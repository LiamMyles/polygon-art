import React, { useContext } from "react"

import { navigationDispatchContext } from "reducer-contexts/navigation"

import { GroupsEditor } from "components/GroupsEditor"
import { EditBackgroundModal } from "components/EditBackgroundModal"

import { Navigation } from "common-styled-components/Navigation"
import { StyledButton } from "common-styled-components/StyledButton"
import { MainContent } from "common-styled-components/MainContent"

export const GroupEditorScreen = () => {
  const navigationDispatch = useContext(navigationDispatchContext)
  return (
    <MainContent>
      <GroupsEditor />
      <Navigation>
        <EditBackgroundModal />
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
