import styled from "styled-components"
import { P5Canvas } from "./P5Canvas"
import React, { useState, useContext, useEffect } from "react"
import { polygonGroupsStateContext } from "reducer-contexts/polygon-groups"
import { backgroundStateContext } from "reducer-contexts/background"
import { ModalBox } from "./ModalBox"
import { generateGifSketch } from "polygon-logic/polygon-p5-draw"
import { NavigationButton } from "./App"

declare class GIF {
  constructor({}: any)

  on(
    type: "start" | "abort" | "finished" | "progress",
    callback: Function
  ): void
  removeListener(
    type: "start" | "abort" | "finished" | "progress",
    callback: Function
  ): void
  render(): void
  abort(): void
  addFrame(canvas: any, options: any): void
}

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

let gif = new GIF({
  workers: 2,
  quality: 5,
  workerScript: "playing-with-polygons/js/gif.worker.js",
  dither: "FalseFloydSteinberg-serpentine",
})

export const GenerateGifModal: React.FC = () => {
  const [editModalIsClosed, setEditModalIsClosed] = useState(true)
  const polygonContext = useContext(polygonGroupsStateContext)
  const backgroundState = useContext(backgroundStateContext)
  const [canUpdate, setCanUpdate] = useState(true)

  useEffect(() => {
    const progressHandler = function (progression: any) {
      console.log("progression", progression)
    }
    const startHandler = (starting: any) => {
      console.log("starting", starting)
    }
    const abortHandler = (aborting: any) => {
      console.log("aborting", aborting)
    }
    const finishedHandler = function (finishedBlob: any) {
      console.log("finished", finishedBlob)
      console.log(URL.createObjectURL(finishedBlob))
      window.open(URL.createObjectURL(finishedBlob))
    }

    gif.on("start", startHandler)
    gif.on("abort", abortHandler)
    gif.on("finished", finishedHandler)
    gif.on("progress", progressHandler)

    if (editModalIsClosed) {
      console.log("try to abort")
      gif.abort()
    }
    return () => {
      gif.removeListener("start", startHandler)
      gif.removeListener("abort", abortHandler)
      gif.removeListener("finished", finishedHandler)
      gif.removeListener("progress", progressHandler)
      gif.abort()
    }
  }, [editModalIsClosed])

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
              gifClass: gif,
              recordingLength: 1,
              scale: 0.2,
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
