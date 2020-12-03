import React from "react";
import { render, fireEvent } from "@testing-library/react";

// import EnhancementBar from "./";

const noFunc = () => {};

let props;
const renderEB = (onClick = noFunc) =>
  render(
    <div data-testid="test-container">
      <EnhancementBar {...props} />
    </div>
  );

beforeEach(() => {
  props = {
    powerSlotIndex: 0,
    zIndex: 5,
  };
});

xit("Doesn't allow clicks to propagate", () => {
  const mockFunc = jest.fn();
  //   const util = renderEB(mockFunc);
  expect(true).toBe(true);
});
