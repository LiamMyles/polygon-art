import React from "react"
import { render } from "@testing-library/react"
import p5 from "p5"

import { P5Canvas } from "components/P5Canvas"

describe("P5Canvas Component", () => {
  it("should render and run sketch code", () => {
    render(<P5Canvas sketch={() => {}} />)

    expect(p5).toHaveBeenCalledTimes(1)
  })
})
