const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Simple whitelist check: treat addresses ending with an even hex digit as whitelisted (mock logic)
app.get('/check_wallet', (req, res) => {
  const address = req.query.address || '';
  const lastChar = address.trim().slice(-1).toLowerCase();
  const isHex = /^[0-9a-f]$/.test(lastChar);
  const whitelisted = isHex ? parseInt(lastChar, 16) % 2 === 0 : false;
  res.json({ whitelisted });
});

app.listen(port, () => {
  console.log(`Mock backend listening at http://localhost:${port}`);
});
