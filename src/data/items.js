/**
 * items.js is responsible for manipulating the items collection in the
 * Mongo database. In architecture parlance, it is a Data Access Object.
 * It abstracts away the details of interact with the database.
 */
const Database = require("../lib/database.js");
const logger = require("../lib/logger.js");
const { ObjectID } = require("mongodb");


class Items {
  static async getAll() {
    try {
      const itemsCollection = await getItemsCollection();
      const items_cursor = itemsCollection.find();
      let items = await items_cursor.toArray();
      items.forEach(item => {
        item._id = item._id.toHexString();
      });
      return items;
    } catch (e) {
      logger.error("ItemsAccessObject.getAll", e);
      throw {
        code: 500,
        error: "Internal Server Error",
        caused_by: e
      };
    }
  }

  static async getOne(id) {
    try {
      const itemsCollection = await getItemsCollection();
      let item = await itemsCollection.findOne({ _id: ObjectID(id) });
      if (item !== null) {
        item._id = item._id.toHexString();
      }
      return item;
    } catch (e) {
      logger.error("ItemsAccessObject.getAll", e);
      throw {
        code: 500,
        error: "Internal Server Error",
        caused_by: e
      };
    }
  }

  static async create(itemData) {
    try {
      const itemsCollection = await getItemsCollection();
      const result = await itemsCollection.insertOne(itemData);
      let item = await itemsCollection.findOne({ _id: result.insertedId });
      item._id = item._id.toHexString();
      return item;
    } catch (e) {
      logger.error("ItemsAccessObject.create", e);
      throw {
        code: 500,
        error: "Internal Server Error",
        caused_by: e
      };
    }
  }

  static async update(itemData) {
    try {
      const itemsCollection = await getItemsCollection();
      const result = await itemsCollection.updateOne(
        { _id: ObjectID(itemData._id) },
        {$set: {name: itemData.name}},
        {upsert: false}
      );
      if (result.modifiedCount < 1) {
        return null;
      } else {
        const item = await itemsCollection.findOne(
          {_id: ObjectID(itemData._id)}
        );
        item._id = item._id.toHexString();
        return itemData;
      }
    } catch (e) {
      logger.error("ItemsAccessObject.update", e);
      throw {
        code: 500,
        error: "Internal Server Error",
        caused_by: e
      };
    }
  }

  static async deleteOne(id) {
    try {
      const itemsCollection = await getItemsCollection();
      const result = await itemsCollection.deleteOne(
        { _id: ObjectID(id) }
      );
      return result.deletedCount >= 1;
    } catch (e) {
      logger.error("ItemsAccessObject.update", e);
      throw {
        code: 500,
        error: "Internal Server Error",
        caused_by: e
      };
    }
  }

}

async function getItemsCollection() {
  const database = await Database.get();
  return database.db("items").collection("items");
}

module.exports = Items;
