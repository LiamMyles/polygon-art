import React, { useContext } from "react"

import styled from "styled-components"

import { navigationDispatchContext } from "reducer-contexts/navigation"

import { StyledButton } from "common-styled-components/StyledButton"

import logo from "images/playing-with-polygons-logo.gif"
import redrawBackgroundLogo from "../images/playing-with-polygons-animated-logo-redraw-background.gif"
import fadedBackgroundLogo from "../images/playing-with-polygons-animated-logo-faded-background.gif"
import rotatingPolygon from "../images/polygon-rotating.gif"
import scalingPolygon from "../images/polygon-scaling.gif"
import rotatingAndScalingPolygon from "../images/polygon-rotating-and-scaling.gif"
import animatedLogo from "../images/playing-with-polygons-animated-logo.gif"

const BigCenteredButton = styled(StyledButton)`
  margin: 20px auto;
  display: block;
  width: 80%;
`

const WrappingDiv = styled.div`
  grid: 1/1;
  overflow-y: scroll;
  background: whitesmoke;
`

const ContentDiv = styled.div`
  max-width: 600px;
  margin: 10px auto;
  padding: 10px;
  font-size: 18px;
  background: white;
  border-radius: 10px;
  box-shadow: 1px 1px 5px dimgrey;

  & img {
    display: block;
    margin: 0 auto;
  }

  p {
    margin: 10px;
  }
  strong {
    font-weight: bold;
  }
  h1,
  h2,
  h3 {
    text-align: center;

    font-weight: bold;
  }
  h1 {
    font-size: 30px;
    margin: 20px;
  }
  h2 {
    font-size: 25px;
    margin: 15px;
  }
  h3 {
    font-size: 20px;
  }
`

export const IntroScreen = () => {
  const navigationDispatch = useContext(navigationDispatchContext)
  return (
    <WrappingDiv>
      <ContentDiv>
        <h1>Playing With Polygons</h1>
        <img alt="Playing with Polygons Logo" src={logo} />
        <p>Welcome to my little polygon art project!</p>
        <p>
          Scroll to Learn a bit about about the app. Or to get straight into the
          action just press <strong>START!</strong>
        </p>
        <BigCenteredButton
          type="button"
          onClick={() => {
            navigationDispatch({ type: "WATCH_SCREEN" })
          }}
        >
          START!
        </BigCenteredButton>
        <h2>Tips and Tricks</h2>
        <p>
          Here are some basic tips that I hope will help you make something cool{" "}
          <span role="img" aria-label="smiley face">
            😁
          </span>
        </p>
        <h3>Background</h3>
        <p>
          By default the background will redraw with an opacity, so you will see
          a trailing image when the polygons move. Adjusting the opacity will
          change how much <em>blur</em> you will see.
        </p>
        <img alt="polygon with fading background" src={fadedBackgroundLogo} />
        <p>
          The <em>redraw background</em> background option will cause the
          polygon to paint. Which can create really interesting patterns if you
          let them run.
        </p>
        <img alt="polygon with drawing background" src={redrawBackgroundLogo} />
        <h3>Polygon Animation</h3>
        <p>Polygons can move in 2 main ways. Rotation, and scaling</p>
        <p>
          Rotation can be either clockwise or anti-clockwise. But you will find
          the most interesting changes when you adjust its speed.{" "}
        </p>
        <img alt="Rotating Polygon" src={rotatingPolygon} />
        <p>
          Scaling is not the best word to describe it, but what basically
          happens is that the polygon will scale between a maximum and a minimum
          size.
        </p>
        <img alt="Scaling Polygon" src={scalingPolygon} />
        <p>
          You will get the most diverse results if you combine scaling and
          rotation together.
        </p>
        <img
          alt="Rotating and Scaling Polygon"
          src={rotatingAndScalingPolygon}
        />
        <h3>Making GIF's and Jif's</h3>
        <p>
          You can make a gif by pressing the make gif button, which you can then
          download!
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
        <h2>About Me</h2>
        <p>
          Hi, I'm Liam{" "}
          <span role="img" aria-label="Waving Hand">
            👋
          </span>
          , thanks for actually checking out my little app! I hope it brings you
          a tiny bit of joy.
        </p>
        <p>
          I'm yet another bearded white cis-male tech person, but I love the
          web, and I want as many people to enjoy what I create as possible.
        </p>
        <p>
          I have tried to make this app as accessible as possible, so if you're
          someone who benefits from an accessible web, and you see anything I
          can improve please do reach out!
        </p>
        <p>
          If you have any questions about the code, or want to raise any issues,
          reach out! Github issues will be the best place, but twitter is fine
          as well.
        </p>
        <h2>Create the polygons!</h2>
        <img alt="Animated Playing with Polygons Logo" src={animatedLogo} />
        <BigCenteredButton
          type="button"
          onClick={() => {
            navigationDispatch({ type: "WATCH_SCREEN" })
          }}
        >
          MAKE POLYGON ART!
        </BigCenteredButton>
      </ContentDiv>
    </WrappingDiv>
  )
}
