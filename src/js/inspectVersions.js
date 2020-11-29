// @flow
import versions from "data/versions.json";

const lastVersion = localStorage.getItem("lastVersion") || null;

export default !lastVersion
  ? versions
  : versions.filter(({ version }) => version > lastVersion);

let foundVersion: boolean = !lastVersion;
for (let i = 0; i < versions.length; i++) {
  const { version, clearStorage } = versions[i];
  if (lastVersion && version > lastVersion) {
    foundVersion = true;
  }

  if (clearStorage && (foundVersion || !lastVersion)) {
    cleanLocalStorage();
    break;
  }
}

function cleanLocalStorage(): void {
  localStorage.setItem("lastVersion", versions[versions.length - 1].version);
  localStorage.removeItem("characters");
  localStorage.removeItem("activeCharacterName");
  localStorage.removeItem("shoppingTotals");
}