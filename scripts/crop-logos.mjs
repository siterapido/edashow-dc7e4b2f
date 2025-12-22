import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const LOGO_DIR = './LOGOS PATROCINADORES';
const OUTPUT_DIR = './LOGOS PATROCINADORES CROP';

async function cropLogos() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    const files = fs.readdirSync(LOGO_DIR).filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f));

    console.log(`Cropping ${files.length} logos and saving to ${OUTPUT_DIR}...\n`);

    for (const file of files) {
        try {
            const filePath = path.join(LOGO_DIR, file);
            const outputPath = path.join(OUTPUT_DIR, file);

            await sharp(filePath)
                .trim()
                .toFile(outputPath);

            console.log(`✓ Cropped: ${file}`);
        } catch (err) {
            console.log(`✗ Error: ${file} - ${err.message}`);
        }
    }

    console.log('\nAll logos processed!');
}

cropLogos();
