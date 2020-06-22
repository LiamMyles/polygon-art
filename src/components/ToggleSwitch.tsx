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

      &:checked + label .button {
        &::before {
          background: grey;
        }
        &::after {
        content: "${checkedText ? checkedText.unchecked : ""}";
          background: lightgrey;
          ${svgBackground ? svgBackgroundCss : ""}
          transform: translate(0, -50%) scale(1);
        }
      }
      &:checked:focus,
      &:checked:hover {
        & + label .button::after {
          transform: translate(0, -50%) scale(0.9);
        }
      }

      & + label{
        display: grid;
        grid-template-rows: 1em 60px;
        grid-gap: 10px;
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
          height: 60px;
          width: 110px;
          border-radius: 50px;
          transition: border 100ms ease-in-out, background-color 200ms ease-in-out;
        }
        &::after {
          content: "${checkedText ? checkedText.checked : ""}";
          display: flex;
          justify-content: center;
          align-items: center;
          background: grey;
          transform: translate(100%, -50%) scale(1) ${
            transformFlip ? "rotateX(0deg) rotateY(180deg)" : ""
          };
          ${svgBackground ? svgBackgroundCss : ""}
          margin: 0 5px;
          width: 50px;
          height: 50px;
          border-radius: 25px;
          transition: transform 200ms ease-in-out, background-color 300ms ease-in-out;
        }
      }

      &:focus,
      &:hover {
        & + label .button::after {
          transform: translate(100%, -50%) scale(0.9) ${
            transformFlip ? "rotateX(0deg) rotateY(180deg)" : ""
          };
        }
        & + label::before {
          border: solid 5px darkgrey;
          height: 55px;
          width: 105px;
          right: -2.5px;
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
