const express = require('express');
const { Item } = require('../models');
const router = express.Router();

// Route to add an item
router.post('/', async (req, res) => {
  try {
    const { productId, orderId, quantity, price } = req.body;
    const item = await Item.create({ productId, orderId, quantity, price });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to list all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get an item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update an item by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { orderId, quantity, price } = req.body;
    const [updated] = await Item.update({ orderId, quantity, price }, { where: { productId: id } });
    if (updated) {
      const updatedItem = await Item.findByPk(id);
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete an item by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Item.destroy({ where: { productId: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
