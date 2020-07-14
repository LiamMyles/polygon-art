import React, { useRef } from "react"
import { Slider } from "./Slider"
import styled from "styled-components"

interface CoordinatePickerProps {
  currentY: number
  currentX: number
  setYFunction: React.Dispatch<React.SetStateAction<number>>
  setXFunction: React.Dispatch<React.SetStateAction<number>>
  scrollingParentRef?: React.RefObject<HTMLElement>
}

const CoordinatePickerWrappingDiv = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr 1fr;
  grid-template-rows: 1fr 1fr 30px;
  width: 250px;
  height: 250px;
  margin: auto;
`
const YSliderWrappingDiv = styled.div`
  grid-column: 1/2;
  grid-row: 1/3;
  justify-self: center;
  align-self: center;
  text-align: center;
`
const XSliderWrappingDiv = styled.div`
  grid-column: 2/4;
  grid-row: 3/4;
  justify-self: center;
  align-self: center;
`
const XSlider = styled(Slider)`
  display: grid;
  grid-template-columns: 10px 1fr;
  align-items: center;
  grid-gap: 10px;
  transform: translateX(-10px);
`

const CoordinatePositionsDiv = styled.div`
  grid-column: 1/2;
  grid-row: 3/4;
  justify-self: center;
  align-self: center;
  text-align: center;
`
const CoordinatePanelDiv = styled.div`
  background: lightgray;
  grid-column: 2/4;
  grid-row: 1/3;
  position: relative;
  border: 10px solid darkgrey;
  &:before,
  &:after {
    position: absolute;
    content: "";
    border: 2px darkgrey dashed;
  }
  &:before {
    width: 100%;
    top: 50%;
    transform: translateY(-2px);
  }
  &:after {
    z-index: 0;
    height: 100%;
    right: 50%;
    transform: translateX(2px);
  }
`
const CoordinateThumbDiv = styled.div`
  position: absolute;
  z-index: 1;
  background: grey;
  border-radius: 20px;
  width: 30px;
  height: 30px;
  top: 0%;
  right: 0%;
  transform: translate(50%, -50%);
  &.moving {
    background: darkgrey;
    border: solid 2px grey;
    width: 28px;
    height: 28px;
  }
