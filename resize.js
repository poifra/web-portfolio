const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = `./public/images`;
const thumbDir = `${dir}/thumbs`;

if (!fs.existsSync(thumbDir)) 
    fs.mkdirSync(thumbDir, { recursive: true });

fs.readdirSync(dir).forEach(file => {
    if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
        sharp(`${dir}/${file}`)
            .resize(800,800,{ fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(`${thumbDir}/${file.replace(/\.[^.]+$/, '.webp')}`)
            .then(() => console.log(`Resized: ${file}`))
            .catch(err => console.error(err));
    }
});