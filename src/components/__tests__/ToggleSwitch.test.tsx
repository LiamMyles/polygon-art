import React, { useState } from "react"
import { render, fireEvent } from "@testing-library/react"
import { ToggleSwitch } from "components/ToggleSwitch"

describe("ToggleSwitch component", () => {
  const WrappedToggleSwitch = () => {
    const [checkedValue, setCheckedValue] = useState(false)
    return (
      <ToggleSwitch
        label={"Hello World"}
        id="123"
        checked={checkedValue}
        handler={({ currentTarget: { checked } }) => {
          setCheckedValue(checked)
        }}
      />
    )
  }
  it("should render", () => {
    const { getByLabelText } = render(<WrappedToggleSwitch />)

    expect(getByLabelText("Hello World")).toBeInTheDocument()
  })
  it("should update when clicked", () => {
    const { getByLabelText } = render(<WrappedToggleSwitch />)

    expect(getByLabelText("Hello World")).toBeInTheDocument()

    fireEvent.click(getByLabelText("Hello World"))

    expect(getByLabelText("Hello World")).toBeChecked()
  })
})
