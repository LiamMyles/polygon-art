import React from "react"
import { render } from "@testing-library/react"
import p5 from "p5"

import { PolygonGroupsContextWrapper } from "reducer-contexts/polygon-groups"

import { MainCanvas } from "components/MainCanvas"

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

test("Renders Main Canvas", () => {
  render(
    <PolygonGroupsContextWrapper>
      <MainCanvas />
    </PolygonGroupsContextWrapper>
  )
})
