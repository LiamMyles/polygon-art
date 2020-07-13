import React, { useState } from "react"
import { render, fireEvent } from "@testing-library/react"
import { Slider } from "components/Slider"

describe("Slider component", () => {
  const WrappedSliderComponent = () => {
    const [sliderValue, setSliderValue] = useState(0)
    return (
      <Slider
        label={"Hello World"}
        id="123"
        max={0}
        min={100}
        currentValue={sliderValue}
        setFunction={setSliderValue}
        hideValue
      />
    )
  }
  it("should render", () => {
    const { getByLabelText } = render(<WrappedSliderComponent />)
    const slider = getByLabelText("Hello World")
    expect(slider).toHaveValue("0")

    fireEvent.change(slider, { target: { value: 100 } })

    expect(slider).toHaveValue("100")
  })
})
