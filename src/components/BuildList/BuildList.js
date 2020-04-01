import React, { useState, useEffect, useContext } from 'react';

import { BuildContext } from 'Providers/Builds.js';
import FilterOptions from './FilterOptions.js';

import styles from './styles.module.scss';

function ListBuild(props) {
  const [filters, setFilters] = useState({
    order: 'asc',
    tags: { length: 0 },
    options: []
  });

  const toggleTag = tag => {
    if (filters.tags[tag]) {
      const newTags = { ...filters.tags };
      delete newTags[tag];
      newTags.length--;
      setFilters({ ...filters, tags: newTags });
    } else {
      setFilters({
        ...filters,
        tags: { ...filters.tags, length: filters.tags.length + 1, [tag]: true }
      });
    }
  };

  const { build } = useContext(BuildContext);

  useEffect(() => {
    const control = {
      name: 'Control',
      color:
        'linear-gradient(0deg, rgba(123,70,2,1) 0%, rgba(252,142,0,1) 50%, rgba(255,202,132,1) 100%)',
      activeColor: 'rgb(123,70,2)'
    };
    const categoryName = {
      defense: {
        name: 'Def',
        color:
          'linear-gradient(0deg, rgba(64,53,89,1) 0%, rgba(123,102,173,1) 50%, rgba(188,176,216,1) 100%)',
        activeColor: 'rgba(64,53,89,1)'
      },
      resistance: {
        name: 'Res',
        color:
          'linear-gradient(0deg, rgba(89,53,69,1) 0%, rgba(173,102,134,1) 50%, rgba(220,184,200,1) 100%)',
        activeColor: 'rgb(89,53,69)'
      },
      slow: {
        name: 'Slow',
        color:
          'linear-gradient(0deg, rgba(17,50,40,1) 0%, rgba(33,97,78,1) 50%, rgba(149,179,170,1) 100%)',
        activeColor: 'rgb(17,50,40)'
      },
      damage: {
        name: 'Dmg',
        color:
          'linear-gradient(0deg, rgba(122,0,0,1) 0%, rgba(252,0,0,1) 50%, rgba(255,132,132,1) 100%)',
        activeColor: 'rgb(122,0,0)'
      },
      healing: {
        name: 'Heal',
        color:
          'linear-gradient(0deg, rgba(0,114,1,1) 0%, rgba(12,225,15,1) 50%, rgba(132,240,134,1) 100%)',
        activeColor: 'rgb(0,114,1)'
      },
      hold: control,
      sleep: control,
      stun: control,
      disorient: control
    };
    const categoryList = new Set();
    for (let setName in build) {
      for (let eName in build[setName]) {
        eName.split('/').forEach(n => {
          const category = categoryName[n.toLowerCase()];
          if (category) {
            categoryList.add(category);
          }
        });
      }
    }

    setFilters({ ...filters, options: [...categoryList].sort() });
    // eslint-disable-next-line
  }, [build]);
  return (
    <div className={styles.BuildList}>
      <FilterOptions filters={filters} toggleTag={toggleTag} />
      <div className={styles.list}>
        {Object.entries(build)
          .sort((a, b) => {
            const countA = Object.keys(a[1]).length;
            const countB = Object.keys(b[1]).length;
            return countA === countB ? 0 : countA > countB ? -1 : 1;
          })
          .map(([setName, enhancements]) => {
            const allEnhancements = [];
            for (let e in enhancements) {
              const count = enhancements[e];
              allEnhancements.push({ name: e, count });
            }
            return (
              <div key={setName} className={styles.set}>
                <h2>{setName}</h2>
                <div className={styles.enhancements}>
                  {allEnhancements.map(({ name, count }) => (
                    <p key={name}>
                      {name}: {count}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ListBuild;
