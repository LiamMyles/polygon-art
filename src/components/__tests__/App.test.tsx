import React from "react"
import { render } from "@testing-library/react"

import { NavigationContextWrapper } from "reducer-contexts/navigation"

import App from "components/App"

test("Renders Basic Text", () => {
  const { getByText } = render(
    <NavigationContextWrapper>
      <App />
    </NavigationContextWrapper>
  )
  const title = getByText(/Hello/i)
  expect(title).toBeInTheDocument()
})
