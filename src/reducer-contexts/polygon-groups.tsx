import React, { useReducer, createContext } from "react"
import produce, { Draft, original } from "immer"

export interface Cords {
  x: number
  y: number
}

export interface PolygonRingRotation {
  enabled: boolean
  clockwise: boolean
  speed: number
  startingRotation: number
}

export interface PolygonRingScale {
  enabled: boolean
  speed: number
  range: {
    min: number
    max: number
  }
  startingSize: number
}

export interface PolygonRingDots {
  enabled: boolean
  size: number
  fillColours: string[]
  strokeColours: string[]
  strokeWidth: number
}
export interface PolygonRingSides {
  enabled: boolean
  amount: number
  strokeWidth: number
  colours: string[]
}

export interface PolygonRing {
  active: boolean
  position: Cords
  rotation: PolygonRingRotation
  scale: PolygonRingScale
  dots: PolygonRingDots
  sides: PolygonRingSides
}

export interface PolygonGroup {
  active: boolean
  position: Cords
  rings: PolygonRing[]
}

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
    rotation?: Partial<PolygonRingRotation>
    scale?: Partial<PolygonRingScale>
    dots?: Partial<PolygonRingDots>
    sides?: Partial<PolygonRingSides>
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
  rotation: Partial<PolygonRingRotation>
}
interface ActionUpdatePolygonScale {
  type: "UPDATE_POLYGON_SCALE"
  group: number
  polygon: number
  scale: Partial<PolygonRingScale>
}
interface ActionUpdatePolygonDots {
  type: "UPDATE_POLYGON_DOTS"
  group: number
  polygon: number
  dots: Partial<PolygonRingDots>
}
interface ActionUpdatePolygonSides {
  type: "UPDATE_POLYGON_SIDES"
  group: number
  polygon: number
  sides: Partial<PolygonRingSides>
}

interface ActionRandomizePolygonRings {
  type: "RANDOMIZE_POLYGON_RINGS"
  group: number
}
interface ActionRandomizePolygon {
  type: "RANDOMIZE_POLYGON"
  group: number
  polygon: number
}
interface ActionRandomizePolygonSides {
  type: "RANDOMIZE_POLYGON_SIDES"
  group: number
  polygon: number
}
interface ActionRandomizePolygonRotation {
  type: "RANDOMIZE_POLYGON_ROTATION"
  group: number
  polygon: number
}
interface ActionRandomizePolygonScale {
  type: "RANDOMIZE_POLYGON_SCALE"
  group: number
  polygon: number
}
interface ActionRandomizePolygonDots {
  type: "RANDOMIZE_POLYGON_DOTS"
  group: number
  polygon: number
}

interface ActionDeletePolygonGroup {
  type: "DELETE_POLYGON_GROUP"
  group: number
}
interface ActionDeletePolygonGroupRing {
  type: "DELETE_POLYGON_GROUP_RING"
  group: number
  polygon: number
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
  | ActionRandomizePolygonRings
  | ActionRandomizePolygon
  | ActionRandomizePolygonSides
  | ActionRandomizePolygonRotation
  | ActionRandomizePolygonScale
  | ActionRandomizePolygonDots
  | ActionDeletePolygonGroup
  | ActionDeletePolygonGroupRing

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

// Randomizing Functions taken from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomBoolean(): boolean {
  return getRandomIntInclusive(0, 1) === 1 ? true : false
}

