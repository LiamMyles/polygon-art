import { PolygonRing, Cords } from "reducer-contexts/polygon-groups"

export interface PolygonAnimation {
  position: Cords
  currentRotation: number
  dots: {
    enabled: boolean
    fillColours: string[]
    strokeColours: string[]
    strokeWidth: number
    size: number
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

interface PolygonAnimationConstants {
  position: Cords
  rotationSpeed: number
  scalingSpeed: number
  scalingRange: { min: number; max: number }
  isActive: boolean
  isRotating: boolean
  isScaling: boolean
  isRotatingClockwise: boolean
}

interface PolygonAnimationState {
  currentRotation: number
  currentSize: number
  currentlyExpanding: boolean
  polygonPoints: PolygonPoint[]
}

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
    size: number
  }
}

export class PolygonAnimationCalculation {
  private style: PolygonStyle
  private animationState: PolygonAnimationState
  private animationConstants: PolygonAnimationConstants

  constructor(polygon: PolygonRing) {
    this.style = this.getInitialStyles(polygon)
    this.animationConstants = this.getInitialConstants(polygon)
    this.animationState = this.getInitialState(polygon)
  }

  private getInitialStyles({ sides, dots }: PolygonRing): PolygonStyle {
    return {
      sides: {
        colours: sides.colours,
        strokeWidth: sides.strokeWidth,
        enabled: sides.enabled,
      },
      dots: {
        enabled: dots.enabled,
        size: dots.size,
        fillColours: dots.fillColours,
        strokeColours: dots.strokeColours,
        strokeWidth: dots.strokeWidth,
      },
    }
  }

  private getInitialPoints(
    sides: number,
    startingSize: number
  ): PolygonPoint[] {
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

  private getInitialConstants({
    active,
    rotation,
    scale,
    position,
  }: PolygonRing): PolygonAnimationConstants {
    return {
      position,
      isActive: active,
      isRotating: rotation.enabled,
      isScaling: scale.enabled,
      isRotatingClockwise: rotation.clockwise,
      rotationSpeed: rotation.speed,
      scalingSpeed: scale.speed,
      scalingRange: scale.range,
    }
  }

  private getInitialState({
    scale,
    rotation,
    sides,
  }: PolygonRing): PolygonAnimationState {
    const polygonPoints = this.getInitialPoints(
      sides.amount,
      scale.startingSize
    )
    const currentlyExpanding =
      scale.startingSize <= (scale.range.max - scale.range.min) / 2
    return {
      currentRotation: rotation.startingRotation,
      currentSize: scale.startingSize,
      currentlyExpanding,
      polygonPoints,
    }
  }

  private updateRotation() {
    const {
      isRotating,
      isRotatingClockwise,
      rotationSpeed,
    } = this.animationConstants
    const { currentRotation } = this.animationState

    let newRotation: number
    if (isRotating) {
      if (isRotatingClockwise) {
        newRotation = currentRotation + rotationSpeed
      } else {
        newRotation = currentRotation - rotationSpeed
      }
      if (newRotation >= 360) {
        const amountOver = currentRotation - 360
        newRotation = 0 + amountOver
      } else if (newRotation <= -360) {
        const amountOver = currentRotation - 360
        newRotation = 0 - amountOver
      }

      this.animationState.currentRotation = newRotation
    }
  }

  private updateScale() {
    const { isScaling, scalingSpeed, scalingRange } = this.animationConstants
    const {
      currentlyExpanding,
      polygonPoints,
      currentSize,
    } = this.animationState

    if (isScaling) {
      let updatedSize: number
      let updatedCurrentlyExpanding = currentlyExpanding
      if (currentlyExpanding) {
        updatedSize = currentSize + scalingSpeed
      } else {
        updatedSize = currentSize - scalingSpeed
      }

      if (updatedSize >= scalingRange.max) {
        updatedSize = scalingRange.max
        updatedCurrentlyExpanding = false
      } else if (updatedSize <= scalingRange.min) {
        updatedSize = scalingRange.min
        updatedCurrentlyExpanding = true
      }

      const newPolygonPoints = polygonPoints.map((point) => {
        const { cos, sin } = point
        const newPoint = { ...point }

        newPoint.x = Math.round(cos * updatedSize)
        newPoint.y = Math.round(sin * updatedSize)

        return newPoint
      })

      this.animationState.currentSize = updatedSize
      this.animationState.currentlyExpanding = updatedCurrentlyExpanding
      this.animationState.polygonPoints = newPolygonPoints
    }
  }

  public getPolygonFrame(): PolygonAnimation {
    const { dots, sides } = this.style
    const { currentRotation, polygonPoints } = this.animationState
    const { position } = this.animationConstants
    const dotPositions = polygonPoints.map((point) => {
      return { x: point.x, y: point.y }
    })
    const sidesPositions: [Cords, Cords][] = polygonPoints.map(
      (point, index) => {
        const totalPoints = polygonPoints.length
        const nextIndex = index + 1
        let nextPoint: Cords
        if (nextIndex === totalPoints) {
          nextPoint = { x: polygonPoints[0].x, y: polygonPoints[0].y }
        } else {
          nextPoint = {
            x: polygonPoints[nextIndex].x,
            y: polygonPoints[nextIndex].y,
          }
        }
        return [{ x: point.x, y: point.y }, nextPoint]
      }
    )

    return {
      position,
      currentRotation,
      dots: {
        enabled: dots.enabled,
        size: dots.size,
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
  public getPolygonFrameAndStep(): PolygonAnimation {
    const { isActive } = this.animationConstants
    const currentFrame = this.getPolygonFrame()
    if (isActive) {
      this.updateScale()
      this.updateRotation()
    }
    return currentFrame
  }
}
