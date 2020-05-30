import {
  generatePolygonGroupSketch,
  generatePolygonRingSketch,
  generateAllPolygonRingGroupsSketch,
} from "polygon-logic/polygon-p5-draw"

import { PolygonGroup, PolygonRing } from "reducer-contexts/polygon-groups"

describe("Generate p5 Sketch", () => {
  describe("One Polygon Ring", () => {
    const polygonRing: PolygonRing = {
      active: true,
      position: { x: 0, y: 0 },
      dots: {
        enabled: true,
        fillColours: ["black"],
        size: 1,
        strokeColours: ["black"],
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
    it("should get a sketch function", () => {
      const actualSketch = generatePolygonRingSketch(polygonRing)
      expect(actualSketch).toEqual(expect.any(Function))
    })
  })
  describe("Polygon Group", () => {
    const polygonGroup: PolygonGroup = {
      active: true,
      position: { x: 0, y: 0 },
      rings: [
        {
          active: true,
          position: { x: 0, y: 0 },
          dots: {
            enabled: true,
            fillColours: ["black"],
            size: 1,
            strokeColours: ["black"],
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
            range: { max: 10, min: 0 },
            startingSize: 5,
          },
          sides: {
            enabled: true,
            strokeWidth: 1,
            colours: ["black"],
            amount: 6,
          },
        },
      ],
    }
    it("should get a sketch function", () => {
      const actualSketch = generatePolygonGroupSketch(polygonGroup)
      expect(actualSketch).toEqual(expect.any(Function))
    })
  })
  describe("Polygon Groups", () => {
    const polygonGroups: Readonly<PolygonGroup[]> = [
      {
        active: true,
        position: { x: 0, y: 0 },
        rings: [
          {
            active: true,
            position: { x: 0, y: 0 },
            dots: {
              enabled: true,
              fillColours: ["black"],
              size: 1,
              strokeColours: ["black"],
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
              range: { max: 10, min: 0 },
              startingSize: 5,
            },
            sides: {
              enabled: true,
              strokeWidth: 1,
              colours: ["black"],
              amount: 6,
            },
          },
        ],
      },
    ]
    it("should get a sketch function", () => {
      const actualSketch = generateAllPolygonRingGroupsSketch(polygonGroups)
      expect(actualSketch).toEqual(expect.any(Function))
    })
  })
})
