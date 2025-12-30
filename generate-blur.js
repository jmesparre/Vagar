const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, 'assets', 'mapa.webp');

sharp(imagePath)
    .resize(10) // Resize to very small
    .toBuffer()
    .then(data => {
        const base64 = `data:image/webp;base64,${data.toString('base64')}`;
        fs.writeFileSync('blur_clean.txt', base64);
    })
    .catch(err => console.error(err));
