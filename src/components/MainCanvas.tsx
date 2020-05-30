import React, { useContext, useEffect } from "react"

import {
  polygonGroupsDispatchContext,
  polygonGroupsStateContext,
  PolygonGroup,
} from "reducer-contexts/polygon-groups"
import { generateAllPolygonRingGroupsSketch } from "polygon-logic/polygon-p5-draw"

import { P5Canvas } from "components/P5Canvas"

function generateKey(
  polygonGroups: Readonly<PolygonGroup[]>,
  containerSize: { height: number; width: number }
): string {
  const polygonGroupLength = polygonGroups.length
  const polygonRingLengths = polygonGroups
    .map((polygonGroup) => polygonGroup.rings.length)
    .join("-")
  const polygonRingRotations = polygonGroups
    .map((polygonGroup) =>
      polygonGroup.rings.map((ring) => ring.rotation.startingRotation).join("-")
    )
    .join("-")

  return `${polygonGroupLength}-${polygonRingLengths}-${polygonRingRotations}-${containerSize.width}-${containerSize.height}`
}

export const MainCanvas: React.FC<{
  containerSize: { width: number; height: number }
}> = ({ containerSize }) => {
  const polygonDispatch = useContext(polygonGroupsDispatchContext)
  const polygonContext = useContext(polygonGroupsStateContext)
  const sketchAll = generateAllPolygonRingGroupsSketch(polygonContext)
  useEffect(() => {
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 0 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 1 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 2 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 3 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 4 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 5 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 6 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 7 })
    polygonDispatch({ type: "RANDOMIZE_POLYGON", group: 0, polygon: 8 })
  }, [polygonDispatch])

  return (
    <P5Canvas
      sketch={sketchAll}
      key={generateKey(polygonContext, containerSize)}
    />
  )
}
