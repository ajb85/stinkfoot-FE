const control = {
  name: "Control",
  color:
    "linear-gradient(0deg, rgba(123,70,2,1) 0%, rgba(252,142,0,1) 50%, rgba(255,202,132,1) 100%)",
  activeColor: "rgb(123,70,2)",
};

export default {
  defense: {
    name: "Def",
    color:
      "linear-gradient(0deg, rgba(64,53,89,1) 0%, rgba(123,102,173,1) 50%, rgba(188,176,216,1) 100%)",
    activeColor: "rgba(64,53,89,1)",
  },
  resistance: {
    name: "Res",
    color:
      "linear-gradient(0deg, rgba(89,53,69,1) 0%, rgba(173,102,134,1) 50%, rgba(220,184,200,1) 100%)",
    activeColor: "rgb(89,53,69)",
  },
  slow: {
    name: "Slow",
    color:
      "linear-gradient(0deg, rgba(17,50,40,1) 0%, rgba(33,97,78,1) 50%, rgba(149,179,170,1) 100%)",
    activeColor: "rgb(17,50,40)",
  },
  damage: {
    name: "Dmg",
    color:
      "linear-gradient(0deg, rgba(122,0,0,1) 0%, rgba(252,0,0,1) 50%, rgba(255,132,132,1) 100%)",
    activeColor: "rgb(122,0,0)",
  },
  heal: {
    name: "Heal",
    color:
      "linear-gradient(0deg, rgba(0,114,1,1) 0%, rgba(12,225,15,1) 50%, rgba(132,240,134,1) 100%)",
    activeColor: "rgb(0,114,1)",
  },
  hold: control,
  sleep: control,
  stun: control,
  confused: control,
  immobilize: control,
  terrorized: control,
};
