import type { JsonObject, JsonSchema, JsonValue } from './ingest-documents.request';

type PrimitiveSchemaType = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string';

type JsonSchemaObject = {
  type?: PrimitiveSchemaType | PrimitiveSchemaType[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  additionalProperties?: JsonSchema;
  enum?: JsonValue[];
  const?: JsonValue;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
};

function isRecord(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepEqual(left: JsonValue, right: JsonValue): boolean {
  if (left === right) return true;

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false;
    for (let index = 0; index < left.length; index += 1) {
      if (!deepEqual(left[index], right[index])) return false;
    }
    return true;
  }

  if (isRecord(left) && isRecord(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) return false;

    for (const key of leftKeys) {
      if (!(key in right)) return false;
      if (!deepEqual(left[key], right[key])) return false;
    }

    return true;
  }

  return false;
}

function normalizeTypes(value: PrimitiveSchemaType | PrimitiveSchemaType[] | undefined): PrimitiveSchemaType[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function matchesType(value: JsonValue, type: PrimitiveSchemaType): boolean {
  switch (type) {
    case 'array':
      return Array.isArray(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value);
    case 'null':
      return value === null;
    case 'number':
      return typeof value === 'number';
    case 'object':
      return isRecord(value);
    case 'string':
      return typeof value === 'string';
    default:
      return false;
  }
}

function formatPath(parentPath: string, key: string | number): string {
  if (typeof key === 'number') return `${parentPath}[${key}]`;
  return parentPath === '$' ? `$.${key}` : `${parentPath}.${key}`;
}

function validateSchema(schema: JsonSchema, value: JsonValue, path: string): string | null {
  if (typeof schema === 'boolean') {
    return schema ? null : `${path}: value is not allowed`;
  }

  const schemaObject = schema as JsonSchemaObject;
  const expectedTypes = normalizeTypes(schemaObject.type);

  if (expectedTypes.length > 0) {
    const matchesExpectedType = expectedTypes.some((type) => matchesType(value, type));
    if (!matchesExpectedType) {
      return `${path}: expected type ${expectedTypes.join(' | ')}`;
    }
  }

  if (schemaObject.enum) {
    const inEnum = schemaObject.enum.some((candidate) => deepEqual(value, candidate));
    if (!inEnum) {
      return `${path}: value is not in enum`;
    }
  }

  if (schemaObject.const !== undefined && !deepEqual(value, schemaObject.const)) {
    return `${path}: value does not match const`;
  }

  if (typeof value === 'string') {
    if (schemaObject.minLength !== undefined && value.length < schemaObject.minLength) {
      return `${path}: string is shorter than minLength ${schemaObject.minLength}`;
    }
    if (schemaObject.maxLength !== undefined && value.length > schemaObject.maxLength) {
      return `${path}: string exceeds maxLength ${schemaObject.maxLength}`;
    }
  }

  if (typeof value === 'number') {
    if (schemaObject.minimum !== undefined && value < schemaObject.minimum) {
      return `${path}: number is below minimum ${schemaObject.minimum}`;
    }
    if (schemaObject.maximum !== undefined && value > schemaObject.maximum) {
      return `${path}: number exceeds maximum ${schemaObject.maximum}`;
    }
  }

  if (Array.isArray(value)) {
    if (schemaObject.minItems !== undefined && value.length < schemaObject.minItems) {
      return `${path}: array has fewer than minItems ${schemaObject.minItems}`;
    }
    if (schemaObject.maxItems !== undefined && value.length > schemaObject.maxItems) {
      return `${path}: array exceeds maxItems ${schemaObject.maxItems}`;
    }

    if (schemaObject.items !== undefined) {
      for (let index = 0; index < value.length; index += 1) {
        const error = validateSchema(schemaObject.items, value[index], formatPath(path, index));
        if (error) return error;
      }
    }
  }

  if (isRecord(value)) {
    const properties = schemaObject.properties ?? {};
    const required = schemaObject.required ?? [];

    for (const requiredKey of required) {
      if (!(requiredKey in value)) {
        return `${formatPath(path, requiredKey)}: is required`;
      }
    }

    for (const [propertyName, propertySchema] of Object.entries(properties)) {
      if (propertyName in value) {
        const error = validateSchema(
          propertySchema,
          value[propertyName],
          formatPath(path, propertyName)
        );

        if (error) return error;
      }
    }

    const additionalProperties = schemaObject.additionalProperties;
    if (additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) {
          return `${formatPath(path, key)}: additional property is not allowed`;
        }
      }
    } else if (additionalProperties && typeof additionalProperties !== 'boolean') {
      for (const [key, propertyValue] of Object.entries(value)) {
        if (!(key in properties)) {
          const error = validateSchema(
            additionalProperties,
            propertyValue,
            formatPath(path, key)
          );
          if (error) return error;
        }
      }
    }
  }

  return null;
}

export function validateMetadataAgainstSchema(metadata: JsonObject, schema: JsonSchema): string | null {
  return validateSchema(schema, metadata, '$');
}
