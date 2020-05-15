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
  rings: [PolygonState]
}

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

type PolygonGroupsActions =
  | ActionCreateGroup
  | ActionCreatePolygon
  | ActionUpdatePolygonAll
  | ActionUpdatePolygonPosition
  | ActionUpdatePolygonRotation
  | ActionUpdatePolygonScale
  | ActionUpdatePolygonDots
  | ActionUpdatePolygonSides

export const polygonGroupsReducer = produce(
  (draft: Draft<PolygonGroupsState>, action: PolygonGroupsActions) => {
    switch (action.type) {
      case "CREATE_POLYGON": {
        break
      }
      case "CREATE_POLYGON_GROUP": {
        break
      }
      case "UPDATE_POLYGON_ALL": {
        break
      }
      case "UPDATE_POLYGON_DOTS": {
        break
      }
      case "UPDATE_POLYGON_POSITION": {
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
