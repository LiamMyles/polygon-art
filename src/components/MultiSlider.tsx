import React, { useRef } from "react"
import styled from "styled-components"
import produce, { Draft } from "immer"

interface SliderActionsMouseMove {
  type: "DIRECT_UPDATE"
  isMinThumb: boolean
  newValue: number
}
interface SliderActionsKeyDown {
  type: "KEY_DOWN"
  isMinThumb: boolean
  key: string
}
type SliderActions = SliderActionsKeyDown | SliderActionsMouseMove

interface SliderState {
  currentMin: number
  currentMax: number
  max: number
  min: number
}

export const sliderReducer: React.Reducer<SliderState, SliderActions> = produce(
  (draft: Draft<SliderState>, action: SliderActions) => {
    const { currentMax, currentMin, min, max } = draft
    function increaseCurrent(
      amount: number,
      toUpdate: number,
      noMoreThan: number
    ) {
      return toUpdate + amount >= noMoreThan ? noMoreThan : toUpdate + amount
    }
    function decreaseCurrent(
      amount: number,
      toUpdate: number,
      noLessThan: number
    ) {
      return toUpdate - amount <= noLessThan ? noLessThan : toUpdate - amount
    }
    function constrainValue(value: number, min: number, max: number) {
      if (value <= min) return min
      if (value >= max) return max
      return value
    }
    switch (action.type) {
      case "KEY_DOWN": {
        switch (action.key) {
          case "ArrowRight":
          case "ArrowUp": {
            if (action.isMinThumb) {
              draft.currentMin = increaseCurrent(1, currentMin, currentMax)
            } else {
              draft.currentMax = increaseCurrent(1, currentMax, max)
            }
            break
          }
          case "ArrowLeft":
          case "ArrowDown": {
            if (action.isMinThumb) {
              draft.currentMin = decreaseCurrent(1, currentMin, min)
            } else {
              draft.currentMax = decreaseCurrent(1, currentMax, currentMin)
            }
            break
          }
          case "PageUp": {
            if (action.isMinThumb) {
              draft.currentMin = increaseCurrent(5, currentMin, currentMax)
            } else {
              draft.currentMax = increaseCurrent(5, currentMax, max)
            }
            break
          }
          case "PageDown": {
            if (action.isMinThumb) {
              draft.currentMin = decreaseCurrent(5, currentMin, min)
            } else {
              draft.currentMax = decreaseCurrent(5, currentMax, currentMin)
            }
            break
          }
          case "Home": {
            if (action.isMinThumb) {
              draft.currentMin = draft.min
            } else {
              draft.currentMax = draft.currentMin
            }
            break
          }
          case "End": {
            if (action.isMinThumb) {
              draft.currentMin = draft.currentMax
            } else {
              draft.currentMax = draft.max
            }
            break
          }
        }
        break
      }
      case "DIRECT_UPDATE": {
        if (action.isMinThumb) {
          draft.currentMin = constrainValue(action.newValue, min, currentMax)
        } else {
          draft.currentMax = constrainValue(action.newValue, currentMin, max)
        }
      }
    }
  }
)

interface HandlePointerDragParams {
  event: React.MouseEvent<HTMLDivElement, PointerEvent>
  max: number
  min: number
  dispatch: React.Dispatch<SliderActions>
  sliderRailRef: React.RefObject<HTMLDivElement>
  isMinThumb: boolean
}
const handlePointerDrag = ({
  event,
  min,
  max,
  sliderRailRef,
  isMinThumb,
  dispatch,
}: HandlePointerDragParams) => {
  function dispatchChange(diffX: number) {
    const offsetWidth = sliderRailRef?.current?.offsetWidth
      ? sliderRailRef.current.offsetWidth
      : 0
    const newValue = Math.round(min + ((max - min) * diffX) / offsetWidth)
    dispatch({ type: "DIRECT_UPDATE", isMinThumb, newValue })
  }

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return
    const offsetLeft = sliderRailRef?.current?.offsetLeft
      ? sliderRailRef.current.offsetLeft
      : 0
    const diffX = (event.pageX | event.clientX) - offsetLeft
    dispatchChange(diffX)
    event.preventDefault()
    event.stopPropagation()
  }
  function handleTouchMove(event: TouchEvent) {
    const offsetLeft = sliderRailRef?.current?.offsetLeft
      ? sliderRailRef.current.offsetLeft
      : 0
    const diffX = event.touches[0].pageX - offsetLeft
    dispatchChange(diffX)
    event.preventDefault()
    event.stopPropagation()
  }

  function handelCleanUp() {
    if (sliderRailRef?.current) {
      sliderRailRef.current.removeEventListener("touchmove", handleTouchMove)
    }

    document.removeEventListener("pointermove", handlePointerMove)
    document.removeEventListener("pointerup", handelCleanUp)
    document.removeEventListener("pointercancel", handelCleanUp)
  }
  if (sliderRailRef?.current) {
    sliderRailRef.current.addEventListener("touchmove", handleTouchMove)
  }
  document.addEventListener("pointermove", handlePointerMove)
  document.addEventListener("pointerup", handelCleanUp)
  document.addEventListener("pointercancel", handelCleanUp)

  event.preventDefault()
  event.stopPropagation()

  event.currentTarget.focus()
}

