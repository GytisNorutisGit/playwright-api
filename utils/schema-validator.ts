import fs from 'fs/promises';
import path from 'path'
import Ajv from 'ajv';
import { createSchema } from 'genson-js'

const SCHEMA_BASE_PATH = './response-schemas';
// Setting allErrors to true to get all validation errors instead of just the first one.
const ajv = new Ajv({ allErrors: true });

export async function validateSchema(dirName: string, fileName: string, responseBody: object, createSchemaFlag: boolean = false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`);

    //Create schema automatically if createSchemaFlag is set to true
    if (createSchemaFlag) {
        await generateNewSchema(responseBody, schemaPath);
    }

    //Load schema file
    const schema = await loadSchema(schemaPath);
    const validate = ajv.compile(schema);

    //Validate response and throw error with details
    const valid = validate(responseBody);
    if (!valid) {
        throw new Error(`Schema validation failed for ${fileName}\n` +
            `${JSON.stringify(validate.errors, null, 2)}\n\n` +
            `Actual response: \n` +
            `${JSON.stringify(responseBody, null, 2)}`
        );
    }
}

async function loadSchema(schemaPath: string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        return JSON.parse(schemaContent);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read schema file: ${message}`);
    }
}

async function generateNewSchema(responseBody: object, schemaPath: string) {
    //Generate schema automatically using genson-js and save to specified path.
    try {
        const generatedSchema = createSchema(responseBody);
        await fs.mkdir(path.dirname(schemaPath), { recursive: true });
        await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 2), 'utf-8');
    } catch (error) {
        throw new Error(`Failed to create schema file: ${error instanceof Error ? error.message : String(error)}`);
    }
}