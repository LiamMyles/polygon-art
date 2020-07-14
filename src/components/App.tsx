import React, { useContext } from "react"
import styled from "styled-components"

import {
  navigationStateContext,
  navigationDispatchContext,
} from "reducer-contexts/navigation"

import Screens from "components/Screens"
import { MainCanvas } from "components/MainCanvas"
import { GroupsEditor } from "components/GroupsEditor"
import { PolygonEditor } from "components/PolygonEditor"
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
    INFO_SCREEN: 1,
    MAIN_SCREEN: 2,
    GROUP_SCREEN: 3,
    POLYGON_SCREEN: 4,
  }

  return (
    <Main>
      <MainContent currentChild={childMapping[navigationState.currentScreen]}>
        <div>
          <h1>Playing With Polygons</h1>
          <img alt="Playing with Polygons Logo" />
          <p>Welcome to my little polygon art project!</p>
          <p>
            To get straight into the action just press get started, otherwise
            keep reading/scrolling to learn more.
          </p>
          <StyledButton
            type="button"
            onClick={() => {
              navigationDispatch({ type: "MAIN_SCREEN" })
            }}
          >
            START!
          </StyledButton>
          <h2>How to use</h2>
          <p>
            You can make all sorts of polygon shaped art, and you're going to
            need to explore all the options to see everything. But here is a few
            examples to start you off{" "}
            <span role="img" aria-label="smiley face">
              😁
            </span>
          </p>
          <h3>Background</h3>
          <img alt="polygon with drawing background" />
          <p>
            You can edit the background to not redraw and you will create an
            animated painting effect.
          </p>
          <img alt="polygon with fading background" />
          <p>
            By default the background will redraw with an opacity, so you will
            see a trailing image as the polygon plays
          </p>
          <h3>Polygon Animation</h3>
          <p>Polygons can move in 2 main ways. Rotation, and scaling</p>
          <img alt="Rotating Polygon" />
          <p>
            Rotating polygons... will... rotate{" "}
            <span role="img" aria-label="Sweating Smiley face">
              😅
            </span>
          </p>
          <img alt="Scaling Polygon" />
          <p>Scaling polygons will actually just bounce between two sizes.</p>
          <h3>Making GIF's and Jif's</h3>
          <p>
            You can make a gif by pressing the make gif button, which you can
            then download!
          </p>
          <p>
            The longer your gif the longer it will take to process, and if your
            device isn't powerful it can take a while to generate the gif.
          </p>
          <p>
            However, if you do actually make any gif's I would love to see them,
            so be sure to tweet them @PlayingPolygons
          </p>
          <h2>Playing with Polygons Across the Web</h2>
          <p>
            You find find playing with polygons on github! Check it out if you
            like code
          </p>
          <p>
            You can also find playing with polygons on twitter! Check it out if
            you like gif's of polygons
          </p>
          <h2>About Me (The Bearded White Dude who made this)</h2>
          <p>
            Hi, I'm Liam{" "}
            <span role="img" aria-label="Waving Hand">
              👋
            </span>
            , thanks for actually checking out my little app!
          </p>
          <p>
            I have tried to make it as accessible as possible, so if you're
            someone who benefits from an accessible web, and you see anything I
            can improve please do reach out!
          </p>
          <p>
            If you have any questions about the code, or want to raise any
            issues, reach out! Github issues will be the best place, but twitter
            is fine as well.
          </p>
          <h2>Create the polygons!</h2>
          <img alt="Animated Playing with Polygons Logo" />
          <StyledButton
            type="button"
            onClick={() => {
              navigationDispatch({ type: "MAIN_SCREEN" })
            }}
          >
            MAKE POLYGON ART!
          </StyledButton>
        </div>
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
          <GroupsEditor />
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
          <PolygonEditor />
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
