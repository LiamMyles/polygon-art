import React from "react"
import { render } from "@testing-library/react"
import p5 from "p5"

import { P5Canvas } from "components/P5Canvas"

const mockP5RemoveFunction = jest.fn()
jest.mock("p5", () => {
  return jest.fn().mockImplementation(() => {
    return { remove: mockP5RemoveFunction }
  })
})

describe("P5Canvas Component", () => {
  it("should render run sketch, and remove on unmount", () => {
    const { unmount } = render(<P5Canvas sketch={() => {}} />)

    expect(p5).toHaveBeenCalledTimes(1)
    expect(mockP5RemoveFunction).not.toHaveBeenCalled()
    unmount()
    expect(mockP5RemoveFunction).toHaveBeenCalledTimes(1)
  })
})
