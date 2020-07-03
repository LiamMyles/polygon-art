import React, { useContext } from "react"
import styled from "styled-components"

import {
  polygonGroupsStateContext,
  polygonGroupsDispatchContext,
  PolygonRing,
} from "reducer-contexts/polygon-groups"

import { navigationDispatchContext } from "reducer-contexts/navigation"

import {
  generatePolygonGroupSketch,
  generatePolygonRingSketch,
} from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"

const GroupsUl = styled.ul`
  display: grid;
  grid-gap: 10px;
  background: lightgrey;
  list-style: none;
  overflow-y: scroll;
  height: 100%;
`

const GroupsLi = styled.li`
  background: white;
  display: grid;
  grid-gap: 10px;
  grid-auto-rows: min-content;
  border: 2px solid darkgrey;
  border-radius: 10px;
  margin: 10px;
  padding: 10px 0;
`
const AddGroupButton = styled.button`
  margin: 0 10px;
  font-size: 18px;
  border-radius: 10px;
  height: 50px;
  margin-bottom: 10px;
  width: calc(100% - 20px);
`

const GroupCanvasDiv = styled.div`
  display: grid;
  grid-template-columns: 200px 100px;
  grid-template-rows: 100px 100px;
  justify-self: center;
`
const GroupRandomizeButton = styled.button`
  justify-self: center;
  align-self: center;
  min-height: 50px;
  border-radius: 5px;
`
const GroupDeleteButton = styled.button`
  justify-self: center;
  align-self: center;
  min-height: 50px;
  border-radius: 5px;
  grid-column: 2/3;
`

export function GroupsDisplay() {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
  const totalPolygonGroups = polygonGroupsState.length
  return (
    <GroupsUl>
      {polygonGroupsState.map((polygonGroup, groupIndex) => {
        const key = `${polygonGroup.rings.length}-${polygonGroup.rings[0].rotation.startingRotation}-${groupIndex}`
        const isLastPolygonGroup = groupIndex === polygonGroupsState.length - 1
        return (
          <>
            <GroupsLi key={key} aria-label={`Group ${groupIndex} Canvas`}>
              <GroupCanvasDiv>
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
                <GroupRandomizeButton
                  onClick={() => {
                    polygonGroupsDispatch({
                      type: "RANDOMIZE_POLYGON_RINGS",
                      group: groupIndex,
                    })
                  }}
                >
                  Randomize
                </GroupRandomizeButton>
                <GroupDeleteButton
                  disabled={totalPolygonGroups === 1}
                  onClick={() => {
                    polygonGroupsDispatch({
                      type: "DELETE_POLYGON_GROUP",
                      group: groupIndex,
                    })
                  }}
                >
                  Delete
                </GroupDeleteButton>
              </GroupCanvasDiv>
              <PolygonRingsDisplay
                polygonRings={polygonGroup.rings}
                groupNumber={groupIndex}
              />
            </GroupsLi>
            {isLastPolygonGroup && (
              <li>
                <AddGroupButton
                  type="button"
                  onClick={() => {
                    polygonGroupsDispatch({ type: "CREATE_POLYGON_GROUP" })
                  }}
                >
                  Add Group
                </AddGroupButton>
              </li>
            )}
          </>
        )
      })}
    </GroupsUl>
  )
}

const RingsUl = styled.ul`
  display: grid;
  grid-gap: 10px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  overflow-x: scroll;
  margin: 0 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: inset 0px 0px 9px -2px #404040;
`

const RingsLi = styled.li`
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-rows: 50px 150px 50px;
  grid-template-areas:
    "EDIT EDIT RANDOM RANDOM"
    "CANVAS CANVAS CANVAS CANVAS"
    ". DELETE DELETE .";
  grid-gap: 10px;
  padding: 10px;
  border: solid 2px darkgrey;
  border-radius: 5px;
  &:last-child {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
  }
`
const RingCanvasDiv = styled.div`
  grid-area: CANVAS;
  justify-self: center;
`
const RingButton = styled.button`
  min-height: 50px;
  border-radius: 5px;
`

const RingEditButton = styled(RingButton)`
  grid-area: EDIT;
`
const RingRandomizeButton = styled(RingButton)`
  grid-area: RANDOM;
`
const RingDeleteButton = styled(RingButton)`
  grid-area: DELETE;
`

const AddRingButton = styled.button`
  height: 50px;
  justify-self: center;
  align-self: center;
  border-radius: 5px;
  grid-column: 1/3;
`

const PolygonRingsDisplay: React.FC<{
  polygonRings: PolygonRing[]
  groupNumber: number
}> = ({ polygonRings, groupNumber }) => {
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
  const navigationDispatch = useContext(navigationDispatchContext)
  const totalPolygons = polygonRings.length
  return (
    <RingsUl>
      {polygonRings.map((polygon, polygonIndex) => {
        const isLastPolygon = totalPolygons === polygonIndex + 1
        const key = `${polygonRings.length}-${polygon.rotation.startingRotation}-${polygonIndex}`
        return (
          <React.Fragment key={key}>
            <RingsLi
              aria-label={`Group ${groupNumber}, Ring ${polygonIndex} Canvas`}
            >
              <RingEditButton
                type="button"
                onClick={() => {
                  navigationDispatch({
                    type: "POLYGON_SCREEN",
                    currentGroup: groupNumber,
                    currentPolygon: polygonIndex,
                  })
                }}
              >
                Edit
              </RingEditButton>
              <RingRandomizeButton
                type="button"
                onClick={() => {
                  polygonGroupsDispatch({
                    type: "RANDOMIZE_POLYGON",
                    group: groupNumber,
                    polygon: polygonIndex,
                  })
                }}
              >
                Randomize
              </RingRandomizeButton>
              <RingCanvasDiv>
                <P5Canvas
                  sketch={generatePolygonRingSketch(
                    polygon,
                    {
                      height: 150,
                      width: 150,
                    },
                    0.15
                  )}
                />
              </RingCanvasDiv>
              <RingDeleteButton
                type="button"
                disabled={totalPolygons === 1}
                onClick={() => {
                  polygonGroupsDispatch({
                    type: "DELETE_POLYGON_GROUP_RING",
                    group: groupNumber,
                    polygon: polygonIndex,
                  })
                }}
              >
                Delete
              </RingDeleteButton>
            </RingsLi>
            {isLastPolygon && (
              <RingsLi>
                <AddRingButton
                  type="button"
                  onClick={() => {
                    polygonGroupsDispatch({
                      type: "CREATE_POLYGON",
                      group: groupNumber,
                    })
                  }}
                >
                  Add Polygon
                </AddRingButton>
              </RingsLi>
            )}
          </React.Fragment>
        )
      })}
    </RingsUl>
  )
}
