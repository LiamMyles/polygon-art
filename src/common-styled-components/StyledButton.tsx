import styled from "styled-components"

export const StyledButton = styled.button`
  min-height: 50px;
  border-radius: 5px;
  margin: 5px;
  background: Gainsboro;
  border: solid 2px silver;
  color: #595959;
  cursor: pointer;

  &:focus,
  &:hover {
    outline: none;
    border: solid 2px lightgrey;
    background: dimgrey;
    color: snow;
  }

  &:active {
    border: solid 2px snow;
  }

  &:disabled {
    border: solid 2px silver;
    background: #f8f8f8;
    color: #6e6e6e;
    cursor: not-allowed;
  }
`
