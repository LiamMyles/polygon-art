import React, { useContext } from "react"
import { render, fireEvent, within } from "@testing-library/react"
import p5 from "p5"

import {
  PolygonGroupsContextWrapper,
  polygonGroupsStateContext,
} from "reducer-contexts/polygon-groups"
import { NavigationContextWrapper } from "reducer-contexts/navigation"

import {
  PolygonDisplay,
  PolygonRotationControls,
  PolygonScaleControls,
  PolygonDotsControls,
  PolygonSidesControls,
  PolygonPositionControls,
} from "components/PolygonDisplay"

const mockP5RemoveFunction = jest.fn()
jest.mock("p5", () => {
  return jest.fn().mockImplementation(() => {
    return { remove: mockP5RemoveFunction }
  })
})

beforeEach(() => {
  const mockedP5: jest.MockInstance<any, any> = p5 as any
  mockP5RemoveFunction.mockClear()
  mockedP5.mockClear()
})

describe("PolygonDisplay Component", () => {
  const TestInput: React.FC<{ value: any; name: string }> = ({
    value,
    name,
  }) => {
    return (
      <>
        <label htmlFor={`testing-${name}`}>{name}</label>
        <input id={`testing-${name}`} defaultValue={value} />
      </>
    )
  }
  it("should render component", () => {
    render(
      <PolygonGroupsContextWrapper>
        <NavigationContextWrapper>
          <PolygonDisplay />
        </NavigationContextWrapper>
      </PolygonGroupsContextWrapper>
    )
  })
  it("should contain ring canvas", () => {
    const { getByLabelText } = render(
      <PolygonGroupsContextWrapper>
        <NavigationContextWrapper>
          <PolygonDisplay />
        </NavigationContextWrapper>
      </PolygonGroupsContextWrapper>
    )
    expect(getByLabelText("Ring 0 Canvas")).toBeInTheDocument()
  })
  it("should randomize ring canvas", () => {
    const TestComponent: React.FC = () => {
      const polygonGroupsState = useContext(polygonGroupsStateContext)
      const {
        rotation: { startingRotation },
        sides: { amount },
      } = polygonGroupsState[0].rings[0]
      return (
        <div key={`${startingRotation}-${amount}`}>
          <label htmlFor="testing">Test</label>
          <input id="testing" defaultValue={`${startingRotation}-${amount}`} />
          <PolygonDisplay />
        </div>
      )
    }

    const { getByLabelText, getAllByRole } = render(
      <PolygonGroupsContextWrapper>
        <NavigationContextWrapper>
          <TestComponent />
        </NavigationContextWrapper>
      </PolygonGroupsContextWrapper>
    )
    const firstRing = getByLabelText("Ring 0 Canvas")
    const testingInput = getByLabelText("Test") as HTMLInputElement

    expect(firstRing).toBeInTheDocument()
    fireEvent.click(getAllByRole("button", { name: "Randomize" })[0])

    const newTestingInput = getByLabelText("Test") as HTMLInputElement

    expect(testingInput.value).not.toEqual(newTestingInput.value)
  })
  describe("Rotation Controls", () => {
    const TestComponent: React.FC = () => {
      const polygonGroupsState = useContext(polygonGroupsStateContext)
      const {
        rotation: { speed, clockwise, enabled, startingRotation },
        scale: { speed: scaleSpeed, startingSize },
      } = polygonGroupsState[0].rings[0]
      return (
        <div
          key={`${speed}-${clockwise}-${enabled}-${startingRotation}-${scaleSpeed}-${startingSize}`}
        >
          <TestInput
            name="random"
            value={`${speed}-${clockwise}-${enabled}-${startingRotation}-${scaleSpeed}-${startingSize}`}
          />
          <TestInput name="speed-test" value={speed} />
          <TestInput name="clockwise" value={clockwise} />
          <TestInput name="enable" value={enabled} />
          <PolygonRotationControls />
        </div>
      )
    }

    it("should randomize", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const startingRandom = getByLabelText("random") as HTMLInputElement
      const startingValue = startingRandom.value

      const randomizeButton = getByRole("button", { name: "Randomize" })
      fireEvent.click(randomizeButton)

      const finishingRandom = getByLabelText("random") as HTMLInputElement
      const finishingValue = finishingRandom.value

      expect(startingValue).not.toEqual(finishingValue)
    })
    it("should enable and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })
      const { value: enabledValue } = getByLabelText(
        "enable"
      ) as HTMLInputElement

      expect(enabledValue).toEqual("true")
      expect(updateButton).toBeDisabled()

      fireEvent.click(getByRole("checkbox", { name: "Enable" }))

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      const { value: updatedEnabledValue } = getByLabelText(
        "enable"
      ) as HTMLInputElement
      expect(updatedEnabledValue).toEqual("false")
    })
    it("should change clockwise and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })
      const { value: startingValue } = getByLabelText(
        "clockwise"
      ) as HTMLInputElement

      if (startingValue === "true") {
        expect(startingValue).toEqual("true")
      } else {
        expect(startingValue).toEqual("false")
      }

      expect(updateButton).toBeDisabled()

      fireEvent.click(getByRole("checkbox", { name: "Clockwise" }))

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      const { value: updatedEnabledValue } = getByLabelText(
        "clockwise"
      ) as HTMLInputElement

      if (startingValue === "true") {
        expect(updatedEnabledValue).toEqual("false")
      } else {
        expect(updatedEnabledValue).toEqual("true")
      }
    })
    it("should change speed and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      fireEvent.change(getByLabelText("Speed"), { target: { value: 20 } })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      expect(getByLabelText("speed-test")).toHaveValue("20")
    })
  })
  describe("Scale Controls", () => {
    const TestComponent: React.FC = () => {
      const polygonGroupsState = useContext(polygonGroupsStateContext)
      const {
        scale: { speed, range, enabled },
      } = polygonGroupsState[0].rings[0]
      return (
        <div key={`${speed}-${range.min}-${range.max}-${enabled}`}>
          <TestInput
            name="random"
            value={`${speed}-${range.min}-${range.max}-${enabled}`}
          />
          <TestInput name="speed-test" value={speed} />
          <TestInput name="range-min" value={range.min} />
          <TestInput name="range-max" value={range.max} />
          <TestInput name="enable" value={enabled} />
          <PolygonScaleControls />
        </div>
      )
    }
    it("should randomize", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const startingRandom = getByLabelText("random") as HTMLInputElement
      const startingValue = startingRandom.value

      const randomizeButton = getByRole("button", { name: "Randomize" })
      fireEvent.click(randomizeButton)

      const finishingRandom = getByLabelText("random") as HTMLInputElement
      const finishingValue = finishingRandom.value

      expect(startingValue).not.toEqual(finishingValue)
    })
    it("should enable and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })
      const { value: enabledValue } = getByLabelText(
        "enable"
      ) as HTMLInputElement

      // To help deal with randomness an if statement is used here.
      if (enabledValue === "true") {
        expect(enabledValue).toEqual("true")
      } else {
        expect(enabledValue).toEqual("false")
      }

      expect(updateButton).toBeDisabled()

      fireEvent.click(getByRole("checkbox", { name: "Enable" }))

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      const { value: updatedEnabledValue } = getByLabelText(
        "enable"
      ) as HTMLInputElement
      if (enabledValue === "true") {
        expect(updatedEnabledValue).toEqual("false")
      } else {
        expect(updatedEnabledValue).toEqual("true")
      }
    })
    it("should change speed and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      fireEvent.change(getByLabelText("Speed"), { target: { value: 20 } })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      expect(getByLabelText("speed-test")).toHaveValue("20")
    })
    it("should change range and update", () => {
      const { getByLabelText, getByRole, getAllByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })
      expect(updateButton).toBeDisabled()

      const minSlider = getAllByRole("slider")[1]
      const maxSlider = getAllByRole("slider")[2]

      fireEvent.keyDown(minSlider, { key: "Home", code: "Home" })
      fireEvent.keyDown(maxSlider, { key: "Home", code: "Home" })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      expect(getByLabelText("range-min")).toHaveValue("0")
      expect(getByLabelText("range-max")).toHaveValue("0")
    })
  })
  describe("Dots Controls", () => {
    const TestComponent: React.FC = () => {
      const polygonGroupsState = useContext(polygonGroupsStateContext)
      const {
        dots: { enabled, fillColours, size, strokeColours, strokeWidth },
      } = polygonGroupsState[0].rings[0]
      return (
        <div
          key={`${enabled}-${strokeWidth}-${size}-${fillColours.join(
            ""
          )}-${strokeColours.join("")}`}
        >
          <TestInput
            name="random"
            value={`${enabled}-${strokeWidth}-${size}-${fillColours.join(
              ""
            )}-${strokeColours.join("")}`}
          />
          <TestInput name="enable" value={enabled} />
          <TestInput name="fill-colours" value={fillColours.join("")} />
          <TestInput name="stroke-colours" value={strokeColours.join("")} />
          <TestInput name="stroke-width" value={strokeWidth} />
          <TestInput name="size" value={size} />
          <PolygonDotsControls />
        </div>
      )
    }
    it("should randomize", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const startingRandom = getByLabelText("random") as HTMLInputElement
      const startingValue = startingRandom.value

      const randomizeButton = getByRole("button", { name: "Randomize" })
      fireEvent.click(randomizeButton)

      const finishingRandom = getByLabelText("random") as HTMLInputElement
      const finishingValue = finishingRandom.value

      expect(startingValue).not.toEqual(finishingValue)
    })
    it("should enable and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })
      const { value: enabledValue } = getByLabelText(
        "enable"
      ) as HTMLInputElement

      // To help deal with randomness an if statement is used here.
      if (enabledValue === "true") {
        expect(enabledValue).toEqual("true")
      } else {
        expect(enabledValue).toEqual("false")
      }

      expect(updateButton).toBeDisabled()

      fireEvent.click(getByRole("checkbox", { name: "Enable" }))

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      const { value: updatedEnabledValue } = getByLabelText(
        "enable"
      ) as HTMLInputElement
      if (enabledValue === "true") {
        expect(updatedEnabledValue).toEqual("false")
      } else {
        expect(updatedEnabledValue).toEqual("true")
      }
    })
    it("should change size and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      fireEvent.change(getByLabelText("Size"), { target: { value: 20 } })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      expect(getByLabelText("size")).toHaveValue("20")
    })
    it("should change stroke width and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      fireEvent.change(getByLabelText("Stroke Width"), {
        target: { value: 20 },
      })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      expect(getByLabelText("stroke-width")).toHaveValue("20")
    })
    it("should change fill colour and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      const colourPicker = getByRole("list", { name: "Fill Colour" })
      const colourInput = within(colourPicker).getByLabelText(/Colour\s1$/)

      fireEvent.blur(colourInput, {
        target: { value: "#f13399" },
      })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      const fillColours = getByLabelText("fill-colours") as HTMLInputElement

      expect(fillColours.value).toEqual(expect.stringContaining("#f13399"))
    })
    it("should change stroke colour and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      const colourPicker = getByRole("list", { name: "Stroke Colours" })
      const colourInput = within(colourPicker).getByLabelText(/Colour\s1$/)

      fireEvent.blur(colourInput, {
        target: { value: "#f13399" },
      })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      const fillColours = getByLabelText("stroke-colours") as HTMLInputElement

      expect(fillColours.value).toEqual(expect.stringContaining("#f13399"))
    })
  })
  describe("Sides Controls", () => {
    const TestComponent: React.FC = () => {
      const polygonGroupsState = useContext(polygonGroupsStateContext)
      const {
        sides: { enabled, colours, amount, strokeWidth },
      } = polygonGroupsState[0].rings[0]
      return (
        <div key={`${enabled}-${strokeWidth}-${amount}-${colours.join("")}`}>
          <TestInput
            name="random"
            value={`${enabled}-${strokeWidth}-${amount}-${colours.join("")}`}
          />
          <TestInput name="enable" value={enabled} />
          <TestInput name="colours" value={colours.join("")} />
          <TestInput name="stroke-width" value={strokeWidth} />
          <TestInput name="amount" value={amount} />
          <PolygonSidesControls />
        </div>
      )
    }
    it("should randomize", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const startingRandom = getByLabelText("random") as HTMLInputElement
      const startingValue = startingRandom.value

      const randomizeButton = getByRole("button", { name: "Randomize" })
      fireEvent.click(randomizeButton)

      const finishingRandom = getByLabelText("random") as HTMLInputElement
      const finishingValue = finishingRandom.value

      expect(startingValue).not.toEqual(finishingValue)
    })
    it("should enable and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })
      const { value: enabledValue } = getByLabelText(
        "enable"
      ) as HTMLInputElement

      // To help deal with randomness an if statement is used here.
      if (enabledValue === "true") {
        expect(enabledValue).toEqual("true")
      } else {
        expect(enabledValue).toEqual("false")
      }

      expect(updateButton).toBeDisabled()

      fireEvent.click(getByRole("checkbox", { name: "Enable" }))

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      const { value: updatedEnabledValue } = getByLabelText(
        "enable"
      ) as HTMLInputElement
      if (enabledValue === "true") {
        expect(updatedEnabledValue).toEqual("false")
      } else {
        expect(updatedEnabledValue).toEqual("true")
      }
    })
    it("should change amount and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      fireEvent.change(getByLabelText("Amount"), { target: { value: 20 } })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      expect(getByLabelText("amount")).toHaveValue("20")
    })
    it("should change stroke width and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      fireEvent.change(getByLabelText("Stroke Width"), {
        target: { value: 20 },
      })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      expect(getByLabelText("stroke-width")).toHaveValue("20")
    })
    it("should change colour and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      const colourPicker = getByRole("list", { name: "Colours" })
      const colourInput = within(colourPicker).getByLabelText(/Colour\s1$/)

      fireEvent.blur(colourInput, {
        target: { value: "#f13399" },
      })

      expect(updateButton).not.toBeDisabled()
      fireEvent.click(updateButton)

      const fillColours = getByLabelText("colours") as HTMLInputElement

      expect(fillColours.value).toEqual(expect.stringContaining("#f13399"))
    })
  })
  describe("Coordinates Controls", () => {
    const TestComponent: React.FC = () => {
      const polygonGroupsState = useContext(polygonGroupsStateContext)
      const {
        position: { x, y },
      } = polygonGroupsState[0].rings[0]
      return (
        <div key={`${x}-${y}`}>
          <TestInput name="x" value={x} />
          <TestInput name="y" value={y} />
          <PolygonPositionControls />
        </div>
      )
    }
    it("should change x, y and update", () => {
      const { getByLabelText, getByRole } = render(
        <PolygonGroupsContextWrapper>
          <NavigationContextWrapper>
            <TestComponent />
          </NavigationContextWrapper>
        </PolygonGroupsContextWrapper>
      )
      const updateButton = getByRole("button", { name: "Update" })

      expect(updateButton).toBeDisabled()

      fireEvent.change(getByLabelText("Y"), {
        target: { value: 20 },
      })
      fireEvent.change(getByLabelText("X"), {
        target: { value: 20 },
      })
      expect(updateButton).not.toBeDisabled()

      fireEvent.click(updateButton)

      expect(getByLabelText("x")).toHaveValue("20")
      expect(getByLabelText("y")).toHaveValue("20")
    })
  })
})
