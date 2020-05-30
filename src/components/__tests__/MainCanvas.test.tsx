import React from "react"
import { render } from "@testing-library/react"

import { PolygonGroupsContextWrapper } from "reducer-contexts/polygon-groups"

import { MainCanvas } from "components/MainCanvas"

const mockP5RemoveFunction = jest.fn()
jest.mock("p5", () => {
  return jest.fn().mockImplementation(() => {
    return { remove: mockP5RemoveFunction }
  })
})

test("Renders Main Canvas", () => {
  render(
    <PolygonGroupsContextWrapper>
      <MainCanvas containerSize={{ width: 100, height: 100 }} />
    </PolygonGroupsContextWrapper>
  )
})
