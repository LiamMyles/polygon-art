import styled from "styled-components"
import { P5Canvas } from "./P5Canvas"
import React, { useState, useContext, useEffect } from "react"
import { polygonGroupsStateContext } from "reducer-contexts/polygon-groups"
import { backgroundStateContext } from "reducer-contexts/background"
import { ModalBox } from "./ModalBox"
import { generateGifSketch } from "polygon-logic/polygon-p5-draw"
import { Slider } from "./Slider"
import { StyledButton } from "common-styled-components/StyledButton"

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

const GifModalInternalWrappingDiv = styled.form`
  width: 100%;
  min-height: 150px;
  display: grid;
  justify-content: center;
  align-content: center;
  grid-gap: 10px;
  font-size: 20px;
  grid-auto-columns: minmax(280px, 80%);
  justify-items: center;
`
const GifCanvas = styled(P5Canvas)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const GifNameInput = styled.input`
  height: 20px;
  font-size: 16px;
  margin: 0 10px;
  border: solid 2px lightgrey;
  border-radius: 4px;
  padding: 3px;
  &:focus,
  &:hover {
    outline: none;
    border-color: grey;
    background: dimgrey;
    color: snow;
  }
`

const gifOptions = {
  workers: 2,
  quality: 5,
  workerScript: "/playing-with-polygons/js/gif.worker.js",
  dither: "FalseFloydSteinberg",
}

// IF the included script isn't on the page, just don't do anything
let gif = typeof GIF !== "undefined" ? new GIF(gifOptions) : null

export const GenerateGifModal: React.FC = () => {
  const [editModalIsClosed, setEditModalIsClosed] = useState(true)
  const polygonContext = useContext(polygonGroupsStateContext)
  const backgroundState = useContext(backgroundStateContext)

  const [recordingLength, setRecordingLength] = useState(5)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [saveFileName, setSaveFileName] = useState("polygon")

  type componentModes = "initial" | "recording" | "processing" | "saving"
  const [gifGenerationMode, setGifGenerationMode] = useState<componentModes>(
    "initial"
  )
  const [startGenerating, setStartGenerating] = useState(false)
  const [renderHasStarted, setRenderHasStarted] = useState(false)
  const [renderFinished, setRenderFinished] = useState(false)

  const [gifFile, setGifFile] = useState<Blob | null>(null)

  // Reset on close
  useEffect(() => {
    if (gif === null) return
    if (editModalIsClosed) {
      setCurrentProgress(0)
      setRenderHasStarted(false)
      setRenderFinished(false)
      setStartGenerating(false)
      setGifFile(null)
    }
  }, [editModalIsClosed])

  //setup gif generation handlers
  useEffect(() => {
    if (gif === null) return
    const progressHandler = function (progression: any) {
      const roundedProgression = Math.round(progression * 100)
      setCurrentProgress(roundedProgression)
    }
    const startHandler = (starting: any) => {
      setRenderHasStarted(true)
    }
    const abortHandler = (aborting: any) => {}
    const finishedHandler = function (finishedBlob: Blob) {
      setRenderFinished(true)
      setGifFile(finishedBlob)
    }

    gif.on("start", startHandler)
    gif.on("abort", abortHandler)
    gif.on("finished", finishedHandler)
    gif.on("progress", progressHandler)

    if (editModalIsClosed) {
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

  // Contain the logic for what mode the gif generation is in
  useEffect(() => {
    if (startGenerating) {
      if (renderHasStarted) {
        if (renderFinished && gifFile) {
          setGifGenerationMode("saving")
        } else {
          setGifGenerationMode("processing")
        }
      } else {
        setGifGenerationMode("recording")
      }
    } else {
      setGifGenerationMode("initial")
    }
  }, [renderHasStarted, renderFinished, startGenerating, gifFile])
  if (gif === null) return null
  return (
    <ModalBox
      buttonText="Make Gif"
      title="Make Gif"
      StyledButton={StyledButton}
      isClosed={editModalIsClosed}
      setIsClosed={setEditModalIsClosed}
    >
      <GifModalInternalWrappingDiv
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        {(() => {
          switch (gifGenerationMode) {
            case "initial":
              return (
                <>
                  <Slider
                    label="Gif Length"
                    min={1}
                    max={10}
                    currentValue={recordingLength}
                    setFunction={setRecordingLength}
                    id={"gif-recording-length-slider"}
                    valueSuffix={" seconds"}
                  />
                  <StyledButton
                    type="submit"
                    onClick={() => {
                      setStartGenerating(true)
                    }}
                  >
                    Start Generating
                  </StyledButton>
                </>
              )
            case "recording":
              return (
                <>
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
              )
            case "processing":
              return <p>Processing : {currentProgress}%</p>
            case "saving": {
              const imgSrc =
                URL?.createObjectURL && gifFile
                  ? URL.createObjectURL(gifFile)
                  : null
              return (
                <>
                  <p>Finished</p>
                  {imgSrc && <img alt="preview gif" src={imgSrc} />}
                  <div>
                    <label htmlFor="save-file-name">Save file name:</label>
                    <GifNameInput
                      id="save-file-name"
                      minLength={1}
                      value={saveFileName}
                      onChange={({ currentTarget: { value } }) => {
                        setSaveFileName(value)
                      }}
                    />
                  </div>
                  <StyledButton
                    type="submit"
                    onClick={() => {
                      download(
                        gifFile as Blob,
                        saveFileName
                          .trim()
                          .replace(/[^\w\s]/gi, "")
                          .toLocaleLowerCase()
                          .replace(/\s+/gi, "-")
                      )
                    }}
                  >
                    Download Gif
                  </StyledButton>
                </>
              )
            }
          }
        })()}
      </GifModalInternalWrappingDiv>
    </ModalBox>
  )
}
