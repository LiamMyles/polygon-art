import React from "react"
import { render, fireEvent } from "@testing-library/react"
import { ToggleSwitch } from "components/ToggleSwitch"

describe("ToggleSwitch component", () => {
  it("should render", () => {
    const { getByLabelText } = render(
      <ToggleSwitch label={"Hello World"} id="123" />
    )

    expect(getByLabelText("Hello World")).toBeInTheDocument()
  })
  it("should update when clicked", () => {
    const { getByLabelText } = render(
      <ToggleSwitch label={"Hello World"} id="123" />
    )

    expect(getByLabelText("Hello World")).toBeInTheDocument()

    fireEvent.click(getByLabelText("Hello World"))

    expect(getByLabelText("Hello World")).toBeChecked()
  })

  it.todo("should handel a function to trigger on update")
})
