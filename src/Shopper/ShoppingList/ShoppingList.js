import React, { useState, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";

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
    Object.values(category).forEach(({ name, need, have }) => {
      const enhComplete = have >= need;

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
    });
  };

  const mapper = mapEnhancement(toggleSet, updateCount);

  const enhancementList = list.reduce((acc, setData, i) => {
    const { categoryName, enhancements } = setData;
    let matches = !filters.tags.length;

    if (!matches) {
      // Only check for tags if there are tags selected
      for (let i = 0; i < enhancements.length; i++) {
        const stats = enhancements[i].name.split("/");
        for (let i = 0; i < stats.length; i++) {
          const s = stats[i];
          const tagCategory = tagCategories[s.toLowerCase()];
          if (tagCategory && filters.tags[tagCategory.name]) {
            matches = true;
            break;
          }
        }
      }
    }

    if (matches) {
      doesSetMatchKeyword(filters.search, categoryName, enhancements) &&
        acc.push(mapper(setData, i));
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

    setFilters({ ...filters, tags: { length: 0 }, options });
    // eslint-disable-next-line
  }, [list]);

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
    // const zIndex = 200 - 2 * i;
    return (
      <div key={categoryName} className={styles.set}>
        <div className={styles.setContainer}>
          <h2 onClick={toggleSet.bind(this, categoryName)}>{categoryName}</h2>
          <div>
            {enhancements.map(({ name, have, need, powerList }) => {
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
                        "increment"
                      )}
                    >
                      {completed ? <AiOutlineCheck /> : count}
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
                  <div className={styles.powerListBG} />
                  <div className={styles.powerList}>
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
