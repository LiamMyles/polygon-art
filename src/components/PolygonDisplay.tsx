import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"

import {
  polygonGroupsStateContext,
  polygonGroupsDispatchContext,
} from "reducer-contexts/polygon-groups"
import { navigationStateContext } from "reducer-contexts/navigation"
import { generatePolygonRingSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"
import { ToggleSwitch, ToggleSwitchHandler } from "components/ToggleSwitch"
import { Slider, SliderHandlerFunction } from "components/Slider"
import { MultiSlider } from "./MultiSlider"

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
  const navigationState = useContext(navigationStateContext)

  const polygonToDisplay =
    polygonGroupsState[navigationState.currentGroup].rings[
      navigationState.currentPolygon
    ]
  const { scale, rotation } = polygonToDisplay
  return (
    <PolygonPageWrappingDiv>
      <PolygonCanvasWrappingDiv>
        <PolygonCanvasDiv
          aria-label={`Ring ${navigationState.currentPolygon} Canvas`}
        >
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
              group: navigationState.currentGroup,
              polygon: navigationState.currentPolygon,
            })
          }}
        >
          Randomize
        </PolygonRandomizeButton>
      </PolygonCanvasWrappingDiv>
      <PolygonOptionsOverflowDiv>
        <PolygonRotationControls
          key={`${rotation.speed}-${rotation.enabled}-${rotation.clockwise}`}
        />
        <PolygonScaleControls
          key={`${scale.enabled}-${scale.range.min}-${scale.range.max}-${scale.speed}-${scale.speed}-${scale.startingSize}`}
        />
      </PolygonOptionsOverflowDiv>
    </PolygonPageWrappingDiv>
  )
}

export const PolygonRotationControls: React.FC = () => {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
  const navigationState = useContext(navigationStateContext)

  const { rotation } = polygonGroupsState[navigationState.currentGroup].rings[
    navigationState.currentPolygon
  ]

  const [speed, setRotationSpeed] = useState(rotation.speed)
  const [enabled, setEnabled] = useState(rotation.enabled)
  const [clockwise, setClockwise] = useState(rotation.clockwise)
  const [canUpdate, setCanUpdate] = useState(false)

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

  useEffect(() => {
    if (
      rotation.speed !== speed ||
      rotation.enabled !== enabled ||
      rotation.clockwise !== clockwise
    ) {
      setCanUpdate(true)
    }
  }, [speed, enabled, clockwise, rotation])

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
        disabled={!canUpdate}
        onClick={() => {
          polygonGroupsDispatch({
            type: "UPDATE_POLYGON_ROTATION",
            group: navigationState.currentGroup,
            polygon: navigationState.currentPolygon,
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
            group: navigationState.currentGroup,
            polygon: navigationState.currentPolygon,
          })
        }}
      >
        Randomize
      </button>
    </div>
  )
}

export const PolygonScaleControls: React.FC = () => {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
  const navigationState = useContext(navigationStateContext)

  const { scale } = polygonGroupsState[navigationState.currentGroup].rings[
    navigationState.currentPolygon
  ]

  const [canUpdate, setCanUpdate] = useState(false)
  const [enabled, setEnabled] = useState(scale.enabled)
  const [speed, setSpeed] = useState(scale.speed)
  const [range, setRange] = useState(scale.range)

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
      setSpeed(convertedValue)
    }
  }
  useEffect(() => {
    if (
      scale.speed !== speed ||
      scale.enabled !== enabled ||
      scale.range !== range
    ) {
      setCanUpdate(true)
    }
  }, [speed, enabled, range, scale])
  return (
    <div>
      <h2>Scale</h2>
      <ToggleSwitch
        label="Enable"
        id="scale-enabled"
        checked={enabled}
        handler={toggleHandler(setEnabled)}
      />
      <Slider
        label="Speed"
        id="scale-speed"
        max={20}
        min={0}
        currentValue={speed}
        handler={sliderSpeedHandler}
      />
      <MultiSlider
        label="scale-range"
        min={0}
        max={500}
        startingMax={range.max}
        startingMin={range.min}
      />
      <button
        disabled={!canUpdate}
        onClick={() => {
          polygonGroupsDispatch({
            type: "UPDATE_POLYGON_SCALE",
            group: navigationState.currentGroup,
            polygon: navigationState.currentPolygon,
            scale: { enabled, range, speed },
          })
        }}
      >
        Update
      </button>
      <button
        onClick={() => {
          polygonGroupsDispatch({
            type: "RANDOMIZE_POLYGON_SCALE",
            group: navigationState.currentGroup,
            polygon: navigationState.currentPolygon,
          })
        }}
      >
        Randomize
      </button>
    </div>
  )
}
