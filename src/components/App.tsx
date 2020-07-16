import React, { useContext } from "react"
import styled from "styled-components"

import { navigationStateContext } from "reducer-contexts/navigation"

import { Screens } from "components/Screens"
import { IntroScreen } from "components/IntroScreen"
import { ViewScreen } from "components/ViewScreen"
import { GroupEditorScreen } from "components/GroupEditorScreen"
import { PolygonEditorScreen } from "components/PolygonEditorScreen"

const Main = styled.main`
  display: grid;
  grid-template-rows: minmax(100%, 100vh);
  grid-template-columns: minmax(100%, 100vw);
  overflow: hidden;
`

const AnimationWrappingScreens = styled(Screens)`
  display: grid;
  grid-row: 1;
  grid-column: 1;
`

const App: React.FC = () => {
  const navigationState = useContext(navigationStateContext)

  const childMapping = {
    INFO_SCREEN: 1,
    WATCH_SCREEN: 2,
    GROUP_SCREEN: 3,
    POLYGON_SCREEN: 4,
  }

  return (
    <Main>
      <AnimationWrappingScreens
        currentChild={childMapping[navigationState.currentScreen]}
      >
        <IntroScreen />
        <ViewScreen />
        <GroupEditorScreen />
        <PolygonEditorScreen />
      </AnimationWrappingScreens>
    </Main>
  )
}

export default App
