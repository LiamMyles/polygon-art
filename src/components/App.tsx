import React, { useContext } from "react"
import styled from "styled-components"

import {
  navigationState as navigationStateContext,
  navigationDispatch as navigationDispatchContext,
} from "reducer-contexts/navigation"

import Screens from "components/Screens"

const Main = styled.main`
  display: grid;
  grid-template-rows: minmax(90%, 90vh) minmax(10vh, 10px);
  overflow: hidden;
`

const App: React.FC = () => {
  const navigationState = useContext(navigationStateContext)
  const navigationDispatch = useContext(navigationDispatchContext)
  return (
    <Main>
      <Screens currentScreen={navigationState.currentScreen}>
        <h1
          style={{
            background: "red",
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: 200,
          }}
        >
          Hello
        </h1>
        <h1
          style={{
            background: "purple",
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: 200,
          }}
        >
          World
        </h1>
        <h1
          style={{
            background: "pink",
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: 200,
          }}
        >
          This
        </h1>
      </Screens>
      <div>
        <button
          onClick={() => {
            navigationDispatch({ type: "PREV_SCREEN" })
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            navigationDispatch({ type: "NEXT_SCREEN" })
          }}
        >
          Next
        </button>
      </div>
    </Main>
  )
}

export default App
