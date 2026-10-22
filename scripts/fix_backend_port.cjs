const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'backend', 'src', 'index.js');
let file = fs.readFileSync(indexPath, 'utf8');

file = file.replace(
  'const PORT = process.env.BACKEND_PORT || process.env.PORT || 8000;',
  'const PORT = process.env.PORT || process.env.BACKEND_PORT || 8000;'
);

file = file.replace(
  'app.listen(PORT, () => {',
  "app.listen(PORT, '0.0.0.0', () => {"
);

fs.writeFileSync(indexPath, file, 'utf8');
console.log('Successfully updated backend/src/index.js for Render PORT precedence and 0.0.0.0 binding');
