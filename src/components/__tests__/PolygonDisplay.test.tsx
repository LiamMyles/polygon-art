import React from "react"
import { render, fireEvent, within } from "@testing-library/react"
import p5 from "p5"

import { PolygonGroupsContextWrapper } from "reducer-contexts/polygon-groups"

import { PolygonDisplay } from "components/PolygonDisplay"

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

describe("PolygonDisplay Component", () => {
  it("should render component", () => {
    render(
      <PolygonGroupsContextWrapper>
        <PolygonDisplay />
      </PolygonGroupsContextWrapper>
    )
  })
  it("should contain ring canvas", () => {
    const { getByLabelText } = render(
      <PolygonGroupsContextWrapper>
        <PolygonDisplay />
      </PolygonGroupsContextWrapper>
    )
    expect(getByLabelText("Ring 0 Canvas")).toBeInTheDocument()
  })

  // This test needs some more thinking. It might be an idea to wrap it in
  // a test component that renders some of the values of the ring, and just asset those change
  it.skip("should randomize ring canvas", () => {
    const { getByLabelText, getByRole } = render(
      <PolygonGroupsContextWrapper>
        <PolygonDisplay />
      </PolygonGroupsContextWrapper>
    )
    const firstRing = getByLabelText("Ring 1 Canvas")

    expect(firstRing).toBeInTheDocument()
    fireEvent.click(getByRole("button", { name: "Randomize" }))
    expect(firstRing).not.toBeInTheDocument()
    expect(getByLabelText("Ring 0 Canvas")).toBeInTheDocument()
  })
})
