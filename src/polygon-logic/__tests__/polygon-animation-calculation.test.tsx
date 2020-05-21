import { PolygonAnimationCalculation } from "polygon-logic/polygon-animation-calculation"
import { PolygonRing } from "reducer-contexts/polygon-groups"

describe("Polygon Animation Calculation Class", () => {
  it("should generate initial polygon from PolygonRingState object", () => {
    const polygonRingState: PolygonRing = {
      active: true,
      position: { x: 0, y: 0 },
      dots: {
        enabled: true,
        fillColours: ["black"],
        size: 1,
        strokeColours: ["black"],
        strokeWidth: 1,
      },
      rotation: { clockwise: true, enabled: true, speed: 1 },
      scale: {
        enabled: true,
        speed: 1,
        range: { max: 10, min: 0 },
        startingSize: 5,
      },
      sides: {
        enabled: true,
        strokeWidth: 1,
        colours: ["black"],
        amount: 6,
      },
    }

    const expectedPolygon = {
      position: { x: 0, y: 0 },
      points: {
        enabled: true,
        position: [
          {
            x: -26,
            y: -44,
          },
          {
            x: 50,
            y: -1,
          },
          {
            x: -25,
            y: 43,
          },
        ],
        fillColour: "",
        strokeColour: "",
      },

      sides: {
        enabled: true,
        positions: [
          [
            {
              x: -26,
              y: -44,
            },
            {
              x: 50,
              y: -1,
            },
          ],
          [
            {
              x: 50,
              y: -1,
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
              x: -26,
              y: -44,
            },
          ],
        ],
        strokeColour: "",
      },
    }

    const PolygonAnimation = new PolygonAnimationCalculation(polygonRingState)

    expect(PolygonAnimation.getPolygonAnimation()).toEqual(expectedPolygon)
  })
  it.todo("should update polygon and persist state of update")
  it.todo("should not update scale if not enabled")
  it.todo("should not update rotation if not enabled")
})
