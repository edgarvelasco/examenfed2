const express = require('express');
const firebase = require('firebase');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const firebaseCredentials = require('../firebaseCredentials');
const database = firebase.initializeApp(firebaseCredentials).database();

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.get('/posts', async (req, res) => {
  const snapshot = await database.ref('publicaciones').once('value');
  const posts = await snapshot.val();

  return res.send({ posts });
});

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;

  const snapshot = await database.ref(`publicaciones/${id}`).once('value');
  const post = await snapshot.val();

  res.send({ post });
});



app.post('/posts', async (req, res) => {
  const { title, content, author,url } = req.body;

  await database.ref('publicaciones').push({
    autor: author,
    titulo: title,
    contenido: content,
    url: url,
  });

  res.send({ message: 'Post created.' });
});





app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, author, url } = req.body;

  await database.ref('publicaciones').child(id).update({
    autor: author,
    titulo: title,
    contenido: content,
    url: url,
  });

  res.send({ message: 'Post updated.' });
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  await database.ref('publicaciones').child(id).remove();

  res.send({ message: 'Post deleted.' });
});

app.listen(8080, () => console.log(`🚀 app running at: http://localhost:8080`));
