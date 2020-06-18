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
import { ColourPicker } from "components/ColourPicker"

const Main = styled.main`
  display: grid;
  grid-template-rows: minmax(90%, 90vh) minmax(10vh, 10px);
  overflow: hidden;
`

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  width: 100%;
`

const App: React.FC = () => {
  const navigationState = useContext(navigationStateContext)
  const navigationDispatch = useContext(navigationDispatchContext)
  const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)

  return (
    <Main>
      <Screens currentScreen={navigationState.currentScreen}>
        <CenterDiv>
          <ColourPicker
            initialColours={[
              "#78d7c8",
              "#83d952",
              "#da67c3",
              "#da4c53",
              "#d360ba",
              "#ba29d8",
              "#44ca8c",
              "#ced159",
              "#d84cd1",
              "#96df4f",
            ]}
            maxColours={12}
          />
        </CenterDiv>
        <MainCanvas />
        <GroupsDisplay />
        <PolygonDisplay />
      </Screens>
      <div>
        <h1>Hello</h1>
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
        <button
          type="button"
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
