import React, { useContext } from "react"
import { StyledButton } from "common-styled-components/StyledButton"
import { PolygonEditor } from "./PolygonEditor"
import { Navigation } from "common-styled-components/Navigation"
import { navigationDispatchContext } from "reducer-contexts/navigation"
import { MainContent } from "common-styled-components/MainContent"

export const PolygonEditorScreen = () => {
  const navigationDispatch = useContext(navigationDispatchContext)
  return (
    <MainContent>
      <PolygonEditor />
      <Navigation>
        <StyledButton
          type="button"
          onClick={() => {
            navigationDispatch({ type: "GROUP_SCREEN" })
          }}
        >
          Edit Polygons
        </StyledButton>
        <StyledButton
          type="button"
          onClick={() => {
            navigationDispatch({ type: "WATCH_SCREEN" })
          }}
        >
          Watch Animation
        </StyledButton>
      </Navigation>
    </MainContent>
  )
}
