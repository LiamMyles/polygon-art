import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"

const ModalDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  background-color: lightgrey;
  z-index: 10;
`

const ModelBackgroundDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: grey;
  opacity: 0.7;
  z-index: 9;
`

const focusChildInput = (first: boolean, parent: HTMLElement) => {
  const modalElements = Array.from(parent.children) as HTMLElement[]

  const elementsToFocus = modalElements.filter((element) => {
    if (element.tagName === "BUTTON" || element.tagName === "INPUT") {
      return true
    } else {
      return false
    }
  })
  if (first) {
    elementsToFocus[0].focus()
  } else {
    elementsToFocus[elementsToFocus.length - 1].focus()
  }
}

interface ModelBoxProps {
  buttonText: string
  title: string
}

export const ModalBox: React.FC<ModelBoxProps> = ({
  children,
  buttonText,
  title,
}) => {
  // -- Should have close button by default
  // -- Should focus first element that can be focused
  // - When closed Should focus trigger button on passed button ref
  // - Focus should be trapped to modal
  // - Modal should close on esc

  const [isClosed, setIsClosed] = useState(true)
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
      <button
        ref={openButtonRef}
        onClick={() => {
          setIsClosed(false)
        }}
      >
        {buttonText}
      </button>
      <ModelBackgroundDiv hidden={isClosed} />
      <ModalDiv
        role="dialog"
        aria-labelledby="dialog_label"
        aria-modal="true"
        ref={modalRef}
        hidden={isClosed}
      >
        <h1 id="dialog_label">{title}</h1>
        <button
          onClick={() => {
            setIsClosed(true)
          }}
        >
          Close
        </button>
        {children}
      </ModalDiv>
    </>
  )
}
