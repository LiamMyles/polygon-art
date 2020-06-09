import React, { useReducer, useRef, useEffect, useState } from "react"
import styled from "styled-components"
import produce, { Draft } from "immer"

const VisuallyHidden = styled.span`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const SliderWrappingDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  grid-gap: 10px;
`
const SliderValueLabel = styled.label`
  display: flex;
  font-size: 30px;
  font-weight: bold;
`
const SliderValueInput = styled.input`
  width: 100%;
`
const SliderRailDiv = styled.div`
  display: flex;
  align-items: center;
  height: 10px;
  width: 100%;
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
  background-color: lime;
`
const SliderRailThumbDivRight = styled(SliderRailThumbDiv)`
  background-color: red;
`

interface SliderActionsMouseMove {
  type: "MOUSE_MOVE"
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
      case "MOUSE_MOVE": {
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

interface mouseDownOptions {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
  railDimensions: sliderRailDimensionsState
  max: number
  min: number
  dispatch: React.Dispatch<SliderActions>
  railRef: HTMLDivElement | null
  isMinThumb: boolean
}
const mouseDown = ({
  event,
  railDimensions,
  min,
  max,
  railRef,
  isMinThumb,
  dispatch,
}: mouseDownOptions) => {
  function handleMouseMove(event: MouseEvent) {
    const diffX = (event.pageX | event.clientX) - railDimensions.offsetLeft
    const newValue = Math.round(
      min + ((max - min) * diffX) / railDimensions.offsetWidth
    )

    dispatch({ type: "MOUSE_MOVE", isMinThumb, newValue })

    event.preventDefault()
    event.stopPropagation()
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)

  event.preventDefault()
  event.stopPropagation()

  if (railRef) {
    //Need to handle focus and blur
    railRef.focus()
  }
}

interface MultiSliderProps {
  label: string
  id: string
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
  id,
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
  const sliderRail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sliderRail.current) {
      setRailDimensions({
        offsetLeft: sliderRail.current.offsetLeft,
        offsetWidth: sliderRail.current.offsetWidth,
      })
    }
  }, [sliderRail, setRailDimensions])
  return (
    <SliderWrappingDiv>
      <SliderValueLabel htmlFor={`${id}-min-input`}>
        <span>
          Min <VisuallyHidden>{`${label} Input`}</VisuallyHidden>
        </span>
        <SliderValueInput
          id={`${id}-min-input`}
          defaultValue={startingMin}
          type="number"
          max={max - 1}
          min={min}
        />
      </SliderValueLabel>
      <SliderRailDiv ref={sliderRail}>
        <SliderRailThumbDivLeft
          onKeyDown={(event) => {
            sliderDispatch({
              type: "KEY_DOWN",
              isMinThumb: true,
              key: event.key,
            })
          }}
          onMouseDown={(event) => {
            mouseDown({
              event,
              railDimensions,
              min,
              max,
              dispatch: sliderDispatch,
              railRef: sliderRail.current,
              isMinThumb: true,
            })
          }}
          style={{
            left: `calc(${(sliderState.currentMin / max) * 100}% - 10px)`,
          }}
          id="minPriceHotel"
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuenow={sliderState.currentMin}
          aria-valuetext={`${startingMin}`}
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
          onMouseDown={(event) => {
            mouseDown({
              event,
              railDimensions,
              min,
              max,
              dispatch: sliderDispatch,
              railRef: sliderRail.current,
              isMinThumb: false,
            })
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
          aria-valuetext={`${startingMax}`}
          aria-valuemax={max}
          aria-label={`${label} Maximum`}
        />
      </SliderRailDiv>
      <SliderValueLabel htmlFor={`${id}-max-input`}>
        <span>
          Max <VisuallyHidden>{`${label} Input`}</VisuallyHidden>
        </span>
        <SliderValueInput
          id={`${id}-max-input`}
          defaultValue={startingMax}
          type="number"
          max={max}
          min={min + 1}
        />
      </SliderValueLabel>
    </SliderWrappingDiv>
  )
}
