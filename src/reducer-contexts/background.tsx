import React, { useReducer, createContext } from "react"
import produce, { Draft } from "immer"

export interface BackgroundState {
  opacity: number
  rgb: string
  rgba: string
  shouldRedraw: boolean
}

interface UpdateBackground {
  type: "UPDATE_BACKGROUND_WITH_HEX"
  opacity: number
  hexColour: string
  shouldRedraw: boolean
}

export type BackgroundActions = UpdateBackground

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export const backgroundReducer = produce(
  (draft: Draft<BackgroundState>, action: BackgroundActions) => {
    switch (action.type) {
      case "UPDATE_BACKGROUND_WITH_HEX": {
        draft.opacity = action.opacity
        draft.shouldRedraw = action.shouldRedraw
        const convertedHex = hexToRgb(action.hexColour)
        if (convertedHex) {
          const { r, g, b } = convertedHex
          draft.rgb = `rgb(${r},${g},${b})`
          draft.rgba = `rgba(${r},${g},${b},${action.opacity / 100})`
        }
        break
      }
    }
  }
)

export const backgroundInitialState: BackgroundState = {
  opacity: 70,
  rgb: "rgb(255,255,255)",
  rgba: "rgba(255,255,255, 0.05)",
  shouldRedraw: true,
}

export const BackgroundContextWrapper: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    backgroundReducer,
    backgroundInitialState
  )

  return (
    <backgroundDispatchContext.Provider value={dispatch}>
      <backgroundStateContext.Provider value={state}>
        {children}
      </backgroundStateContext.Provider>
    </backgroundDispatchContext.Provider>
  )
}

export const backgroundDispatchContext = createContext(
  {} as React.Dispatch<BackgroundActions>
)
export const backgroundStateContext = createContext({} as BackgroundState)
