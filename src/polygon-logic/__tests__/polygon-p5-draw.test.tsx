import {
  generatePolygonRingGroupSketch,
  generatePolygonRingSketch,
} from "polygon-logic/polygon-p5-draw"

import { PolygonAnimation } from "polygon-logic/polygon-animation-calculation"

describe("Generate p5 Sketch", () => {
  describe("One PolygonAnimation Object", () => {
    const PolygonAnimation: PolygonAnimation = {
      position: { x: 0, y: 0 },
      currentRotation: 0,
      dots: {
        enabled: true,
        fillColours: ["black"],
        strokeColours: ["black"],
        strokeWidth: 10,
        position: [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ],
      },
      sides: {
        enabled: true,
        strokeColours: ["black"],
        strokeWidth: 10,
        positions: [
          [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ],
          [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ],
        ],
      },
    }
    it("should get a sketch function", () => {
      const actualSketch = generatePolygonRingSketch(PolygonAnimation)
      expect(actualSketch).toEqual(expect.any(Function))
    })
    it.todo("should test sketch function")
  })
  describe("Array of PolygonAnimation Objects", () => {
    const PolygonAnimationArray: PolygonAnimation[] = [
      {
        position: { x: 0, y: 0 },
        currentRotation: 0,
        dots: {
          enabled: true,
          fillColours: ["black"],
          strokeColours: ["black"],
          strokeWidth: 10,
          position: [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ],
        },
        sides: {
          enabled: true,
          strokeColours: ["black"],
          strokeWidth: 10,
          positions: [
            [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ],
            [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ],
            [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ],
          ],
        },
      },
      {
        position: { x: 0, y: 0 },
        currentRotation: 0,
        dots: {
          enabled: true,
          fillColours: ["black"],
          strokeColours: ["black"],
          strokeWidth: 10,
          position: [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ],
        },
        sides: {
          enabled: true,
          strokeColours: ["black"],
          strokeWidth: 10,
          positions: [
            [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ],
            [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ],
            [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ],
          ],
        },
      },
    ]
    it("should get a sketch function", () => {
      const actualSketch = generatePolygonRingGroupSketch(PolygonAnimationArray)
      expect(actualSketch).toEqual(expect.any(Function))
    })
    it.todo("should test sketch function")
  })
})
