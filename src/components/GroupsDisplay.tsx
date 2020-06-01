import React, { useContext } from "react"
import styled from "styled-components"

import { polygonGroupsStateContext } from "reducer-contexts/polygon-groups"

import { generatePolygonGroupSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"

const GroupDisplayWrapper = styled.div`
  background: lightgrey;
  width: 100%;
  height: 100%;
  max-width: 100vw;
`
export function GroupsDisplay() {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  return (
    <GroupDisplayWrapper>
      {polygonGroupsState.map((polygonGroup, index) => {
        const key = `${polygonGroup.rings.length}-${polygonGroup.rings[0].rotation.startingRotation}-${index}`
        return (
          <div key={key} aria-label={`Group ${index} Canvas`}>
            <P5Canvas
              sketch={generatePolygonGroupSketch(
                polygonGroup,
                {
                  height: 200,
                  width: 200,
                },
                0.2
              )}
            />
          </div>
        )
      })}
    </GroupDisplayWrapper>
  )
}
