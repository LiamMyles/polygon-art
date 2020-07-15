import React, { useContext } from "react"

import { navigationDispatchContext } from "reducer-contexts/navigation"

import { GenerateGifModal } from "components/ShareGifModal"
import { EditBackgroundModal } from "components/EditBackgroundModal"
import { MainCanvas } from "components/MainCanvas"

import { StyledButton } from "common-styled-components/StyledButton"
import { Navigation } from "common-styled-components/Navigation"
import { MainContent } from "common-styled-components/MainContent"

export const ViewScreen = () => {
  const navigationDispatch = useContext(navigationDispatchContext)
  return (
    <MainContent>
      <MainCanvas />
      <Navigation>
        <EditBackgroundModal />
        <GenerateGifModal />
        <StyledButton
          type="button"
          onClick={() => {
            navigationDispatch({ type: "GROUP_SCREEN" })
          }}
        >
          Edit Polygons
        </StyledButton>
      </Navigation>
    </MainContent>
  )
}