/**
 * Taken from https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion/9493060#9493060
 *
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  var r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    var hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function getRandomRGB(): [number, number, number] {
  const h = getRandomArbitrary(0, 1)
  const s = getRandomArbitrary(0.5, 0.7)
  const l = getRandomArbitrary(0.5, 0.7)
  const [r, g, b] = hslToRgb(h, s, l)
  return [r, g, b]
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c: number) {
  var hex = c.toString(16)
  return hex.length === 1 ? "0" + hex : hex
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

function getRandomColoursForPolygon(amountOfSides: number): string[] {
  const amountOfColours = getRandomIntInclusive(1, amountOfSides)

  return [...Array(amountOfColours)].map(() => rgbToHex(...getRandomRGB()))
}

function getRandomSides(): PolygonRingSides {
  const sidesAmount = getRandomIntInclusive(3, 12)
  return {
    enabled: true,
    strokeWidth: getRandomIntInclusive(1, 10),
    amount: sidesAmount,
    colours: getRandomColoursForPolygon(sidesAmount),
  }
}
function getRandomDots(amountOfSides: number): PolygonRingDots {
  return {
    enabled: true,
    fillColours: getRandomColoursForPolygon(amountOfSides),
    size: getRandomIntInclusive(5, 10),
    strokeWidth: getRandomIntInclusive(0, 10),
    strokeColours: getRandomColoursForPolygon(amountOfSides),
  }
}
function getRandomRotation(): PolygonRingRotation {
  return {
    enabled: true,
    clockwise: getRandomBoolean(),
    speed: getRandomIntInclusive(2, 7),
    startingRotation: getRandomIntInclusive(1, 360),
  }
}
function getRandomScale(): PolygonRingScale {
  const min = getRandomIntInclusive(0, 150)
  const max = getRandomIntInclusive(200, 500)

  return {
    enabled: true,
    range: { min, max },
    speed: getRandomIntInclusive(2, 7),
    startingSize: getRandomIntInclusive(min, max),
  }
}

function getRandomEnabled(): {
  sidesEnabled: boolean
  dotsEnabled: boolean
  rotationEnabled: boolean
  scaleEnabled: boolean
} {
  const randomNumber = getRandomIntInclusive(0, 100)

  let enabledFields
  if (randomNumber <= 48) {
    // Full motion Sides
    enabledFields = {
      sidesEnabled: true,
      dotsEnabled: false,
      rotationEnabled: true,
      scaleEnabled: true,
    }
  } else if (randomNumber <= 50) {
    // Rotating Sides
    enabledFields = {
      sidesEnabled: true,
      dotsEnabled: false,
      rotationEnabled: true,
      scaleEnabled: false,
    }
  } else if (randomNumber <= 90) {
    // Full Motion Dots
    enabledFields = {
      sidesEnabled: false,
      dotsEnabled: true,
      rotationEnabled: true,
      scaleEnabled: true,
    }
  } else if (randomNumber <= 95) {
    // Rotating Dots
    enabledFields = {
      sidesEnabled: false,
      dotsEnabled: true,
      rotationEnabled: true,
      scaleEnabled: false,
    }
  } else {
    // Dots & Sides Full Motion
    enabledFields = {
      sidesEnabled: true,
      dotsEnabled: true,
      rotationEnabled: true,
      scaleEnabled: true,
    }
  }
  return enabledFields
}

function getRandomPolygon({
  active = true,
  position = { x: 0, y: 0 },
}: Partial<PolygonRing> = {}): PolygonRing {
  const sides = getRandomSides()
  const dots = getRandomDots(sides.amount)
  const rotation = getRandomRotation()
  const scale = getRandomScale()
  const {
    sidesEnabled,
    scaleEnabled,
    rotationEnabled,
    dotsEnabled,
  } = getRandomEnabled()

  sides.enabled = sidesEnabled
  dots.enabled = dotsEnabled
  scale.enabled = scaleEnabled
  rotation.enabled = rotationEnabled

  return { active, position, sides, dots, rotation, scale }
}

function createRandomPolygonRings(): PolygonRing[] {
  const amountOfRings = getRandomIntInclusive(2, 8)

  return [...Array(amountOfRings)].map(() => getRandomPolygon())
}

type PolygonGroupsReducer = React.Reducer<
  Readonly<PolygonGroup[]>,
  PolygonGroupsActions
>
export const polygonGroupsReducer: PolygonGroupsReducer = produce(
  (draft: Draft<PolygonGroup[]>, action: PolygonGroupsActions) => {
    switch (action.type) {
      case "CREATE_POLYGON_GROUP": {
        draft.push({
          active: true,
          position: { x: 0, y: 0 },
          rings: createRandomPolygonRings(),
        })
        break
      }
      case "CREATE_POLYGON": {
        draft[action.group].rings.push(getRandomPolygon())
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
        const draftPolygon = draft[action.group].rings[action.polygon]
        if (action.polygonState.active !== undefined) {
          draftPolygon.active = action.polygonState.active
        }
        if (action.polygonState.position !== undefined) {
          draftPolygon.position = action.polygonState.position
        }
        if (action.polygonState.dots !== undefined) {
          draftPolygon.dots = getDraftUpdatedByOptions<PolygonRingDots>(
            draftPolygon.dots,
            action.polygonState.dots
          )
        }
        if (action.polygonState.rotation !== undefined) {
          draftPolygon.rotation = getDraftUpdatedByOptions<PolygonRingRotation>(
            draftPolygon.rotation,
            action.polygonState.rotation
          )
        }
        if (action.polygonState.sides !== undefined) {
          draftPolygon.sides = getDraftUpdatedByOptions<PolygonRingSides>(
            draftPolygon.sides,
            action.polygonState.sides
          )
        }
        if (action.polygonState.scale !== undefined) {
          draftPolygon.scale = getDraftUpdatedByOptions<PolygonRingScale>(
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
        const draftPolygon = draft[action.group].rings[action.polygon]
        draftPolygon.dots = getDraftUpdatedByOptions<PolygonRingDots>(
          draftPolygon.dots,
          action.dots
        )
        break
      }
      case "UPDATE_POLYGON_ROTATION": {
        const draftPolygon = draft[action.group].rings[action.polygon]
        draftPolygon.rotation = getDraftUpdatedByOptions<PolygonRingRotation>(
          draftPolygon.rotation,
          action.rotation
        )
        break
      }
      case "UPDATE_POLYGON_SIDES": {
        const draftPolygon = draft[action.group].rings[action.polygon]
        draftPolygon.sides = getDraftUpdatedByOptions<PolygonRingSides>(
          draftPolygon.sides,
          action.sides
        )
        break
      }
      case "UPDATE_POLYGON_SCALE": {
        const draftPolygon = draft[action.group].rings[action.polygon]
        draftPolygon.scale = getDraftUpdatedByOptions<PolygonRingScale>(
          draftPolygon.scale,
          action.scale
        )
        break
      }
      case "RANDOMIZE_POLYGON_RINGS": {
        const draftGroups = draft[action.group]
        draftGroups.rings = createRandomPolygonRings()
        break
      }
      case "RANDOMIZE_POLYGON": {
        const draftRings = draft[action.group].rings
        draftRings[action.polygon] = getRandomPolygon(
          original(draftRings[action.polygon])
        )
        break
      }
      case "RANDOMIZE_POLYGON_SIDES": {
        const draftPolygon = draft[action.group].rings[action.polygon]
        draftPolygon.sides = getRandomSides()
        break
      }
      case "RANDOMIZE_POLYGON_ROTATION": {
        const draftPolygon = draft[action.group].rings[action.polygon]
        draftPolygon.rotation = getRandomRotation()
        break
      }
      case "RANDOMIZE_POLYGON_SCALE": {
        const draftPolygon = draft[action.group].rings[action.polygon]
        draftPolygon.scale = getRandomScale()
        break
      }
      case "RANDOMIZE_POLYGON_DOTS": {
        const draftPolygon = draft[action.group].rings[action.polygon]
        const sides = draftPolygon.sides.amount
        draftPolygon.dots = getRandomDots(sides)
        break
      }
      case "DELETE_POLYGON_GROUP": {
        const originalDraft = original(draft)
        const totalGroups = originalDraft ? originalDraft.length : 1
        if (originalDraft && totalGroups > 1) {
          draft.splice(action.group, 1)
        }
        break
      }
      case "DELETE_POLYGON_GROUP_RING": {
        const originalDraft = original(draft)
        const totalRings = originalDraft
          ? originalDraft[action.group].rings.length
          : 1
        if (totalRings > 1) {
          draft[action.group].rings.splice(action.polygon, 1)
        }
        break
      }
    }
  }
)

const polygonGroupsInitialState: PolygonGroup[] = [
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

function polygonGroupsInit(
  polygonGroupsInitialState: PolygonGroup[]
): PolygonGroup[] {
  const newPolygon = [...polygonGroupsInitialState]
  newPolygon[0].rings = createRandomPolygonRings()
  return newPolygon
}

export const PolygonGroupsContextWrapper: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    polygonGroupsReducer,
    polygonGroupsInitialState,
    polygonGroupsInit
  )

  return (
    <polygonGroupsDispatchContext.Provider value={dispatch}>
      <polygonGroupsStateContext.Provider value={state}>
        {children}
      </polygonGroupsStateContext.Provider>
    </polygonGroupsDispatchContext.Provider>
  )
}

export const polygonGroupsDispatchContext = createContext(
  {} as React.Dispatch<PolygonGroupsActions>
)
export const polygonGroupsStateContext = createContext(
  [] as Readonly<PolygonGroup[]>
)
