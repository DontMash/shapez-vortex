/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "f96llnpqjo2l87m",
    "created": "2025-01-15 14:24:18.982Z",
    "updated": "2025-01-15 14:24:18.982Z",
    "name": "blueprints",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "8j4ijwrf",
        "name": "title",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 3,
          "max": 64,
          "pattern": "^[A-Za-z0-9-_\\s]+$"
        }
      },
      {
        "system": false,
        "id": "brxbc8vv",
        "name": "data",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": "^(SHAPEZ2)-\\d-.+$"
        }
      },
      {
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
      },
      {
        "system": false,
        "id": "c4r0jraj",
        "name": "tags",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "zd5u2s0odf28ljg",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 8,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "n0m9mxft",
        "name": "description",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "3s8manv8",
        "name": "type",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Island",
            "Building"
          ]
        }
      },
      {
        "system": false,
        "id": "jzwla8zo",
        "name": "cost",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "1gbjpf44",
        "name": "buildings",
        "type": "json",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "yapfnl4q",
        "name": "buildingCount",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "tfd1rzny",
        "name": "islandCount",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "rer3t3cl",
        "name": "creator",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "bfxqahes",
        "name": "viewCount",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "sjp1zgqk",
        "name": "downloadCount",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "47oawv1n",
        "name": "bookmarkCount",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "4jqgzorl",
        "name": "version",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.id = @request.data.creator.id",
    "updateRule": "@request.auth.id = creator.id",
    "deleteRule": "@request.auth.id = creator.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("f96llnpqjo2l87m");

  return dao.deleteCollection(collection);
})
