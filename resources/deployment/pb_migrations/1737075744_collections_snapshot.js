/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const snapshot = [
    {
      "id": "_pb_users_auth_",
      "created": "2024-02-23 20:57:09.484Z",
      "updated": "2024-08-16 22:24:16.132Z",
      "name": "users",
      "type": "auth",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "users_name",
          "name": "displayname",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "users_avatar",
          "name": "avatar",
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
            "thumbs": null,
            "maxSelect": 1,
            "maxSize": 5242880,
            "protected": false
          }
        },
        {
          "system": false,
          "id": "e97xfrkq",
          "name": "blueprints",
          "type": "relation",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "f96llnpqjo2l87m",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": null,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "nzouwkjv",
          "name": "bookmarks",
          "type": "relation",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "f96llnpqjo2l87m",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": null,
            "displayFields": null
          }
        }
      ],
      "indexes": [
        "CREATE UNIQUE INDEX `idx_aez81VK` ON `users` (`displayname`)"
      ],
      "listRule": "",
      "viewRule": "",
      "createRule": "",
      "updateRule": "id = @request.auth.id",
      "deleteRule": "id = @request.auth.id",
      "options": {
        "allowEmailAuth": false,
        "allowOAuth2Auth": true,
        "allowUsernameAuth": true,
        "exceptEmailDomains": null,
        "manageRule": null,
        "minPasswordLength": 8,
        "onlyEmailDomains": null,
        "onlyVerified": false,
        "requireEmail": false
      }
    },
    {
      "id": "zd5u2s0odf28ljg",
      "created": "2024-02-23 20:59:28.279Z",
      "updated": "2024-08-16 22:24:16.132Z",
      "name": "tags",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "dbnp31ia",
          "name": "name",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": 3,
            "max": 24,
            "pattern": "^[\\w-]+$"
          }
        },
        {
          "system": false,
          "id": "ycgtlyrp",
          "name": "creator",
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
        }
      ],
      "indexes": [
        "CREATE UNIQUE INDEX `idx_IcpzmJs` ON `tags` (`name`)"
      ],
      "listRule": "",
      "viewRule": "",
      "createRule": "@request.auth.id != \"\"",
      "updateRule": "",
      "deleteRule": "",
      "options": {}
    },
    {
      "id": "f96llnpqjo2l87m",
      "created": "2024-02-23 20:59:28.280Z",
      "updated": "2024-08-22 18:57:33.725Z",
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
    },
    {
      "id": "0z55yujym3tisf7",
      "created": "2024-04-21 17:59:27.742Z",
      "updated": "2024-08-16 22:24:16.132Z",
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
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
