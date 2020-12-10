import React from "react";
import withProviders from "testTools/providers.js";
import { render, fireEvent } from "@testing-library/react";

import EnhancementBar from "./";

const noFunc = () => {};

let props;
const renderEB = (onClick = noFunc, characterData) =>
  render(
    <div data-testid="test-container">
      {withProviders(<EnhancementBar {...props} />)(characterData)}
    </div>
  );

const withCharacter = withProviders(<EnhancementBar />);

beforeEach(() => {
  props = {
    powerSlotIndex: 0,
    zIndex: 5,
  };
});

it("Doesn't allow clicks to propagate", () => {
  const mockFunc = jest.fn();
  const util = renderEB(mockFunc);
  // console.log("RETURNED: ", util);
  fireEvent.click(util.getAllByTestId("enhancementSlot")[0]);

  expect(mockFunc).not.toHaveBeenCalled();
});
