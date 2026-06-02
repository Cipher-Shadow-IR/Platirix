const Menu = require("../models/Menu");

const menuController = {
  async list(req, res, next) {
    try {
      const { category } = req.query;
      const items = await Menu.findAll({ category });
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await Menu.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, error: { message: "Menu item not found" } });
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const item = await Menu.create(req.validatedBody);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = menuController;
