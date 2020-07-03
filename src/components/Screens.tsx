import React from "react"
import { useTransition, animated } from "react-spring"

interface ScreensProps {
  currentChild: number
  className?: string
}

const Screens: React.FC<ScreensProps> = ({
  children,
  currentChild,
  className,
}) => {
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
          <animated.div key={key} style={props} className={className}>
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
