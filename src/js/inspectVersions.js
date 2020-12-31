// @flow
import versions from "data/versions.json";
import type { Version } from "flow/types.js";

const lastVersion = localStorage.getItem("lastVersion") || null;

const toExport: Array<Version> = !lastVersion
  ? []
  : versions.filter(({ version }) => version > lastVersion);

export default toExport;

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
