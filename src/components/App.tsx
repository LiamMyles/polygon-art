import React, { useContext } from "react"
import styled from "styled-components"

import {
  navigationStateContext,
  navigationDispatchContext,
} from "reducer-contexts/navigation"

import Screens from "components/Screens"
import { MainCanvas } from "components/MainCanvas"
import { GroupsDisplay } from "components/GroupsDisplay"
import { PolygonDisplay } from "components/PolygonDisplay"
import { GenerateGifModal } from "components/ShareGifModal"
import { EditBackgroundModal } from "components/EditBackgroundModal"

import { StyledButton } from "common-styled-components/StyledButton"

const Main = styled.main`
  display: grid;
  grid-template-rows: minmax(100%, 100vh);
  grid-template-columns: minmax(100%, 100vw);
  overflow: hidden;
`

const MainContent = styled(Screens)`
  display: grid;
  grid-template-rows: minmax(90%, 90vh) minmax(10%, 10vh);
  grid-template-columns: minmax(100%, 100vw);
  grid-row: 1;
  grid-column: 1;
`

const Navigation = styled.nav`
  background-color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-shadow: inset 0px 4px 9px -2px #404040;
`

const App: React.FC = () => {
  const navigationState = useContext(navigationStateContext)
  const navigationDispatch = useContext(navigationDispatchContext)

  const childMapping = {
    MAIN_SCREEN: 1,
    GROUP_SCREEN: 2,
    POLYGON_SCREEN: 3,
  }

  return (
    <Main>
      <MainContent currentChild={childMapping[navigationState.currentScreen]}>
        <>
          <MainCanvas />
          <Navigation>
            <EditBackgroundModal />
            <GenerateGifModal />
            <StyledButton
              type="button"
              onClick={() => {
                navigationDispatch({ type: "GROUP_SCREEN" })
              }}
            >
              Edit Polygons
            </StyledButton>
          </Navigation>
        </>
        <>
          <GroupsDisplay />
          <Navigation>
            <EditBackgroundModal />
            <StyledButton
              type="button"
              onClick={() => {
                navigationDispatch({ type: "MAIN_SCREEN" })
              }}
            >
              Home
            </StyledButton>
          </Navigation>
        </>
        <>
          <PolygonDisplay />
          <Navigation>
            <StyledButton
              type="button"
              onClick={() => {
                navigationDispatch({ type: "GROUP_SCREEN" })
              }}
            >
              Edit Polygons
            </StyledButton>
            <StyledButton
              type="button"
              onClick={() => {
                navigationDispatch({ type: "MAIN_SCREEN" })
              }}
            >
              Home
            </StyledButton>
          </Navigation>
        </>
      </MainContent>
    </Main>
  )
}

export default App
