import React, { useContext, useState } from "react"
import styled from "styled-components"

import {
  polygonGroupsStateContext,
  polygonGroupsDispatchContext,
} from "reducer-contexts/polygon-groups"
import { generatePolygonRingSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"
import { ToggleSwitch, ToggleSwitchHandler } from "components/ToggleSwitch"
import { Slider, SliderHandlerFunction } from "components/Slider"

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

export const PolygonDisplay = () => {
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
      <PolygonOptionsOverflowDiv>
        <PolygonRotationControls
          key={`${polygonToDisplay.rotation.speed}-${polygonToDisplay.rotation.enabled}-${polygonToDisplay.rotation.clockwise}`}
        />
      </PolygonOptionsOverflowDiv>
    </PolygonPageWrappingDiv>
  )
}

interface PolygonRotationControls {}

const PolygonRotationControls: React.FC<PolygonRotationControls> = () => {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)

  const [speed, setRotationSpeed] = useState(
    polygonGroupsState[0].rings[0].rotation.speed
  )
  const [enabled, setEnabled] = useState(
    polygonGroupsState[0].rings[0].rotation.enabled
  )
  const [clockwise, setClockwise] = useState(
    polygonGroupsState[0].rings[0].rotation.clockwise
  )

  const toggleHandler = (
    setFunction: React.Dispatch<React.SetStateAction<boolean>>
  ): ToggleSwitchHandler => {
    return ({ currentTarget: { checked } }) => {
      setFunction(checked)
    }
  }
  const sliderSpeedHandler: SliderHandlerFunction = ({
    currentTarget: { value },
  }) => {
    const convertedValue = Number.parseInt(value)
    if (!Number.isNaN(convertedValue)) {
      setRotationSpeed(convertedValue)
    }
  }

  return (
    <div>
      <h2>Rotation</h2>
      <ToggleSwitch
        label="Enable"
        id="rotation-enabled"
        checked={enabled}
        handler={toggleHandler(setEnabled)}
      />
      <ToggleSwitch
        label="Clockwise"
        id="rotation-clockwise"
        checked={clockwise}
        handler={toggleHandler(setClockwise)}
      />
      <Slider
        label="Speed"
        id="rotation-speed"
        max={20}
        min={0}
        currentValue={speed}
        handler={sliderSpeedHandler}
      />
      <button
        onClick={() => {
          polygonGroupsDispatch({
            type: "UPDATE_POLYGON_ROTATION",
            group: 0,
            polygon: 0,
            rotation: { clockwise, enabled, speed },
          })
        }}
      >
        Update
      </button>
      <button
        onClick={() => {
          polygonGroupsDispatch({
            type: "RANDOMIZE_POLYGON_ROTATION",
            group: 0,
            polygon: 0,
          })
        }}
      >
        Randomize
      </button>
    </div>
  )
}
