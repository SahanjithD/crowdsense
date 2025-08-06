const app = require('express')();
const cors = require('cors');

const PORT = 8080;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(require('express').json());


app.listen(
    PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


