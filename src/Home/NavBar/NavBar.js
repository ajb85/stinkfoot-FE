import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
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

import logo from "assets/logo.svg";
import styles from "./styles.module.scss";

export default function NavBar(props) {
  const [render, setRender] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const history = useHistory();

  const toggleHidden = () => setHidden(!hidden);
  const updateHistory = (route) => {
    history.push(route);
    setRender(!render);
  };

  const hiddenClass = hidden ? " " + styles.hidden : "";
  return (
    <section className={styles.NavBar + hiddenClass}>
      <img src={logo} alt="Stinkfoot Logo" onClick={toggleHidden} />
      <Dropdown
        direction="left"
        open={dropdown}
        toggle={setDropdown.bind(this, !dropdown)}
      >
        <DropdownToggle theme="success">
          <MdSupervisorAccount />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>+New Character</DropdownItem>
          <DropdownItem>Another action</DropdownItem>
          <DropdownItem>Something else here</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <NavButton
        id="planner"
        title="Character Planner"
        updateHistory={updateHistory}
      >
        <IoMdConstruct />
      </NavButton>
      <NavButton
        id="badger"
        title="Badge Tracker"
        updateHistory={updateHistory}
      >
        <GiPoliceBadge />
      </NavButton>
      <NavButton
        id="shopper"
        title="Shopping Cart"
        updateHistory={updateHistory}
      >
        <FaShoppingCart />
      </NavButton>
    </section>
  );
}

function NavButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const activeRoute = window.location.pathname.substring(1);

  return (
    <>
      <Button
        onClick={props.updateHistory.bind(this, "/" + props.id)}
        id={props.id}
        pill
        outline={activeRoute !== props.id}
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
