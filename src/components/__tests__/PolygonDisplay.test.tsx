import React, { useContext } from "react"
import { render, fireEvent } from "@testing-library/react"
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
        rotation: { speed, clockwise, enabled },
      } = polygonGroupsState[0].rings[0]
      return (
        <div key={`${speed}-${clockwise}-${enabled}`}>
          <TestInput name="random" value={`${speed}-${clockwise}-${enabled}`} />
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
    it.todo("should change range and update")
  })
  describe("Dots Controls", () => {
    it.todo("should randomize")
    it.todo("should enable and update")
    it.todo("should change size and update")
    it.todo("should change fill colour and update")
    it.todo("should change stroke width and update")
    it.todo("should change stroke colour and update")
  })
  describe("Sides Controls", () => {
    it.todo("should randomize")
    it.todo("should enable and update")
    it.todo("should change amount and update")
    it.todo("should change stroke width and update")
    it.todo("should change colour and update")
  })
  describe("Coordinates Controls", () => {
    it.todo("should randomize")
    it.todo("should change x, y and update")
  })
})
