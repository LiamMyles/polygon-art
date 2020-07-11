import styled from "styled-components"
import { P5Canvas } from "./P5Canvas"
import React, { useState, useContext, useEffect } from "react"
import { polygonGroupsStateContext } from "reducer-contexts/polygon-groups"
import { backgroundStateContext } from "reducer-contexts/background"
import { ModalBox } from "./ModalBox"
import { generateGifSketch } from "polygon-logic/polygon-p5-draw"
import { NavigationButton } from "./App"
import { Slider } from "./Slider"

import download from "downloadjs"

declare class GIF {
  constructor(options: {
    workers: number
    quality: number
    workerScript: string
    dither: string
  })

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

const gifOptions = {
  workers: 2,
  quality: 5,
  workerScript: "playing-with-polygons/js/gif.worker.js",
  dither: "FalseFloydSteinberg-serpentine",
}

let gif = typeof GIF !== "undefined" ? new GIF(gifOptions) : null

export const GenerateGifModal: React.FC = () => {
  const [editModalIsClosed, setEditModalIsClosed] = useState(true)
  const polygonContext = useContext(polygonGroupsStateContext)
  const backgroundState = useContext(backgroundStateContext)

  const [recordingLength, setRecordingLength] = useState(5)
  const [startGenerating, setStartGenerating] = useState(false)
  const [gifFile, setGifFile] = useState<Blob | null>(null)

  const [currentProgress, setCurrentProgress] = useState(0)
  const [renderHasStarted, setRenderHasStarted] = useState(false)
  const [renderFinished, setRenderFinished] = useState(false)

  // Reset on close
  useEffect(() => {
    if (gif === null) return
    if (editModalIsClosed) {
      console.log("reset")
      setCurrentProgress(0)
      setRenderHasStarted(false)
      setRenderFinished(false)
      setStartGenerating(false)
      setGifFile(null)
    }
  }, [editModalIsClosed])

  useEffect(() => {
    if (gif === null) return
    const progressHandler = function (progression: any) {
      console.log("progression", progression)
      const roundedProgression = Math.round(progression * 100)
      setCurrentProgress(roundedProgression)
    }
    const startHandler = (starting: any) => {
      console.log("starting", starting)
      setRenderHasStarted(true)
    }
    const abortHandler = (aborting: any) => {
      console.log("aborting", aborting)
    }
    const finishedHandler = function (finishedBlob: Blob) {
      const gifUrlObject = URL.createObjectURL(finishedBlob)
      console.log("finished", finishedBlob)
      console.log(gifUrlObject)
      setRenderFinished(true)
      setGifFile(finishedBlob)
    }

    gif.on("start", startHandler)
    gif.on("abort", abortHandler)
    gif.on("finished", finishedHandler)
    gif.on("progress", progressHandler)

    if (editModalIsClosed) {
      console.log("try to abort")
      gif.abort()
      gif = new GIF(gifOptions)
    }
    return () => {
      if (gif === null) return
      gif.removeListener("start", startHandler)
      gif.removeListener("abort", abortHandler)
      gif.removeListener("finished", finishedHandler)
      gif.removeListener("progress", progressHandler)
      gif.abort()
      gif = new GIF(gifOptions)
    }
  }, [editModalIsClosed])
  if (gif === null) return null
  return (
    <ModalBox
      buttonText="Share Gif"
      title="Share Gif"
      StyledButton={NavigationButton}
      isClosed={editModalIsClosed}
      setIsClosed={setEditModalIsClosed}
    >
      <GifModalInternalWrappingDiv>
        {renderHasStarted &&
          (!renderFinished ? (
            <p>Processing : {currentProgress}%</p>
          ) : (
            <p>Finished</p>
          ))}
        {!startGenerating && (
          <Slider
            label="Gif Length"
            min={1}
            max={10}
            currentValue={recordingLength}
            setFunction={setRecordingLength}
            id={"gif-recording-length-slider"}
          />
        )}
        {!editModalIsClosed && !renderHasStarted && startGenerating && (
          <>
            {console.log("crap I rendered")}
            <p>Recording</p>
            <GifCanvas
              sketch={generateGifSketch({
                polygonGroups: polygonContext,
                windowSize: { height: 250, width: 250 },
                rgbaBackgroundColour: backgroundState.rgba,
                rgbBackgroundColour: backgroundState.rgb,
                shouldRedrawBackground: backgroundState.shouldRedraw,
                gifClass: gif,
                recordingLength: recordingLength,
                scale: 0.3,
              })}
            />
          </>
        )}
        {!startGenerating && (
          <GifModalUpdateButton
            type="button"
            onClick={() => {
              setStartGenerating(true)
            }}
          >
            Start Generating
          </GifModalUpdateButton>
        )}
        {gifFile && (
          <GifModalUpdateButton
            type="button"
            onClick={() => {
              download(gifFile)
            }}
          >
            Download Gif
          </GifModalUpdateButton>
        )}
      </GifModalInternalWrappingDiv>
    </ModalBox>
  )
}
