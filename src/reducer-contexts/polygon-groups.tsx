import React, { useReducer, createContext } from "react"
import produce, { Draft, original } from "immer"

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
  fillColours: ReadonlyArray<string>
  strokeWidth: number
  strokeColours: ReadonlyArray<string>
}
interface PolygonStateSides {
  enabled: boolean
  amount: number
  strokeWidth: number
  colours: ReadonlyArray<string>
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
  rings: ReadonlyArray<PolygonState>
}

export type PolygonInitialState = ReadonlyArray<PolygonGroupsState>

interface ActionCreateGroup {
  type: "CREATE_POLYGON_GROUP"
}

interface ActionCreatePolygon {
  type: "CREATE_POLYGON"
  group: number
}

interface ActionUpdatePolygonGroupPosition {
  type: "UPDATE_POLYGON_GROUP_POSITION"
  group: number
  position: Cords
}

interface ActionUpdatePolygonAll {
  type: "UPDATE_POLYGON_ALL"
  group: number
  polygon: number
  polygonState: {
    active?: boolean
    position?: Cords
    rotation?: Partial<PolygonStateRotation>
    scale?: Partial<PolygonStateScale>
    dots?: Partial<PolygonStateDots>
    sides?: Partial<PolygonStateSides>
  }
}

interface ActionUpdatePolygonActive {
  type: "UPDATE_POLYGON_ACTIVE"
  group: number
  polygon: number
  active: boolean
}
interface ActionUpdatePolygonGroupActive {
  type: "UPDATE_POLYGON_GROUP_ACTIVE"
  group: number
  active: boolean
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
  rotation: Partial<PolygonStateRotation>
}
interface ActionUpdatePolygonScale {
  type: "UPDATE_POLYGON_SCALE"
  group: number
  polygon: number
  scale: Partial<PolygonStateScale>
}
interface ActionUpdatePolygonDots {
  type: "UPDATE_POLYGON_DOTS"
  group: number
  polygon: number
  dots: Partial<PolygonStateDots>
}
interface ActionUpdatePolygonSides {
  type: "UPDATE_POLYGON_SIDES"
  group: number
  polygon: number
  sides: Partial<PolygonStateSides>
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
  | ActionUpdatePolygonActive
  | ActionUpdatePolygonGroupActive

type NotReadonly<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * Takes in the current draft for the matching options
 * and returns a updated draft with the new options so
 * it can be set to the new state
 *
 * @template T
 * @param {T} draft
 * @param {Partial<T>} options
 * @returns {T}
 */
function getDraftUpdatedByOptions<T>(draft: T, options: Partial<T>): T {
  const newState = { ...original(draft) } as Partial<T>
  const optionKeys = Object.keys(options) as [keyof T]
  optionKeys.forEach((option) => {
    newState[option] = options[option]
  })

  return newState as T
}

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
      case "UPDATE_POLYGON_GROUP_ACTIVE": {
        draft[action.group].active = action.active
        break
      }
      case "UPDATE_POLYGON_ALL": {
        const draftPolygon = draft[action.group].rings[
          action.polygon
        ] as NotReadonly<PolygonState>
        if (action.polygonState.active !== undefined) {
          draftPolygon.active = action.polygonState.active
        }
        if (action.polygonState.position !== undefined) {
          draftPolygon.position = action.polygonState.position
        }
        if (action.polygonState.dots !== undefined) {
          draftPolygon.dots = getDraftUpdatedByOptions<PolygonStateDots>(
            draftPolygon.dots,
            action.polygonState.dots
          )
        }
        if (action.polygonState.rotation !== undefined) {
          draftPolygon.rotation = getDraftUpdatedByOptions<
            PolygonStateRotation
          >(draftPolygon.rotation, action.polygonState.rotation)
        }
        if (action.polygonState.sides !== undefined) {
          draftPolygon.sides = getDraftUpdatedByOptions<PolygonStateSides>(
            draftPolygon.sides,
            action.polygonState.sides
          )
        }
        if (action.polygonState.scale !== undefined) {
          draftPolygon.scale = getDraftUpdatedByOptions<PolygonStateScale>(
            draftPolygon.scale,
            action.polygonState.scale
          )
        }
        break
      }
      case "UPDATE_POLYGON_POSITION": {
        draft[action.group].rings[action.polygon].position = action.position
        break
      }
      case "UPDATE_POLYGON_ACTIVE": {
        draft[action.group].rings[action.polygon].active = action.active
        break
      }
      case "UPDATE_POLYGON_DOTS": {
        const draftPolygon = draft[action.group].rings[
          action.polygon
        ] as NotReadonly<PolygonState>
        draftPolygon.dots = getDraftUpdatedByOptions<PolygonStateDots>(
          draftPolygon.dots,
          action.dots
        )
        break
      }
      case "UPDATE_POLYGON_ROTATION": {
        const draftPolygon = draft[action.group].rings[action.polygon]
        draftPolygon.rotation = getDraftUpdatedByOptions<PolygonStateRotation>(
          draftPolygon.rotation,
          action.rotation
        )
        break
      }
      case "UPDATE_POLYGON_SIDES": {
        const draftPolygon = draft[action.group].rings[
          action.polygon
        ] as NotReadonly<PolygonState>
        draftPolygon.sides = getDraftUpdatedByOptions<PolygonStateSides>(
          draftPolygon.sides,
          action.sides
        )
        break
      }
      case "UPDATE_POLYGON_SCALE": {
        const draftPolygon = draft[action.group].rings[action.polygon]
        draftPolygon.scale = getDraftUpdatedByOptions<PolygonStateScale>(
          draftPolygon.scale,
          action.scale
        )
        break
      }
    }
  }
)

const polygonGroupsInitialState: PolygonInitialState = [
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

export const NavigationContextWrapper: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    polygonGroupsReducer,
    polygonGroupsInitialState
  )

  return (
    <polygonGroupsDispatch.Provider value={dispatch}>
      <polygonGroupsState.Provider value={state}>
        {children}
      </polygonGroupsState.Provider>
    </polygonGroupsDispatch.Provider>
  )
}

export const polygonGroupsDispatch = createContext(
  {} as React.Dispatch<PolygonGroupsActions>
)
export const polygonGroupsState = createContext([] as PolygonInitialState)
