require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 8080;

const Todo = require('./models/todo.model');

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/todos', async (req, res) => {
  const { name, user } = req.body;

  if(!name || !user)
    res.send('No name or user provided').status(400);

  try {
    const todo = await Todo.create({ name, user });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/todos/:user', async (req, res) => {
  const { user } = req.params;
  try {
    const todos = await Todo.find({ user });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.deleteOne({_id: req.params.id})
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).send(error);
  }
});

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
  console.log('Connected to database!');
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})
.catch(() => {
  console.log('Connection failed!');
});
