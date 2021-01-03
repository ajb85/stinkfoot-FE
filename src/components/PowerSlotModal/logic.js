export function getTopOptions(enhNavigation, updateNav, power) {
  return [
    {
      content: "Standard",
      styles: {
        color: enhNavigation.section === "standard" ? "red" : null,
      },
      onClick: updateNav.bind(this, { section: "standard", tier: "IO" }),
    },
    {
      content: "Sets",
      styles: { color: enhNavigation.section === "sets" ? "red" : null },
      onClick: updateNav.bind(this, {
        section: "sets",
        tier: "IO",
        setType: power.setTypes[0],
      }),
    },
  ];
}

export function getSideOptions(enhNavigation, updateNav, subsections) {
  const { section } = enhNavigation;
  const isSet = section === "sets";
  // console.log("SIDE OPTIONS: ", isSet, enhNavigation, updateNav, subsections);
  return subsections.map((category) => {
    const name = isSet ? category.name : category;
    const setType = isSet ? category.setType : name;
    const isActive = isSet
      ? setType === enhNavigation.setType
      : name === enhNavigation.tier;
    return {
      content: name,
      onClick: updateNav.bind(this, { setType }),
      style: {
        color: isActive ? "red" : "white",
        cursor: "pointer",
      },
    };
  });
}
