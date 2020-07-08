import React, { useState, useEffect, useRef } from "react"
import styled, { StyledComponent } from "styled-components"

const ScreenReaderOnly = styled.span`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const ModalDiv = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  width: calc(100% - 40px);
  border: 1px solid darkgrey;
  border-radius: 8px;
  box-shadow: 0px 3px 7px 0px darkgrey;
  padding: 10px;
  background-color: lightgrey;
  z-index: 10;
`

const ModalTitleBarDv = styled.div`
  display: flex;
  padding: 10px;
  border-radius: 4px 4px 0 0;
  justify-content: space-between;
  align-items: center;
  background: grey;
  margin: -10px -10px 10px -10px;
  h2 {
    font-size: 32px;
    font-weight: bold;
    margin: 0 10px 0 0;
    color: whitesmoke;
  }
  button {
    position: relative;
    background: lightgrey;
    width: 35px;
    height: 35px;
    border-radius: 4px;
    border: 1px solid lightgrey;
    box-shadow: 0 2px 2px dimgray;
    transition: all 200ms ease-in-out;
    &:focus,
    &:hover {
      box-shadow: 1px 3px 3px 2px dimgray;
      outline: none;
      background-color: dimgrey;
      &::before {
        transition: all 200ms ease-in-out;
        text-shadow: 0 0 0 lightgrey;
      }
    }
    &::before {
      position: absolute;
      content: "❌";
      text-shadow: 0 0 0 dimgrey;
      color: transparent;
      font-size: 20px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`

const ModelBackgroundDiv = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: lightgrey;
  opacity: 0.7;
  z-index: 9;
`

const focusChildInput = (first: boolean, parent: HTMLElement) => {
  const childrenInputs = Array.from(parent.getElementsByTagName("input"))
  const childrenButtons = Array.from(parent.getElementsByTagName("button"))

  const modalElements = [...childrenButtons, ...childrenInputs]

  if (first) {
    modalElements[0].focus()
  } else {
    modalElements[modalElements.length - 1].focus()
  }
}

interface ModelBoxProps {
  buttonText: string
  title: string
  StyledButton: StyledComponent<"button", any, {}, never>
}

export const ModalBox: React.FC<ModelBoxProps> = ({
  children,
  buttonText,
  title,
  StyledButton,
}) => {
  const [isClosed, setIsClosed] = useState(false)
  const [lastFocus, setLastFocus] = useState<Element | null>(null)
  const openButtonRef = useRef(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus first element on open
  useEffect(() => {
    if (!isClosed && modalRef?.current) {
      focusChildInput(true, modalRef.current)
    }
  }, [isClosed, modalRef])

  // Keyboard Listeners
  useEffect(() => {
    const closeModal = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsClosed(true)
      }
    }

    const lockFocus = () => {
      if (modalRef?.current) {
        const modal = modalRef.current
        // If focus inside modal set as last focus
        if (modal.contains(document.activeElement)) {
          setLastFocus(document.activeElement)
        } else {
          // Focus first child unless new active focus is last focus
          focusChildInput(true, modal)
          if (lastFocus === document.activeElement) {
            focusChildInput(false, modal)
          }
          setLastFocus(document.activeElement)
        }
      }
    }

    if (!isClosed) {
      window.addEventListener("keydown", closeModal, true)
      window.addEventListener("focus", lockFocus, true)
    } else {
      window.removeEventListener("keydown", closeModal, true)
      window.removeEventListener("focus", lockFocus, true)
    }

    return () => {
      window.removeEventListener("keydown", closeModal, true)
      window.removeEventListener("focus", lockFocus, true)
    }
  }, [setIsClosed, isClosed, lastFocus, setLastFocus])

  return (
    <>
      <StyledButton
        ref={openButtonRef}
        onClick={() => {
          setIsClosed(false)
        }}
      >
        {buttonText}
      </StyledButton>
      <ModelBackgroundDiv hidden={isClosed} />
      <ModalDiv
        role="dialog"
        aria-labelledby="dialog_label"
        aria-modal="true"
        ref={modalRef}
        hidden={isClosed}
      >
        <ModalTitleBarDv>
          <h2 id="dialog_label">{title}</h2>
          <button
            onClick={() => {
              setIsClosed(true)
            }}
          >
            <ScreenReaderOnly>Close</ScreenReaderOnly>
          </button>
        </ModalTitleBarDv>
        {children}
      </ModalDiv>
    </>
  )
}
