import React, { useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"

import {
  polygonGroupsStateContext,
  PolygonGroup,
} from "reducer-contexts/polygon-groups"
import { generateAllPolygonRingGroupsSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"

const MainCanvasWrapper = styled.div`
  background: white;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  text-align: center;
  font-size: 200;
`

function generateKey(
  polygonGroups: Readonly<PolygonGroup[]>,
  containerSize: { height: number; width: number }
): string {
  const polygonGroupLength = polygonGroups.length
  const polygonRingLengths = polygonGroups
    .map((polygonGroup) => polygonGroup.rings.length)
    .join("-")
  const polygonRingRotations = polygonGroups
    .map((polygonGroup) =>
      polygonGroup.rings.map((ring) => ring.rotation.startingRotation).join("-")
    )
    .join("-")

  return `${polygonGroupLength}-${polygonRingLengths}-${polygonRingRotations}-${containerSize.width}-${containerSize.height}`
}

export const MainCanvas: React.FC = () => {
  const polygonContext = useContext(polygonGroupsStateContext)
  const [currentSize, setCurrentSize] = useState({ height: 0, width: 0 })
  const mainWrapper = useRef(
    null
  ) as React.MutableRefObject<null | HTMLDivElement>

  /**
   * Updates the canvas size when the ref for the wrapping component
   * comes back.
   *
   * Also listens to the window resize and updates the canvas size if
   * it changes. But its throttled by 250ms
   */
  useEffect(() => {
    if (mainWrapper?.current) {
      setCurrentSize({
        height: mainWrapper.current.offsetHeight,
        width: mainWrapper.current.offsetWidth,
      })
    }
  }, [mainWrapper, setCurrentSize])

  useEffect(() => {
    function updateCanvasSize() {
      if (mainWrapper?.current) {
        setCurrentSize({
          height: mainWrapper.current.offsetHeight,
          width: mainWrapper.current.offsetWidth,
        })
      }
    }

    updateCanvasSize()

    let timeoutId: number
    const throttledWindowUpdate = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => updateCanvasSize(), 250)
    }

    window.addEventListener("resize", throttledWindowUpdate)
    return () => {
      window.removeEventListener("resize", throttledWindowUpdate)
    }
  }, [mainWrapper, setCurrentSize])

  return (
    <MainCanvasWrapper ref={mainWrapper}>
      <P5Canvas
        sketch={generateAllPolygonRingGroupsSketch(polygonContext, currentSize)}
        key={generateKey(polygonContext, currentSize)}
      />
    </MainCanvasWrapper>
  )
}
