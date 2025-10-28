import type { BackendModule, ResourceLanguage } from "i18next";
import PouchDB from "pouchdb-browser";

export const db = new PouchDB("translation");

export const pouchBackend: BackendModule = {
  type: "backend",
  init: () => {},
  read: (language, namespace) => {
    return db
      .get<{ mapping: ResourceLanguage }>([language, namespace].join("-"))
      .then((d) => d.mapping);
  },
  save: (language, namespace, data) => {
    return db.put({
      _id: [language, namespace].join("-"),
      mapping: data,
    });
  },
  create: (languages, namespace, key, fallbackValue) => {
    return Promise.all(
      languages.map((l) => {
        db.get<{ mapping: ResourceLanguage }>([l, namespace].join("-")).then(
          (d) => {
            d.mapping[key] = fallbackValue;
            return db.put(d);
          }
        );
      })
    );
  },
};
