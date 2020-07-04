import React from "react"
import styled from "styled-components"

const ColourPickerWrapperDiv = styled.div`
  width: 100%;
  overflow: hidden;
`
const ColourPickerWrapperUl = styled.ul`
  display: grid;
  grid-gap: 15px;
  grid-auto-flow: column;
  grid-auto-columns: 150px;
  max-width: 100vw;
  padding: 10px 0px;
  overflow-x: scroll;
  margin: 5px 0 0 0;
  padding: 10px 10px;
  border-radius: 4px;
  box-shadow: inset 0px 0px 9px -2px #404040;
`
const ColourPickerLi = styled.li`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  grid-template-rows: 20px 35px 30px;
`
const ColourPickerLabel = styled.label`
  text-align: center;
  align-self: center;
`
const ColourPickerInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 35px;
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
  maxColours: number
  setFunction: React.Dispatch<React.SetStateAction<string[]>>
  colours: string[]
  label: string
  id: string
}

export const ColourPicker: React.FC<ColourPickerProps> = ({
  maxColours,
  setFunction,
  colours,
  label,
  id,
}) => {
  return (
    <ColourPickerWrapperDiv>
      <h3 id={`colour-picker-${id}`}>{label}</h3>
      <ColourPickerWrapperUl aria-labelledby={`colour-picker-${id}`}>
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
                    setFunction(newColours)
                  }}
                />
                {colours.length !== 1 && (
                  <ColourPickerDeleteButton
                    type="button"
                    onClick={() => {
                      const newColours = [...colours]
                      newColours.splice(index, 1)
                      setFunction(newColours)
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
                      setFunction(newColours)
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
    </ColourPickerWrapperDiv>
  )
}
