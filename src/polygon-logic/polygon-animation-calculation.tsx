import {
  PolygonRing,
  PolygonRingSides,
  PolygonRingDots,
  Mutable,
  Cords,
} from "reducer-contexts/polygon-groups"

interface PolygonAnimation {
  position: Cords
  points: {
    enabled: boolean
    position: Cords[]
    fillColour: string
    strokeColour: string
    strokeWidth: number
  }
  sides: {
    enabled: boolean
    positions: [Cords, Cords][]
    strokeColour: string
    strokeWidth: number
  }
}

interface PolygonPoint extends Cords {
  cos: number
  sin: number
}

type PolygonPoints = PolygonPoint[]

interface PolygonStyle {
  sides: {
    colours: string[]
    strokeWidth: number
  }
  dots: {
    strokeColours: string[]
    fillColours: string[]
    strokeWidth: number
  }
}

interface PolygonActions {
  isRotating: boolean
  isScaling: boolean
  isExpanding: boolean
  isRotatingClockwise: boolean
}

export class PolygonAnimationCalculation {
  private points: PolygonPoints
  private style: PolygonStyle
  private actions: PolygonActions

  constructor(polygonRingState: PolygonRing) {
    const {
      sides: { amount: sidesAmount },
      sides,
      dots,
      scale: { startingSize },
    } = { ...polygonRingState }

    this.points = this.getInitialPoints(sidesAmount, startingSize)
    this.style = getInitialStyles(sides, dots)
  }

  private getInitialStyles(
    sides: Mutable<PolygonRingSides>,
    dots: Mutable<PolygonRingSides>
  ): PolygonStyle {
    return { sides: { colours: sides.colours } }
  }

  private getInitialPoints(sides: number, startingSize: number): PolygonPoints {
    const twoPi = Math.PI * 2
    const angleBetweenPoints = twoPi / sides

    let currentAngle = angleBetweenPoints
    return [...Array(sides)].map(() => {
      currentAngle = +angleBetweenPoints
      const cos = Math.cos(currentAngle)
      const sin = Math.sin(currentAngle)
      const x = Math.round(cos * startingSize)
      const y = Math.round(sin * startingSize)

      return { x, y, sin, cos }
    })
  }

  getPolygonAnimation(): PolygonAnimation {
    return {}
  }
}
