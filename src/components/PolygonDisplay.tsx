import React, { useContext, useState, useEffect, useReducer } from "react"
import styled from "styled-components"

import {
  polygonGroupsStateContext,
  polygonGroupsDispatchContext,
} from "reducer-contexts/polygon-groups"
import { navigationStateContext } from "reducer-contexts/navigation"
import { generatePolygonRingSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"
import { ToggleSwitch } from "components/ToggleSwitch"
import { Slider } from "components/Slider"
import { MultiSlider, sliderReducer } from "components/MultiSlider"
import { ColourPicker } from "components/ColourPicker"

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
  const { scale, rotation, dots } = polygonToDisplay
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
        <PolygonDotsControls
          key={`${dots.enabled}-${dots.size}-${
            dots.strokeWidth
          }-${dots.strokeColours.join("")}-${dots.fillColours.join("")}`}
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
        setFunction={setEnabled}
      />
      <ToggleSwitch
        label="Clockwise"
        id="rotation-clockwise"
        checked={clockwise}
        setFunction={setClockwise}
      />
      <Slider
        label="Speed"
        id="rotation-speed"
        max={20}
        min={0}
        currentValue={speed}
        setFunction={setRotationSpeed}
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

  const rangeInitialState = {
    min: 0,
    max: 500,
    currentMin: scale.range.min,
    currentMax: scale.range.max,
  }
  const [rangeState, rangeDispatch] = useReducer(
    sliderReducer,
    rangeInitialState
  )
  useEffect(() => {
    if (
      scale.speed !== speed ||
      scale.enabled !== enabled ||
      scale.range.min !== rangeState.currentMin ||
      scale.range.max !== rangeState.currentMax
    ) {
      setCanUpdate(true)
    }
  }, [speed, enabled, rangeState, scale])
  return (
    <div>
      <h2>Scale</h2>
      <ToggleSwitch
        label="Enable"
        id="scale-enabled"
        checked={enabled}
        setFunction={setEnabled}
      />
      <Slider
        label="Speed"
        id="scale-speed"
        max={20}
        min={0}
        currentValue={speed}
        setFunction={setSpeed}
      />
      <MultiSlider
        label="scale-range"
        sliderState={rangeState}
        sliderReducerDispatch={rangeDispatch}
      />
      <button
        disabled={!canUpdate}
        onClick={() => {
          polygonGroupsDispatch({
            type: "UPDATE_POLYGON_SCALE",
            group: navigationState.currentGroup,
            polygon: navigationState.currentPolygon,
            scale: {
              enabled,
              range: { min: rangeState.currentMin, max: rangeState.currentMax },
              speed,
            },
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
export const PolygonDotsControls: React.FC = () => {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
  const navigationState = useContext(navigationStateContext)

  const { dots, sides } = polygonGroupsState[
    navigationState.currentGroup
  ].rings[navigationState.currentPolygon]

  const [canUpdate, setCanUpdate] = useState(false)
  const [enabled, setEnabled] = useState(dots.enabled)
  const [size, setSize] = useState(dots.size)
  const [strokeWidth, setStrokeWidth] = useState(dots.strokeWidth)
  const [fillColours, setFillColours] = useState(dots.fillColours)
  const [strokeColours, setStrokeColours] = useState(dots.strokeColours)

  useEffect(() => {
    if (
      dots.enabled !== enabled ||
      dots.size !== size ||
      dots.strokeWidth !== strokeWidth ||
      dots.fillColours.join("") !== fillColours.join("") ||
      dots.strokeColours.join("") !== strokeColours.join("")
    ) {
      setCanUpdate(true)
    }
  }, [enabled, size, strokeWidth, dots, fillColours, strokeColours])
  return (
    <div>
      <h2>Dots</h2>
      <ToggleSwitch
        label="Enable"
        id="dots-enabled"
        checked={enabled}
        setFunction={setEnabled}
      />
      <Slider
        label="Size"
        id="dots-size"
        max={20}
        min={0}
        currentValue={size}
        setFunction={setSize}
      />
      <ColourPicker
        label="Fill Colour"
        id="fill-colour"
        maxColours={sides.amount}
        colours={fillColours}
        setFunction={setFillColours}
      />
      <Slider
        label="Stroke Width"
        id="dots-stroke-width"
        max={20}
        min={0}
        currentValue={strokeWidth}
        setFunction={setStrokeWidth}
      />
      <ColourPicker
        label="Stroke Colours"
        id="stroke-colour"
        maxColours={sides.amount}
        colours={strokeColours}
        setFunction={setStrokeColours}
      />
      <button
        disabled={!canUpdate}
        onClick={() => {
          polygonGroupsDispatch({
            type: "UPDATE_POLYGON_DOTS",
            group: navigationState.currentGroup,
            polygon: navigationState.currentPolygon,
            dots: { enabled, fillColours, size, strokeColours, strokeWidth },
          })
        }}
      >
        Update
      </button>
      <button
        onClick={() => {
          polygonGroupsDispatch({
            type: "RANDOMIZE_POLYGON_DOTS",
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
