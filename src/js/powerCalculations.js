import powersets from 'data/powersets.js';
import poolPowers from 'data/poolPowers.js';
import epicPools from 'data/epicPools.js';
import enhancements from 'data/enhancements.js';
import ioSets from 'data/ioSets.js';
import schedules from 'data/enhancements/schedules.json';

export const getPowerStats = (state) => (power) => {
  const { archetypeOrder, powerIndex, poolIndex } = power;
  const { build, tracking, settings } = state;
  const powersetIndex = tracking[archetypeOrder + 'Index'];
  const { archetype } = build;
  const orders = {
    primary: powersets[archetype].primaries,
    secondary: powersets[archetype].secondaries,
    poolPowers: poolPowers,
    epicPool: epicPools,
  };

  const o = orders[archetypeOrder];

  const p =
    poolIndex === undefined
      ? o[powersetIndex].powers[powerIndex]
      : o[poolIndex].powers[powerIndex];

  const stats = [];

  if (p.accuracy) {
    stats.push({
      stat: 'accuracy',
      display: 'Acc',
      value: { sum: decimalize(p.accuracy) },
    });
  }

  const damage = p.effects.find(({ effectType }) => effectType === 'Damage');

  if (damage) {
    stats.push({
      stat: 'damage',
      display: 'Dmg',
      value: damage.values.reduce(
        (acc, { mag, damageType }, i) => {
          const magValue = mag.pvp && settings.pvp ? mag.pvp : mag.pve;
          acc.sum += magValue;
          acc.parts.push({ mag: magValue, damageType });

          if (i === damage.values.length - 1) {
            acc.sum = decimalize(acc.sum);
          }
          return acc;
        },
        { sum: 0, parts: [] }
      ),
    });
  }

  if (p.range) {
    stats.push({
      stat: 'range',
      display: 'Range',
      value: { sum: decimalize(p.range) },
    });
  }

  return stats;
};

function getEnhancementMags(enh) {
  const { tier } = enh;
  const standards = { TO: true, DO: true, SO: true };
  if (standards[tier]) {
    const { imageName } = enh;
    // !! Currently not storing the coded name of the enhancement when adding.
    // Could add it to the .enhancement key inside of enhSlots to save the split
    const enhancement = enhancements.standard[imageName.split('.')[0]];
    const e = enhancement.effects[0];
    return [{ mag: e.mag[tier], stat: e.stat, schedule: schedules[e.stat] }];
  } else if (tier === 'IO') {
    const { imageName } = enh;
    const enhancement = enhancements.standard[imageName.split('.')[0]];
    const e = enhancement.effects[0];
    return [
      { mag: e.mag.IO[enh.level], stat: e.stat, schedule: schedules[e.stat] },
    ];
  } else {
    const { setIndex } = enh;
    // !! Don't love .find here, could store the index of the enhancement
    // When it was originally added to save O(n) operation.  But it's also
    // only O(6) at max so...
    const enhancement = ioSets[tier][setIndex].enhancements.find(
      ({ fullName }) => fullName === enh.FullName
    );

    return enhancement.effects.map((e) => ({
      mag: e.mag.IO.cap,
      stat: e.stat,
      schedules: schedules[e.stat],
    }));
  }
}

function decimalize(num) {
  // Rounds to 2 decimal places & eliminates trailing zeroes
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
