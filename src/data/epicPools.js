import { markSet } from "./powersets.js";

import Blaster_Cold_Mastery from "./epics/Blaster_Cold_Mastery.json";
import Blaster_Electrical_Mastery from "./epics/Blaster_Electrical_Mastery.json";
import Blaster_Flame_Mastery from "./epics/Blaster_Flame_Mastery.json";
import Blaster_Force_Mastery from "./epics/Blaster_Force_Mastery.json";
import Blaster_Munitions_Mastery from "./epics/Blaster_Munitions_Mastery.json";
import Blaster_Mastermind_Leviathan_Mastery from "./epics/Blaster_Mastermind_Leviathan_Mastery.json";
import Blaster_Mace_Mastery from "./epics/Blaster_Mace_Mastery.json";
import Blaster_Mu_Mastery from "./epics/Blaster_Mu_Mastery.json";
import Blaster_Mastermind_Soul_Mastery from "./epics/Blaster_Mastermind_Soul_Mastery.json";

import Brute_Energy_Mastery from "./epics/Brute_Energy_Mastery.json";
import Tanker_Energy_Mastery from "./epics/Tanker_Energy_Mastery.json";
import Tanker_Brute_Arctic_Mastery from "./epics/Tanker_Brute_Arctic_Mastery.json";
import Tanker_Brute_Earth_Mastery from "./epics/Tanker_Brute_Earth_Mastery.json";
import Tanker_Brute_Pyre_Mastery from "./epics/Tanker_Brute_Pyre_Mastery.json";
import Tanker_Brute_Leviathan_Mastery from "./epics/Tanker_Brute_Leviathan_Mastery.json";
import Tanker_Brute_Mace_Mastery from "./epics/Tanker_Brute_Mace_Mastery.json";
import Tanker_Brute_Mu_Mastery from "./epics/Tanker_Brute_Mu_Mastery.json";
import Tanker_Brute_Soul_Mastery from "./epics/Tanker_Brute_Soul_Mastery.json";

const epicPools = {
  Blaster: [
    Blaster_Cold_Mastery,
    Blaster_Electrical_Mastery,
    Blaster_Flame_Mastery,
    Blaster_Force_Mastery,
    Blaster_Munitions_Mastery,
    Blaster_Mastermind_Leviathan_Mastery,
    Blaster_Mace_Mastery,
    Blaster_Mu_Mastery,
    Blaster_Mastermind_Soul_Mastery,
  ].map(markSet("Blaster")),
  Brute: [
    Tanker_Brute_Arctic_Mastery,
    Tanker_Brute_Earth_Mastery,
    Brute_Energy_Mastery,
    Tanker_Brute_Pyre_Mastery,
    Tanker_Brute_Leviathan_Mastery,
    Tanker_Brute_Mace_Mastery,
    Tanker_Brute_Mu_Mastery,
    Tanker_Brute_Soul_Mastery,
  ].map(markSet("Brute")),
  Tanker: [
    Tanker_Brute_Arctic_Mastery,
    Tanker_Brute_Earth_Mastery,
    Tanker_Energy_Mastery,
    Tanker_Brute_Pyre_Mastery,
    Tanker_Brute_Leviathan_Mastery,
    Tanker_Brute_Mace_Mastery,
    Tanker_Brute_Mu_Mastery,
    Tanker_Brute_Soul_Mastery,
  ].map(markSet("Tanker")),
};

export default epicPools;
