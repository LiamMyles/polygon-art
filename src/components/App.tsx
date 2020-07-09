import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"

import {
  navigationStateContext,
  navigationDispatchContext,
} from "reducer-contexts/navigation"
import { polygonGroupsDispatchContext } from "reducer-contexts/polygon-groups"
import {
  backgroundDispatchContext,
  backgroundStateContext,
} from "reducer-contexts/background"

import Screens from "components/Screens"
import { MainCanvas } from "components/MainCanvas"
import { GroupsDisplay } from "components/GroupsDisplay"
import { PolygonDisplay } from "components/PolygonDisplay"
import { ModalBox } from "components/ModalBox"
import { ToggleSwitch } from "components/ToggleSwitch"
import { Slider } from "components/Slider"

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

const NavigationButton = styled.button`
  min-height: 50px;
  border-radius: 5px;
  margin: 5px;
`

const ColourPickerInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 35px;
  padding: 5px;
  border-radius: 5px;
`

const EditBackgroundModal: React.FC = () => {
  const backgroundDispatch = useContext(backgroundDispatchContext)
  const backgroundState = useContext(backgroundStateContext)

  const [canUpdate, setCanUpdate] = useState(false)
  const [editModalIsClosed, setEditModalIsClosed] = useState(true)
  const [shouldRedrawBackground, setShouldRedrawBackground] = useState(
    backgroundState.shouldRedraw
  )
  const [backgroundHex, setBackgroundHex] = useState(backgroundState.hex)
  const [backgroundOpacity, setBackgroundOpacity] = useState(
    backgroundState.opacity
  )

  useEffect(() => {
    if (
      shouldRedrawBackground !== backgroundState.shouldRedraw ||
      backgroundHex !== backgroundState.hex ||
      backgroundOpacity !== backgroundState.opacity
    ) {
    }
    setCanUpdate(true)
  }, [
    backgroundState,
    shouldRedrawBackground,
    backgroundHex,
    backgroundOpacity,
  ])

  return (
    <ModalBox
      buttonText="Edit Background"
      title="Edit Background"
      StyledButton={NavigationButton}
      isClosed={editModalIsClosed}
      setIsClosed={setEditModalIsClosed}
    >
      <ToggleSwitch
        checked={shouldRedrawBackground}
        id="redraw-background-toggle"
        label="Redraw Background"
        setFunction={setShouldRedrawBackground}
        checkedText={{ checked: "Yes", unchecked: "No" }}
      />
      <label htmlFor="background-colour-picker">Colour</label>
      <ColourPickerInput
        id="background-colour-picker"
        type="color"
        value={backgroundHex}
        onChange={({ currentTarget: { value } }) => {
          setBackgroundHex(value)
        }}
      />
      <Slider
        label="Opacity"
        id="background-opacity"
        currentValue={backgroundOpacity}
        max={100}
        min={0}
        setFunction={setBackgroundOpacity}
      />
      <button
        type="button"
        disabled={!canUpdate}
        onClick={() => {
          backgroundDispatch({
            type: "UPDATE_BACKGROUND_WITH_HEX",
            shouldRedraw: shouldRedrawBackground,
            hexColour: backgroundHex,
            opacity: backgroundOpacity,
          })
          setCanUpdate(false)
          setEditModalIsClosed(true)
        }}
      >
        Update
      </button>
    </ModalBox>
  )
}

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
      <MainContent currentChild={childMapping[navigationState.currentScreen]}>
        <>
          <MainCanvas />
          <Navigation>
            <EditBackgroundModal />
            <NavigationButton
              type="button"
              onClick={() => {
                polygonGroupsDispatch({
                  type: "RANDOMIZE_POLYGON_RINGS",
                  group: 0,
                })
              }}
            >
              Randomize
            </NavigationButton>
            <NavigationButton
              type="button"
              onClick={() => {
                navigationDispatch({ type: "GROUP_SCREEN" })
              }}
            >
              Edit Polygons
            </NavigationButton>
          </Navigation>
        </>
        <>
          <GroupsDisplay />
          <Navigation>
            <NavigationButton
              type="button"
              onClick={() => {
                navigationDispatch({ type: "MAIN_SCREEN" })
              }}
            >
              Home
            </NavigationButton>
          </Navigation>
        </>
        <>
          <PolygonDisplay />
          <Navigation>
            <NavigationButton
              type="button"
              onClick={() => {
                navigationDispatch({ type: "GROUP_SCREEN" })
              }}
            >
              Edit Polygons
            </NavigationButton>
            <NavigationButton
              type="button"
              onClick={() => {
                navigationDispatch({ type: "MAIN_SCREEN" })
              }}
            >
              Home
            </NavigationButton>
          </Navigation>
        </>
      </MainContent>
    </Main>
  )
}

export default App
