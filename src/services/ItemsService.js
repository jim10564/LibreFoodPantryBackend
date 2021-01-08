/* eslint-disable no-unused-vars */
const logger = require("../logger");
const { MongoClient } = require("mongodb");
const config = require("../config");
const Service = require('./Service');

/**
*
* returns inline_response_200
* */
const listItems = () => new Promise(
  async (resolve, reject) => {
    try {
      const mongoClient = new MongoClient(config.MONGO_URI, { useUnifiedTopology: true });
      await mongoClient.connect();
      const items_cursor = await mongoClient.db("items").collection("items").find();
      const items = await items_cursor.toArray();
      for (item of items) {
        item._id = item._id.toHexString();
      }
      resolve(Service.successResponse({ items }));
    } catch (e) {
      logger.error(e);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  listItems,
};
