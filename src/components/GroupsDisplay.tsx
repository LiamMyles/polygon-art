import React, { useContext } from "react"
import styled from "styled-components"

import { polygonGroupsStateContext } from "reducer-contexts/polygon-groups"


const GroupDisplayWrapper = styled.div`
  background: lightgrey;
  width: 100%;
  height: 100%;
  max-width: 100vw;
`
export function GroupsDisplay() {
  const polygonGroupsState = useContext(polygonGroupsStateContext)
  return (
    <GroupDisplayWrapper>
      {polygonGroupsState.map((polygonGroup, index) => {
        const key = `${polygonGroup.rings.length}-${polygonGroup.rings[0].rotation.startingRotation}`
        return <div key={key} aria-label={`Group ${index} Canvas`}></div>
      })}
    </GroupDisplayWrapper>
  )
}
