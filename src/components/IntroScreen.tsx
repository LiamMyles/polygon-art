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
  /* TODO: Link Style */
  em {
    font-style: italic;
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
          By default the background will redraw with an opacity, this will cause
          a trailing image when the polygons move. Adjusting the opacity will
          change how much <em>trail/blur</em> is left behind.
        </p>
        <img alt="polygon with fading background" src={fadedBackgroundLogo} />
        <p>
          The <em>redraw background</em> <strong>Edit Background</strong> option
          will cause the polygon to paint. This creates the most interesting
          patterns when its left to run for a while.
        </p>
        <img alt="polygon with drawing background" src={redrawBackgroundLogo} />
        <h3>Polygon Animation</h3>
        <p>
          Polygons move in two main ways. <strong>Rotation</strong> and{" "}
          <strong>Scaling</strong>
        </p>
        <p>
          <strong>Rotation</strong> can be either clockwise or anti-clockwise.
          But you will find the most interesting changes when you adjust its
          speed.
        </p>
        <img alt="Rotating Polygon" src={rotatingPolygon} />
        <p>
          <strong>Scaling</strong> like the rotation is an endless cycle. And
          causes the polygon to scale between a maximum and a minimum size.
        </p>
        <img alt="Scaling Polygon" src={scalingPolygon} />
        <p>
          For the most interesting results you can combine scaling and rotation
          together.
        </p>
        <img
          alt="Rotating and Scaling Polygon"
          src={rotatingAndScalingPolygon}
        />
        <h3>Making GIF's or Jif's</h3>
        <p>
          You can make and download a gif by pressing the{" "}
          <strong>Make Gif</strong> button. Just be aware that the longer the
          gif is, the longer it will take to make.
        </p>
        <p>
          If you're on a phone I would recommend creating short gifs. But you
          can make them 10 seconds long if you don't mind the wait.
        </p>
        <p>
          If you do make anything you want to share on twitter, be sure to
          include <em>@PlayingPolygons</em> to share with the{" "}
          <a href="#">Playing With Polygons Twitter</a>
        </p>
        <h2>Playing with Polygons Across the Web</h2>
        <p>
          If you want to see the code powering this app, or you want to raise an
          issue. Check out the <a href="#">Playing with Polygons Github page</a>
        </p>
        <p>
          If twitter is more of your thing, why not check out the{" "}
          <a href="#">Playing with Polygons Twitter account</a>. Hopefully there
          will be gifs on their to help inspire you.
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
          I'm just another bearded, white, cis-male, tech person. But I love the
          web, and how accessible it is to so many people.
        </p>
        <p>
          If you want to know more about me, you can check{" "}
          <a href="#">my Twitter account</a> and see what I'm up to.
        </p>
        <p>
          Also, while I have done my best to make this app as accessible as
          possible, if you have anything you notice I can improve please do
          reach out!
        </p>
        <h2>The Next Step</h2>
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
