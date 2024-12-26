import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

const resizeSchema = schemaValidation.object({
    width: schemaValidation.number()
        .min(1),
    height: schemaValidation.number()
        .min(1),
});

async function resizeHandler(imageBuffer, _, params) {
    const { width, height } = params;

    return sharp(imageBuffer)
        .resize(width, height, {
            fit: sharp.fit.fill,
            withoutEnlargement: true,
        })
        .toBuffer();
}

createFilterHandler('resize', resizeSchema, resizeHandler);
