import React from "react"
import { render, fireEvent } from "@testing-library/react"
import { MultiSlider } from "components/MultiSlider"

describe("MultiSlider Component", () => {
  it("should render", () => {
    const { getByLabelText, queryByLabelText } = render(
      <MultiSlider
        id="testing-component"
        label="Testing Component"
        min={0}
        max={100}
        startingMin={10}
        startingMax={90}
      />
    )

    expect(getByLabelText("Testing Component Minimum")).toBeInTheDocument()
    expect(getByLabelText("Testing Component Maximum")).toBeInTheDocument()
    expect(
      queryByLabelText(/Min\sTesting\sComponent\sInput/)
    ).toBeInTheDocument()
    expect(getByLabelText(/Max\sTesting\sComponent\sInput/)).toBeInTheDocument()
  })
  it.todo("should be able to update min input")
  it.todo("should be able to update max input")
  describe("Min Thumb", () => {
    it("should increase in value when right arrow is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "ArrowRight", code: "ArrowRight" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("11")
    })
    it("should increase in value when up arrow is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "ArrowUp", code: "ArrowUp" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("11")
    })
    it("should decrease in value when left arrow is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "ArrowLeft", code: "ArrowLeft" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("9")
    })
    it("should decrease in value when down arrow is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "ArrowDown", code: "ArrowDown" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("9")
    })
    it("should not decrease in value below min", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={1}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("1")

      fireEvent.keyDown(minThumb, { key: "ArrowDown", code: "ArrowDown" })
      fireEvent.keyDown(minThumb, { key: "ArrowDown", code: "ArrowDown" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("0")
    })
    it("should not increase in value above current max", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={11}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "ArrowUp", code: "ArrowUp" })
      fireEvent.keyDown(minThumb, { key: "ArrowUp", code: "ArrowUp" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("11")
    })
    it("should increase 5 steps when page up is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "PageUp", code: "PageUp" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("15")
    })
    it("should not increase past current max when page up is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={15}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "PageUp", code: "PageUp" })
      fireEvent.keyDown(minThumb, { key: "PageUp", code: "PageUp" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("15")
    })
    it("should decrease 5 steps when page down is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "PageDown", code: "PageDown" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("5")
    })
    it("should not decrease past min when page down is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={5}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("5")

      fireEvent.keyDown(minThumb, { key: "PageDown", code: "PageDown" })
      fireEvent.keyDown(minThumb, { key: "PageDown", code: "PageDown" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("0")
    })
    it("should set to minimum when home is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "Home", code: "Home" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("0")
    })
    it("should set to current maximum when end is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Minimum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("10")

      fireEvent.keyDown(minThumb, { key: "End", code: "End" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("90")
    })
    it.todo("should update value when dragged")
    it.todo("should not be able to drag past other thumbs value")
    it.todo("should not be able to increase past max thumbs value")
  })
  describe("Max Thumb", () => {
    it("should increase in value when right arrow is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "ArrowRight", code: "ArrowRight" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("91")
    })
    it("should increase in value when up arrow is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "ArrowUp", code: "ArrowUp" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("91")
    })
    it("should decrease in value when left arrow is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "ArrowLeft", code: "ArrowLeft" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("89")
    })
    it("should decrease in value when down arrow is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "ArrowDown", code: "ArrowDown" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("89")
    })
    it("should not decrease in value below current min", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={89}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "ArrowDown", code: "ArrowDown" })
      fireEvent.keyDown(minThumb, { key: "ArrowDown", code: "ArrowDown" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("89")
    })
    it("should not increase in value above max", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={99}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("99")

      fireEvent.keyDown(minThumb, { key: "ArrowUp", code: "ArrowUp" })
      fireEvent.keyDown(minThumb, { key: "ArrowUp", code: "ArrowUp" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("100")
    })
    it("should increase 5 steps when page up is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "PageUp", code: "PageUp" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("95")
    })
    it("should not increase past max when page up is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={94}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("94")

      fireEvent.keyDown(minThumb, { key: "PageUp", code: "PageUp" })
      fireEvent.keyDown(minThumb, { key: "PageUp", code: "PageUp" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("100")
    })
    it("should decrease 5 steps when page down is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "PageDown", code: "PageDown" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("85")
    })
    it("should not decrease past current min when page down is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={85}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "PageDown", code: "PageDown" })
      fireEvent.keyDown(minThumb, { key: "PageDown", code: "PageDown" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("85")
    })
    it("should set to current minimum when home is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "Home", code: "Home" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("10")
    })
    it("should set to maximum when end is pressed", () => {
      const { getByLabelText } = render(
        <MultiSlider
          id="testing-component"
          label="Testing Component"
          min={0}
          max={100}
          startingMin={10}
          startingMax={90}
        />
      )
      const minThumb = getByLabelText("Testing Component Maximum")
      const startingValue = minThumb.getAttribute("aria-valuenow")

      expect(startingValue).toEqual("90")

      fireEvent.keyDown(minThumb, { key: "End", code: "End" })

      const updatedValue = minThumb.getAttribute("aria-valuenow")

      expect(updatedValue).toEqual("100")
    })
    it.todo("should update value when dragged")
    it.todo("should not be able to drag past other thumbs value")
    it.todo("should not be able to decrease past min thumbs value")
  })
})
