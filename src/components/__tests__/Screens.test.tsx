import React, { useState } from "react"
import { render, fireEvent, wait as waitFor } from "@testing-library/react"
import { Screens } from "components/Screens"

describe("Screens Component", () => {
  let TestComponent1: React.FC,
    TestComponent2: React.FC,
    TestComponent3: React.FC,
    TestStateWrappedScreens: React.FC<{
      nextPage: number
      currentPage: number
    }>

  beforeAll(() => {
    TestComponent1 = () => {
      return <p>Test Component 1</p>
    }
    TestComponent2 = () => {
      return <p>Test Component 2</p>
    }
    TestComponent3 = () => {
      return <p>Test Component 3</p>
    }
    TestStateWrappedScreens = ({ nextPage, currentPage }) => {
      const [screen, setScreen] = useState(currentPage)
      return (
        <>
          <Screens currentChild={screen}>
            <TestComponent1 />
            <TestComponent2 />
            <TestComponent3 />
          </Screens>
          <button
            onClick={() => {
              setScreen(nextPage)
            }}
          >
            Next Page
          </button>
        </>
      )
    }
  })

  it("should only render first child on load", () => {
    const { getByText, queryByText } = render(
      <Screens currentChild={1}>
        <TestComponent1 />
        <TestComponent2 />
        <TestComponent3 />
      </Screens>
    )
    expect(getByText("Test Component 1")).toBeInTheDocument()
    expect(queryByText("Test Component 2")).not.toBeInTheDocument()
  })

  it("should transition from first to page 2/3", async () => {
    const { getByText, queryByText } = render(
      <TestStateWrappedScreens currentPage={1} nextPage={2} />
    )
    expect(getByText("Test Component 1")).toBeInTheDocument()
    expect(queryByText("Test Component 2")).not.toBeInTheDocument()

    fireEvent.click(getByText("Next Page"))

    await waitFor(() =>
      expect(queryByText("Test Component 1")).not.toBeInTheDocument()
    )

    expect(getByText("Test Component 2")).toBeInTheDocument()
    expect(queryByText("Test Component 1")).not.toBeInTheDocument()
  })

  it("should transition from first to page 3/3", async () => {
    const { getByText, queryByText } = render(
      <TestStateWrappedScreens currentPage={1} nextPage={3} />
    )
    expect(getByText("Test Component 1")).toBeInTheDocument()
    expect(queryByText("Test Component 3")).not.toBeInTheDocument()

    fireEvent.click(getByText("Next Page"))

    await waitFor(() =>
      expect(queryByText("Test Component 1")).not.toBeInTheDocument()
    )

    expect(getByText("Test Component 3")).toBeInTheDocument()
    expect(queryByText("Test Component 1")).not.toBeInTheDocument()
  })

  it("should transition from last to first", async () => {
    const { getByText, queryByText } = render(
      <TestStateWrappedScreens currentPage={3} nextPage={1} />
    )
    const thirdComponent = getByText("Test Component 3")
    expect(thirdComponent).toBeInTheDocument()
    expect(queryByText("Test Component 1")).not.toBeInTheDocument()

    fireEvent.click(getByText("Next Page"))

    await waitFor(() =>
      expect(queryByText("Test Component 3")).not.toBeInTheDocument()
    )

    expect(getByText("Test Component 1")).toBeInTheDocument()
    expect(queryByText("Test Component 3")).not.toBeInTheDocument()
  })
})
