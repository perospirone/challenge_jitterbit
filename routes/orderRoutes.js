const express = require('express');
const { Order, Item } = require('../models');
const router = express.Router();

// add an order
router.post('/', async (req, res) => {
  try {
    let { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    const order = await Order.create({ orderId: numeroPedido, value: valorTotal, creationDate: dataCriacao });

    let allItems = await Promise.all(items.map(async (item) => {
      return await Item.create({
        productId: item.idItem,
        orderId: numeroPedido,
        quantity: item.quantidadeItem,
        price: item.valorItem
      });
    }));

    let response = {
      orderId: numeroPedido,
      value: valorTotal,
      creationDate: dataCriacao,
      items: allItems
    };

    console.log(response);

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// list all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: Item,
        as: 'items'
      }]
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get an order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{
        model: Item,
        as: 'items'
      }]
    });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update an order by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value, creationDate, items } = req.body;

    const [updated] = await Order.update({ value, creationDate }, { where: { orderId: id } });

    if (updated) {
      const existingItems = await Item.findAll({ where: { orderId: id } });

      const existingItemsMap = new Map(existingItems.map(item => [item.productId, item]));

      for (const item of items) {
        if (existingItemsMap.has(item.idItem)) {
          const [itemUpdated] = await Item.update(
            {
              quantity: item.quantidadeItem,
              price: item.valorItem
            },
            {
              where: {
                orderId: id,
                productId: item.idItem
              }
            }
          );
          console.log(`Updated item: ${item.idItem}, success: ${itemUpdated}`);
        } else {
          const newItem = await Item.create({
            productId: item.idItem,
            orderId: id,
            quantity: item.quantidadeItem,
            price: item.valorItem
          });
          console.log(`Created new item: ${newItem.productId}`);
        }
      }

      const updatedOrderWithItems = await Order.findByPk(id, {
        include: [{
          model: Item,
          as: 'items'
        }]
      });

      res.status(200).json(updatedOrderWithItems);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete an order by ID
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
