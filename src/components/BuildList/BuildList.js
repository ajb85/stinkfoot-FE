import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BuildContext } from 'Providers/Builds.js';
import FilterOptions from './FilterOptions.js';

import categoryName from 'js/categories.js';
import doesSetMatchKeyword from 'js/doesSetMatchKeyword.js';

import styles from './styles.module.scss';

function ListBuild(props) {
  const [filters, setFilters] = useState({
    order: 'asc',
    tags: { length: 0 },
    options: [],
    search: '',
  });

  const { build, toggleEnhancement, toggleSet, decrementCount } = useContext(
    BuildContext
  );

  const toggleTag = (tag) => {
    if (filters.tags[tag]) {
      const newTags = { ...filters.tags };
      delete newTags[tag];
      newTags.length--;
      setFilters({ ...filters, tags: newTags });
    } else {
      setFilters({
        ...filters,
        tags: { ...filters.tags, length: filters.tags.length + 1, [tag]: true },
      });
    }
  };

  const setSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const enhancementList = Object.entries(build.enhancements)
    .filter(([setName, { enhancements }]) => {
      if (!filters.tags.length) {
        return doesSetMatchKeyword(filters.search, setName, enhancements);
      }
      for (let e in enhancements) {
        const stats = e.split('/');
        for (let i = 0; i < stats.length; i++) {
          const s = stats[i];
          const category = categoryName[s.toLowerCase()];
          if (category && filters.tags[category.name]) {
            return doesSetMatchKeyword(filters.search, setName, enhancements);
          }
        }
      }
      return false;
    })
    .sort((a, b) => {
      const countA = Object.keys(a[1].enhancements).length;
      const countB = Object.keys(b[1].enhancements).length;
      const isACompleted = a[1].completed;
      const isBCompleted = b[1].completed;
      return isACompleted && !isBCompleted
        ? 1
        : !isACompleted && isBCompleted
        ? -1
        : countA === countB
        ? 0
        : countA > countB
        ? -1
        : 1;
    })
    .map(([setName, meta]) => {
      const allEnhancements = [];
      const { enhancements } = meta;
      for (let e in enhancements) {
        const { need, have } = enhancements[e];
        allEnhancements.push({ name: e, need, have });
      }
      return (
        <div key={setName} className={styles.set}>
          <div className={styles.setContainer}>
            <h2 onClick={() => toggleSet(setName)}>{setName}</h2>
            <div>
              {allEnhancements.map(({ name, have, need }) => {
                const count = need - have;
                const completed = count === 0;

                return (
                  <div
                    className={styles.enhancement}
                    key={name}
                    style={{ cursor: 'pointer' }}
                  >
                    <p
                      style={{
                        visibility:
                          !completed && need === 1 ? 'hidden' : 'visible',
                        backgroundColor: completed ? '#279f8f' : '#0a1b3b',
                      }}
                      onClick={() => decrementCount(setName, name)}
                    >
                      {completed ? (
                        <FontAwesomeIcon icon={['fal', 'check']} />
                      ) : (
                        count
                      )}
                    </p>
                    <p
                      style={{
                        textDecoration: completed ? 'line-through' : null,
                      }}
                      onClick={() => toggleEnhancement(setName, name)}
                    >
                      {name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    });

  useEffect(() => {
    const categoryList = new Set();
    for (let setName in build.enhancements) {
      for (let eName in build.enhancements[setName].enhancements) {
        eName.split('/').forEach((n) => {
          const category = categoryName[n.toLowerCase()];
          if (category) {
            categoryList.add(category);
          }
        });
      }
    }

    const options = [...categoryList].sort((a, b) =>
      a.name === b.name ? 0 : a.name > b.name ? 1 : -1
    );

    setFilters({ ...filters, options });
    // eslint-disable-next-line
  }, [build]);

  return (
    <div className={styles.BuildList}>
      <FilterOptions
        filters={filters}
        toggleTag={toggleTag}
        setSearch={setSearch}
      />
      <div className={styles.list}>
        {enhancementList.length ? (
          enhancementList
        ) : (
          <p style={{ marginTop: '18px' }}>
            Whoops, you don't have any enhancements that match that criteria!
          </p>
        )}
      </div>
    </div>
  );
}

export default ListBuild;
