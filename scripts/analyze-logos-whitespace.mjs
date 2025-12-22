import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const LOGO_DIR = './LOGOS PATROCINADORES';

async function analyzeLogos() {
    const files = fs.readdirSync(LOGO_DIR).filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f));

    console.log(`Analyzing ${files.length} logos...\n`);
    console.log('| File | Original Size | Trimmed Size | Whitespace Reduction |');
    console.log('|------|---------------|--------------|----------------------|');

    for (const file of files) {
        try {
            const filePath = path.join(LOGO_DIR, file);
            const image = sharp(filePath);
            const metadata = await image.metadata();

            // sharp().trim() doesn't return the bounding box directly in a simple way without processing
            // but we can use trim() and check the resulting metadata
            const trimmed = await image.clone().trim().toBuffer({ resolveWithObject: true });
            const trimmedMetadata = await sharp(trimmed.data).metadata();

            const originalArea = metadata.width * metadata.height;
            const trimmedArea = trimmedMetadata.width * trimmedMetadata.height;
            const reduction = ((1 - (trimmedArea / originalArea)) * 100).toFixed(2);

            console.log(`| ${file} | ${metadata.width}x${metadata.height} | ${trimmedMetadata.width}x${trimmedMetadata.height} | ${reduction}% |`);
        } catch (err) {
            console.log(`| ${file} | Error: ${err.message} | - | - |`);
        }
    }
}

analyzeLogos();
