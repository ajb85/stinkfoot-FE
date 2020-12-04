import buildProviders from "providers/builder/";
import { BadgesProvider } from "providers/useBadges.js";
import { CharactersProvider } from "providers/useCharacters.js";
import { ShoppingProvider } from "providers/useShoppingTotals.js";

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

export default function easyProviders(Component) {
  return function withCharacter(characterData) {
    localStorage.setItem("characters", characterData);
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
