import React, { useReducer, createContext } from "react"
import produce, { Draft } from "immer"

interface NavigationState {
  currentScreen: number
  totalScreens: number
}

interface NextScreen {
  type: "NEXT_SCREEN"
}

interface PrevScreen {
  type: "PREV_SCREEN"
}

export type NavigationActions = PrevScreen | NextScreen

export const navigationReducer = produce(
  (draft: Draft<NavigationState>, action: NavigationActions) => {
    switch (action.type) {
      case "NEXT_SCREEN": {
        const newScreen = draft.currentScreen + 1
        if (newScreen <= draft.totalScreens) {
          draft.currentScreen = newScreen
        } else {
          draft.currentScreen = 1
        }
        break
      }
      case "PREV_SCREEN": {
        const newScreen = draft.currentScreen - 1
        if (newScreen <= 0) {
          draft.currentScreen = draft.totalScreens
        } else {
          draft.currentScreen = newScreen
        }
        break
      }
    }
  }
)

export const navigationInitialState = { currentScreen: 1, totalScreens: 3 }

export const NavigationContextWrapper: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    navigationReducer,
    navigationInitialState
  )

  return (
    <navigationDispatch.Provider value={dispatch}>
      <navigationState.Provider value={state}>
        {children}
      </navigationState.Provider>
    </navigationDispatch.Provider>
  )
}

export const navigationDispatch = createContext(
  {} as React.Dispatch<NavigationActions>
)
export const navigationState = createContext({} as NavigationState)
