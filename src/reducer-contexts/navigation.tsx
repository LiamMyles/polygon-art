import React, { useReducer, createContext } from "react"
import produce, { Draft } from "immer"

export interface NavigationState {
  currentScreen: "MAIN_SCREEN" | "GROUP_SCREEN" | "POLYGON_SCREEN"
  currentGroup: number
  currentPolygon: number
}
interface MainScreen {
  type: "MAIN_SCREEN"
}
interface GroupScreen {
  type: "GROUP_SCREEN"
}
interface PolygonScreen {
  type: "POLYGON_SCREEN"
  currentGroup: number
  currentPolygon: number
}

export type NavigationActions = MainScreen | GroupScreen | PolygonScreen

export const navigationReducer = produce(
  (draft: Draft<NavigationState>, action: NavigationActions) => {
    switch (action.type) {
      case "MAIN_SCREEN":
      case "GROUP_SCREEN": {
        draft.currentScreen = action.type
        break
      }
      case "POLYGON_SCREEN": {
        draft.currentScreen = action.type
        draft.currentGroup = action.currentGroup
        draft.currentPolygon = action.currentPolygon
        break
      }
    }
  }
)

export const navigationInitialState: NavigationState = {
  currentScreen: "POLYGON_SCREEN",
  currentGroup: 0,
  currentPolygon: 0,
}

export const NavigationContextWrapper: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    navigationReducer,
    navigationInitialState
  )

  return (
    <navigationDispatchContext.Provider value={dispatch}>
      <navigationStateContext.Provider value={state}>
        {children}
      </navigationStateContext.Provider>
    </navigationDispatchContext.Provider>
  )
}

export const navigationDispatchContext = createContext(
  {} as React.Dispatch<NavigationActions>
)
export const navigationStateContext = createContext({} as NavigationState)
