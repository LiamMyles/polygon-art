import { P5 } from "types/p5"
import {
  PolygonAnimationCalculation,
  PolygonAnimation,
} from "polygon-logic/polygon-animation-calculation"
// Disabled because PolygonRing is only used as a type and is getting flagged
// eslint-disable-next-line
import { PolygonRing, PolygonGroup } from "reducer-contexts/polygon-groups"

function getSizeConstrainedCords(
  size: { width: number; height: number },
  cords: { x: number; y: number }
): { x: number; y: number } {
  const x = Math.floor((size.width * (cords.x / 100)) / 2)
  let y = Math.floor((size.height * (cords.y / 100)) / 2)
  //Flip the y axis to have +100 at the top and -100 at the bottom
  if (y < 0) {
    y = y / -1
  } else {
    y = y / -1
  }

  return { x, y }
}

function singlePolygonDraw(
  polygonAnimation: PolygonAnimation,
  size: { width: number; height: number },
  p5: P5,
  scale?: number
) {
  const { currentRotation, dots, sides, position } = polygonAnimation
  const { x, y } = getSizeConstrainedCords(size, position)

  p5.push()
  p5.translate(x, y)
  if (scale) {
    p5.scale(scale)
  }
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
  windowSize: { height: number; width: number },
  scale?: number
) {
  const polygonRingInstance = new PolygonAnimationCalculation(PolygonRing)

  return (p5: P5) => {
    p5.setup = () => {
      p5.createCanvas(windowSize.width, windowSize.height)
      p5.background("#f6f6f6")
    }
    p5.draw = () => {
      polygonRingInstance.getPolygonFrameAndStep()
      p5.angleMode("degrees")
      p5.background("rgba(255,255,255, 0.05)")
      p5.translate(windowSize.width / 2, windowSize.height / 2)
      singlePolygonDraw(
        polygonRingInstance.getPolygonFrameAndStep(),
        windowSize,
        p5,
        scale
      )
    }
  }
}

export function generatePolygonGroupSketch(
  polygonGroup: Readonly<PolygonGroup>,
  windowSize: { height: number; width: number },
  scale?: number
) {
  const polygonRingInstances = polygonGroup.rings.map((polygonRing) => {
    return new PolygonAnimationCalculation(polygonRing)
  })

  return (p5: P5) => {
    p5.setup = () => {
      p5.createCanvas(windowSize.width, windowSize.height)
      p5.background("#f6f6f6")
    }
    p5.draw = () => {
      p5.angleMode("degrees")
      p5.background("rgba(255,255,255, 0.05)")
      p5.translate(windowSize.width / 2, windowSize.height / 2)
      p5.push()
      for (const polygonRing of polygonRingInstances) {
        singlePolygonDraw(
          polygonRing.getPolygonFrameAndStep(),
          windowSize,
          p5,
          scale
        )
      }
      p5.pop()
    }
  }
}

export function generateAllPolygonRingGroupsSketch(
  polygonGroups: Readonly<PolygonGroup[]>,
  windowSize: { height: number; width: number }
) {
  const polygonGroupInstances = polygonGroups.map(({ rings }) =>
    rings.map((polygonRing) => {
      return new PolygonAnimationCalculation(polygonRing)
    })
  )

  return (p5: P5) => {
    p5.setup = () => {
      p5.createCanvas(windowSize.width, windowSize.height)
      p5.background("#f6f6f6")
    }
    p5.draw = () => {
      p5.angleMode("degrees")
      p5.background("rgba(255,255,255, 0.05)")
      p5.translate(windowSize.width / 2, windowSize.height / 2)
      polygonGroupInstances.forEach((polygonGroupRings, index) => {
        p5.push()
        const { x, y } = getSizeConstrainedCords(
          windowSize,
          polygonGroups[index].position
        )
        p5.translate(x, y)
        for (const polygonRingInstance of polygonGroupRings) {
          singlePolygonDraw(
            polygonRingInstance.getPolygonFrameAndStep(),
            windowSize,
            p5
          )
        }
        p5.pop()
      })
    }
  }
}
