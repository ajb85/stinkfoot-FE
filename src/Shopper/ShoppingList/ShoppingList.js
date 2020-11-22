import React, { useState, useEffect } from "react";

import useShoppingTotals from "providers/useShoppingTotals.js";
import FilterOptions from "./FilterOptions.js";

import tagCategories from "js/tagCategories.js";
import doesSetMatchKeyword from "js/doesSetMatchKeyword.js";

import styles from "./styles.module.scss";

export default function ShoppingList({ list, lookup }) {
  const [filters, setFilters] = useState({
    order: "asc",
    tags: { length: 0 },
    options: [],
    search: "",
  });

  const { updateCount } = useShoppingTotals();

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

  const toggleSet = (categoryName) => {
    const category = lookup[categoryName];

    for (let eName in category) {
      const { name, need, have } = category[eName];
      const enhComplete = have < need;

      // If category is complete, everything has to be reset
      // If category is incomplete, only update enhancements that
      // are also incomplete
      const shouldUpdate = category.isComplete || !enhComplete;

      shouldUpdate &&
        updateCount(
          categoryName,
          name,
          category.isComplete ? "reset" : "setTo",
          category.isComplete ? undefined : need
        );
    }
  };

  const mapper = mapEnhancement(toggleSet, updateCount);

  const enhancementList = list.reduce((acc, setData) => {
    const { categoryName, enhancements } = setData;
    if (!filters.tags.length) {
      // If there are no tags, then just check my search term
      doesSetMatchKeyword(filters.search, categoryName, enhancements) &&
        acc.push(mapper(setData));
      return acc;
    }

    for (let e in enhancements) {
      const stats = e.split("/");
      for (let i = 0; i < stats.length; i++) {
        const s = stats[i];
        const tagCategory = tagCategories[s.toLowerCase()];
        if (tagCategory && filters.tags[tagCategory.name]) {
          doesSetMatchKeyword(filters.search, categoryName, enhancements) &&
            acc.push(mapper(setData));
          return acc;
        }
      }
    }

    return acc;
  }, []);

  useEffect(() => {
    const categoryList = new Set();
    list.forEach(({ enhancements }) => {
      enhancements.forEach(({ name: eName }) => {
        eName.split("/").forEach((n) => {
          const category = tagCategories[n.toLowerCase()];
          if (category) {
            categoryList.add(category);
          }
        });
      });
    });

    const options = [...categoryList].sort((a, b) =>
      a.name === b.name ? 0 : a.name > b.name ? 1 : -1
    );

    setFilters({ ...filters, options });
    // eslint-disable-next-line
  }, [list]);

  return (
    <div
      className={styles.BuildList}
      style={{ position: "relative", zIndex: enhancementList.length * -2 }}
    >
      <FilterOptions
        filters={filters}
        toggleTag={toggleTag}
        setSearch={setSearch}
      />
      <div
        className={styles.list}
        style={{ position: "relative", zIndex: enhancementList.length * -2 }}
      >
        {enhancementList.length ? (
          enhancementList
        ) : (
          <p style={{ marginTop: "18px" }}>
            {list.length
              ? "Whoops, you don't have any enhancements that match that criteria!"
              : "Add enhancements to you build to begin"}
          </p>
        )}
      </div>
    </div>
  );
}

function mapEnhancement(toggleSet, updateCount) {
  return ({ categoryName, enhancements }, i) => {
    const allEnhancements = [];
    for (let eName in enhancements) {
      const { need, have, powerList } = enhancements[eName];
      allEnhancements.push({ name: eName, need, have, powerList });
    }

    const zIndex = 200 - 2 * i;

    return (
      <div
        style={{ position: "relative", zIndex }}
        key={categoryName}
        className={styles.set}
      >
        <div className={styles.setContainer}>
          <h2 onClick={toggleSet.bind(this, categoryName)}>{categoryName}</h2>
          <div style={{ position: "relative" }}>
            {allEnhancements.map(({ name, have, need, powerList }) => {
              const count = need - have;
              const completed = count <= 0;
              const toggleEnhancement = updateCount.bind(
                this,
                categoryName,
                name,
                completed ? "reset" : "setTo",
                completed ? undefined : need
              );
              return (
                <div key={name} className={styles.enhContainer}>
                  <div className={styles.enhancement}>
                    <p
                      style={{
                        visibility:
                          !completed && need === 1 ? "hidden" : "visible",
                        backgroundColor: completed ? "#279f8f" : "#0a1b3b",
                      }}
                      onClick={updateCount.bind(
                        this,
                        categoryName,
                        name,
                        "decrement"
                      )}
                    >
                      {completed ? <p>ICON</p> : count}
                    </p>
                    <p
                      style={{
                        textDecoration: completed ? "line-through" : null,
                      }}
                      onClick={toggleEnhancement}
                    >
                      {name}
                    </p>
                  </div>
                  <div
                    style={{ zIndex: zIndex - 2 }}
                    className={styles.powerListBG}
                  />
                  <div
                    style={{ zIndex: zIndex - 1 }}
                    className={styles.powerList}
                  >
                    <span>
                      {Object.entries(powerList)
                        .map(
                          ([powerName, { count }]) =>
                            `${powerName}${count > 1 ? ` (${count})` : ""}`
                        )
                        .join(", ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
}
