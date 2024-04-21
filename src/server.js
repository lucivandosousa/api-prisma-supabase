const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/products', async (req, res) => {
  const { description, price, quantity } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        description,
        price,
        quantity
      },
    });
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: +id
      }
    });

    if (!product) {
      return res.status(404).send("Produto não localizado")
    };

    await prisma.product.update({
      where: {
        id: +id
      },
      data: {
        ...data
      }
    });
    res.status(200).send("Produto atualizado");
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: +id
      }
    });

    if (!product) {
      return res.status(404).send("Produto não localizado")
    };

    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).send("Produto excluído");
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
