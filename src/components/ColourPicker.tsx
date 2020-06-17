import React, { useState } from "react"

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
    <div>
      {colours.map((colour, index) => {
        return (
          <React.Fragment key={`${colour}-${index}`}>
            <form
              onSubmit={(event) => {
                event.preventDefault()
              }}
            >
              <label htmlFor={`${index}-${colour.substr(1)}`}>
                Colour {index + 1}
              </label>
              <input
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
                <button
                  onClick={() => {
                    const newColours = [...colours]
                    newColours.splice(index, 1)
                    setColours(newColours)
                  }}
                >
                  Delete
                </button>
              )}
            </form>
            {index + 1 === colours.length && colours.length < maxColours ? (
              <button
                onClick={() => {
                  const newColours = [...colours]
                  newColours.push("#ffffff")
                  setColours(newColours)
                }}
              >
                Add
              </button>
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}
