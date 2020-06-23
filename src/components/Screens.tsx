import React from "react"
import { useTransition, animated } from "react-spring"
import styled from "styled-components"

interface ScreensProps {
  currentChild: number
}

const Screen = styled(animated.div)`
  grid-row: 1;
  grid-column: 1;
`

const Screens: React.FC<ScreensProps> = ({ children, currentChild }) => {
  const transitions = useTransition(currentChild, (item: number) => item, {
    from: {
      opacity: 0,
      transform: "translate(100%,0)",
    },
    enter: { opacity: 1, transform: "translate(0%,0)" },
    leave: {
      opacity: 0,
      transform: "translate(-50%,0)",
    },
  })
  return (
    <>
      {transitions.map(({ item, key, props }) => {
        return (
          <Screen key={key} style={props}>
            {React.Children.map(children, (child, index) => {
              if (index === item - 1) {
                return child
              }
            })}
          </Screen>
        )
      })}
    </>
  )
}

export default Screens
