// Import the Express library
const express = require('express');
const cors = require('cors'); // To allow requests from other domains

// Create an instance of the Express application
const app = express();

// Render sets the port via an environment variable, so we use process.env.PORT.
// For local execution, we fall back to 3000.
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// --- Our Emoji "Database" ---
const emojis = [
  // Category: food
  { id: 1, name: "Watermelon", icon: "https://openmoji.org/data/color/svg/1F349.svg", category: "food" },
  { id: 2, name: "Pineapple", icon: "https://openmoji.org/data/color/svg/1F34D.svg", category: "food" },
  { id: 3, name: "Hot Pepper", icon: "https://openmoji.org/data/color/svg/1F336.svg", category: "food" },
  { id: 4, name: "Mushroom", icon: "https://openmoji.org/data/color/svg/1F344.svg", category: "food" },
  { id: 5, name: "French Fries", icon: "https://openmoji.org/data/color/svg/1F35F.svg", category: "food" },
  // Category: smileys
  { id: 6, name: "Grinning Face", icon: "https://openmoji.org/data/color/svg/1F600.svg", category: "smileys" },
  { id: 7, name: "Smiling Face with Heart-Eyes", icon: "https://openmoji.org/data/color/svg/1F60D.svg", category: "smileys" },
  { id: 8, name: "Face with Tears of Joy", icon: "https://openmoji.org/data/color/svg/1F602.svg", category: "smileys" }
];

// --- OUR ENDPOINTS ---

// ENDPOINT: /api/categories
// Returns a list of all unique emoji categories.
app.get('/api/categories', (req, res) => {
  // 1. Map the emojis array to get only the 'category' property from each object.
  // 2. Create a 'Set' from the result, which automatically removes all duplicates.
  // 3. Convert the 'Set' back into an array.
  const categories = [...new Set(emojis.map(emoji => emoji.category))];
  
  console.log('[200] Returning unique categories.');
  res.status(200).json(categories); // e.g., ["food", "smileys"]
});


// ENDPOINT: /api/emojis
// Returns emojis, with an option to filter by category.
app.get('/api/emojis', (req, res) => {
  // Get the value of the 'category' parameter from the URL query string
  // e.g., /api/emojis?category=food -> req.query.category will be "food"
  const { category } = req.query;

  // If the 'category' parameter was provided in the URL...
  if (category) {
    // Filter the emoji list, returning only those whose category matches (case-insensitive)
    const filteredEmojis = emojis.filter(emoji => emoji.category.toLowerCase() === category.toLowerCase());
    
    // If we find emojis for the category, return the filtered list
    if (filteredEmojis.length > 0) {
      console.log(`[200] Returning ${filteredEmojis.length} emojis for category: ${category}`);
      return res.status(200).json(filteredEmojis);
    } else {
      // If no emojis are found for the provided category, return a 404 error
      console.log(`[404] No emojis found for category: ${category}`);
      return res.status(404).json({ message: `No emojis found for category '${category}'` });
    }
  }

  // If NO 'category' parameter was provided, return the full list of emojis
  console.log(`[200] No category specified. Returning all ${emojis.length} emojis.`);
  res.status(200).json(emojis);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});