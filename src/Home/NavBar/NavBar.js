import React, { useState } from "react";
import history from "history.js";
import {
  Navbar,
  Button,
  Tooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "shards-react";

import { FaShoppingCart } from "react-icons/fa";
import { GiPoliceBadge } from "react-icons/gi";
import { IoMdConstruct } from "react-icons/io";
import { MdSupervisorAccount } from "react-icons/md";

import useCharacters from "providers/useCharacters.js";

import logo from "assets/stinkfoot_logo.png";
import styles from "./styles.module.scss";

export default function NavBar(props) {
  const [dropdown, setDropdown] = useState(false);
  const { activeCharacter, characterList, updateActive } = useCharacters();

  return (
    <section className={styles.NavBar}>
      <Navbar>
        <Logo />
        <div>
          <Dropdown
            direction="left"
            open={dropdown}
            toggle={setDropdown.bind(this, !dropdown)}
          >
            <DropdownToggle theme="success">
              {activeCharacter && activeCharacter.name ? (
                activeCharacter.name
              ) : (
                <MdSupervisorAccount />
              )}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={props.openNewCharacterModal}>
                +New Character
              </DropdownItem>
              {characterList.map((name) => (
                <DropdownItem
                  key={name}
                  onClick={updateActive.bind(this, name)}
                >
                  {name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <NavButton
            id="planner"
            title="Character Planner"
            disabled={!activeCharacter}
          >
            <IoMdConstruct />
          </NavButton>
          <NavButton
            id="badger"
            title="Badge Tracker"
            disabled={!activeCharacter}
          >
            <GiPoliceBadge />
          </NavButton>
          <NavButton
            id="shopper"
            title="Shopping Cart"
            disabled={!activeCharacter}
          >
            <FaShoppingCart />
          </NavButton>
        </div>
      </Navbar>
    </section>
  );
}

function navTo(route = "/") {
  history.push(route);
}

function Logo() {
  return (
    <div className={styles.logo} onClick={navTo}>
      <img src={logo} alt="Stinkfoot Logo" />
      <h1>Stinkfoot</h1>
    </div>
  );
}

function NavButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const activeRoute = window.location.pathname.substring(1);

  return (
    <>
      <Button
        onClick={navTo.bind(this, "/" + props.id)}
        id={props.id}
        pill
        outline={activeRoute !== props.id}
        disabled={props.disabled}
      >
        {props.children}
      </Button>
      <Tooltip
        placement="bottom"
        target={"#" + props.id}
        open={isOpen}
        toggle={toggleOpen}
      >
        {props.title}
      </Tooltip>
    </>
  );
}
