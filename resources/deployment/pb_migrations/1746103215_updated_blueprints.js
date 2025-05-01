/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f96llnpqjo2l87m")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ixmnqrhd",
    "name": "images",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
      ],
      "thumbs": [
        "300x200",
        "600x400",
        "1200x800"
      ],
      "maxSelect": 4,
      "maxSize": 1048576,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f96llnpqjo2l87m")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ixmnqrhd",
    "name": "images",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [
        "image/jpeg",
        "image/png",
        "image/gif"
      ],
      "thumbs": [
        "300x200",
        "600x400",
        "1200x800"
      ],
      "maxSelect": 8,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
