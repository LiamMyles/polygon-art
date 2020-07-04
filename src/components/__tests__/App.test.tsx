import React, { useContext } from "react"
import { render, fireEvent } from "@testing-library/react"
import p5 from "p5"

import {
  NavigationContextWrapper,
  navigationStateContext,
} from "reducer-contexts/navigation"
import { PolygonGroupsContextWrapper } from "reducer-contexts/polygon-groups"

import App from "components/App"

const mockP5RemoveFunction = jest.fn()
jest.mock("p5", () => {
  return jest.fn().mockImplementation(() => {
    return { remove: mockP5RemoveFunction }
  })
})

beforeEach(() => {
  const mockedP5: jest.MockInstance<any, any> = p5 as any
  mockP5RemoveFunction.mockClear()
  mockedP5.mockClear()
})

describe("App Component", () => {
  describe("App Navigation", () => {
    const TestComponent: React.FC = ({ children }) => {
      const navigationState = useContext(navigationStateContext)
      return (
        <>
          <label>
            Test Navigation
            <input onChange={() => {}} value={navigationState.currentScreen} />
          </label>
          {children}
        </>
      )
    }
    it("should navigate to edit polygons and home", () => {
      const { getByRole, getByLabelText } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent>
              <App />
            </TestComponent>
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      expect(getByLabelText("Test Navigation")).toHaveValue("MAIN_SCREEN")

      fireEvent.click(getByRole("button", { name: "Edit Polygons" }))
      expect(getByLabelText("Test Navigation")).toHaveValue("GROUP_SCREEN")

      fireEvent.click(getByRole("button", { name: "Home" }))
      expect(getByLabelText("Test Navigation")).toHaveValue("MAIN_SCREEN")
    })

    it("should go to edit polygons and home", async () => {
      const { getByRole, getByLabelText, getAllByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent>
              <App />
            </TestComponent>
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )

      fireEvent.click(getByRole("button", { name: "Edit Polygons" }))
      expect(getByLabelText("Test Navigation")).toHaveValue("GROUP_SCREEN")

      fireEvent.click(getAllByRole("button", { name: "Edit" })[0])
      expect(getByLabelText("Test Navigation")).toHaveValue("POLYGON_SCREEN")

      fireEvent.click(getAllByRole("button", { name: "Home" })[0])
      expect(getByLabelText("Test Navigation")).toHaveValue("MAIN_SCREEN")
    })
  })
})
