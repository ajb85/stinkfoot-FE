import BuildProviders from "providers/builder/";
import { BadgesProvider } from "providers/useBadges.js";
import { CharactersProvider } from "providers/useCharacters.js";
import { ShoppingProvider } from "providers/useShoppingTotals.js";

import defaultCharacter from "./mockChar.json";

export default function easyProviders(Component) {
  return function WithCharacter(characterData = defaultCharacter) {
    const { name } = characterData || { name: "Test" };
    const stringified = JSON.stringify({ [name]: characterData });
    localStorage.setItem("characters", stringified);

    return (
      <CharactersProvider>
        <BadgesProvider>
          <ShoppingProvider>
            <BuildProviders>{Component}</BuildProviders>
          </ShoppingProvider>
        </BadgesProvider>
      </CharactersProvider>
    );
  };
}
