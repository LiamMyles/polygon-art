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

interface KeyDownActions {
  isMinThumb: boolean
  key: string
}

interface KeyDownState {
  currentMin: number
  currentMax: number
  max: number
  min: number
}

const keyDownReducer = produce(
  (draft: Draft<KeyDownState>, action: KeyDownActions) => {
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
            draft.currentMax + 1 >= draft.max ? draft.max : draft.currentMax + 1
        }
        break
      }
      case "ArrowLeft":
      case "ArrowDown": {
        if (action.isMinThumb) {
          draft.currentMin =
            draft.currentMin - 1 <= draft.min ? draft.min : draft.currentMin - 1
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
            draft.currentMax + 5 >= draft.max ? draft.max : draft.currentMax + 5
        }
        break
      }
      case "PageDown": {
        if (action.isMinThumb) {
          draft.currentMin =
            draft.currentMin - 5 <= draft.min ? draft.min : draft.currentMin - 5
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
  }
)

interface mouseDownOptions {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
  railDimensions: sliderRailDimensionsState
  max: number
  min: number
  dispatch: React.Dispatch<KeyDownActions>
}
const mouseDown = ({ event, railDimensions }: mouseDownOptions) => {
  const handleMouseMove = (event: MouseEvent) => {
    const diffX = event.pageX - railDimensions.offsetLeft
    console.log(diffX)
    console.log(0 + ((100 - 0) * diffX) / railDimensions.offsetWidth)

    event.preventDefault()
    event.stopPropagation()
  }

  var handleMouseUp = function (event: MouseEvent) {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)

  event.preventDefault()
  event.stopPropagation()

  // Set focus to the clicked handle
  // this.domNode.focus();
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
  const initialState: KeyDownState = {
    currentMin: startingMin,
    currentMax: startingMax,
    max: max,
    min: min,
  }
  const [state, dispatchKeydown] = useReducer(keyDownReducer, initialState)
  const [railDimensions, setSliderRailDimensions] = useState<
    sliderRailDimensionsState
  >({
    offsetWidth: 0,
    offsetLeft: 0,
  })
  const sliderRail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sliderRail.current) {
      setSliderRailDimensions({
        offsetLeft: sliderRail.current.offsetLeft,
        offsetWidth: sliderRail.current.offsetWidth,
      })
    }
  }, [sliderRail, setSliderRailDimensions])
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
            dispatchKeydown({ isMinThumb: true, key: event.key })
          }}
          onMouseDown={(event) => {
            mouseDown({ event, railDimensions })
          }}
          style={{ left: `calc(${(state.currentMin / max) * 100}% - 10px)` }}
          id="minPriceHotel"
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuenow={state.currentMin}
          aria-valuetext={`${startingMin}`}
          aria-valuemax={max - 1}
          aria-label={`${label} Minimum`}
        />
        <SliderRailThumbDivRight
          onKeyDown={(event) => {
            dispatchKeydown({ isMinThumb: false, key: event.key })
          }}
          style={{
            right: `calc(${100 - (state.currentMax / max) * 100}% - 10px)`,
          }}
          id="maxPriceHotel"
          role="slider"
          tabIndex={0}
          aria-valuemin={min + 1}
          aria-valuenow={state.currentMax}
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
