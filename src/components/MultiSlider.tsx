import React, { useReducer, useRef, useEffect, useState } from "react"
import styled from "styled-components"
import produce, { Draft } from "immer"

const SliderWrappingDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  grid-gap: 10px;
`

const SliderValueDiv = styled.div`
  width: 100%;
  font-size: 30px;
  font-weight: bold;
`
const SliderRailDiv = styled.div`
  display: flex;
  align-items: center;
  height: 10px;
  width: 100%;
  margin: 0 10px;
  background-color: rebeccapurple;
  align-self: center;
  position: relative;
`
const SliderRailThumbDiv = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50px;
  background-color: chartreuse;
`
const SliderRailThumbDivLeft = styled(SliderRailThumbDiv)`
  transform: translateX(-10px);
  background-color: lime;
`
const SliderRailThumbDivRight = styled(SliderRailThumbDiv)`
  transform: translateX(10px);
  background-color: red;
`

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

const sliderReducer = produce(
  (draft: Draft<SliderState>, action: SliderActions) => {
    switch (action.type) {
      case "KEY_DOWN": {
        switch (action.key) {
          case "ArrowRight":
          case "ArrowUp": {
            if (action.isMinThumb) {
              draft.currentMin =
                draft.currentMin + 1 >= draft.currentMax
                  ? draft.currentMax
                  : draft.currentMin + 1
            } else {
              draft.currentMax =
                draft.currentMax + 1 >= draft.max
                  ? draft.max
                  : draft.currentMax + 1
            }
            break
          }
          case "ArrowLeft":
          case "ArrowDown": {
            if (action.isMinThumb) {
              draft.currentMin =
                draft.currentMin - 1 <= draft.min
                  ? draft.min
                  : draft.currentMin - 1
            } else {
              draft.currentMax =
                draft.currentMax - 1 <= draft.currentMin
                  ? draft.currentMin
                  : draft.currentMax - 1
            }
            break
          }
          case "PageUp": {
            if (action.isMinThumb) {
              draft.currentMin =
                draft.currentMin + 5 >= draft.currentMax
                  ? draft.currentMax
                  : draft.currentMin + 5
            } else {
              draft.currentMax =
                draft.currentMax + 5 >= draft.max
                  ? draft.max
                  : draft.currentMax + 5
            }
            break
          }
          case "PageDown": {
            if (action.isMinThumb) {
              draft.currentMin =
                draft.currentMin - 5 <= draft.min
                  ? draft.min
                  : draft.currentMin - 5
            } else {
              draft.currentMax =
                draft.currentMax - 5 <= draft.currentMin
                  ? draft.currentMin
                  : draft.currentMax - 5
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
          const valueAboveMin =
            action.newValue <= draft.min ? draft.min : action.newValue
          const valueAboveMinAndBelowMax =
            valueAboveMin >= draft.currentMax ? draft.currentMax : valueAboveMin
          draft.currentMin = valueAboveMinAndBelowMax
        } else {
          const valueAboveMin =
            action.newValue <= draft.currentMin
              ? draft.currentMin
              : action.newValue
          const valueAboveMinAndBelowMax =
            valueAboveMin >= draft.max ? draft.max : valueAboveMin
          draft.currentMax = valueAboveMinAndBelowMax
        }
      }
    }
  }
)

interface handlePointerDragOptions {
  event: React.MouseEvent<HTMLDivElement, PointerEvent>
  railDimensions: sliderRailDimensionsState
  max: number
  min: number
  dispatch: React.Dispatch<SliderActions>
  railRef: HTMLDivElement | null
  isMinThumb: boolean
}
const handlePointerDrag = ({
  event,
  railDimensions,
  min,
  max,
  railRef,
  isMinThumb,
  dispatch,
}: handlePointerDragOptions) => {
  const rail = railRef as HTMLDivElement

  function dispatchChange(diffX: number) {
    const newValue = Math.round(
      min + ((max - min) * diffX) / railDimensions.offsetWidth
    )
    dispatch({ type: "DIRECT_UPDATE", isMinThumb, newValue })
  }

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return
    const diffX = (event.pageX | event.clientX) - railDimensions.offsetLeft
    dispatchChange(diffX)
    event.preventDefault()
    event.stopPropagation()
  }
  function handleTouchMove(event: TouchEvent) {
    const diffX = event.touches[0].pageX - railDimensions.offsetLeft
    dispatchChange(diffX)
    event.preventDefault()
    event.stopPropagation()
  }

  function handelPointerUp() {
    rail.removeEventListener("touchmove", handleTouchMove)
    document.removeEventListener("pointermove", handlePointerMove)
    document.removeEventListener("pointerup", handelPointerUp)
    document.removeEventListener("pointercancel", handlePointerCancel)
  }

  function handlePointerCancel() {
    rail.removeEventListener("touchmove", handleTouchMove)
    document.removeEventListener("pointermove", handlePointerMove)
    document.removeEventListener("pointerup", handelPointerUp)
    document.removeEventListener("pointercancel", handlePointerCancel)
  }

  rail.addEventListener("touchmove", handleTouchMove)
  document.addEventListener("pointermove", handlePointerMove)
  document.addEventListener("pointerup", handelPointerUp)
  document.addEventListener("pointercancel", handlePointerCancel)

  event.preventDefault()
  event.stopPropagation()

  event.currentTarget.focus()
}

interface MultiSliderProps {
  label: string
  startingMin: number
  startingMax: number
  min: number
  max: number
}

interface sliderRailDimensionsState {
  offsetWidth: number
  offsetLeft: number
}
export const MultiSlider: React.FC<MultiSliderProps> = ({
  label,
  startingMax,
  startingMin,
  min,
  max,
}) => {
  const initialState: SliderState = {
    currentMin: startingMin,
    currentMax: startingMax,
    max: max,
    min: min,
  }
  const [sliderState, sliderDispatch] = useReducer(sliderReducer, initialState)
  const [railDimensions, setRailDimensions] = useState<
    sliderRailDimensionsState
  >({
    offsetWidth: 0,
    offsetLeft: 0,
  })
  const sliderRailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sliderRailRef.current) {
      setRailDimensions({
        offsetLeft: sliderRailRef.current.offsetLeft,
        offsetWidth: sliderRailRef.current.offsetWidth,
      })
    }
  }, [sliderRailRef, setRailDimensions])
  return (
    <SliderWrappingDiv>
      <SliderValueDiv>
        <span>Min {sliderState.currentMin}</span>
      </SliderValueDiv>
      <SliderRailDiv ref={sliderRailRef}>
        <SliderRailThumbDivLeft
          onKeyDown={(event) => {
            sliderDispatch({
              type: "KEY_DOWN",
              isMinThumb: true,
              key: event.key,
            })
          }}
          onPointerDown={(event) => {
            handlePointerDrag({
              event,
              railDimensions,
              min,
              max,
              dispatch: sliderDispatch,
              railRef: sliderRailRef.current,
              isMinThumb: true,
            })
          }}
          onFocus={(event) => {
            event.currentTarget.classList.add("focus")
            if (sliderRailRef.current)
              sliderRailRef.current.classList.add("focus")
          }}
          onBlur={(event) => {
            event.currentTarget.classList.remove("focus")
            if (sliderRailRef.current)
              sliderRailRef.current.classList.remove("focus")
          }}
          style={{
            left: `calc(${(sliderState.currentMin / max) * 100}% - 10px)`,
          }}
          id="minPriceHotel"
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuenow={sliderState.currentMin}
          aria-valuetext={`${sliderState.currentMin}`}
          aria-valuemax={max - 1}
          aria-label={`${label} Minimum`}
        />
        <SliderRailThumbDivRight
          onKeyDown={(event) => {
            sliderDispatch({
              type: "KEY_DOWN",
              isMinThumb: false,
              key: event.key,
            })
          }}
          onPointerDown={(event) => {
            handlePointerDrag({
              event,
              railDimensions,
              min,
              max,
              dispatch: sliderDispatch,
              railRef: sliderRailRef.current,
              isMinThumb: false,
            })
          }}
          onFocus={(event) => {
            event.currentTarget.classList.add("focus")
            if (sliderRailRef.current)
              sliderRailRef.current.classList.add("focus")
          }}
          onBlur={(event) => {
            event.currentTarget.classList.remove("focus")
            if (sliderRailRef.current)
              sliderRailRef.current.classList.remove("focus")
          }}
          style={{
            right: `calc(${
              100 - (sliderState.currentMax / max) * 100
            }% - 10px)`,
          }}
          id="maxPriceHotel"
          role="slider"
          tabIndex={0}
          aria-valuemin={min + 1}
          aria-valuenow={sliderState.currentMax}
          aria-valuetext={`${sliderState.currentMax}`}
          aria-valuemax={max}
          aria-label={`${label} Maximum`}
        />
      </SliderRailDiv>
      <SliderValueDiv>
        <span>Max {sliderState.currentMax}</span>
      </SliderValueDiv>
    </SliderWrappingDiv>
  )
}
