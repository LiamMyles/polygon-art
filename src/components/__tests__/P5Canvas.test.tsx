import React from "react"
import { render } from "@testing-library/react"

import { P5Canvas } from "components/P5Canvas"

//Need to look into mocking a sketch Or at least watch p5 run

it("should render and run sketch code", () => {
  const { getByText } = render(<P5Canvas />)
  const title = getByText(/Hello/i)
  expect(title).toBeInTheDocument()
})
