import React, { useState } from "react"
import { Slider, SliderHandlerFunction } from "./Slider"

interface CoordinatePickerProps {
  initialX: number
  initialY: number
}

export const CoordinatePicker: React.FC<CoordinatePickerProps> = ({
  initialX,
  initialY,
}) => {
  const [xCord, setXCord] = useState(initialX)
  const [yCord, setYCord] = useState(initialY)

  const xInputHandler: SliderHandlerFunction = ({
    currentTarget: { value },
  }) => {
    const convertedValue = Number.parseInt(value)
    if (!Number.isNaN(convertedValue)) {
      setXCord(convertedValue)
    }
  }
  const yInputHandler: SliderHandlerFunction = ({
    currentTarget: { value },
  }) => {
    const convertedValue = Number.parseInt(value)
    if (!Number.isNaN(convertedValue)) {
      setYCord(convertedValue)
    }
  }
  return (
    <div>
      <Slider
        max={100}
        min={-100}
        currentValue={yCord}
        label="y"
        id="y"
        simpleThumb={true}
        vertical={true}
        handler={yInputHandler}
      />
      <Slider
        max={100}
        min={-100}
        currentValue={xCord}
        label="X"
        id="x"
        simpleThumb={true}
        handler={xInputHandler}
      />
    </div>
  )
}
