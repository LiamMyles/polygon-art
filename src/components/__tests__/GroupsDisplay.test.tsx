import React from "react"
import { render, fireEvent, within } from "@testing-library/react"
import p5 from "p5"

import { PolygonGroupsContextWrapper } from "reducer-contexts/polygon-groups"

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
    const { getByLabelText } = render(
      <PolygonGroupsContextWrapper>
        <GroupsDisplay />
      </PolygonGroupsContextWrapper>
    )

    expect(getByLabelText("Group 0 Canvas")).toBeInTheDocument()
  })
  it("should display canvas for each ring in group", () => {
    const { getByLabelText } = render(
      <PolygonGroupsContextWrapper>
        <GroupsDisplay />
      </PolygonGroupsContextWrapper>
    )
    expect(getByLabelText("Group 0, Ring 0 Canvas")).toBeInTheDocument()
    expect(getByLabelText("Group 0, Ring 1 Canvas")).toBeInTheDocument()
  })
  it("should be able to add new groups", () => {
    const { getByLabelText, getByRole, queryByLabelText } = render(
      <PolygonGroupsContextWrapper>
        <GroupsDisplay />
      </PolygonGroupsContextWrapper>
    )
    expect(getByLabelText("Group 0 Canvas")).toBeInTheDocument()
    expect(queryByLabelText(/Group 1 Canvas/)).not.toBeInTheDocument()

    fireEvent.click(getByRole("button", { name: "Add Group" }))

    expect(getByLabelText("Group 0 Canvas")).toBeInTheDocument()
    expect(getByLabelText("Group 1 Canvas")).toBeInTheDocument()
  })
  it("should be able to re-roll rings of group", () => {
    const { getByLabelText } = render(
      <PolygonGroupsContextWrapper>
        <GroupsDisplay />
      </PolygonGroupsContextWrapper>
    )
    const group1 = getByLabelText("Group 0 Canvas")
    const group1Ring1 = within(group1).getByLabelText("Group 0, Ring 1 Canvas")
    const group1RandomizeButton = within(group1).getByRole("button", {
      name: "Randomize",
    })

    expect(group1).toBeInTheDocument()

    fireEvent.click(group1RandomizeButton)

    const newGroup1 = getByLabelText("Group 0 Canvas")
    const newGroup1Ring1 = within(newGroup1).getByLabelText(
      "Group 0, Ring 1 Canvas"
    )
    expect(group1Ring1).not.toBeInTheDocument()
    expect(newGroup1Ring1).toBeInTheDocument()
  })
  it.todo("should be able to delete groups")
  it.todo("should not be able to delete first group")
  it.todo("should be able to add new rings")
  it.todo("should be able to delete rings")
  it.todo("should not be able to delete first ring")
})
