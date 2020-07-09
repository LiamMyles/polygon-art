import React, { useState } from "react"
import { render, fireEvent, act } from "@testing-library/react"
import { ModalBox } from "components/ModalBox"

import styled from "styled-components"

const TestStyledButton = styled.button``

describe("ModalBox component", () => {
  const TestComponent: React.FC = () => {
    const [isClosed, setIsClosed] = useState(true)
    return (
      <div>
        <button>Above Button</button>
        <ModalBox
          isClosed={isClosed}
          setIsClosed={setIsClosed}
          buttonText="Open Modal"
          title="Testing Modal"
          StyledButton={TestStyledButton}
        >
          <label htmlFor="input">Extra Input</label>
          <input id="input" defaultValue="testing" />
        </ModalBox>
        <button>Below Button</button>
      </div>
    )
  }

  it("should open and focus first input", () => {
    const { getByRole, getByText } = render(<TestComponent />)
    expect(getByText("Testing Modal")).not.toBeVisible()
    fireEvent.click(getByRole("button", { name: "Open Modal" }))

    expect(getByText("Testing Modal")).toBeVisible()
    expect(getByRole("button", { name: "Close" })).toHaveFocus()
  })
  it("should close on escape", () => {
    const { getByRole, getByText } = render(<TestComponent />)

    expect(getByText("Testing Modal")).not.toBeVisible()
    fireEvent.click(getByRole("button", { name: "Open Modal" }))
    expect(getByText("Testing Modal")).toBeVisible()

    fireEvent.keyDown(window, { key: "Escape", code: "Escape" })
    expect(getByText("Testing Modal")).not.toBeVisible()
  })
  it("should close on close click", () => {
    const { getByRole, getByText } = render(<TestComponent />)
    expect(getByText("Testing Modal")).not.toBeVisible()
    fireEvent.click(getByRole("button", { name: "Open Modal" }))

    expect(getByText("Testing Modal")).toBeVisible()
    fireEvent.click(getByRole("button", { name: "Close" }))
    expect(getByText("Testing Modal")).not.toBeVisible()
  })
  it("should focus modal if focus moves outside", () => {
    const { getByRole, getByText, getByLabelText } = render(<TestComponent />)
    expect(getByText("Testing Modal")).not.toBeVisible()
    fireEvent.click(getByRole("button", { name: "Open Modal" }))

    expect(getByText("Testing Modal")).toBeVisible()
    expect(getByRole("button", { name: "Close" })).toHaveFocus()

    fireEvent.focus(getByRole("button", { name: "Below Button" }))
    act(() => {
      getByLabelText("Extra Input").focus()
    })
    act(() => {
      getByRole("button", { name: "Below Button" }).focus()
    })
    expect(getByRole("button", { name: "Close" })).toHaveFocus()

    act(() => {
      getByRole("button", { name: "Above Button" }).focus()
    })
    expect(getByLabelText("Extra Input")).toHaveFocus()
  })
})
