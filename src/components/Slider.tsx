import React from "react"
import styled, { css } from "styled-components"

interface SliderProps {
  label: string
  id: string
  min: number
  max: number
  currentValue: number
  setFunction: React.Dispatch<React.SetStateAction<number>>
  vertical?: boolean
  className?: string
  valueSuffix?: string
  hideValue?: boolean
  verticalHeight?: number
}

const SliderLabel = styled.label<{ styleHeight?: number }>`
  ${({ styleHeight }) => {
    if (styleHeight) {
      return css`
        position: absolute;
        top: -${styleHeight / 2}px;
        left: 50%;
        transform: translateX(-50%);
      `
    } else {
      return ``
    }
  }}
`

const SliderInputRange = styled.input<{ styleHeight?: number }>`
  &.vertical {
    transform: rotate(-90deg);
    width: ${(props) => `${props.styleHeight}px`};
  }

  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  &:focus {
    outline: none;
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    border: 0px solid #000000;
    height: 20px;
    width: 39px;
    border-radius: 15px;
    background: grey;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -5.2px;
  }
  &:focus::-webkit-slider-thumb {
    background: radial-gradient(
      rgb(255, 255, 255) 0%,
      rgb(141, 141, 141) 50%,
      rgb(63, 63, 63) 100%
    );
    outline: none;
    border: solid grey 2px;
    margin-top: -7.2px;
  }
  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    border: 0px solid #000000;
    height: 20px;
    width: 39px;
    border-radius: 15px;
    background: grey;
    cursor: pointer;
  }

  &:focus::-moz-range-thumb {
    background: radial-gradient(
      rgb(255, 255, 255) 0%,
      rgb(141, 141, 141) 50%,
      rgb(63, 63, 63) 100%
    );
    outline: none;
    border: solid grey 2px;
  }
  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    border: 0px solid #000000;
    height: 18px;
    width: 18px;
    border-radius: 50px;
    background: grey;
    cursor: pointer;
  }

  &:focus::-webkit-slider-thumb {
    margin-top: -7.2px;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    background: lightgrey;
    border-radius: 25px;
    border: 0px solid #000101;
  }
  &::-moz-range-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    background: lightgrey;
    border-radius: 25px;
    border: 0px solid #000101;
  }
  &:focus::-moz-range-track {
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
  &:focus::-webkit-slider-runnable-track {
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

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  currentValue,
  id,
  label,
  vertical,
  setFunction,
  className,
  valueSuffix,
  hideValue,
  verticalHeight,
}) => {
  return (
    <div className={className} style={{ position: "relative" }}>
      <SliderLabel htmlFor={id} styleHeight={verticalHeight}>
        {label}
        {hideValue ? "" : `: ${currentValue}${valueSuffix ? valueSuffix : ""}`}
      </SliderLabel>
      <SliderInputRange
        className={vertical ? "vertical" : ""}
        id={id}
        type="range"
        min={min}
        max={max}
        value={currentValue}
        styleHeight={verticalHeight}
        onChange={({ currentTarget: { value } }) => {
          const convertedValue = Number.parseInt(value)
          if (!Number.isNaN(convertedValue)) {
            setFunction(convertedValue)
          }
        }}
      />
    </div>
  )
}
