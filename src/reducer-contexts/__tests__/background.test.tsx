import React, { useContext } from "react"
import { render, fireEvent } from "@testing-library/react"
import {
  BackgroundState,
  backgroundReducer,
  BackgroundActions,
  BackgroundContextWrapper,
  backgroundDispatchContext,
  backgroundStateContext,
} from "reducer-contexts/background"

describe("Background Reducer", () => {
  describe("UPDATE_BACKGROUND_WITH_HEX action", () => {
    it("should fire action and convert HEX to rgb and rgba", () => {
      const action: BackgroundActions = {
        type: "UPDATE_BACKGROUND_WITH_HEX",
        hexColour: "#ffffff",
        opacity: 80,
        shouldRedraw: true,
      }
      const initialState: BackgroundState = {
        opacity: 5,
        hex: "#000000",
        rgb: "rgb(0,0,0)",
        rgba: "rgba(0,0,0,0.05)",
        shouldRedraw: false,
      }
      const expectedState: BackgroundState = {
        opacity: 80,
        hex: "#ffffff",
        rgb: "rgb(255,255,255)",
        rgba: "rgba(255,255,255,0.8)",
        shouldRedraw: true,
      }
      const actualState = backgroundReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
})

describe("Background Context", () => {
  const TestComponent = () => {
    const state = useContext(backgroundStateContext)
    const dispatch = useContext(backgroundDispatchContext)
    return (
      <>
        <label>
          RGBA <input value={state.rgba} onChange={() => {}} />
        </label>
        <button
          onClick={() => {
            dispatch({
              type: "UPDATE_BACKGROUND_WITH_HEX",
              hexColour: "#ffffff",
              opacity: 80,
              shouldRedraw: true,
            })
          }}
        >
          Update Colour
        </button>
      </>
    )
  }
  it("should update background on button dispatch", () => {
    const { getByText, getByLabelText } = render(
      <BackgroundContextWrapper>
        <TestComponent />
      </BackgroundContextWrapper>
    )

    fireEvent.click(getByText("Update Colour"))
    expect(getByLabelText("RGBA")).toHaveValue("rgba(255,255,255,0.8)")
  })
})
