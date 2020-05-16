import React, { useContext } from "react"
import { render, fireEvent } from "@testing-library/react"

import {
  polygonGroupsReducer,
  PolygonGroupsActions,
  PolygonInitialState,
} from "reducer-contexts/polygon-groups"

describe("Polygon Reducer", () => {
  describe("CREATE_POLYGON_GROUP", () => {
    it("should create polygon group", () => {
      const action: PolygonGroupsActions = { type: "CREATE_POLYGON_GROUP" }

      const expectedState: PolygonInitialState = [
        { active: true, position: { x: 0, y: 0 }, rings: [] },
      ]
      const actualState = polygonGroupsReducer([], action)

      expect(actualState).toEqual(expectedState)
    })
    it("should add polygon group", () => {
      const action: PolygonGroupsActions = { type: "CREATE_POLYGON_GROUP" }
      const initialState: PolygonInitialState = [
        { active: true, position: { x: 0, y: 0 }, rings: [] },
      ]

      const expectedState: PolygonInitialState = [
        { active: true, position: { x: 0, y: 0 }, rings: [] },
        { active: true, position: { x: 0, y: 0 }, rings: [] },
      ]
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("CREATE_POLYGON", () => {
    it("should create polygon on existing group", () => {
      const action: PolygonGroupsActions = { type: "CREATE_POLYGON", group: 0 }
      const initialState: PolygonInitialState = [
        { active: true, position: { x: 0, y: 0 }, rings: [] },
      ]
      const expectedState: PolygonInitialState = [
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
              rotation: { clockwise: true, enabled: true, speed: 1 },
              scale: { enabled: true, speed: 1, range: { max: 10, min: 0 } },
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
    it("should add polygon to existing list of rings", () => {
      const action: PolygonGroupsActions = { type: "CREATE_POLYGON", group: 0 }
      const initialState: PolygonInitialState = [
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
              rotation: { clockwise: true, enabled: true, speed: 1 },
              scale: { enabled: true, speed: 1, range: { max: 10, min: 0 } },
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
      const expectedState: PolygonInitialState = [
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
              rotation: { clockwise: true, enabled: true, speed: 1 },
              scale: { enabled: true, speed: 1, range: { max: 10, min: 0 } },
              sides: {
                enabled: true,
                strokeWidth: 1,
                colours: ["black"],
                amount: 6,
              },
            },
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
              rotation: { clockwise: true, enabled: true, speed: 1 },
              scale: { enabled: true, speed: 1, range: { max: 10, min: 0 } },
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
    it("should add polygon to second ring group", () => {
      const action: PolygonGroupsActions = { type: "CREATE_POLYGON", group: 1 }
      const initialState: PolygonInitialState = [
        { active: true, position: { x: 0, y: 0 }, rings: [] },
        { active: true, position: { x: 0, y: 0 }, rings: [] },
      ]
      const expectedState: PolygonInitialState = [
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: [],
        },
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
              rotation: { clockwise: true, enabled: true, speed: 1 },
              scale: { enabled: true, speed: 1, range: { max: 10, min: 0 } },
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("UPDATE_POLYGON_ALL", () => {
    it.todo("should update polygon all")
  })
  describe("UPDATE_POLYGON_POSITION", () => {
    it.todo("should update polygon position")
  })
  describe("UPDATE_POLYGON_ROTATION", () => {
    it.todo("should update polygon rotation")
  })
  describe("UPDATE_POLYGON_SCALE", () => {
    it.todo("should update polygon scale")
  })
  describe("UPDATE_POLYGON_DOTS", () => {
    it.todo("should update polygon dots")
  })
  describe("UPDATE_POLYGON_SIDES", () => {
    it.todo("should update polygon sides")
  })
})

describe("Polygon Context", () => {
  it.todo("should expose context state")
  it.todo("should expose context dispatch and allow update")
})