`

interface UpdateThumbPositionParams {
  x: number
  y: number
  coordinatePanel: React.RefObject<HTMLDivElement>
  scrollingParentRef?: React.RefObject<HTMLElement>
  setXFunction: (value: React.SetStateAction<number>) => void
  setYFunction: (value: React.SetStateAction<number>) => void
}

function updateThumbPosition({
  x,
  y,
  coordinatePanel,
  scrollingParentRef,
  setXFunction,
  setYFunction,
}: UpdateThumbPositionParams) {
  if (coordinatePanel.current === null) return
  //Get the difference from the panel between the panel edge and the thumb
  const diffX = x - coordinatePanel.current.offsetLeft
  let diffY = y - coordinatePanel.current.offsetTop
  //If we have a scrolling parent, account for its current scroll
  if (scrollingParentRef?.current?.scrollTop) {
    diffY = diffY + scrollingParentRef.current.scrollTop
  }

  //Do some fancy math that I haven't spent the time to understand
  const newX = Math.round(
    -100 + ((100 - -100) * diffX) / coordinatePanel.current.offsetWidth
  )
  const newY = Math.round(
    100 + ((-100 - 100) * diffY) / coordinatePanel.current.offsetHeight
  )
  //Locks the values to the inside of the panel and set them
  if (newX >= -100 && newX <= 100) {
    setXFunction(newX)
  } else if (newX >= -100) {
    setXFunction(100)
  } else if (newX <= 100) {
    setXFunction(-100)
  }

  if (newY >= -100 && newY <= 100) {
    setYFunction(newY)
  } else if (newY >= -100) {
    setYFunction(100)
  } else if (newY <= 100) {
    setYFunction(-100)
  }
}

interface HandleThumbDragParams {
  pointerDownEvent: React.MouseEvent<HTMLDivElement, PointerEvent>
  coordinatePanel: React.RefObject<HTMLDivElement>
  scrollingParentRef?: React.RefObject<HTMLElement>
  setXFunction: (value: React.SetStateAction<number>) => void
  setYFunction: (value: React.SetStateAction<number>) => void
}

const handleThumbDrag = ({
  pointerDownEvent,
  coordinatePanel,
  scrollingParentRef,
  setXFunction,
  setYFunction,
}: HandleThumbDragParams) => {
  pointerDownEvent.preventDefault()
  pointerDownEvent.stopPropagation()

  const elementClassList = pointerDownEvent.currentTarget.classList
  elementClassList.add("moving")

  function pointerMove(pointerMoveEvent: PointerEvent) {
    if (pointerMoveEvent.pointerType === "touch") return
    updateThumbPosition({
      x: pointerMoveEvent.pageX | pointerMoveEvent.clientX,
      y: pointerMoveEvent.pageY | pointerMoveEvent.clientY,
      scrollingParentRef,
      setXFunction,
      setYFunction,
      coordinatePanel,
    })
    pointerMoveEvent.preventDefault()
    pointerMoveEvent.stopPropagation()
  }
  function handleTouchMove(touchMoveEvent: TouchEvent) {
    updateThumbPosition({
      x: touchMoveEvent.touches[0].pageX,
      y: touchMoveEvent.touches[0].pageY,
      scrollingParentRef,
      setXFunction,
      setYFunction,
      coordinatePanel,
    })
    touchMoveEvent.preventDefault()
    touchMoveEvent.stopPropagation()
  }

  function cleanUpEvents() {
    elementClassList.remove("moving")
    if (coordinatePanel?.current) {
      coordinatePanel.current.removeEventListener("touchmove", handleTouchMove)
    }
    document.removeEventListener("pointerup", cleanUpEvents)
    document.removeEventListener("pointermove", pointerMove)
  }

  if (coordinatePanel?.current) {
    coordinatePanel.current.addEventListener("touchmove", handleTouchMove)
  }
  document.addEventListener("pointerup", cleanUpEvents)
  document.addEventListener("pointermove", pointerMove)
}

interface getNewValueForRangeOptions {
  oldValue: number
  oldMin: number
  oldMax: number
  newMin: number
  newMax: number
}

function getNewValueForRange({
  oldValue,
  oldMin,
  oldMax,
  newMin,
  newMax,
}: getNewValueForRangeOptions): number {
  return ((oldValue - oldMin) * (newMin - newMax)) / (oldMax - oldMin) + newMax
}

export const CoordinatePicker: React.FC<CoordinatePickerProps> = ({
  currentY,
  setYFunction,
  currentX,
  setXFunction,
  scrollingParentRef,
}) => {
  const yToTopPosition = getNewValueForRange({
    oldValue: currentY,
    oldMin: -100,
    oldMax: 100,
    newMin: 0,
    newMax: 100,
  })
  const xToTopPosition = getNewValueForRange({
    oldValue: currentX,
    oldMin: -100,
    oldMax: 100,
    newMin: 0,
    newMax: 100,
  })
  const positionStyles = {
    top: `${yToTopPosition}%`,
    right: `${xToTopPosition}%`,
  }

  const coordinatePanel = useRef<HTMLDivElement>(null)

  return (
    <CoordinatePickerWrappingDiv>
      <YSliderWrappingDiv>
        <Slider
          max={100}
          min={-100}
          currentValue={currentY}
          label="Y"
          id="y"
          vertical={true}
          setFunction={setYFunction}
          hideValue
          verticalHeight={125}
        />
      </YSliderWrappingDiv>
      <CoordinatePositionsDiv>
        <p>X:{currentX}</p>
        <p>Y:{currentY}</p>
      </CoordinatePositionsDiv>
      <CoordinatePanelDiv
        ref={coordinatePanel}
        onClick={(event) => {
          updateThumbPosition({
            x: event.pageX | event.clientX,
            y: event.pageY | event.clientY,
            scrollingParentRef,
            setXFunction,
            setYFunction,
            coordinatePanel,
          })
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        <CoordinateThumbDiv
          style={positionStyles}
          onPointerDown={(event) => {
            handleThumbDrag({
              pointerDownEvent: event,
              coordinatePanel,
              scrollingParentRef,
              setXFunction,
              setYFunction,
            })
          }}
        />
      </CoordinatePanelDiv>
      <XSliderWrappingDiv>
        <XSlider
          max={100}
          min={-100}
          currentValue={currentX}
          label="X"
          id="x"
          setFunction={setXFunction}
          hideValue
        />
      </XSliderWrappingDiv>
    </CoordinatePickerWrappingDiv>
  )
}
