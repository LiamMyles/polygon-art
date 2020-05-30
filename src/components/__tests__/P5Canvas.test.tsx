import React, { useState, useEffect } from "react"
import { render, wait as waitFor } from "@testing-library/react"
import p5 from "p5"

import { P5Canvas } from "components/P5Canvas"

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

describe("P5Canvas Component", () => {
  it("should render run sketch, and remove on unmount", () => {
    const { unmount } = render(<P5Canvas sketch={() => {}} />)

    expect(p5).toHaveBeenCalledTimes(1)
    expect(mockP5RemoveFunction).not.toHaveBeenCalled()
    unmount()
    expect(mockP5RemoveFunction).toHaveBeenCalledTimes(1)
  })
  it("shouldn't trigger p5 when rendered with the same key", async () => {
    const TestComponent: React.FC = () => {
      const [count, setCount] = useState(0)
      const [count2, setCount2] = useState(false)
      useEffect(() => {
        let timeoutId: number
        if (count !== 2) {
          timeoutId = setTimeout(() => {
            if (count === 1 && !count2) {
              setCount(1)
              setCount2(true)
            } else {
              setCount(count + 1)
            }
          }, 100)
        }

        return () => {
          clearInterval(timeoutId)
        }
      }, [count, setCount, count2, setCount2])
      return (
        <>
          <p>Count: {count}</p>
          <P5Canvas sketch={() => {}} key={count} />
        </>
      )
    }
    const { getByText } = render(<TestComponent />)

    await waitFor(() => expect(getByText("Count: 2")).toBeInTheDocument())

    expect(p5).toHaveBeenCalledTimes(3)
    expect(mockP5RemoveFunction).toHaveBeenCalledTimes(3)
  })
})
