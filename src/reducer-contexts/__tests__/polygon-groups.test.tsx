import React, { useContext } from "react"
import { render, fireEvent } from "@testing-library/react"

import {
  polygonGroupsReducer,
  PolygonGroupsActions,
  PolygonGroup,
  PolygonGroupsContextWrapper,
  polygonGroupsDispatchContext,
  polygonGroupsStateContext,
  PolygonRingRotation,
  PolygonRingScale,
  PolygonRingDots,
  PolygonRingSides,
} from "reducer-contexts/polygon-groups"

describe("Polygon Reducer", () => {
  let initialState: PolygonGroup[] = [
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

  const expectedRingObject = {
    active: expect.any(Boolean),
    position: expect.objectContaining({
      x: expect.any(Number),
      y: expect.any(Number),
    }),
    dots: {
      enabled: expect.any(Boolean),
      fillColours: expect.arrayContaining([expect.any(String)]),
      size: expect.any(Number),
      strokeColours: expect.arrayContaining([expect.any(String)]),
      strokeWidth: expect.any(Number),
    },
    rotation: {
      clockwise: expect.any(Boolean),
      enabled: expect.any(Boolean),
      speed: expect.any(Number),
      startingRotation: expect.any(Number),
    },
    scale: {
      enabled: expect.any(Boolean),
      speed: expect.any(Number),
      range: expect.objectContaining({
        max: expect.any(Number),
        min: expect.any(Number),
      }),
      startingSize: expect.any(Number),
    },
    sides: {
      enabled: expect.any(Boolean),
      strokeWidth: expect.any(Number),
      colours: expect.arrayContaining([expect.any(String)]),
      amount: expect.any(Number),
    },
  }

  describe("CREATE_POLYGON_GROUP", () => {
    it("should create polygon group", () => {
      const action: PolygonGroupsActions = { type: "CREATE_POLYGON_GROUP" }

      const expectedInitialGroup: PolygonGroup = {
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

      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState[0]).toEqual(expectedInitialGroup)
      expect(actualState[1]).toEqual(
        expect.objectContaining({
          active: expect.any(Boolean),
          position: expect.objectContaining({
            x: expect.any(Number),
            y: expect.any(Number),
          }),
          rings: expect.arrayContaining([
            expect.objectContaining(expectedRingObject),
          ]),
        })
      )
    })
  })
  describe("CREATE_POLYGON", () => {
    it("should create polygon on existing group", () => {
      const action: PolygonGroupsActions = { type: "CREATE_POLYGON", group: 0 }

      const expectedState: PolygonGroup[] = [
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: expect.arrayContaining([expectedRingObject]),
        },
      ]
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState[0].rings.length).toEqual(
        initialState[0].rings.length + 1
      )
      expect(actualState).toEqual(expectedState)
    })
    it("should add polygon to second ring group", () => {
      const expectedState: PolygonGroup[] = [
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: expect.arrayContaining([expectedRingObject]),
        },
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: expect.arrayContaining([expectedRingObject]),
        },
      ]
      const action1: PolygonGroupsActions = { type: "CREATE_POLYGON_GROUP" }
      const action2: PolygonGroupsActions = { type: "CREATE_POLYGON", group: 1 }
      const groupAddedState = polygonGroupsReducer(initialState, action1)
      const actualState = polygonGroupsReducer(groupAddedState, action2)

      expect(actualState[1].rings.length).toEqual(
        groupAddedState[1].rings.length + 1
      )
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

      const expectedState: PolygonGroup[] = [
        {
          active: true,
          position: { x: 10, y: 10 },
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("UPDATE_POLYGON_GROUP_ACTIVE", () => {
    it("should update polygon group active option", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_GROUP_ACTIVE",
        group: 0,
        active: false,
      }

      const expectedState: PolygonGroup[] = [
        {
          active: false,
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

      const expectedState: PolygonGroup[] = [
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("UPDATE_POLYGON_ACTIVE", () => {
    it("should update polygon active state", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_ACTIVE",
        group: 0,
        polygon: 0,
        active: false,
      }
      const expectedState: PolygonGroup[] = [
        {
          active: true,
          position: { x: 0, y: 0 },
          rings: [
            {
              active: false,
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("UPDATE_POLYGON_ROTATION", () => {
    it("should update all polygon rotation options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_ROTATION",
        group: 0,
        polygon: 0,
        rotation: {
          clockwise: false,
          enabled: false,
          speed: 10,
          startingRotation: 90,
        },
      }
      const expectedState: PolygonGroup[] = [
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
                clockwise: false,
                enabled: false,
                speed: 10,
                startingRotation: 90,
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
      const expectedState: PolygonGroup[] = [
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
                enabled: false,
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

      const expectedState: PolygonGroup[] = [
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
                clockwise: false,
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
      const expectedState: PolygonGroup[] = [
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
                speed: 10,
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
    it("should update polygon rotation startingRotation option", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_ROTATION",
        group: 0,
        polygon: 0,
        rotation: {
          startingRotation: 90,
        },
      }
      const expectedState: PolygonGroup[] = [
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
                startingRotation: 90,
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("UPDATE_POLYGON_SCALE", () => {
    it("should update all polygon scale options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SCALE",
        group: 0,
        polygon: 0,
        scale: {
          enabled: false,
          speed: 10,
          range: { min: 10, max: 20 },
          startingSize: 15,
        },
      }
      const expectedState: PolygonGroup[] = [
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
                enabled: false,
                speed: 10,
                range: { max: 20, min: 10 },
                startingSize: 15,
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
    it("should update polygon startingSize options", () => {
      const action: PolygonGroupsActions = {
        type: "UPDATE_POLYGON_SCALE",
        group: 0,
        polygon: 0,
        scale: { startingSize: 10 },
      }

      const expectedState: PolygonGroup[] = [
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
                startingSize: 10,
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

      const expectedState: PolygonGroup[] = [
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
                enabled: false,
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

      const expectedState: PolygonGroup[] = [
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
                speed: 10,
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

      const expectedState: PolygonGroup[] = [
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
                range: { max: 100, min: 50 },
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("UPDATE_POLYGON_DOTS", () => {
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
      const expectedState: PolygonGroup[] = [
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
      const expectedState: PolygonGroup[] = [
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
      const expectedState: PolygonGroup[] = [
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
      const expectedState: PolygonGroup[] = [
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
      const expectedState: PolygonGroup[] = [
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
      const expectedState: PolygonGroup[] = [
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
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState).toEqual(expectedState)
    })
  })
  describe("UPDATE_POLYGON_SIDES", () => {
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
      const expectedState: PolygonGroup[] = [
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
      const expectedState: PolygonGroup[] = [
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
      const expectedState: PolygonGroup[] = [
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
      const expectedState: PolygonGroup[] = [
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
      const expectedState: PolygonGroup[] = [
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
          rotation: {
            clockwise: false,
            enabled: false,
            speed: 10,
            startingRotation: 90,
          },
          scale: {
            enabled: false,
            speed: 10,
            range: { max: 100, min: 10 },
            startingSize: 50,
          },
          sides: {
            enabled: false,
            strokeWidth: 10,
            colours: ["white"],
            amount: 3,
          },
        },
      }
      const expectedState: PolygonGroup[] = [
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
              rotation: {
                clockwise: false,
                enabled: false,
                speed: 10,
                startingRotation: 90,
              },
              scale: {
                enabled: false,
                speed: 10,
                range: { max: 100, min: 10 },
                startingSize: 50,
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
          rotation: { clockwise: false, speed: 10, startingRotation: 90 },
          scale: { speed: 10, range: { max: 100, min: 10 }, startingSize: 50 },
          sides: {
            strokeWidth: 10,
            colours: ["white"],
            amount: 3,
          },
        },
      }
      const expectedState: PolygonGroup[] = [
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
              rotation: {
                clockwise: false,
                enabled: true,
                speed: 10,
                startingRotation: 90,
              },
              scale: {
                enabled: true,
                speed: 10,
                range: { max: 100, min: 10 },
                startingSize: 50,
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
  describe("RANDOMIZE_POLYGON_DOTS", () => {
    it("should randomize a polygons dots", () => {
      const action: PolygonGroupsActions = {
        type: "RANDOMIZE_POLYGON_DOTS",
        group: 0,
        polygon: 0,
      }
      const actualState = polygonGroupsReducer(initialState, action)
      expect(actualState[0].rings[0].dots).not.toEqual(
        initialState[0].rings[0].dots
      )
      expect(actualState[0].rings[0].dots).toEqual(
        expect.objectContaining<PolygonRingDots>({
          enabled: expect.any(Boolean),
          size: expect.any(Number),
          fillColours: expect.any(Array),
          strokeColours: expect.any(Array),
          strokeWidth: expect.any(Number),
        })
      )
    })
  })
  describe("RANDOMIZE_POLYGON_SIDES", () => {
    it("should randomize a polygons sides", () => {
      const action: PolygonGroupsActions = {
        type: "RANDOMIZE_POLYGON_SIDES",
        group: 0,
        polygon: 0,
      }
      const actualState = polygonGroupsReducer(initialState, action)
      expect(actualState[0].rings[0].sides).not.toEqual(
        initialState[0].rings[0].sides
      )
      expect(actualState[0].rings[0].sides).toEqual(
        expect.objectContaining<PolygonRingSides>({
          enabled: expect.any(Boolean),
          amount: expect.any(Number),
          strokeWidth: expect.any(Number),
          colours: expect.any(Array),
        })
      )
    })
  })
  describe("RANDOMIZE_POLYGON_SCALE", () => {
    it("should randomize a polygons scale", () => {
      const action: PolygonGroupsActions = {
        type: "RANDOMIZE_POLYGON_SCALE",
        group: 0,
        polygon: 0,
      }
      const actualState = polygonGroupsReducer(initialState, action)
      expect(actualState[0].rings[0].scale).not.toEqual(
        initialState[0].rings[0].scale
      )
      expect(actualState[0].rings[0].scale).toEqual(
        expect.objectContaining<PolygonRingScale>({
          enabled: expect.any(Boolean),
          speed: expect.any(Number),
          range: expect.objectContaining({
            min: expect.any(Number),
            max: expect.any(Number),
          }),
          startingSize: expect.any(Number),
        })
      )
    })
  })
  describe("RANDOMIZE_POLYGON_ROTATION", () => {
    it("should randomize a polygons Rotation", () => {
      const action: PolygonGroupsActions = {
        type: "RANDOMIZE_POLYGON_ROTATION",
        group: 0,
        polygon: 0,
      }
      const actualState = polygonGroupsReducer(initialState, action)
      expect(actualState[0].rings[0].rotation).not.toEqual(
        initialState[0].rings[0].rotation
      )
      expect(actualState[0].rings[0].rotation).toEqual(
        expect.objectContaining<PolygonRingRotation>({
          enabled: expect.any(Boolean),
          clockwise: expect.any(Boolean),
          speed: expect.any(Number),
          startingRotation: expect.any(Number),
        })
      )
    })
  })
  describe("RANDOMIZE_POLYGON", () => {
    it("should return a randomized polygon", () => {
      const action: PolygonGroupsActions = {
        type: "RANDOMIZE_POLYGON",
        group: 0,
        polygon: 0,
      }
      const actualState = polygonGroupsReducer(initialState, action)

      expect(actualState[0].rings[0].dots).not.toEqual(
        initialState[0].rings[0].dots
      )
      expect(actualState[0].rings[0].dots).toEqual(
        expect.objectContaining<PolygonRingDots>({
          enabled: expect.any(Boolean),
          size: expect.any(Number),
          fillColours: expect.any(Array),
          strokeColours: expect.any(Array),
          strokeWidth: expect.any(Number),
        })
      )
      expect(actualState[0].rings[0].sides).not.toEqual(
        initialState[0].rings[0].sides
      )
      expect(actualState[0].rings[0].sides).toEqual(
        expect.objectContaining<PolygonRingSides>({
          enabled: expect.any(Boolean),
          amount: expect.any(Number),
          strokeWidth: expect.any(Number),
          colours: expect.any(Array),
        })
      )
      expect(actualState[0].rings[0].scale).not.toEqual(
        initialState[0].rings[0].scale
      )
      expect(actualState[0].rings[0].scale).toEqual(
        expect.objectContaining<PolygonRingScale>({
          enabled: expect.any(Boolean),
          speed: expect.any(Number),
          range: expect.objectContaining({
            min: expect.any(Number),
            max: expect.any(Number),
          }),
          startingSize: expect.any(Number),
        })
      )

      expect(actualState[0].rings[0].rotation).not.toEqual(
        initialState[0].rings[0].rotation
      )
      expect(actualState[0].rings[0].rotation).toEqual(
        expect.objectContaining<PolygonRingRotation>({
          enabled: expect.any(Boolean),
          clockwise: expect.any(Boolean),
          speed: expect.any(Number),
          startingRotation: expect.any(Number),
        })
      )
    })
  })
  describe("RANDOMIZED_POLYGON_RINGS", () => {
    it("should return an array of randomized polygon", () => {
      const action: PolygonGroupsActions = {
        type: "RANDOMIZE_POLYGON_RINGS",
        group: 0,
      }
      const actualState = polygonGroupsReducer(initialState, action)
      expect(actualState[0].rings.length).toBeGreaterThanOrEqual(2)
      expect(actualState[0].rings[0].dots).not.toEqual(
        initialState[0].rings[0].dots
      )
      expect(actualState[0].rings[0].dots).toEqual(
        expect.objectContaining<PolygonRingDots>({
          enabled: expect.any(Boolean),
          size: expect.any(Number),
          fillColours: expect.any(Array),
          strokeColours: expect.any(Array),
          strokeWidth: expect.any(Number),
        })
      )
      expect(actualState[0].rings[0].sides).not.toEqual(
        initialState[0].rings[0].sides
      )
      expect(actualState[0].rings[0].sides).toEqual(
        expect.objectContaining<PolygonRingSides>({
          enabled: expect.any(Boolean),
          amount: expect.any(Number),
          strokeWidth: expect.any(Number),
          colours: expect.any(Array),
        })
      )
      expect(actualState[0].rings[0].scale).not.toEqual(
        initialState[0].rings[0].scale
      )
      expect(actualState[0].rings[0].scale).toEqual(
        expect.objectContaining<PolygonRingScale>({
          enabled: expect.any(Boolean),
          speed: expect.any(Number),
          range: expect.objectContaining({
            min: expect.any(Number),
            max: expect.any(Number),
          }),
          startingSize: expect.any(Number),
        })
      )

      expect(actualState[0].rings[0].rotation).not.toEqual(
        initialState[0].rings[0].rotation
      )
      expect(actualState[0].rings[0].rotation).toEqual(
        expect.objectContaining<PolygonRingRotation>({
          enabled: expect.any(Boolean),
          clockwise: expect.any(Boolean),
          speed: expect.any(Number),
          startingRotation: expect.any(Number),
        })
      )
    })
  })

  describe("DELETE_POLYGON_GROUP", () => {
    it("should delete passed polygon group", () => {
      const createPolygonGroupAction: PolygonGroupsActions = {
        type: "CREATE_POLYGON_GROUP",
      }
      const deletePolygonGroupAction: PolygonGroupsActions = {
        type: "DELETE_POLYGON_GROUP",
        group: 0,
      }

      const extraPolygonGroupState = polygonGroupsReducer(
        initialState,
        createPolygonGroupAction
      )
      expect(extraPolygonGroupState.length).toEqual(2)
      const deletedPolygonGroupState = polygonGroupsReducer(
        extraPolygonGroupState,
        deletePolygonGroupAction
      )
      expect(deletedPolygonGroupState.length).toEqual(1)
    })
    it("shouldn't delete last polygon group", () => {
      const deletePolygonGroupAction: PolygonGroupsActions = {
        type: "DELETE_POLYGON_GROUP",
        group: 0,
      }

      const deletedPolygonGroupState = polygonGroupsReducer(
        initialState,
        deletePolygonGroupAction
      )
      expect(deletedPolygonGroupState).toEqual(initialState)
    })
  })

  describe("DELETE_POLYGON_RING", () => {
    it("should delete passed polygon ring", () => {
      const randomizedPolygonAction: PolygonGroupsActions = {
        type: "RANDOMIZE_POLYGON_RINGS",
        group: 0,
      }
      const deletePolygonGroupRingAction: PolygonGroupsActions = {
        type: "DELETE_POLYGON_GROUP_RING",
        group: 0,
        polygon: 0,
      }

      const randomisedPolygonState = polygonGroupsReducer(
        initialState,
        randomizedPolygonAction
      )
      const deletedPolygonGroupState = polygonGroupsReducer(
        randomisedPolygonState,
        deletePolygonGroupRingAction
      )
      const initialRings = randomisedPolygonState[0].rings.length
      const updatedRings = deletedPolygonGroupState[0].rings.length

      expect(updatedRings).toEqual(initialRings - 1)
    })
    it("shouldn't delete last polygon ring", () => {
      const deletePolygonGroupAction: PolygonGroupsActions = {
        type: "DELETE_POLYGON_GROUP_RING",
        group: 0,
        polygon: 0,
      }

      const deletedPolygonGroupRingState = polygonGroupsReducer(
        initialState,
        deletePolygonGroupAction
      )
      expect(deletedPolygonGroupRingState).toEqual(initialState)
    })
  })
})

describe("Polygon Context", () => {
  let TestComponent: React.FC
  beforeAll(() => {
    TestComponent = () => {
      const dispatch = useContext(polygonGroupsDispatchContext)
      const state = useContext(polygonGroupsStateContext)
      return (
        <>
          <p>Scale: {`${state[0].rings[0].scale.enabled}`}</p>
          <p>Active: {`${state[0].rings[0].active}`}</p>
          <button
            onClick={() => {
              dispatch({
                type: "UPDATE_POLYGON_SCALE",
                group: 0,
                polygon: 0,
                scale: { enabled: false },
              })
            }}
          >
            Update
          </button>
        </>
      )
    }
  })
  it("should expose context state", () => {
    const { getByText } = render(
      <PolygonGroupsContextWrapper>
        <TestComponent />
      </PolygonGroupsContextWrapper>
    )
    expect(getByText("Scale: true")).toBeInTheDocument()
    expect(getByText("Active: true")).toBeInTheDocument()
  })
  it("should expose context dispatch and allow update", () => {
    const { getByText } = render(
      <PolygonGroupsContextWrapper>
        <TestComponent />
      </PolygonGroupsContextWrapper>
    )
    expect(getByText("Scale: true")).toBeInTheDocument()

    fireEvent.click(getByText("Update"))

    expect(getByText("Scale: false")).toBeInTheDocument()
    expect(getByText("Active: true")).toBeInTheDocument()
  })
})
