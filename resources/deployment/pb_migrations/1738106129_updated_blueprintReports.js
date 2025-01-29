/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0z55yujym3tisf7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vqpo4rsg",
    "name": "reason",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "illegal",
        "discriminatory",
        "misinformation",
        "disrespectful",
        "other"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0z55yujym3tisf7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vqpo4rsg",
    "name": "reason",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Illegal",
        "Discriminatory",
        "Misinformation",
        "Disrespectful",
        "Other"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
