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

  const childMapping = {
    MAIN_SCREEN: 1,
    GROUP_SCREEN: 2,
    POLYGON_SCREEN: 3,
  }

  return (
    <Main>
      <Screens currentChild={childMapping[navigationState.currentScreen]}>
        <MainCanvas />
        <GroupsDisplay />
        <PolygonDisplay />
      </Screens>
      <div>
        <Screens currentChild={childMapping[navigationState.currentScreen]}>
          <>
            <button
              type="button"
              onClick={() => {
                polygonGroupsDispatch({
                  type: "RANDOMIZE_POLYGON_RINGS",
                  group: 0,
                })
              }}
            >
              Randomize
            </button>

            <button
              type="button"
              onClick={() => {
                navigationDispatch({ type: "GROUP_SCREEN" })
              }}
            >
              Edit Polygon
            </button>
            <button
              type="button"
              onClick={() => {
                console.log("TODO")
              }}
            >
              Edit Background
            </button>
          </>
          <>
            <button
              type="button"
              onClick={() => {
                navigationDispatch({ type: "MAIN_SCREEN" })
              }}
            >
              Back
            </button>
          </>
        </Screens>
      </div>
    </Main>
  )
}

export default App
