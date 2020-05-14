import React, { useContext } from "react"
import { render, fireEvent } from "@testing-library/react"
import {
  navigationReducer,
  NavigationActions,
  NavigationContextWrapper,
  navigationDispatch,
  navigationState,
} from "reducer-contexts/navigation"

describe("Navigation Reducer", () => {
  describe("NEXT_SCREEN Action", () => {
    it("should move from screen 2 to screen 3", () => {
      const action: NavigationActions = { type: "NEXT_SCREEN" }
      const initialState = { currentScreen: 2, totalScreens: 3 }
      const expectedState = { currentScreen: 3, totalScreens: 3 }
      const actualState = navigationReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })

    it("should move from screen 3 to screen 1", () => {
      const action: NavigationActions = { type: "NEXT_SCREEN" }
      const initialState = { currentScreen: 3, totalScreens: 3 }
      const expectedState = { currentScreen: 1, totalScreens: 3 }
      const actualState = navigationReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("PREV_SCREEN action", () => {
    it("should move from screen 2 to screen 1", () => {
      const action: NavigationActions = { type: "PREV_SCREEN" }
      const initialState = { currentScreen: 2, totalScreens: 3 }
      const expectedState = { currentScreen: 1, totalScreens: 3 }
      const actualState = navigationReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
    it("should move from screen 1 to screen 3", () => {
      const action: NavigationActions = { type: "PREV_SCREEN" }
      const initialState = { currentScreen: 1, totalScreens: 3 }
      const expectedState = { currentScreen: 3, totalScreens: 3 }
      const actualState = navigationReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
})

describe("Navigation Context", () => {
  let TestComponent: React.FC
  beforeAll(() => {
    TestComponent = () => {
      const state = useContext(navigationState)
      const dispatch = useContext(navigationDispatch)
      return (
        <>
          <p>Screen: {state.currentScreen}</p>
          <p>Total: {state.totalScreens}</p>
          <button
            onClick={() => {
              dispatch({ type: "NEXT_SCREEN" })
            }}
          >
            Next Page
          </button>
        </>
      )
    }
  })
  it("should expose context state", () => {
    const { getByText } = render(
      <NavigationContextWrapper>
        <TestComponent />
      </NavigationContextWrapper>
    )
    expect(getByText("Screen: 1")).toBeInTheDocument()
    expect(getByText("Total: 3")).toBeInTheDocument()
  })
  it("should expose dispatch, and allow it to update state", () => {
    const { getByText } = render(
      <NavigationContextWrapper>
        <TestComponent />
      </NavigationContextWrapper>
    )
    expect(getByText("Screen: 1")).toBeInTheDocument()

    fireEvent.click(getByText("Next Page"))

    expect(getByText("Screen: 2")).toBeInTheDocument()
    expect(getByText("Total: 3")).toBeInTheDocument()
  })
})
