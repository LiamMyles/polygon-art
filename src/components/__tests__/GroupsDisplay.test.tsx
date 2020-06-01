import React, { useEffect, useContext } from "react"
import { render } from "@testing-library/react"

import {
  PolygonGroupsContextWrapper,
  polygonGroupsDispatchContext,
} from "reducer-contexts/polygon-groups"

import { GroupsDisplay } from "components/GroupsDisplay"

describe("GroupDisplay Component", () => {
  it("should render component", () => {
    render(<GroupsDisplay />)
  })
  it("should display a canvas for each group", () => {
    const TestComponent: React.FC = ({ children }) => {
      const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)
      useEffect(() => {
        polygonGroupsDispatch({ type: "CREATE_POLYGON_GROUP" })
      }, [polygonGroupsDispatch])
      return <>{children}</>
    }
    const { getByLabelText } = render(
      <PolygonGroupsContextWrapper>
        <TestComponent>
          <GroupsDisplay />
        </TestComponent>
      </PolygonGroupsContextWrapper>
    )

    expect(getByLabelText("Group 0 Canvas")).toBeInTheDocument()
    expect(getByLabelText("Group 1 Canvas")).toBeInTheDocument()
  })
  it.todo("should display canvas for each ring in group")
  it.todo("should be able to add new groups")
  it.todo("should be able to re-roll rings of group")
  it.todo("should be able to delete groups")
  it.todo("should not be able to delete first group")
  it.todo("should be able to add new rings")
  it.todo("should be able to delete rings")
  it.todo("should not be able to delete first ring")
})
