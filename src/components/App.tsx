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
import { PolygonDisplay } from "components/PolygonDisplay"

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
        <PolygonDisplay />
      </Screens>
      <div>
        <button
          type="button"
          onClick={() => {
            navigationDispatch({ type: "PREV_SCREEN" })
          }}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => {
            navigationDispatch({ type: "NEXT_SCREEN" })
          }}
        >
          Next
        </button>
        <br />
        <button
          type="button"
          onClick={() => {
            polygonGroupsDispatch({ type: "RANDOMIZE_POLYGON_RINGS", group: 0 })
          }}
        >
          Randomize!
        </button>
      </div>
    </Main>
  )
}

export default App
