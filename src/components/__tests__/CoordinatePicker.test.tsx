import React from "react"
import { render } from "@testing-library/react"
import { CoordinatePicker } from "components/CoordinatePicker"

describe("CoordinatePicker component", () => {
  it("should render", () => {
    render(<CoordinatePicker />)
  })
})