const SliderWrappingDiv = styled.div`
  display: grid;
  grid-template-areas:
    "label . . ."
    "bar bar bar bar"
    "min min max max";
  justify-items: center;
  grid-gap: 10px;
  width: 100%;
`

const SliderValueDiv = styled.div<{ area: string }>`
  font-size: 16px;
  grid-area: ${({ area }) => area};
`

const SliderLabelP = styled.p`
  grid-area: label;
  justify-self: left;
`
const SliderRailDiv = styled.div`
  display: flex;
  grid-area: bar;
  align-items: center;
  height: 10px;
  width: calc(100% - 60px);
  margin: 0 35px;
  border-radius: 20px;
  background-color: lightgrey;
  align-self: center;
  position: relative;
  border: solid lightgrey 2px;
  &.focus {
    outline: none;
    background: linear-gradient(
      225deg,
      rgb(63, 63, 63) 0%,
      rgb(141, 141, 141) 25%,
      rgb(255, 255, 255) 50%,
      rgb(141, 141, 141) 75%,
      rgb(63, 63, 63) 100%
    );
    border: solid grey 2px;
  }
`

interface SliderRailThumbProps {
  className?: string
  sliderDispatch: React.Dispatch<SliderActions>
  isMinThumb: boolean
  sliderRailRef: React.RefObject<HTMLDivElement>
  sliderState: SliderState
  label: string
}

const SliderRailThumb: React.FC<SliderRailThumbProps> = ({
  className,
  sliderDispatch,
  sliderRailRef,
  label,
  sliderState,
  isMinThumb,
}) => {
  const { currentMin, min, max, currentMax } = sliderState
  const style = {} as { left?: string; right?: string }

  // Convert min/max range to 0 -> 100 range
  const maxOldValue = currentMax
  const minOldValue = currentMin
  const oldMin = min
  const oldMax = max
  const newMin = 0
  const newMax = 100

  const minNewValue =
    ((minOldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
  const maxNewValue =
    ((maxOldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin

  if (isMinThumb) {
    style.left = `calc(${minNewValue}% - 20px)`
  } else {
    style.right = `calc(${100 - maxNewValue}% - 20px)`
  }
  return (
    <div
      className={className}
      onKeyDown={(event) => {
        sliderDispatch({
          type: "KEY_DOWN",
          isMinThumb,
          key: event.key,
        })
      }}
      onPointerDown={(event) => {
        handlePointerDrag({
          event,
          min,
          max,
          dispatch: sliderDispatch,
          sliderRailRef,
          isMinThumb,
        })
      }}
      onFocus={(event) => {
        event.currentTarget.classList.add("focus")
        if (sliderRailRef?.current) {
          sliderRailRef.current.classList.add("focus")
        }
      }}
      onBlur={(event) => {
        event.currentTarget.classList.remove("focus")
        if (sliderRailRef?.current) {
          sliderRailRef.current.classList.remove("focus")
        }
      }}
      style={style}
      role="slider"
      tabIndex={0}
      aria-valuemin={min}
      aria-valuenow={isMinThumb ? currentMin : currentMax}
      aria-valuetext={`${isMinThumb ? currentMin : currentMax}`}
      aria-valuemax={max}
      aria-label={`${label} ${isMinThumb ? "Minimum" : "Maximum"}`}
    />
  )
}

const SliderRailThumbDiv = styled(SliderRailThumb)`
  position: absolute;
  width: 30px;
  height: 30px;
  border: solid darkgrey 2px;
  background: darkgray;
  border-radius: 50% 50% 100% 0% / 100% 50% 50% 0%;
  &.focus {
    background: linear-gradient(
      225deg,
      rgb(63, 63, 63) 0%,
      rgb(141, 141, 141) 34%,
      rgb(255, 255, 255) 100%
    );
    outline: none;
    border: solid grey 2px;
  }
`
const SliderRailThumbDivMin = styled(SliderRailThumbDiv)`
  transform: translateX(-20px) rotate(225deg);
`
const SliderRailThumbDivMax = styled(SliderRailThumbDiv)`
  transform: translateX(20px) rotate(45deg);
`

interface MultiSliderProps {
  label: string
  sliderState: SliderState
  sliderReducerDispatch: React.Dispatch<SliderActions>
}

export const MultiSlider: React.FC<MultiSliderProps> = ({
  label,
  sliderState,
  sliderReducerDispatch,
}) => {
  const sliderRailRef = useRef<HTMLDivElement>(null)
  return (
    <SliderWrappingDiv>
      <SliderLabelP>{label}</SliderLabelP>
      <SliderRailDiv ref={sliderRailRef}>
        <SliderRailThumbDivMin
          sliderDispatch={sliderReducerDispatch}
          isMinThumb={true}
          sliderRailRef={sliderRailRef}
          sliderState={sliderState}
          label={label}
        />
        <SliderRailThumbDivMax
          sliderDispatch={sliderReducerDispatch}
          isMinThumb={false}
          sliderRailRef={sliderRailRef}
          sliderState={sliderState}
          label={label}
        />
      </SliderRailDiv>
      <SliderValueDiv area="min">
        <span>Min {sliderState.currentMin}</span>
      </SliderValueDiv>
      <SliderValueDiv area="max">
        <span>Max {sliderState.currentMax}</span>
      </SliderValueDiv>
    </SliderWrappingDiv>
  )
}
