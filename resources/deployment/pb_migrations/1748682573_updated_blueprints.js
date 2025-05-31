/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("f96llnpqjo2l87m")

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "brxbc8vv",
    "max": 1250000,
    "min": 0,
    "name": "data",
    "pattern": "^(SHAPEZ2)-\\d-.+$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("f96llnpqjo2l87m")

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "brxbc8vv",
    "max": 0,
    "min": 0,
    "name": "data",
    "pattern": "^(SHAPEZ2)-\\d-.+$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
