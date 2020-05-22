import React, { useContext } from "react"
import styled from "styled-components"

import { P5 } from "types/p5"
import {
  navigationState as navigationStateContext,
  navigationDispatch as navigationDispatchContext,
} from "reducer-contexts/navigation"

import Screens from "components/Screens"
import { P5Canvas } from "components/P5Canvas"

const sketch = (p5: P5) => {
  p5.setup = () => {
    p5.createCanvas(400, 400)
  }
  let int = 0
  p5.draw = () => {
    int++
    p5.background("white")
    p5.textSize(32)
    p5.text(`${int}`, 10, 30)
  }
}

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
      <h1>Hello</h1>
      <Screens currentScreen={navigationState.currentScreen}>
        <>
          <div
            style={{
              background: "white",
              width: "100%",
              height: "100%",
              textAlign: "center",
              fontSize: 200,
            }}
          >
            <P5Canvas sketch={sketch} />
          </div>
        </>
        <h1
          style={{
            background: "purple",
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
