import React from "react"
import { render, fireEvent } from "@testing-library/react"
import { CoordinatePicker } from "components/CoordinatePicker"

describe("CoordinatePicker component", () => {
  it("should render", () => {
    const { getByText } = render(<CoordinatePicker initialY={0} initialX={0} />)

    expect(getByText(/X:\s*0/)).toBeInTheDocument()
    expect(getByText(/Y:\s*0/)).toBeInTheDocument()
  })
  it("should be able to update sliders and x/y text", () => {
    const { getByText, getByLabelText } = render(
      <CoordinatePicker initialY={0} initialX={0} />
    )
    const ySlider = getByLabelText("Y")
    const xSlider = getByLabelText("X")

    expect(getByText(/X:\s*0/)).toBeInTheDocument()

    expect(ySlider).toHaveValue("0")
    expect(xSlider).toHaveValue("0")

    fireEvent.change(ySlider, { target: { value: "20" } })
    expect(getByText(/Y:\s*20/)).toBeInTheDocument()
    expect(ySlider).toHaveValue("20")

    fireEvent.change(xSlider, { target: { value: "25" } })
    expect(getByText(/X:\s*25/)).toBeInTheDocument()
    expect(xSlider).toHaveValue("25")
  })
})
