import React, { useEffect, useRef } from "react"
import p5 from "p5"
import { P5 } from "types/p5"
import styled from "styled-components"

const Container = styled.div`
  width: 100%;
  height: 100%;
`
interface P5CanvasProps {
  sketch: (p5: P5) => void
}

export const P5Canvas: React.FC<P5CanvasProps> = ({ sketch }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const P5Ref = useRef<P5>()

  useEffect(() => {
    const node = divRef.current as HTMLDivElement
    if (P5Ref.current !== undefined) {
      P5Ref.current.remove()
    }
    const p5Instance = new p5(sketch, node)
    P5Ref.current = p5Instance

    return () => {
      const P5Instance = P5Ref.current as P5
      P5Instance.remove()
    }
  }, [P5Ref, divRef, sketch])

  return <Container ref={divRef} />
}
