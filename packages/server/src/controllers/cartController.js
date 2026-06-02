const Cart = require("../models/Cart");

const cartController = {
  async list(_req, res, next) {
    try {
      const items = await Cart.findAll();
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  },

  async add(req, res, next) {
    try {
      const { menuItemId, quantity } = req.validatedBody;
      const item = await Cart.addOrUpdate(menuItemId, quantity);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { quantity } = req.validatedBody;
      const item = await Cart.updateQuantity(req.params.id, quantity);
      if (!item) {
        return res.status(404).json({ success: false, error: { message: "Cart item not found" } });
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const deleted = await Cart.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: { message: "Cart item not found" } });
      }
      res.json({ success: true, message: "Item removed from cart" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = cartController;
