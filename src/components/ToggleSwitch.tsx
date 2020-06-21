import React from "react"
import styled from "styled-components"

interface ToggleSwitchProps {
  label: string
  id: string
  checked: boolean
  setFunction: React.Dispatch<React.SetStateAction<boolean>>
}

const CheckboxLabel = styled.label`
  display: block;
  box-sizing: border-box;
  padding-right: 120px;
  position: relative;
  height: 60px;
  width: 200px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  &::before {
    background: lightgrey;
    height: 60px;
    width: 110px;
    border-radius: 50px;
  }
  &::after {
    content: "OFF";
    display: flex;
    justify-content: center;
    align-items: center;
    background: grey;
    margin: 0 5px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    transition: all 100ms ease-in-out;
  }
`

const CheckboxInput = styled.input`
  height: 0px;
  width: 0px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  position: absolute !important;

  &:checked + ${CheckboxLabel} {
    &::before {
      background: grey;
    }
    &::after {
      content: "ON";
      background: lightgrey;
      transform: translate(0, -50%) scale(0.9);
    }
    &:active::after {
      width: 100px;
      right: 0;
    }
  }
  &:checked:focus,
  &:checked:hover {
    & + ${CheckboxLabel}::after {
      transform: translate(0, -50%) scale(1);
    }
  }

  &:focus,
  &:hover {
    & + ${CheckboxLabel}::after {
      transform: translate(-100%, -50%) scale(1);
    }
    & + ${CheckboxLabel}::before {
      border: solid 5px darkgrey;
      height: 55px;
      width: 105px;
      right: -2.5px;
    }
  }
  & + ${CheckboxLabel} {
    &::after {
      transform: translate(-100%, -50%) scale(0.9);
    }
    &:active::after {
      right: -100px;
      width: 100px;
    }
  }
`

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  id,
  checked,
  setFunction,
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
      />
      <CheckboxLabel htmlFor={id}>{label}</CheckboxLabel>
    </div>
  )
}
