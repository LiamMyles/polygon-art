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

describe("App Component", () => {
  it("should render App", () => {
    render(
      <PolygonGroupsContextWrapper>
        <NavigationContextWrapper>
          <App />
        </NavigationContextWrapper>
      </PolygonGroupsContextWrapper>
    )
  })
})
