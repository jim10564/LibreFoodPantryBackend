const Items = require("../data/items.js");

module.exports = function (app) {
  app.get('/items/:id', async function(request, response) {
    const id = request.params.id;
    const item = await Items.getOne(id);
    if (item !== null) {
      response.status(200).json(item);
    } else {
      response.status(404).json({
        status: 404,
        error: "Item not found",
        message: "ID does not exist"
      })
    }
  });
}
