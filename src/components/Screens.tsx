import React from "react"
import { useTransition, animated } from "react-spring"

interface ScreensProps {
  currentScreen: number
}

const Screens: React.FC<ScreensProps> = ({ children, currentScreen }) => {
  const transitions = useTransition(currentScreen, (item: number) => item, {
    from: {
      position: "absolute",
      opacity: 0,
      transform: "translate3d(100%,0,0)",
    },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  })
  return (
    <>
      {transitions.map(({ item, key, props }) => {
        return (
          <animated.div key={key} style={props}>
            {React.Children.map(children, (child, index) => {
              if (index === item - 1) {
                return child
              }
            })}
          </animated.div>
        )
      })}
    </>
  )
}

export default Screens
