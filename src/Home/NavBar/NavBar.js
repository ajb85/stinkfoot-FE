import React, { useState } from "react";
import history from "history.js";
import {
  Navbar,
  Button,
  Tooltip,
  Nav,
  NavItem,
  NavLink,
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
  // const history = useHistory();
  const [dropdown, setDropdown] = useState(false);
  const { activeCharacter } = useCharacters();

  return (
    <section className={styles.NavBar}>
      <Navbar>
        <Logo />
        <div>
          <Dropdown
            direction="bottom"
            open={dropdown}
            toggle={setDropdown.bind(this, !dropdown)}
          >
            <DropdownToggle theme="success">
              {activeCharacter && activeCharacter.name
                ? activeCharacter.name
                : "+New Character"}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={props.openNewCharacterModal}>
                +New Character
              </DropdownItem>
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

function returnHome() {
  history.push("/");
}

function Logo() {
  return (
    <div className={styles.logo} onClick={returnHome}>
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
        // onClick={props.updateHistory.bind(this, "/" + props.id)}
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
