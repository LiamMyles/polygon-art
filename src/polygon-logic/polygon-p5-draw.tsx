import { P5 } from "types/p5"
import {
  PolygonAnimationCalculation,
  PolygonAnimation,
} from "polygon-logic/polygon-animation-calculation"
// eslint-disable-next-line
import { PolygonRing, PolygonGroup } from "reducer-contexts/polygon-groups"

function singlePolygonDraw(
  polygonAnimation: PolygonAnimation,
  size: { width: number; height: number },
  p5: P5
) {
  const { currentRotation, dots, sides, position } = polygonAnimation
  const x = Math.floor(size.width * (position.x / 100))
  const y = Math.floor(size.height * (position.y / 100))
  p5.push()
  p5.translate(x, y)
  p5.rotate(currentRotation)
  if (sides.enabled) {
    sides.positions.forEach((cords, index) => {
      const stokeColour = index % sides.strokeColours.length
      p5.stroke(sides.strokeColours[stokeColour])
      p5.strokeWeight(sides.strokeWidth)
      p5.line(cords[0].x, cords[0].y, cords[1].x, cords[1].y)
    })
  }
  if (dots.enabled) {
    p5.push()
    dots.position.forEach((cords, index) => {
      const fillColourIndex = index % dots.fillColours.length
      const stokeColourIndex = index % dots.strokeColours.length
      const { x, y } = cords
      p5.fill(dots.fillColours[fillColourIndex])
      p5.strokeWeight(dots.strokeWidth)
      p5.stroke(dots.strokeColours[stokeColourIndex])
      p5.ellipse(x, y, dots.size)
    })
    p5.pop()
  }
  p5.pop()
}

export function generatePolygonRingSketch(
  PolygonRing: Readonly<PolygonRing>,
  size: { height: number; width: number }
) {
  const polygonRingInstance = new PolygonAnimationCalculation(PolygonRing)

  return (p5: P5) => {
    p5.setup = () => {
      p5.createCanvas(size.width, size.height)
      p5.background("grey")
    }
    p5.draw = () => {
      polygonRingInstance.getPolygonFrameAndStep()
      p5.angleMode("degrees")
      p5.translate(size.width / 2, size.height / 2)
      singlePolygonDraw(polygonRingInstance.getPolygonFrameAndStep(), size, p5)
    }
  }
}

export function generatePolygonGroupSketch(
  polygonGroup: Readonly<PolygonGroup>,
  size: { height: number; width: number }
) {
  const polygonRingInstances = polygonGroup.rings.map((polygonRing) => {
    return new PolygonAnimationCalculation(polygonRing)
  })

  return (p5: P5) => {
    p5.setup = () => {
      p5.createCanvas(size.width, size.height)
      p5.background("grey")
    }
    p5.draw = () => {
      p5.angleMode("degrees")
      p5.background("grey")
      p5.translate(size.width / 2, size.height / 2)
      p5.push()
      for (const polygonRing of polygonRingInstances) {
        singlePolygonDraw(polygonRing.getPolygonFrameAndStep(), size, p5)
      }
      p5.pop()
    }
  }
}

export function generateAllPolygonRingGroupsSketch(
  polygonGroups: Readonly<PolygonGroup[]>,
  size: { height: number; width: number }
) {
  const polygonGroupInstances = polygonGroups.map(({ rings }) =>
    rings.map((polygonRing) => {
      return new PolygonAnimationCalculation(polygonRing)
    })
  )

  return (p5: P5) => {
    p5.setup = () => {
      p5.createCanvas(size.width, size.height)
      p5.background("grey")
    }
    p5.draw = () => {
      p5.angleMode("degrees")
      p5.background("grey")
      p5.translate(size.width / 2, size.height / 2)
      for (const polygonGroupRings of polygonGroupInstances) {
        p5.push()
        // p5.translate(0, 0) -- TODO Placeholder for group translation, needs some thinking. Might just change it to offset in the ring
        for (const polygonRingInstance of polygonGroupRings) {
          singlePolygonDraw(
            polygonRingInstance.getPolygonFrameAndStep(),
            size,
            p5
          )
        }
        p5.pop()
      }
    }
  }
}
