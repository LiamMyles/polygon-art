import React from "react"
import styled, { css } from "styled-components"

interface CheckboxInputProps {
  checkedText?: { checked: string; unchecked: string }
  svgBackground?: string
  transformFlip?: boolean
}
const CheckboxInput = styled.input<CheckboxInputProps>`
  ${({ checkedText, svgBackground, transformFlip }) => {
    const svgBackgroundCss = css`
    background-image: url("${svgBackground}");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 90%;
    `

    return css`
      height: 0px;
      width: 0px;
      overflow: hidden;
      clip: rect(1px, 1px, 1px, 1px);
      position: absolute !important;

      & + label{
        display: grid;
        grid-template-rows: 1em 50px;
        grid-gap: 5px;
      }

      & + label .button {
        display: block;
        box-sizing: border-box;
        position: relative;

        &::before,
        &::after {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        &::before {
          background: lightgrey;
          height: 50px;
          width: 90px;
          border-radius: 50px;
        }
        &::after {
          content: "${checkedText ? checkedText.unchecked : ""}";
          display: flex;
          justify-content: center;
          align-items: center;
          background: Gainsboro;
          margin: 0 5px;
          border: solid 2px silver;
          width: 38px;
          height: 38px;
          transform: translate(35px, -50%) ${
            transformFlip ? "rotateX(0deg) rotateY(180deg)" : ""
          };
          ${svgBackground ? svgBackgroundCss : ""}
          border-radius: 25px;
          transition: transform 200ms ease-in-out;
        }
      }
      
      &:checked + label .button {
        &::after {
          content: "${checkedText ? checkedText.checked : ""}";
          ${svgBackground ? svgBackgroundCss : ""}
          transform: translate(0, -50%);
        }
      }
      &:checked:focus,
      &:checked:hover {
        & + label .button::after {
          transform: translate(0, -50%);
        }
      }

      &:focus,
      &:hover {
        & + label .button::after {
          border: solid 3px silver;
          width: 35px;
          height: 35px;
          transform: translate(35px, -50%) ${
            transformFlip ? "rotateX(0deg) rotateY(180deg)" : ""
          };
        }
        & + label .button::before {
          background: grey;
        }
      }`
  }}
`

interface ToggleSwitchProps extends CheckboxInputProps {
  label: string
  id: string
  checked: boolean
  setFunction: React.Dispatch<React.SetStateAction<boolean>>
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  id,
  checked,
  setFunction,
  checkedText,
  svgBackground,
  transformFlip,
}) => {
  return (
    <div>
      <CheckboxInput
        type="checkbox"
        id={id}
        checked={checked}
        onChange={({ currentTarget: { checked } }) => {
          setFunction(checked)
        }}
        checkedText={checkedText}
        svgBackground={svgBackground}
        transformFlip={transformFlip}
      />
      <label htmlFor={id}>
        <span className="text">{label}</span>
        <span className="button" />
      </label>
    </div>
  )
}
