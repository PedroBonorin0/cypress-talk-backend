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

app.post('/api/:name/todos', async (req, res) => {
  if(!req.body.name)
    res.send('No name provided').status(400);

  try {
    const todo = await Todo.create(req.body);
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/:name/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/api/:name/todos/:id', async (req, res) => {
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
