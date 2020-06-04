import React, { useContext } from "react"
import styled from "styled-components"

import {
  polygonGroupsStateContext,
  polygonGroupsDispatchContext,
  PolygonRing,
} from "reducer-contexts/polygon-groups"
import { generatePolygonRingSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"

const PolygonPageWrappingDiv = styled.div`
  display: grid;
  grid-template-rows: 200px calc(90vh - 200px);
`

const PolygonCanvasDiv = styled.div`
  text-align: center;
`

const PolygonOptionsOverflowDiv = styled.div`
  overflow-y: scroll;
`

export function PolygonDisplay() {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)

  const currentRing = 0
  const polygonToDisplay = polygonGroupsState[0].rings[currentRing]

  generatePolygonRingSketch(polygonToDisplay, { width: 200, height: 200 })

  return (
    <PolygonPageWrappingDiv>
      <PolygonCanvasDiv aria-label={`Ring ${currentRing} Canvas`}>
        <P5Canvas
          sketch={generatePolygonRingSketch(
            polygonToDisplay,
            {
              width: 200,
              height: 200,
            },
            0.2
          )}
        />
      </PolygonCanvasDiv>
      <PolygonOptionsOverflowDiv>Test content</PolygonOptionsOverflowDiv>
    </PolygonPageWrappingDiv>
  )
}
