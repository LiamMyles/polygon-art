import React from "react"
import { render } from "@testing-library/react"
import { Slider } from "components/Slider"

describe("Slider component", () => {
  it("should render", () => {
    const { getByLabelText } = render(
      <Slider
        label={"Hello World"}
        id="123"
        max={0}
        min={100}
        startingValue={0}
      />
    )

    expect(getByLabelText("Hello World")).toBeInTheDocument()
  })
})
