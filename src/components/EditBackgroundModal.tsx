import styled from "styled-components"
import React, { useContext, useState, useEffect } from "react"
import {
  backgroundDispatchContext,
  backgroundStateContext,
} from "reducer-contexts/background"
import { ModalBox } from "./ModalBox"
import { ToggleSwitch } from "./ToggleSwitch"
import { Slider } from "./Slider"
import { NavigationButton } from "./App"

const ModalInternalWrappingDiv = styled.div`
  display: grid;
  grid-gap: 10px;
  font-size: 20px;
`

const ModalUpdateButton = styled.button`
  display: block;
  width: 80%;
  height: 50px;
  margin: 10px auto 0;
  font-size: 18px;
  border-radius: 5px;
`
const ColourPickerInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 35px;
  padding: 5px;
  margin: 5px 0 0;
  border-radius: 5px;
`

export const EditBackgroundModal: React.FC = () => {
  const backgroundDispatch = useContext(backgroundDispatchContext)
  const backgroundState = useContext(backgroundStateContext)

  const [canUpdate, setCanUpdate] = useState(false)
  const [editModalIsClosed, setEditModalIsClosed] = useState(true)
  const [shouldRedrawBackground, setShouldRedrawBackground] = useState(
    backgroundState.shouldRedraw
  )
  const [backgroundHex, setBackgroundHex] = useState(backgroundState.hex)
  const [backgroundOpacity, setBackgroundOpacity] = useState(
    backgroundState.opacity
  )

  useEffect(() => {
    if (
      shouldRedrawBackground !== backgroundState.shouldRedraw ||
      backgroundHex !== backgroundState.hex ||
      backgroundOpacity !== backgroundState.opacity
    ) {
    }
    setCanUpdate(true)
  }, [
    backgroundState,
    shouldRedrawBackground,
    backgroundHex,
    backgroundOpacity,
  ])

  return (
    <ModalBox
      buttonText="Edit Background"
      title="Edit Background"
      StyledButton={NavigationButton}
      isClosed={editModalIsClosed}
      setIsClosed={setEditModalIsClosed}
    >
      <ModalInternalWrappingDiv>
        <ToggleSwitch
          checked={shouldRedrawBackground}
          id="redraw-background-toggle"
          label="Redraw Background"
          setFunction={setShouldRedrawBackground}
          checkedText={{ checked: "Yes", unchecked: "No" }}
        />
        <div>
          <label htmlFor="background-colour-picker">Colour</label>
          <ColourPickerInput
            id="background-colour-picker"
            type="color"
            value={backgroundHex}
            onChange={({ currentTarget: { value } }) => {
              setBackgroundHex(value)
            }}
          />
        </div>
        <Slider
          label="Opacity"
          id="background-opacity"
          currentValue={backgroundOpacity}
          max={100}
          min={0}
          setFunction={setBackgroundOpacity}
        />
        <ModalUpdateButton
          type="button"
          disabled={!canUpdate}
          onClick={() => {
            backgroundDispatch({
              type: "UPDATE_BACKGROUND_WITH_HEX",
              shouldRedraw: shouldRedrawBackground,
              hexColour: backgroundHex,
              opacity: backgroundOpacity,
            })
            setCanUpdate(false)
            setEditModalIsClosed(true)
          }}
        >
          Update
        </ModalUpdateButton>
      </ModalInternalWrappingDiv>
    </ModalBox>
  )
}
