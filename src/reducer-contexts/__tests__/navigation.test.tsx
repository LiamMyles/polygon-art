import React, { useContext } from "react"
import { render, fireEvent } from "@testing-library/react"
import {
  NavigationState,
  navigationReducer,
  NavigationActions,
  NavigationContextWrapper,
  navigationDispatchContext,
  navigationStateContext,
} from "reducer-contexts/navigation"

describe("Navigation Reducer", () => {
  describe("WATCH_SCREEN action", () => {
    it("should fire action", () => {
      const action: NavigationActions = { type: "WATCH_SCREEN" }
      const initialState: NavigationState = {
        currentScreen: "GROUP_SCREEN",
        currentGroup: 0,
        currentPolygon: 0,
      }
      const expectedState: NavigationState = {
        currentScreen: "WATCH_SCREEN",
        currentGroup: 0,
        currentPolygon: 0,
      }
      const actualState = navigationReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("GROUP_SCREEN action", () => {
    it("should fire action", () => {
      const action: NavigationActions = { type: "GROUP_SCREEN" }
      const initialState: NavigationState = {
        currentScreen: "WATCH_SCREEN",
        currentGroup: 0,
        currentPolygon: 0,
      }
      const expectedState: NavigationState = {
        currentScreen: "GROUP_SCREEN",
        currentGroup: 0,
        currentPolygon: 0,
      }
      const actualState = navigationReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("POLYGON_SCREEN action", () => {
    it("should fire action", () => {
      const action: NavigationActions = {
        type: "POLYGON_SCREEN",
        currentGroup: 1,
        currentPolygon: 1,
      }
      const initialState: NavigationState = {
        currentScreen: "WATCH_SCREEN",
        currentGroup: 0,
        currentPolygon: 0,
      }
      const expectedState: NavigationState = {
        currentScreen: "POLYGON_SCREEN",
        currentGroup: 1,
        currentPolygon: 1,
      }
      const actualState = navigationReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
})

describe("Navigation Context", () => {
  const TestComponent = () => {
    const state = useContext(navigationStateContext)
    const dispatch = useContext(navigationDispatchContext)
    return (
      <>
        <p>Screen: {state.currentScreen}</p>
        <button
          onClick={() => {
            dispatch({ type: "WATCH_SCREEN" })
          }}
        >
          Main Screen
        </button>
        <button
          onClick={() => {
            dispatch({ type: "GROUP_SCREEN" })
          }}
        >
          Group Screen
        </button>
        <button
          onClick={() => {
            dispatch({
              type: "POLYGON_SCREEN",
              currentPolygon: 0,
              currentGroup: 0,
            })
          }}
        >
          Polygon Screen
        </button>
      </>
    )
  }
  it("should update navigation on button dispatch", () => {
    const { getByText } = render(
      <NavigationContextWrapper>
        <TestComponent />
      </NavigationContextWrapper>
    )

    fireEvent.click(getByText("Main Screen"))
    expect(getByText("Screen: WATCH_SCREEN")).toBeInTheDocument()

    fireEvent.click(getByText("Group Screen"))
    expect(getByText("Screen: GROUP_SCREEN")).toBeInTheDocument()

    fireEvent.click(getByText("Polygon Screen"))
    expect(getByText("Screen: POLYGON_SCREEN")).toBeInTheDocument()
  })
})
