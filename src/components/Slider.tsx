import React from "react"
import styled, { StyledComponent } from "styled-components"

interface SliderProps {
  label: string
  id: string
  min: number
  max: number
  currentValue: number
  vertical?: boolean
  simpleThumb?: boolean
  setFunction: React.Dispatch<React.SetStateAction<number>>
}

const SliderInputRange = styled.input`
  &[orient="vertical"] {
    writing-mode: bt-lr;
    -webkit-appearance: slider-vertical;
    &::-webkit-slider-thumb {
      margin-right: -3.2px;
    }
    &:focus::-webkit-slider-thumb {
      margin-right: -5.2px;
    }
    &::-webkit-slider-runnable-track {
      width: 10px;
      height: 100%;
    }
    &::-moz-range-track {
      width: 10px;
      height: 100%;
    }
  }
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  &:focus {
    outline: none;
  }
  &:not(.simpleThumb) {
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

  &::-webkit-slider-thumb {
    margin-top: -3.2px;
  }

  &:focus::-webkit-slider-thumb {
    margin-top: -5.2px;
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
` as StyledComponent<"input", any, { orient: string }, never>

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  currentValue,
  id,
  label,
  vertical,
  simpleThumb,
  setFunction,
}) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <SliderInputRange
        className={simpleThumb ? "simpleThumb" : ""}
        id={id}
        type="range"
        min={min}
        max={max}
        value={currentValue}
        orient={vertical ? "vertical" : "horizontal"}
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
