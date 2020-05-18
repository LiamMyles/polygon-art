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
  describe("UPDATE_POLYGON_GROUP_POSITION", () => {
    it("should update polygon group position", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_GROUP_POSITION",
        group: 0,

        position: { x: 10, y: 10 },
      }
      const initialState: PolygonInitialState = [
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: [],
        },
      ]
      const expectedState: PolygonInitialState = [
        {
          active: true,
          position: { x: 10, y: 10 },
          rings: [],
        },
      ]
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("UPDATE_POLYGON_POSITION", () => {
    it("should update polygon position", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_POSITION",
        group: 0,
        polygon: 0,
        position: { x: 10, y: 10 },
      }
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
              position: { x: 10, y: 10 },
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
  describe("UPDATE_POLYGON_ACTIVE", () => {
    it.todo("should update polygon active state")
  })
  describe("UPDATE_POLYGON_ROTATION", () => {
    let initialState: PolygonInitialState
    beforeAll(() => {
      initialState = [
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
    })
    it("should update all polygon rotation options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_ROTATION",
        group: 0,
        polygon: 0,
        rotation: {
          clockwise: false,
          enabled: false,
          speed: 10,
        },
      }
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
              rotation: { clockwise: false, enabled: false, speed: 10 },
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
    it("should update polygon rotation enabled option", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_ROTATION",
        group: 0,
        polygon: 0,
        rotation: {
          enabled: false,
        },
      }
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
              rotation: { clockwise: true, enabled: false, speed: 1 },
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
    it("should update polygon rotation clockwise option", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_ROTATION",
        group: 0,
        polygon: 0,
        rotation: {
          clockwise: false,
        },
      }

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
              rotation: { clockwise: false, enabled: true, speed: 1 },
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
    it("should update polygon rotation speed option", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_ROTATION",
        group: 0,
        polygon: 0,
        rotation: {
          speed: 10,
        },
      }
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
              rotation: { clockwise: true, enabled: true, speed: 10 },
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
  describe("UPDATE_POLYGON_SCALE", () => {
    let initialState: PolygonInitialState
    beforeAll(() => {
      initialState = [
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
    })
    it("should update all polygon scale options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SCALE",
        group: 0,
        polygon: 0,
        scale: { enabled: false, speed: 10, range: { min: 10, max: 20 } },
      }
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
              scale: { enabled: false, speed: 10, range: { max: 20, min: 10 } },
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
    it("should update polygon enabled options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SCALE",
        group: 0,
        polygon: 0,
        scale: { enabled: false },
      }

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
              scale: { enabled: false, speed: 1, range: { max: 10, min: 0 } },
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
    it("should update polygon speed options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SCALE",
        group: 0,
        polygon: 0,
        scale: { speed: 10 },
      }

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
              scale: { enabled: true, speed: 10, range: { max: 10, min: 0 } },
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
    it("should update polygon range options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SCALE",
        group: 0,
        polygon: 0,
        scale: { range: { max: 100, min: 50 } },
      }

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
              scale: { enabled: true, speed: 1, range: { max: 100, min: 50 } },
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
  describe("UPDATE_POLYGON_DOTS", () => {
    let initialState: PolygonInitialState
    beforeAll(() => {
      initialState = [
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
    })
    it("should update all polygon dots options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_DOTS",
        group: 0,
        polygon: 0,
        dots: {
          enabled: false,
          fillColours: ["white"],
          size: 10,
          strokeColours: ["white"],
          strokeWidth: 10,
        },
      }
      const expectedState: PolygonInitialState = [
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: [
            {
              active: true,
              position: { x: 0, y: 0 },
              dots: {
                enabled: false,
                fillColours: ["white"],
                size: 10,
                strokeColours: ["white"],
                strokeWidth: 10,
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
    it("should update polygon enabled options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_DOTS",
        group: 0,
        polygon: 0,
        dots: {
          enabled: false,
        },
      }
      const expectedState: PolygonInitialState = [
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: [
            {
              active: true,
              position: { x: 0, y: 0 },
              dots: {
                enabled: false,
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
    it("should update polygon size options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_DOTS",
        group: 0,
        polygon: 0,
        dots: {
          size: 10,
        },
      }
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
                size: 10,
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
    it("should update polygon fillColours options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_DOTS",
        group: 0,
        polygon: 0,
        dots: {
          fillColours: ["white"],
        },
      }
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
                fillColours: ["white"],
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
    it("should update polygon strokeWidth options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_DOTS",
        group: 0,
        polygon: 0,
        dots: {
          strokeWidth: 10,
        },
      }
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
                strokeWidth: 10,
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
    it("should update polygon strokeColours options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_DOTS",
        group: 0,
        polygon: 0,
        dots: {
          strokeColours: ["white"],
        },
      }
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
                strokeColours: ["white"],
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
  describe("UPDATE_POLYGON_SIDES", () => {
    let initialState: PolygonInitialState
    beforeAll(() => {
      initialState = [
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
    })
    it("should update all polygon sides options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SIDES",
        group: 0,
        polygon: 0,
        sides: {
          enabled: false,
          strokeWidth: 10,
          colours: ["white"],
          amount: 3,
        },
      }
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
                enabled: false,
                strokeWidth: 10,
                colours: ["white"],
                amount: 3,
              },
            },
          ],
        },
      ]
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
    it("should update polygon sides enabled options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SIDES",
        group: 0,
        polygon: 0,
        sides: {
          enabled: false,
        },
      }
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
                enabled: false,
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
    it("should update polygon sides amount options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SIDES",
        group: 0,
        polygon: 0,
        sides: {
          amount: 3,
        },
      }
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
                amount: 3,
              },
            },
          ],
        },
      ]
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
    it("should update polygon sides strokeWidth options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SIDES",
        group: 0,
        polygon: 0,
        sides: {
          strokeWidth: 10,
        },
      }
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
                strokeWidth: 10,
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
    it("should update polygon sides colours options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SIDES",
        group: 0,
        polygon: 0,
        sides: {
          colours: ["white"],
        },
      }
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
                colours: ["white"],
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
    let initialState: PolygonInitialState
    beforeAll(() => {
      initialState = [
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
    })
    it("should update all polygon all options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_ALL",
        group: 0,
        polygon: 0,
        polygonState: {
          active: false,
          position: { x: 10, y: 10 },
          dots: {
            enabled: false,
            fillColours: ["white"],
            size: 10,
            strokeColours: ["white"],
            strokeWidth: 10,
          },
          rotation: { clockwise: false, enabled: false, speed: 10 },
          scale: { enabled: false, speed: 10, range: { max: 100, min: 10 } },
          sides: {
            enabled: false,
            strokeWidth: 10,
            colours: ["white"],
            amount: 3,
          },
        },
      }
      const expectedState: PolygonInitialState = [
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: [
            {
              active: false,
              position: { x: 10, y: 10 },
              dots: {
                enabled: false,
                fillColours: ["white"],
                size: 10,
                strokeColours: ["white"],
                strokeWidth: 10,
              },
              rotation: { clockwise: false, enabled: false, speed: 10 },
              scale: {
                enabled: false,
                speed: 10,
                range: { max: 100, min: 10 },
              },
              sides: {
                enabled: false,
                strokeWidth: 10,
                colours: ["white"],
                amount: 3,
              },
            },
          ],
        },
      ]
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
    it("should update some polygon all options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_ALL",
        group: 0,
        polygon: 0,
        polygonState: {
          position: { x: 10, y: 10 },
          dots: {
            fillColours: ["white"],
            size: 10,
            strokeColours: ["white"],
            strokeWidth: 10,
          },
          rotation: { clockwise: false, speed: 10 },
          scale: { speed: 10, range: { max: 100, min: 10 } },
          sides: {
            strokeWidth: 10,
            colours: ["white"],
            amount: 3,
          },
        },
      }
      const expectedState: PolygonInitialState = [
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: [
            {
              active: true,
              position: { x: 10, y: 10 },
              dots: {
                enabled: true,
                fillColours: ["white"],
                size: 10,
                strokeColours: ["white"],
                strokeWidth: 10,
              },
              rotation: { clockwise: false, enabled: true, speed: 10 },
              scale: {
                enabled: true,
                speed: 10,
                range: { max: 100, min: 10 },
              },
              sides: {
                enabled: true,
                strokeWidth: 10,
                colours: ["white"],
                amount: 3,
              },
            },
          ],
        },
      ]
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
})

describe("Polygon Context", () => {
  it.todo("should expose context state")
  it.todo("should expose context dispatch and allow update")
})
