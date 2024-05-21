const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blogapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Post model
const Post = mongoose.model('Post', {
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: 'desc' });
    res.render('index.ejs', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/posts/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = new Post({ title, content });
    await post.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
