const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');  // Import axios

const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route to get movies data from db.json
app.get('/api/movies', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read db.json' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Route to get trailer data from db2.json
app.get('/api/movies/trailers', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'db2.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read db2.json' });
      return;
    }

    const jsonData = JSON.parse(data);
    // Assuming db2.json contains a "trailers" array at the root
    if (jsonData.trailers) {
      res.json({ trailers: jsonData.trailers });
    } else {
      res.status(404).json({ error: 'No trailers found' });
    }
  });
});

// Route to get upcoming movies from TMDb
app.get('/api/upcomingmovies', async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
      params: {
        api_key: '4e44d9029b1270a757cddc766a1bcb63',
        language: 'en-US'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from TMDb' });
  }
});

// Route to get specific movie details by ID
app.get('/api/upcomingmovies/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: '4e44d9029b1270a757cddc766a1bcb63',
        language: 'en-US'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching movie with ID ${movieId}:`, error.message);
    res.status(404).json({ error: `Movie with ID ${movieId} not found` });
  }
});

// Route to fetch events data from db3.json
app.get('/api/events', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'db3.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db3.json:', err.message);
      res.status(500).json({ error: 'Failed to read events data' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Serve the React app in production
// Uncomment this block when React app is built
/*
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
*/

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
