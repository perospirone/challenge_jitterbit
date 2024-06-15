const express = require('express');
const { Fruit } = require('../models');
const router = express.Router();

// Route to add a fruit
router.post('/', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const fruit = await Fruit.create({ name, quantity });
    res.status(201).json(fruit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to list all fruits
router.get('/', async (req, res) => {
  try {
    const fruits = await Fruit.findAll();
    res.status(200).json(fruits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a fruit by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fruit = await Fruit.findByPk(id);
    if (fruit) {
      res.status(200).json(fruit);
    } else {
      res.status(404).json({ message: 'Fruit not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update a fruit by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity } = req.body;
    const [updated] = await Fruit.update({ name, quantity }, { where: { id } });
    if (updated) {
      const updatedFruit = await Fruit.findByPk(id);
      res.status(200).json(updatedFruit);
    } else {
      res.status(404).json({ message: 'Fruit not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a fruit by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Fruit.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Fruit not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
