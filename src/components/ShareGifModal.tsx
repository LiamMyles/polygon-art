import styled from "styled-components"
import { P5Canvas } from "./P5Canvas"
import React, { useState, useContext } from "react"
import { polygonGroupsStateContext } from "reducer-contexts/polygon-groups"
import { backgroundStateContext } from "reducer-contexts/background"
import { ModalBox } from "./ModalBox"
import { generateGifSketch } from "polygon-logic/polygon-p5-draw"
import { NavigationButton } from "./App"

const GifModalInternalWrappingDiv = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  grid-gap: 10px;
  font-size: 20px;
`
const GifCanvas = styled(P5Canvas)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const GifModalUpdateButton = styled.button`
  display: block;
  width: 80%;
  height: 50px;
  margin: 10px auto 0;
  font-size: 18px;
  border-radius: 5px;
`

export const GenerateGifModal: React.FC = () => {
  const [editModalIsClosed, setEditModalIsClosed] = useState(true)
  const polygonContext = useContext(polygonGroupsStateContext)
  const backgroundState = useContext(backgroundStateContext)
  const [canUpdate, setCanUpdate] = useState(true)

  return (
    <ModalBox
      buttonText="Share Gif"
      title="Share Gif"
      StyledButton={NavigationButton}
      isClosed={editModalIsClosed}
      setIsClosed={setEditModalIsClosed}
    >
      <GifModalInternalWrappingDiv>
        {!editModalIsClosed && (
          <GifCanvas
            sketch={generateGifSketch({
              polygonGroups: polygonContext,
              windowSize: { height: 250, width: 250 },
              rgbaBackgroundColour: backgroundState.rgba,
              rgbBackgroundColour: backgroundState.rgb,
              shouldRedrawBackground: backgroundState.shouldRedraw,
            })}
          />
        )}
        <GifModalUpdateButton
          type="button"
          disabled={!canUpdate}
          onClick={() => {
            // setCanUpdate(false)
            setEditModalIsClosed(true)
          }}
        >
          Update
        </GifModalUpdateButton>
      </GifModalInternalWrappingDiv>
    </ModalBox>
  )
}
