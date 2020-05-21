import {
  PolygonAnimationCalculation,
  PolygonAnimation,
} from "polygon-logic/polygon-animation-calculation"
import { PolygonRing } from "reducer-contexts/polygon-groups"

describe("Polygon Animation Calculation Class", () => {
  it("should generate initial polygon from PolygonRingState object", () => {
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
      rotation: { clockwise: true, enabled: true, speed: 1 },
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

    const expectedPolygon: PolygonAnimation = {
      position: { x: 0, y: 0 },
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
  it.todo("should update polygon and persist state of update")
  it.todo("should not update scale if not enabled")
  it.todo("should not update rotation if not enabled")
})
