import React, { useContext } from "react"

import {
  navigationState as navigationStateContext,
  navigationDispatch as navigationDispatchContext,
} from "reducer-contexts/navigation"

import Screens from "components/Screens"

const App: React.FC = () => {
  const navigationState = useContext(navigationStateContext)
  const navigationDispatch = useContext(navigationDispatchContext)
  console.log(navigationState)
  return (
    <>
      <Screens currentScreen={navigationState.currentScreen}>
        <h1>Hello</h1>
        <h1>World</h1>
        <h1>This</h1>
      </Screens>
      <button
        onClick={() => {
          navigationDispatch({ type: "NEXT_SCREEN" })
        }}
      >
        Next
      </button>
    </>
  )
}

export default App
