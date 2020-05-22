import React, { useCallback } from "react"
import p5 from "p5"
import { P5 } from "types/p5"

interface P5CanvasProps {
  sketch: (p5: P5) => void
}
export const P5Canvas: React.FC<P5CanvasProps> = ({ sketch }) => {
  const canvasRef = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) {
        if (node.lastChild !== null) node.removeChild(node.lastChild)
        new p5(sketch, node)
      }
    },
    [sketch]
  )
  return <div ref={canvasRef} />
}
