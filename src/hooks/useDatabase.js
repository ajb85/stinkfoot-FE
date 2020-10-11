import React, { useState, useEffect, createContext, useContext } from "react";

const DBContext = createContext();

export function DatabaseProvider(props) {
  const [db, setDB] = useState(null);

  useEffect(() => {
    const idb = window.indexedDB;

    if (!idb) {
      alert(
        "Your browser is too outdated to use this service.  Please consider updating or switching to a modern browser, like Chrome or Firefox."
      );
      return;
    }

    const cp = idb.open("characterPlanner");

    cp.onerror = function (e) {
      console.log("Failed to open DB: ", e);
    };

    cp.onsuccess = function (e) {
      setDB(cp.result);
    };
  }, []);

  useEffect(() => {
    if (db && !db.objectStoreNames.length) {
      // populate DB
    }
  }, [db]);

  const { Provider } = DBContext;

  return <Provider value={db}>{props.children}</Provider>;
}

export default function useDB() {
  return useContext(DBContext);
}
