import { P5 } from "types/p5"

export function drawPolygonRing(p5: P5) {
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
