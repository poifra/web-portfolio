const sharp = require('sharp');
const exifReader = require('exif-reader');
const fs = require('fs');
const path = require('path');

const JSON_PATH = './public/assets/photos.json';
const IMG_DIR = './public/images';
const THUMB_DIR = './public/images/thumbs';

async function run() {
    // 1. Load existing JSON data
    let data = { photos: [] };
    if (fs.existsSync(JSON_PATH)) {
        data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    }

    const files = fs.readdirSync(IMG_DIR).filter(f => f.match(/\.(jpg|jpeg|png)$/i));

    for (const file of files) {
        const inputPath = path.join(IMG_DIR, file);
        const thumbPath = path.join(THUMB_DIR, file.replace(/\.[^.]+$/, '.webp'));

        console.log(`Processing ${file}...`);
        
        let exifData = {};
        const metadata = await sharp(inputPath).metadata();
		if (metadata.exif) {
        const parsed = exifReader(metadata.exif);
        exifData = {
            model: parsed.Image.Make+" "+parsed.Image.Model,
            lens: parsed.Photo.LensModel,
            fstop: `f/${parsed.Photo.FNumber}`,
            shutter: `1/${Math.round(1/parsed.Photo.ExposureTime)}s`,
            iso: parsed.Photo.ISOSpeedRatings,
            focal: `${parsed.Photo.FocalLength}mm`
        };

        // 3. Create Thumbnail (Strictly strips GPS because we don't use .withMetadata())
        if (!fs.existsSync(THUMB_DIR)) 
            fs.mkdirSync(THUMB_DIR, { recursive: true });
        await sharp(inputPath)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(thumbPath);

        // 4. Update JSON Object
        // Find existing entry by filename
        let photoEntry = data.photos.find(p => p.src === file);
        if (photoEntry) 
            photoEntry.exif = exifData;
        
    }

    // 5. Save updated JSON
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
    console.log("Optimization complete. photos.json updated.");
    }
}
run();
