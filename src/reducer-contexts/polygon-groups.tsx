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
interface PolygonStateScale {
  enabled: boolean
  speed: number
  range: {
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
interface PolygonStateSides {
  enabled: boolean
  amount: number
  strokeWidth: number
  colours: [string]
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
  rotation: PolygonStateRotation
}
interface ActionUpdatePolygonScale {
  type: "UPDATE_POLYGON_SCALE"
  group: number
  polygon: number
  scale: PolygonStateScale
}
interface ActionUpdatePolygonDots {
  type: "UPDATE_POLYGON_DOTS"
  group: number
  polygon: number
  dots: PolygonStateDots
}
interface ActionUpdatePolygonSides {
  type: "UPDATE_POLYGON_SIDES"
  group: number
  polygon: number
  sides: PolygonStateSides
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
        break
      }
      case "UPDATE_POLYGON_ROTATION": {
        break
      }
      case "UPDATE_POLYGON_SIDES": {
        break
      }
    }
  }
)
