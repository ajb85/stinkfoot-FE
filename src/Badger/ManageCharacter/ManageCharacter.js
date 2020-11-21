import React from "react";

import useBadges from "Providers/Badges.js";

import styles from "./styles.module.scss";

export default function ManageCharacter(props) {
  const { badges, character } = useBadges();
  const [name, setName] = React.useState("");

  const characterCount = Object.keys(badges.characters).length;

  return (
    <div className={styles.ManageCharacter}>
      {/* If there are characters */}
      {characterCount > 0 && (
        <div>
          <select value={badges.active} onChange={character.active}>
            {Object.keys(badges.characters)
              .sort()
              .map((name) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
          </select>
          <p
            style={{ color: "red", cursor: "pointer" }}
            onClick={character.delete.bind(this, badges.active)}
          >
            X
          </p>
        </div>
      )}

      {/* If there are no characters */}
      {characterCount === 0 && <p>Please create a character to begin!</p>}

      <form onSubmit={submitForm(name, setName, badges, character)}>
        <input type="text" value={name} onChange={updateName(setName)} />
        <button type="submit">Create Character</button>
      </form>
    </div>
  );
}

const submitForm = (name, setName, badges, character) => (e) => {
  e.preventDefault();
  if (name.length && !badges.characters[name]) {
    character.add(name);
    setName("");
  }
};

const updateName = (setName) => (e) => setName(e.target.value);
