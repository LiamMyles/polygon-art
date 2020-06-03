import React, { useContext } from "react"
import styled from "styled-components"

import {
  navigationStateContext,
  navigationDispatchContext,
} from "reducer-contexts/navigation"

import { polygonGroupsDispatchContext } from "reducer-contexts/polygon-groups"

import Screens from "components/Screens"
import { MainCanvas } from "components/MainCanvas"
import { GroupsDisplay } from "components/GroupsDisplay"

const Main = styled.main`
  display: grid;
  grid-template-rows: minmax(90%, 90vh) minmax(10vh, 10px);
  overflow: hidden;
`

const App: React.FC = () => {
  const navigationState = useContext(navigationStateContext)
  const navigationDispatch = useContext(navigationDispatchContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)

  return (
    <Main>
      <Screens currentScreen={navigationState.currentScreen}>
        <MainCanvas />
        <GroupsDisplay />
        <h1
          style={{
            background: "pink",
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: 200,
          }}
        >
          World
        </h1>
      </Screens>
      <div>
        <h1>Hello</h1>
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
        <br />
        <button
          onClick={() => {
            polygonGroupsDispatch({ type: "RANDOMIZE_POLYGON_RINGS", group: 0 })
          }}
        >
          Randomize!
        </button>
        <button
          onClick={() => {
            polygonGroupsDispatch({ type: "CREATE_POLYGON_GROUP" })
          }}
        >
          App Group!
        </button>
      </div>
    </Main>
  )
}

export default App
