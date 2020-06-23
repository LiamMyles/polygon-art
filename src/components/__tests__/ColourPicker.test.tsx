import React, { useState } from "react"
import { render, fireEvent } from "@testing-library/react"

import { ColourPicker } from "components/ColourPicker"

describe("ColourPicker component", () => {
  const TestComponent = () => {
    const [colours, setColours] = useState(["#ffffff", "#888888"])
    return (
      <ColourPicker
        maxColours={3}
        colours={colours}
        setFunction={setColours}
        id="test"
        label="test"
      />
    )
  }
  it("should render all colours passed", () => {
    const { getByLabelText } = render(<TestComponent />)

    const colour1 = getByLabelText("Colour 1")
    const colour2 = getByLabelText("Colour 2")

    expect(colour1).toHaveValue("#ffffff")
    expect(colour2).toHaveValue("#888888")
  })
  it("should add until limit is hit", () => {
    const { getByRole, queryByRole, queryByLabelText } = render(
      <TestComponent />
    )

    expect(getByRole("button", { name: "Add" })).toBeInTheDocument()
    expect(queryByLabelText("Colour 1")).toBeInTheDocument()
    expect(queryByLabelText("Colour 2")).toBeInTheDocument()
    expect(queryByLabelText("Colour 3")).not.toBeInTheDocument()

    fireEvent.click(getByRole("button", { name: "Add" }))

    expect(queryByLabelText("Colour 1")).toBeInTheDocument()
    expect(queryByLabelText("Colour 2")).toBeInTheDocument()
    expect(queryByLabelText("Colour 3")).toBeInTheDocument()
    expect(queryByRole("button", { name: "Add" })).not.toBeInTheDocument()
  })
  it("should delete all but last one", () => {
    const { getAllByRole, queryByRole, queryByLabelText } = render(
      <TestComponent />
    )

    expect(getAllByRole("button", { name: "Delete" })[0]).toBeInTheDocument()
    expect(getAllByRole("button", { name: "Delete" })[1]).toBeInTheDocument()
    expect(queryByLabelText("Colour 1")).toBeInTheDocument()
    expect(queryByLabelText("Colour 2")).toBeInTheDocument()

    fireEvent.click(getAllByRole("button", { name: "Delete" })[1])

    expect(queryByRole("button", { name: "Delete" })).not.toBeInTheDocument()
    expect(queryByLabelText("Colour 1")).toBeInTheDocument()
    expect(queryByLabelText("Colour 2")).not.toBeInTheDocument()
  })
})
