import React, { useReducer, createContext } from "react"
import produce, { Draft } from "immer"

interface Cords {
  x: number
  y: number
}

interface PolygonStateRotation {
  enabled: boolean
  clockwise: boolean
  speed: number
}

interface PolygonStateRotationOptional {
  enabled?: boolean
  clockwise?: boolean
  speed?: number
}
interface PolygonStateScale {
  enabled: boolean
  speed: number
  range: {
    min: number
    max: number
  }
}

interface PolygonStateScaleOptional {
  enabled?: boolean
  speed?: number
  range?: {
    min: number
    max: number
  }
}

interface PolygonStateDots {
  enabled: boolean
  size: number
  fillColours: [string]
  strokeWidth: number
  strokeColours: [string]
}
interface PolygonStateDotsOptional {
  enabled?: boolean
  size?: number
  fillColours?: [string]
  strokeWidth?: number
  strokeColours?: [string]
}

interface PolygonStateSides {
  enabled: boolean
  amount: number
  strokeWidth: number
  colours: [string]
}

interface PolygonStateSidesOptional {
  enabled?: boolean
  amount?: number
  strokeWidth?: number
  colours?: [string]
}

interface PolygonState {
  active: boolean
  position: Cords
  rotation: PolygonStateRotation
  scale: PolygonStateScale
  dots: PolygonStateDots
  sides: PolygonStateSides
}

interface PolygonGroupsState {
  active: boolean
  position: Cords
  rings: Array<PolygonState>
}

export type PolygonInitialState = Array<PolygonGroupsState>

interface ActionCreateGroup {
  type: "CREATE_POLYGON_GROUP"
}

interface ActionCreatePolygon {
  type: "CREATE_POLYGON"
  group: number
}

interface ActionUpdatePolygonAll {
  type: "UPDATE_POLYGON_ALL"
  group: number
  polygon: number
  polygonState: {
    position?: Cords
    rotation?: PolygonStateRotation
    scale?: PolygonStateScale
    dots?: PolygonStateDots
    sides?: PolygonStateSides
  }
}

interface ActionUpdatePolygonGroupPosition {
  type: "UPDATE_POLYGON_GROUP_POSITION"
  group: number
  position: Cords
}

interface ActionUpdatePolygonPosition {
  type: "UPDATE_POLYGON_POSITION"
  group: number
  polygon: number
  position: Cords
}
interface ActionUpdatePolygonRotation {
  type: "UPDATE_POLYGON_ROTATION"
  group: number
  polygon: number
  rotation: PolygonStateRotationOptional
}
interface ActionUpdatePolygonScale {
  type: "UPDATE_POLYGON_SCALE"
  group: number
  polygon: number
  scale: PolygonStateScaleOptional
}
interface ActionUpdatePolygonDots {
  type: "UPDATE_POLYGON_DOTS"
  group: number
  polygon: number
  dots: PolygonStateDotsOptional
}
interface ActionUpdatePolygonSides {
  type: "UPDATE_POLYGON_SIDES"
  group: number
  polygon: number
  sides: PolygonStateSidesOptional
}

export type PolygonGroupsActions =
  | ActionCreateGroup
  | ActionCreatePolygon
  | ActionUpdatePolygonAll
  | ActionUpdatePolygonGroupPosition
  | ActionUpdatePolygonPosition
  | ActionUpdatePolygonRotation
  | ActionUpdatePolygonScale
  | ActionUpdatePolygonDots
  | ActionUpdatePolygonSides

export const polygonGroupsReducer = produce(
  (draft: Draft<PolygonInitialState>, action: PolygonGroupsActions) => {
    switch (action.type) {
      case "CREATE_POLYGON_GROUP": {
        draft.push({ active: true, position: { x: 0, y: 0 }, rings: [] })
        break
      }
      case "CREATE_POLYGON": {
        draft[action.group].rings.push({
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
        })
        break
      }
      case "UPDATE_POLYGON_GROUP_POSITION": {
        draft[action.group].position = action.position
        break
      }
      case "UPDATE_POLYGON_POSITION": {
        draft[action.group].rings[action.polygon].position = action.position
        break
      }
      case "UPDATE_POLYGON_ALL": {
        break
      }
      case "UPDATE_POLYGON_DOTS": {
        const draftDots = draft[action.group].rings[action.polygon].dots
        if (action.dots.enabled !== undefined) {
          draftDots.enabled = action.dots.enabled
        }
        if (action.dots.fillColours !== undefined) {
          draftDots.fillColours = action.dots.fillColours
        }
        if (action.dots.size !== undefined) {
          draftDots.size = action.dots.size
        }
        if (action.dots.strokeColours !== undefined) {
          draftDots.strokeColours = action.dots.strokeColours
        }
        if (action.dots.strokeWidth !== undefined) {
          draftDots.strokeWidth = action.dots.strokeWidth
        }
        break
      }
      case "UPDATE_POLYGON_ROTATION": {
        const draftRotation = draft[action.group].rings[action.polygon].rotation

        if (action.rotation.clockwise !== undefined) {
          draftRotation.clockwise = action.rotation.clockwise
        }
        if (action.rotation.enabled !== undefined) {
          draftRotation.enabled = action.rotation.enabled
        }
        if (action.rotation.speed !== undefined) {
          draftRotation.speed = action.rotation.speed
        }
        break
      }
      case "UPDATE_POLYGON_SIDES": {
        const draftSides = draft[action.group].rings[action.polygon].sides
        const actionSides = action.sides
        if (actionSides.enabled !== undefined) {
          draftSides.enabled = actionSides.enabled
        }
        if (actionSides.amount !== undefined) {
          draftSides.amount = actionSides.amount
        }
        if (actionSides.colours !== undefined) {
          draftSides.colours = actionSides.colours
        }
        if (actionSides.strokeWidth !== undefined) {
          draftSides.strokeWidth = actionSides.strokeWidth
        }
        break
      }
      case "UPDATE_POLYGON_SCALE": {
        const draftScale = draft[action.group].rings[action.polygon].scale
        const actionScale = action.scale
        if (actionScale.enabled !== undefined) {
          draftScale.enabled = actionScale.enabled
        }
        if (actionScale.range !== undefined) {
          draftScale.range = actionScale.range
        }
        if (actionScale.speed !== undefined) {
          draftScale.speed = actionScale.speed
        }
        break
      }
    }
  }
)
