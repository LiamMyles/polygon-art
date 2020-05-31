import React, { useContext, useEffect, useRef, useState } from "react"

import {
  polygonGroupsDispatchContext,
  polygonGroupsStateContext,
  PolygonGroup,
} from "reducer-contexts/polygon-groups"
import { generateAllPolygonRingGroupsSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"

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
  const polygonDispatch = useContext(polygonGroupsDispatchContext)
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

  useEffect(() => {
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 0 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 1 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 2 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 3 })
    polygonDispatch({
      type: "UPDATE_POLYGON_GROUP_POSITION",
      group: 0,
      position: { x: -50, y: 50 },
    })
    polygonDispatch({
      type: "UPDATE_POLYGON_POSITION",
      group: 0,
      polygon: 0,
      position: { x: 0, y: 50 },
    })
    polygonDispatch({
      type: "UPDATE_POLYGON_POSITION",
      group: 0,
      polygon: 1,
      position: { x: 50, y: 0 },
    })
    polygonDispatch({
      type: "UPDATE_POLYGON_POSITION",
      group: 0,
      polygon: 2,
      position: { x: -50, y: 0 },
    })
    polygonDispatch({
      type: "UPDATE_POLYGON_POSITION",
      group: 0,
      polygon: 3,
      position: { x: 0, y: -50 },
    })
  }, [polygonDispatch, mainWrapper])

  const sketchAll = generateAllPolygonRingGroupsSketch(
    polygonContext,
    currentSize
  )
  return (
    <div
      ref={mainWrapper}
      style={{
        background: "white",
        width: "100%",
        height: "100%",
        maxWidth: "100vw",
        textAlign: "center",
        fontSize: 200,
      }}
    >
      <P5Canvas
        sketch={sketchAll}
        key={generateKey(polygonContext, currentSize)}
      />
    </div>
  )
}
