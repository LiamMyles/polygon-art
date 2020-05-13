import React from "react"
import { render } from "@testing-library/react"
import App from "components/App"

test("Renders Basic Text", () => {
  const { getByText } = render(<App />)
  const title = getByText(/Hello/i)
  expect(title).toBeInTheDocument()
})
