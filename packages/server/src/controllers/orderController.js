const Order = require("../models/Order");

const orderController = {
  async list(_req, res, next) {
    try {
      const orders = await Order.findAll();
      res.json({ success: true, data: orders });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, error: { message: "Order not found" } });
      }
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  async create(_req, res, next) {
    try {
      const order = await Order.createFromCart();
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const order = await Order.updateStatus(req.params.id, req.validatedBody.status);
      if (!order) {
        return res.status(404).json({ success: false, error: { message: "Order not found" } });
      }
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = orderController;
