/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "0z55yujym3tisf7",
    "created": "2025-01-15 14:24:18.980Z",
    "updated": "2025-01-15 14:24:18.980Z",
    "name": "blueprintReports",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "90eedagn",
        "name": "blueprint",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "f96llnpqjo2l87m",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
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
      },
      {
        "system": false,
        "id": "q4rbxdug",
        "name": "message",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 256,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "hjqrthua",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "yebqa4mr",
        "name": "resolved",
        "type": "bool",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": "@request.auth.id != \"\"",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("0z55yujym3tisf7");

  return dao.deleteCollection(collection);
})
