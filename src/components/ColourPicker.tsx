import React, { useState } from "react"
import styled from "styled-components"

const ColourPickerWrapperUl = styled.ul`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(25, 150px);
  width: 100%;
  max-width: 100vw;
  padding: 10px 0px;
  overflow-x: scroll;
`
const ColourPickerLi = styled.li`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  grid-template-rows: 20px 40px 30px;
`
const ColourPickerLabel = styled.label`
  text-align: center;
  align-self: center;
`
const ColourPickerInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  padding: 5px;
  border-radius: 5px;
`
const ColourPickerDeleteButton = styled.button`
  border-radius: 5px;
  padding: 5px;
`
const ColourPickerAddButton = styled.button`
  grid-row: 2/3;
  width: 100%;
  border-radius: 5px;
`

interface ColourPickerProps {
  initialColours: string[]
  maxColours: number
}

export const ColourPicker: React.FC<ColourPickerProps> = ({
  initialColours,
  maxColours,
}) => {
  const [colours, setColours] = useState(initialColours)
  return (
    <ColourPickerWrapperUl>
      {colours.map((colour, index) => {
        return (
          <React.Fragment key={`${colour}-${index}`}>
            <ColourPickerLi>
              <ColourPickerLabel htmlFor={`${index}-${colour.substr(1)}`}>
                Colour {index + 1}
              </ColourPickerLabel>
              <ColourPickerInput
                id={`${index}-${colour.substr(1)}`}
                type="color"
                defaultValue={colour}
                onBlur={({ currentTarget: { value } }) => {
                  const newColours = [...colours]
                  newColours[index] = value
                  setColours(newColours)
                }}
              />
              {colours.length !== 1 && (
                <ColourPickerDeleteButton
                  type="button"
                  onClick={() => {
                    const newColours = [...colours]
                    newColours.splice(index, 1)
                    setColours(newColours)
                  }}
                >
                  Delete
                </ColourPickerDeleteButton>
              )}
            </ColourPickerLi>
            {index + 1 === colours.length && colours.length < maxColours ? (
              <ColourPickerLi>
                <ColourPickerAddButton
                  type="button"
                  onClick={() => {
                    const newColours = [...colours]
                    newColours.push("#ffffff")
                    setColours(newColours)
                  }}
                >
                  Add
                </ColourPickerAddButton>
              </ColourPickerLi>
            ) : null}
          </React.Fragment>
        )
      })}
    </ColourPickerWrapperUl>
  )
}
