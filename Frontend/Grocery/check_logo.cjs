const fs = require('fs');
const buffer = fs.readFileSync('public/GreenCart_logo.png');
const width = buffer.readInt32BE(16);
const height = buffer.readInt32BE(20);
console.log(`${width}x${height}`);
