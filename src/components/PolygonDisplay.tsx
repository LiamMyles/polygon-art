import React, { useContext } from "react"
import styled from "styled-components"

import {
  polygonGroupsStateContext,
  polygonGroupsDispatchContext,
} from "reducer-contexts/polygon-groups"
import { generatePolygonRingSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"

const PolygonPageWrappingDiv = styled.div`
  display: grid;
  grid-template-rows: 200px calc(90vh - 200px);
  grid-template-columns: 100vw;
  justify-content: center;
`

const PolygonCanvasWrappingDiv = styled.div`
  display: grid;
  grid-template-columns: 200px 100px;
  grid-gap: 10px;
  justify-content: center;
`

const PolygonCanvasDiv = styled.div``

const PolygonRandomizeButton = styled.button`
  height: 50px;
  border-radius: 5px;
  align-self: center;
`

const PolygonOptionsOverflowDiv = styled.div`
  overflow-y: scroll;
`

export function PolygonDisplay() {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)

  //TODO - Put these values into the navigation
  const currentRing = 0
  const currentGroup = 0
  const polygonToDisplay = polygonGroupsState[currentGroup].rings[currentRing]

  generatePolygonRingSketch(polygonToDisplay, { width: 200, height: 200 })

  return (
    <PolygonPageWrappingDiv>
      <PolygonCanvasWrappingDiv>
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
        <PolygonRandomizeButton
          type="button"
          onClick={() => {
            polygonGroupsDispatch({
              type: "RANDOMIZE_POLYGON",
              group: currentGroup,
              polygon: currentRing,
            })
          }}
        >
          Randomize
        </PolygonRandomizeButton>
      </PolygonCanvasWrappingDiv>
      <PolygonOptionsOverflowDiv>Test content</PolygonOptionsOverflowDiv>
    </PolygonPageWrappingDiv>
  )
}
