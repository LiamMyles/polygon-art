import React, { useContext } from "react"
import { render, fireEvent } from "@testing-library/react"
import p5 from "p5"

import {
  PolygonGroupsContextWrapper,
  polygonGroupsDispatchContext,
} from "reducer-contexts/polygon-groups"

import { GroupsDisplay } from "components/GroupsDisplay"

const mockP5RemoveFunction = jest.fn()
jest.mock("p5", () => {
  return jest.fn().mockImplementation(() => {
    return { remove: mockP5RemoveFunction }
  })
})

beforeEach(() => {
  const mockedP5: jest.MockInstance<any, any> = p5 as any
  mockP5RemoveFunction.mockClear()
  mockedP5.mockClear()
})

describe("GroupDisplay Component", () => {
  it("should render component", () => {
    render(<GroupsDisplay />)
  })
  it("should display a canvas for each group", () => {
    // Adds button to press and create a polygon group
    const TestComponent: React.FC = ({ children }) => {
      const polygonGroupsDispatch = useContext(polygonGroupsDispatchContext)

      return (
        <>
          {children}
          <button
            onClick={() => {
              polygonGroupsDispatch({ type: "CREATE_POLYGON_GROUP" })
            }}
          >
            Add Group
          </button>
        </>
      )
    }
    const { getByLabelText, queryByLabelText, getByRole } = render(
      <PolygonGroupsContextWrapper>
        <TestComponent>
          <GroupsDisplay />
        </TestComponent>
      </PolygonGroupsContextWrapper>
    )
    expect(p5).toHaveBeenCalledTimes(1)
    expect(getByLabelText("Group 0 Canvas")).toBeInTheDocument()
    expect(queryByLabelText(/Group 1 Canvas/)).not.toBeInTheDocument()
    fireEvent.click(getByRole("button", { name: "Add Group" }))
    expect(p5).toHaveBeenCalledTimes(3)
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
