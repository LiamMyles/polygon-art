import React from "react"
import styled from "styled-components"

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
  left: calc(25% - 20px);
`
const SliderRailThumbDivRight = styled(SliderRailThumbDiv)`
  background-color: red;
  right: calc(75% - 20px);
`

interface MultiSliderProps {
  label: string
  id: string
  startingMin: number
  startingMax: number
  min: number
  max: number
}

export const MultiSlider: React.FC<MultiSliderProps> = ({
  label,
  id,
  startingMax,
  startingMin,
  min,
  max,
}) => {
  return (
    <SliderWrappingDiv>
      <SliderValueLabel htmlFor={`${id}-min-input`}>
        <span>
          Min <VisuallyHidden>{label}</VisuallyHidden>
        </span>
        <SliderValueInput
          id={`${id}-min-input`}
          defaultValue={startingMin}
          type="number"
          max={max - 1}
          min={min}
        />
      </SliderValueLabel>
      <SliderRailDiv>
        <SliderRailThumbDivLeft
          id="minPriceHotel"
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuenow={startingMin}
          aria-valuetext={`${startingMin}`}
          aria-valuemax={max - 1}
          aria-label={`${label} Minimum`}
        />
        <SliderRailThumbDivRight
          id="maxPriceHotel"
          role="slider"
          tabIndex={0}
          aria-valuemin={min + 1}
          aria-valuenow={startingMax}
          aria-valuetext={`${startingMax}`}
          aria-valuemax={max}
          aria-label={`${label} Maximum`}
        />
      </SliderRailDiv>
      <SliderValueLabel htmlFor={`${id}-max-input`}>
        <span>
          Max <VisuallyHidden>{label}</VisuallyHidden>
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
