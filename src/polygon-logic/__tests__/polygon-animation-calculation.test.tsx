import {
  PolygonAnimationCalculation,
  PolygonAnimation,
} from "polygon-logic/polygon-animation-calculation"
import { PolygonRing } from "reducer-contexts/polygon-groups"

describe("Polygon Animation Calculation Class", () => {
  const polygonRingState: PolygonRing = {
    active: true,
    position: { x: 0, y: 0 },
    dots: {
      enabled: true,
      fillColours: ["Black"],
      size: 1,
      strokeColours: ["Black"],
      strokeWidth: 1,
    },
    rotation: {
      clockwise: true,
      enabled: true,
      speed: 1,
      startingRotation: 1,
    },
    scale: {
      enabled: true,
      speed: 1,
      range: { max: 100, min: 0 },
      startingSize: 50,
    },
    sides: {
      enabled: true,
      strokeWidth: 1,
      colours: ["Black"],
      amount: 3,
    },
  }
  it("should generate initial polygon from PolygonRingState object", () => {
    const expectedPolygon: PolygonAnimation = {
      position: { x: 0, y: 0 },
      currentRotation: 1,
      dots: {
        enabled: true,
        strokeWidth: 1,
        position: [
          {
            x: -25,
            y: -43,
          },
          {
            x: 50,
            y: -0,
          },
          {
            x: -25,
            y: 43,
          },
        ],
        fillColours: ["Black"],
        strokeColours: ["Black"],
      },
      sides: {
        enabled: true,
        strokeWidth: 1,
        positions: [
          [
            {
              x: -25,
              y: -43,
            },
            {
              x: 50,
              y: -0,
            },
          ],
          [
            {
              x: 50,
              y: -0,
            },
            {
              x: -25,
              y: 43,
            },
          ],
          [
            {
              x: -25,
              y: 43,
            },
            {
              x: -25,
              y: -43,
            },
          ],
        ],
        strokeColours: ["Black"],
      },
    }

    const Polygon = new PolygonAnimationCalculation(polygonRingState)

    expect(Polygon.getPolygonFrame()).toEqual(expectedPolygon)
  })
  it("should update polygon and persist state of update", () => {
    const Polygon = new PolygonAnimationCalculation(polygonRingState)

    const firstFrame = Polygon.getPolygonFrame()
    expect(firstFrame).toEqual(Polygon.getPolygonFrameAndStep())

    const secondFrame = Polygon.getPolygonFrame()
    expect(secondFrame.currentRotation).toEqual(2)
    expect(secondFrame.dots.position).toEqual([
      { x: -26, y: -44 },
      { x: 51, y: -0 },
      { x: -25, y: 44 },
    ])
  })
  it("should not update scale if not enabled", () => {
    const updatedPolygonRingState: PolygonRing = {
      ...polygonRingState,
      scale: { ...polygonRingState.scale, enabled: false },
    }
    const Polygon = new PolygonAnimationCalculation(updatedPolygonRingState)

    const firstFrame = Polygon.getPolygonFrame()
    expect(firstFrame).toEqual(Polygon.getPolygonFrameAndStep())

    const secondFrame = Polygon.getPolygonFrame()
    expect(secondFrame.dots.position).toEqual(firstFrame.dots.position)
  })
  it("should not update rotation if not enabled", () => {
    const updatedPolygonRingState: PolygonRing = {
      ...polygonRingState,
      rotation: { ...polygonRingState.rotation, enabled: false },
    }
    const Polygon = new PolygonAnimationCalculation(updatedPolygonRingState)

    const firstFrame = Polygon.getPolygonFrame()
    expect(firstFrame).toEqual(Polygon.getPolygonFrameAndStep())

    const secondFrame = Polygon.getPolygonFrame()
    expect(secondFrame.currentRotation).toEqual(firstFrame.currentRotation)
  })
  it("should not update anything if not active", () => {
    const updatedPolygonRingState: PolygonRing = {
      ...polygonRingState,
      active: false,
    }
    const Polygon = new PolygonAnimationCalculation(updatedPolygonRingState)

    const firstFrame = Polygon.getPolygonFrame()
    expect(firstFrame).toEqual(Polygon.getPolygonFrameAndStep())

    const secondFrame = Polygon.getPolygonFrame()
    expect(secondFrame.currentRotation).toEqual(firstFrame.currentRotation)
    expect(secondFrame.dots.position).toEqual(firstFrame.dots.position)
  })
})
