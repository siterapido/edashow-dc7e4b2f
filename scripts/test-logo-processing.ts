
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

async function testProcessing() {
    const logosDir = path.join(process.cwd(), 'LOGOS PATROCINADORES');
    const files = fs.readdirSync(logosDir).filter(f => !f.startsWith('.'));

    console.log(`Analyzing ${files.length} files...`);
    console.log('Filename | Original (WxH) | Processed (WxH) | Reduction %');
    console.log('--- | --- | --- | ---');

    for (const file of files) {
        const filePath = path.join(logosDir, file);
        const ext = path.extname(file).toLowerCase();

        if (file === '31.gif') {
            console.log(`${file} | SKIPPED (GIF) | - | -`);
            continue;
        }

        try {
            const fileBuffer = fs.readFileSync(filePath);
            const image = sharp(fileBuffer);
            const metadata = await image.metadata();

            // Emulate the processing logic
            const threshold = 15; // Trying a threshold
            const processed = await image
                .trim({ threshold: threshold }) // Add threshold to be more aggressive with noise
                .resize({
                    width: 500,
                    height: 300,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .toBuffer();

            const processedMeta = await sharp(processed).metadata();

            const origArea = (metadata.width || 0) * (metadata.height || 0);
            const procArea = (processedMeta.width || 0) * (processedMeta.height || 0);
            const reduction = origArea ? ((origArea - procArea) / origArea * 100).toFixed(1) : '0';

            console.log(`${file} | ${metadata.width}x${metadata.height} | ${processedMeta.width}x${processedMeta.height} | ${reduction}%`);

        } catch (err) {
            console.error(`${file} | ERROR: ${err.message}`);
        }
    }
}

testProcessing().catch(console.error);
