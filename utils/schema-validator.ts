import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv';
import { createSchema } from 'genson-js';
import addFormats from 'ajv-formats';

const SCHEMA_BASE_PATH = './response-schemas';
// Setting allErrors to true to get all validation errors instead of just the first one.
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export async function validateSchema(dirName: string, fileName: string, responseBody: object, createSchemaFlag: boolean = false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}.schema.json`);

    //Create schema automatically if createSchemaFlag is set to true
    if (createSchemaFlag) {
        await generateNewSchema(responseBody, schemaPath);
    }

    //Load schema file
    const schema = await loadSchema(schemaPath);
    const validate = ajv.compile(schema);

    //Validate response and throw error with details.
    const valid = validate(responseBody);
    if (!valid) {
        throw new Error(`Schema validation failed for ${fileName}\n` +
            `${JSON.stringify(validate.errors, null, 2)}\n\n` +
            'Actual response: \n' +
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
    //NB: modify this to add additional formats if needed.
    try {
        const generatedSchema = createSchema(responseBody);
        addDateTimeFormats(generatedSchema);
        await fs.mkdir(path.dirname(schemaPath), { recursive: true });
        await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 2), 'utf-8');
    } catch (error) {
        throw new Error(`Failed to create schema file: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function addDateTimeFormats(schema: Record<string, any>) {
    const dateTimeProperties = ['createdAt', 'updatedAt'];

    if (schema.properties) {
        for (const key of dateTimeProperties) {
            if (schema.properties[key] && schema.properties[key].type === 'string') {
                schema.properties[key].format = 'date-time';
            }
        }

        for (const value of Object.values(schema.properties)) {
            if (typeof value === 'object' && value !== null) {
                addDateTimeFormats(value as Record<string, any>);
            }
        }
    }

    if (schema.items && typeof schema.items === 'object') {
        addDateTimeFormats(schema.items as Record<string, any>);
    }
}