import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"

import {
  polygonGroupsStateContext,
  polygonGroupsDispatchContext,
  PolygonRing,
  PolygonGroup,
} from "reducer-contexts/polygon-groups"

import { navigationDispatchContext } from "reducer-contexts/navigation"

import {
  generatePolygonGroupSketch,
  generatePolygonRingSketch,
} from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"
import { ModalBox } from "./ModalBox"
import { CoordinatePicker } from "./CoordinatePicker"
import { backgroundStateContext } from "reducer-contexts/background"

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

const GroupCanvasGroupDiv = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 100px 100px;
  grid-template-rows: 1fr 200px 1fr;
  justify-self: center;
`

const CanvasWrappingDiv = styled.div`
  grid-column: 1/4;
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
  grid-column: 1/3;
`

const UpdateCoordinateButton = styled.button`
  display: block;
  width: 80%;
  height: 50px;
  margin: 10px auto 0;
  font-size: 18px;
  border-radius: 5px;
`

const GroupCoordinateModal: React.FC<{
  polygonGroup: PolygonGroup
  groupIndex: number
}> = ({ polygonGroup, groupIndex }) => {
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)

  const [canUpdate, setCanUpdate] = useState(false)
  const [isClosed, setIsClosed] = useState(true)
  const [x, setX] = useState(polygonGroup.position.x)
  const [y, setY] = useState(polygonGroup.position.y)

  useEffect(() => {
    if (polygonGroup.position.x !== x || polygonGroup.position.y !== y) {
      setCanUpdate(true)
    }
  }, [polygonGroup, x, y])

  return (
    <ModalBox
      isClosed={isClosed}
      setIsClosed={setIsClosed}
      StyledButton={GroupRandomizeButton}
      buttonText="Edit Position"
      title="Edit Position"
    >
      <CoordinatePicker
        currentX={x}
        currentY={y}
        setYFunction={setY}
        setXFunction={setX}
      />
      <UpdateCoordinateButton
        type="button"
        disabled={!canUpdate}
        onClick={() => {
          setCanUpdate(false)
          polygonGroupsDispatch({
            type: "UPDATE_POLYGON_GROUP_POSITION",
            group: groupIndex,
            position: { x, y },
          })
          setIsClosed(true)
        }}
      >
        Update
      </UpdateCoordinateButton>
    </ModalBox>
  )
}

export function GroupsDisplay() {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
  const backgroundState = useContext(backgroundStateContext)
  const totalPolygonGroups = polygonGroupsState.length

  return (
    <GroupsUl>
      {polygonGroupsState.map((polygonGroup, groupIndex) => {
        const key = `${polygonGroup.rings.length}-${polygonGroup.rings[0].rotation.startingRotation}-${groupIndex}`
        const isLastPolygonGroup = groupIndex === polygonGroupsState.length - 1

        return (
          <React.Fragment key={key}>
            <GroupsLi aria-label={`Group ${groupIndex} Canvas`}>
              <GroupCanvasGroupDiv>
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
                <GroupCoordinateModal
                  polygonGroup={polygonGroup}
                  groupIndex={groupIndex}
                />
                <CanvasWrappingDiv>
                  <P5Canvas
                    sketch={generatePolygonGroupSketch({
                      polygonGroup: polygonGroup,
                      windowSize: {
                        height: 200,
                        width: 200,
                      },
                      scale: 0.2,
                      rgbaBackgroundColour: backgroundState.rgba,
                      rgbBackgroundColour: backgroundState.rgb,
                      shouldRedrawBackground: backgroundState.shouldRedraw,
                    })}
                  />
                </CanvasWrappingDiv>
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
              </GroupCanvasGroupDiv>
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
          </React.Fragment>
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
    "RANDOM RANDOM EDIT EDIT"
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
  const backgroundState = useContext(backgroundStateContext)

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

              <RingCanvasDiv>
                <P5Canvas
                  sketch={generatePolygonRingSketch({
                    polygonRing: polygon,
                    windowSize: {
                      width: 150,
                      height: 150,
                    },
                    scale: 0.15,
                    rgbaBackgroundColour: backgroundState.rgba,
                    rgbBackgroundColour: backgroundState.rgb,
                    shouldRedrawBackground: backgroundState.shouldRedraw,
                  })}
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
