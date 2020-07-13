import React, {
  useContext,
  useState,
  useEffect,
  useReducer,
  useRef,
} from "react"
import styled from "styled-components"

import {
  polygonGroupsStateContext,
  polygonGroupsDispatchContext,
} from "reducer-contexts/polygon-groups"

import { navigationStateContext } from "reducer-contexts/navigation"
import { backgroundStateContext } from "reducer-contexts/background"

import { generatePolygonRingSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"
import { ToggleSwitch } from "components/ToggleSwitch"
import { Slider } from "components/Slider"
import { MultiSlider, sliderReducer } from "components/MultiSlider"
import { ColourPicker } from "components/ColourPicker"
import { CoordinatePicker } from "components/CoordinatePicker"

import { StyledButton } from "common-styled-components/StyledButton"

import rotatingDirection from "../rotating-ring.svg"

const PolygonPageWrappingDiv = styled.div`
  display: grid;
  grid-template-rows: 250px calc(90vh - 260px);
  grid-template-columns: 100vw;
  grid-gap: 10px;
  justify-content: center;
`

const PolygonCanvasWrappingDiv = styled.div`
  display: grid;
  grid-template-columns: 200px;
  grid-template-rows: 200px 50px;
  grid-gap: 10px;
  justify-content: center;
`

const PolygonOptionsOverflowDiv = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  border-radius: 8px;
  box-shadow: inset 0px 0px 9px -2px #404040;
  margin: 10px;
  padding: 10px;
`

export const PolygonDisplay = () => {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
  const navigationState = useContext(navigationStateContext)
  const backgroundState = useContext(backgroundStateContext)
  const scrollingElementRef = useRef<HTMLDivElement>(null)

  const polygonToDisplay =
    polygonGroupsState[navigationState.currentGroup].rings[
      navigationState.currentPolygon
    ]
  const { scale, rotation, dots, sides, position } = polygonToDisplay
  return (
    <PolygonPageWrappingDiv>
      <PolygonCanvasWrappingDiv>
        <div aria-label={`Ring ${navigationState.currentPolygon} Canvas`}>
          <P5Canvas
            sketch={generatePolygonRingSketch({
              polygonRing: polygonToDisplay,
              windowSize: {
                width: 200,
                height: 200,
              },
              scale: 0.2,
              rgbaBackgroundColour: backgroundState.rgba,
              rgbBackgroundColour: backgroundState.rgb,
              shouldRedrawBackground: backgroundState.shouldRedraw,
            })}
          />
        </div>
        <StyledButton
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
        </StyledButton>
      </PolygonCanvasWrappingDiv>
      <PolygonOptionsOverflowDiv ref={scrollingElementRef}>
        <PolygonRotationControls
          key={`${rotation.speed}-${rotation.enabled}-${rotation.clockwise}`}
        />
        <PolygonScaleControls
          key={`${scale.enabled}-${scale.range.min}-${scale.range.max}-${scale.speed}`}
        />
        <PolygonDotsControls
          key={`${dots.enabled}-${dots.size}-${
            dots.strokeWidth
          }-${dots.strokeColours.join("")}-${dots.fillColours.join("")}`}
        />
        <PolygonSidesControls
          key={`${sides.enabled}-${sides.amount}-${
            sides.strokeWidth
          }-${sides.colours.join("")}`}
        />
        <PolygonPositionControls
          key={`${position.x}-${position.y}`}
          scrollingParentRef={scrollingElementRef}
        />
      </PolygonOptionsOverflowDiv>
    </PolygonPageWrappingDiv>
  )
}

const PolygonCardDiv = styled.div`
  border: 1px solid grey;
  border-radius: 10px;
  display: grid;
  grid-auto-rows: min-content;
  grid-gap: 10px;
  padding: 10px;
`

const PolygonCardH2 = styled.h2`
  font-size: 20px;
  font-weight: bold;
`
const PolygonCardButtonContainingDiv = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-auto-flow: column;
`

export const PolygonControlsWrapper: React.FC<{
  title: string
  updateDispatch: Function
  randomizeDispatch?: Function
  canUpdate: boolean
}> = ({ children, title, updateDispatch, randomizeDispatch, canUpdate }) => {
  return (
    <PolygonCardDiv>
      <PolygonCardH2>{title}</PolygonCardH2>
      {children}
      <PolygonCardButtonContainingDiv>
        <StyledButton
          disabled={!canUpdate}
          onClick={() => {
            updateDispatch()
          }}
        >
          Update
        </StyledButton>
        {randomizeDispatch && (
          <StyledButton
            onClick={() => {
              randomizeDispatch()
            }}
          >
            Randomize
          </StyledButton>
        )}
      </PolygonCardButtonContainingDiv>
    </PolygonCardDiv>
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

  const updateDispatch = () => {
    setCanUpdate(false)
    polygonGroupsDispatch({
      type: "UPDATE_POLYGON_ROTATION",
      group: navigationState.currentGroup,
      polygon: navigationState.currentPolygon,
      rotation: { clockwise, enabled, speed },
    })
  }
  const randomizeDispatch = () => {
    polygonGroupsDispatch({
      type: "RANDOMIZE_POLYGON_ROTATION",
      group: navigationState.currentGroup,
      polygon: navigationState.currentPolygon,
    })
  }
  return (
    <PolygonControlsWrapper
      updateDispatch={updateDispatch}
      randomizeDispatch={randomizeDispatch}
      canUpdate={canUpdate}
      title="Rotation"
    >
      <ToggleSwitch
        label="Enable"
        id="rotation-enabled"
        checked={enabled}
        setFunction={setEnabled}
        checkedText={{ checked: "OFF", unchecked: "ON" }}
      />
      <ToggleSwitch
        label="Clockwise"
        id="rotation-clockwise"
        checked={clockwise}
        setFunction={setClockwise}
        svgBackground={rotatingDirection}
        transformFlip={true}
      />
      <Slider
        label="Speed"
        id="rotation-speed"
        max={20}
        min={0}
        currentValue={speed}
        setFunction={setRotationSpeed}
      />
    </PolygonControlsWrapper>
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

  const updateDispatch = () => {
    setCanUpdate(false)
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
  }
  const randomizeDispatch = () => {
    polygonGroupsDispatch({
      type: "RANDOMIZE_POLYGON_SCALE",
      group: navigationState.currentGroup,
      polygon: navigationState.currentPolygon,
    })
  }
  return (
    <PolygonControlsWrapper
      title="Scale"
      updateDispatch={updateDispatch}
      randomizeDispatch={randomizeDispatch}
      canUpdate={canUpdate}
    >
      <ToggleSwitch
        label="Enable"
        id="scale-enabled"
        checked={enabled}
        setFunction={setEnabled}
        checkedText={{ checked: "OFF", unchecked: "ON" }}
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
        label="Size"
        sliderState={rangeState}
        sliderReducerDispatch={rangeDispatch}
      />
    </PolygonControlsWrapper>
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

  const updateDispatch = () => {
    setCanUpdate(false)
    polygonGroupsDispatch({
      type: "UPDATE_POLYGON_DOTS",
      group: navigationState.currentGroup,
      polygon: navigationState.currentPolygon,
      dots: { enabled, fillColours, size, strokeColours, strokeWidth },
    })
  }

  const randomizeDispatch = () => {
    polygonGroupsDispatch({
      type: "RANDOMIZE_POLYGON_DOTS",
      group: navigationState.currentGroup,
      polygon: navigationState.currentPolygon,
    })
  }

  return (
    <PolygonControlsWrapper
      updateDispatch={updateDispatch}
      randomizeDispatch={randomizeDispatch}
      title="Dots"
      canUpdate={canUpdate}
    >
      <ToggleSwitch
        label="Enable"
        id="dots-enabled"
        checked={enabled}
        setFunction={setEnabled}
        checkedText={{ checked: "OFF", unchecked: "ON" }}
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
        valueSuffix="px"
      />
      <ColourPicker
        label="Stroke Colours"
        id="stroke-colour"
        maxColours={sides.amount}
        colours={strokeColours}
        setFunction={setStrokeColours}
      />
    </PolygonControlsWrapper>
  )
}
export const PolygonSidesControls: React.FC = () => {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
  const navigationState = useContext(navigationStateContext)

  const { sides } = polygonGroupsState[navigationState.currentGroup].rings[
    navigationState.currentPolygon
  ]

  const [canUpdate, setCanUpdate] = useState(false)
  const [enabled, setEnabled] = useState(sides.enabled)
  const [amount, setAmount] = useState(sides.amount)
  const [strokeWidth, setStrokeWidth] = useState(sides.strokeWidth)
  const [colours, setColours] = useState(sides.colours)

  useEffect(() => {
    if (
      sides.enabled !== enabled ||
      sides.amount !== amount ||
      sides.strokeWidth !== strokeWidth ||
      sides.colours.join("") !== colours.join("")
    ) {
      setCanUpdate(true)
    }
  }, [enabled, amount, strokeWidth, sides, colours])

  const randomizeDispatch = () => {
    polygonGroupsDispatch({
      type: "RANDOMIZE_POLYGON_SIDES",
      group: navigationState.currentGroup,
      polygon: navigationState.currentPolygon,
    })
  }

  const updateDispatch = () => {
    setCanUpdate(false)
    polygonGroupsDispatch({
      type: "UPDATE_POLYGON_SIDES",
      group: navigationState.currentGroup,
      polygon: navigationState.currentPolygon,
      sides: { amount, colours, enabled, strokeWidth },
    })
  }
  return (
    <PolygonControlsWrapper
      updateDispatch={updateDispatch}
      randomizeDispatch={randomizeDispatch}
      title={"Sides"}
      canUpdate={canUpdate}
    >
      <ToggleSwitch
        label="Enable"
        id="sides-enabled"
        checked={enabled}
        setFunction={setEnabled}
        checkedText={{ checked: "OFF", unchecked: "ON" }}
      />
      <Slider
        label="Amount"
        id="sides-amount"
        max={20}
        min={1}
        currentValue={amount}
        setFunction={setAmount}
      />
      <Slider
        label="Stroke Width"
        id="sides-stroke-width"
        max={20}
        min={0}
        currentValue={strokeWidth}
        setFunction={setStrokeWidth}
        valueSuffix="px"
      />
      <ColourPicker
        label="Colours"
        id="sides-colours"
        maxColours={sides.amount}
        colours={colours}
        setFunction={setColours}
      />
    </PolygonControlsWrapper>
  )
}
export const PolygonPositionControls: React.FC<{
  scrollingParentRef?: React.RefObject<HTMLDivElement>
}> = ({ scrollingParentRef }) => {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
  const navigationState = useContext(navigationStateContext)

  const { position } = polygonGroupsState[navigationState.currentGroup].rings[
    navigationState.currentPolygon
  ]

  const [canUpdate, setCanUpdate] = useState(false)
  const [x, setX] = useState(position.x)
  const [y, setY] = useState(position.y)

  useEffect(() => {
    if (position.x !== x || position.y !== y) {
      setCanUpdate(true)
    }
  }, [position, x, y])

  const updateDispatch = () => {
    setCanUpdate(false)
    polygonGroupsDispatch({
      type: "UPDATE_POLYGON_POSITION",
      group: navigationState.currentGroup,
      polygon: navigationState.currentPolygon,
      position: { x, y },
    })
  }
  return (
    <PolygonControlsWrapper
      updateDispatch={updateDispatch}
      title={"Position"}
      canUpdate={canUpdate}
    >
      <CoordinatePicker
        currentX={x}
        currentY={y}
        setYFunction={setY}
        setXFunction={setX}
        scrollingParentRef={scrollingParentRef}
      />
    </PolygonControlsWrapper>
  )
}
