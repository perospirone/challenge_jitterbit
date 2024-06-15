const express = require('express');
const { Order, Item } = require('../models');
const router = express.Router();

// Route to add an order
router.post('/', async (req, res) => {
  try {
    let { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // const { idItem, quantidadeItem, valorItem } = items

    const order = await Order.create({ orderId: numeroPedido, value: valorTotal, creationDate: dataCriacao });

    items.map(async (item) => {
      await Item.create({productId: item.idItem, orderId: numeroPedido, quantity: item.quantidadeItem, price: item.valorItem})
    })

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to list all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get an order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update an order by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value, creationDate } = req.body;
    const [updated] = await Order.update({ value, creationDate }, { where: { orderId: id } });
    if (updated) {
      const updatedOrder = await Order.findByPk(id);
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete an order by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.destroy({ where: { orderId: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
