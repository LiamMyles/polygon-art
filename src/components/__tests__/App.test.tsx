import React from "react"
import { render } from "@testing-library/react"

import { NavigationContextWrapper } from "reducer-contexts/navigation"
import { PolygonGroupsContextWrapper } from "reducer-contexts/polygon-groups"

import App from "components/App"

const mockP5RemoveFunction = jest.fn()
jest.mock("p5", () => {
  return jest.fn().mockImplementation(() => {
    return { remove: mockP5RemoveFunction }
  })
})

test("Renders Basic Text", () => {
  const { getByText } = render(
    <PolygonGroupsContextWrapper>
      <NavigationContextWrapper>
        <App />
      </NavigationContextWrapper>
    </PolygonGroupsContextWrapper>
  )
  const title = getByText(/Hello/i)
  expect(title).toBeInTheDocument()
})
