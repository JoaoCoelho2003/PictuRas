import {z} from 'zod';
import {zodToJsonSchema} from "zod-to-json-schema";
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

function exportSchema(filterName, paramsSchema) {
    const args = process.argv.slice(2);

    if (args.length === 0) process.exit(1);

    const schemaPath = args[0];

    const fileContent = readFileSync(schemaPath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    jsonData[filterName] = zodToJsonSchema(paramsSchema, filterName);

    writeFileSync(schemaPath, JSON.stringify(jsonData, null, 2), 'utf-8');

    process.exit(0);
}

async function downloadImage(imagePath) {
    console.log(`Downloading image from: ${imagePath}`);
    return readFileSync(imagePath);
}

async function uploadImage(buffer, outputPath) {
    const outputFilePath = path.resolve(outputPath);
    writeFileSync(outputFilePath, buffer);
    console.log(`Uploaded image to: ${outputFilePath}`);
}

export function createFilterHandler(filterName, paramsSchema, imageHandler) {
    if (process.env.EXPORT_SCHEMA === 'true') return exportSchema(filterName, paramsSchema);

    const params = {};
    const imagePath = path.join(fileURLToPath(import.meta.url), "../../sample.jpg");
    const outputPath = "sample-proc.jpg";

    // TODO use env test for running with sample image

    (async () => {
        try {
            const validatedParams = paramsSchema.parse(params);

            const imageBuffer = await downloadImage(imagePath);

            const processedImage = await imageHandler(imageBuffer, validatedParams);

            await uploadImage(processedImage, outputPath);
        } catch (error) {
            console.error('Error in filter handler:', error);
            throw error;
        }
    })()

    setTimeout(() => {
    }, 1000);
}

export {z as schemaValidation};
