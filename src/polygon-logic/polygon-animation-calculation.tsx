import { PolygonRing } from "reducer-contexts/polygon-groups"

interface PolygonAnimation {
  position: {
    x: number
    y: number
  }
  points: {
    enabled: boolean
    position: {
      x: number
      y: number
    }[]
    fillColour: string
    strokeColour: string
    strokeWidth: number
  }
  sides: {
    enabled: boolean
    positions: [
      {
        x: number
        y: number
      },
      {
        x: number
        y: number
      }
    ][]
    strokeColour: string
    strokeWidth: number
  }
}

interface PolygonPoint {
  x: number
  y: number
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
  private actions: 

  constructor(polygonRingState: PolygonRing) {
    const {
      sides: { amount: sidesAmount },
      scale: { startingSize },
    }: PolygonRing = polygonRingState

    this.points = this.getInitialPoints(sidesAmount, startingSize)
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
