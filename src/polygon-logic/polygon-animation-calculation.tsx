import {
  PolygonRing,
  PolygonRingSides,
  PolygonRingDots,
  Cords,
} from "reducer-contexts/polygon-groups"

export interface PolygonAnimation {
  position: Cords
  dots: {
    enabled: boolean
    fillColours: string[]
    strokeColours: string[]
    strokeWidth: number
    position: Cords[]
  }
  sides: {
    enabled: boolean
    strokeColours: string[]
    strokeWidth: number
    positions: [Cords, Cords][]
  }
}

interface PolygonPoint extends Cords {
  cos: number
  sin: number
}

type PolygonPoints = PolygonPoint[]

interface PolygonStyle {
  sides: {
    enabled: boolean
    colours: string[]
    strokeWidth: number
  }
  dots: {
    enabled: boolean
    strokeColours: string[]
    fillColours: string[]
    strokeWidth: number
  }
}

interface PolygonActions {
  isActive: boolean
  isRotating: boolean
  isScaling: boolean
  isRotatingClockwise: boolean
}

export class PolygonAnimationCalculation {
  private points: PolygonPoints
  private style: PolygonStyle
  private actions: PolygonActions

  constructor(polygon: PolygonRing) {
    const {
      sides: { amount: sidesAmount },
      sides,
      dots,
      scale: { startingSize },
    } = { ...polygon }

    this.points = this.getInitialPoints(sidesAmount, startingSize)
    this.style = this.getInitialStyles(sides, dots)
    this.actions = this.getInitialActions(polygon)
  }

  private getInitialStyles(
    sides: PolygonRingSides,
    dots: PolygonRingDots
  ): PolygonStyle {
    return {
      sides: {
        colours: sides.colours,
        strokeWidth: sides.strokeWidth,
        enabled: sides.enabled,
      },
      dots: {
        enabled: sides.enabled,
        fillColours: dots.fillColours,
        strokeColours: dots.strokeColours,
        strokeWidth: dots.strokeWidth,
      },
    }
  }

  private getInitialPoints(sides: number, startingSize: number): PolygonPoints {
    const twoPi = Math.PI * 2
    const angleBetweenPoints = twoPi / sides

    let currentAngle = angleBetweenPoints
    return [...Array(sides)].map(() => {
      currentAngle += angleBetweenPoints
      const cos = Math.cos(currentAngle)
      const sin = Math.sin(currentAngle)
      const x = Math.round(cos * startingSize)
      const y = Math.round(sin * startingSize)

      return { x, y, sin, cos }
    })
  }

  private getInitialActions({
    active,
    rotation,
    scale,
  }: PolygonRing): PolygonActions {
    return {
      isActive: active,
      isRotating: rotation.enabled,
      isScaling: scale.enabled,
      isRotatingClockwise: rotation.clockwise,
    }
  }

  public getPolygonFrame(): PolygonAnimation {
    const { dots, sides } = this.style
    const dotPositions = this.points.map((point) => {
      return { x: point.x, y: point.y }
    })
    const sidesPositions: [Cords, Cords][] = this.points.map((point, index) => {
      const totalPoints = this.points.length
      const nextIndex = index + 1
      let nextPoint: Cords
      if (nextIndex === totalPoints) {
        nextPoint = { x: this.points[0].x, y: this.points[0].y }
      } else {
        nextPoint = {
          x: this.points[nextIndex].x,
          y: this.points[nextIndex].y,
        }
      }
      return [{ x: point.x, y: point.y }, nextPoint]
    })

    return {
      position: { x: 0, y: 0 },
      dots: {
        enabled: dots.enabled,
        position: dotPositions,
        fillColours: dots.fillColours,
        strokeColours: dots.strokeColours,
        strokeWidth: dots.strokeWidth,
      },
      sides: {
        enabled: sides.enabled,
        positions: sidesPositions,
        strokeWidth: sides.strokeWidth,
        strokeColours: sides.colours,
      },
    }
  }
  // public getPolygonFrameAndStep(): PolygonAnimation {
  //   return {}
  // }
}
