const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from QvATPC Demo Node Server!');
});

app.listen(port, 'localhost', () => {
  console.log(`Server running at http://localhost:${port}`);
});