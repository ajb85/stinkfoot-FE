import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Dropdown from "./";

let props;
const renderDD = () =>
  render(
    <div data-testid="test-container">
      <Dropdown {...props} />
    </div>
  );

beforeEach(() => {
  const value = "Test Option Value";
  props = {
    options: [
      {
        key: 0,
        value,
        image: "testImage.jpg",
        alt: "Test Image",
        display: "Test Option Display",
      },
      {
        key: 1,
        value: "Second Option Value",
        image: "secondImage.jpg",
        alt: "Second Test Image",
        display: "Second Option Display",
      },
    ],
    selected: value,
    onChange: () => {},
    name: "Test Option Name",
  };
});

describe("Renders the active item", () => {
  it("Renders an image & text in the dropdown, defaulting to the display value", () => {
    // Arrange
    // Act
    const util = renderDD();
    // Assert
    util.getByAltText("Test Image");
    util.getByText("Test Option Display");
  });

  it("Uses the value if there is no display", () => {
    // Arrange
    delete props.options[0].display;
    // Act
    const util = renderDD();
    // Assert
    util.getByText("Test Option Value");
  });
});

describe("Toggles correctly", () => {
  it("Starts closed", () => {
    // Arrange
    // Act
    const util = renderDD();
    const options = util.queryByTestId("ddOption");
    // Assert
    expect(options).toBe(null);
  });

  it("Opens after the toggle is clicked", () => {
    // Arrange
    // Act
    const util = renderDD();
    const toggle = util.getByTestId("dropdownToggle");
    fireEvent.click(toggle);
    // Assert
    const options = util.getAllByTestId("ddOption");
    expect(options).toHaveLength(2);
  });

  it("Closes when toggle is clicked while open", () => {
    // Arrange
    // Act
    const util = renderDD();
    const toggle = util.getByTestId("dropdownToggle");
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    const options = util.queryByTestId("ddOption");
    // Assert
    expect(options).toBe(null);
  });
});
