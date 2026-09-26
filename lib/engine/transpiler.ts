import { CORE_PATTERNS } from "./patterns";

export type DataType = "string" | "integer" | "float" | "boolean" | "json";

export interface ExtractedFieldMeta {
  name: string;
  macro?: string;
  dataType: DataType;
  rawTypeString?: string;
}

export interface TranspileError {
  message: string;
  column: number;
  length: number;
  macro?: string;
}

export interface TranspileResult {
  success: boolean;
  regexString: string;
  regExp?: RegExp;
  fields: ExtractedFieldMeta[];
  fieldTypes: Record<string, DataType>;
  error?: TranspileError;
}

/**
 * Normalizes user-specified data types to supported DataType enum
 */
export function normalizeDataType(typeStr?: string): DataType {
  if (!typeStr) return "string";
  const lower = typeStr.toLowerCase().trim();
  switch (lower) {
    case "int":
    case "integer":
    case "long":
      return "integer";
    case "float":
    case "double":
    case "number":
      return "float";
    case "bool":
    case "boolean":
      return "boolean";
    case "json":
      return "json";
    default:
      return "string";
  }
}

/**
 * Casts a string value to its parsed type based on DataType
 */
export function castValue(value: string | undefined, dataType: DataType): unknown {
  if (value === undefined || value === null) return null;
  switch (dataType) {
    case "integer": {
      const parsed = parseInt(value, 10);
      return Number.isNaN(parsed) ? value : parsed;
    }
    case "float": {
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) ? value : parsed;
    }
    case "boolean": {
      const lower = value.toLowerCase();
      if (lower === "true" || lower === "1") return true;
      if (lower === "false" || lower === "0") return false;
      return value;
    }
    case "json": {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    case "string":
    default:
      return value;
  }
}

const MAX_RECURSION_DEPTH = 10;

/**
 * Recursively resolves a macro pattern down to pure base regular expression syntax.
 */
export function resolveMacro(
  macroName: string,
  dictionary: Record<string, string>,
  visited: Set<string> = new Set(),
  depth: number = 0
): string {
  if (depth > MAX_RECURSION_DEPTH) {
    throw new Error(
      `Maximum recursion depth (${MAX_RECURSION_DEPTH}) exceeded resolving %{${macroName}}`
    );
  }

  if (visited.has(macroName)) {
    throw new Error(
      `Circular macro reference detected: ${Array.from(visited).join(" -> ")} -> ${macroName}`
    );
  }

  const raw = dictionary[macroName];
  if (!raw) {
    throw new Error(`Unknown pattern macro: %{${macroName}}`);
  }

  visited.add(macroName);

  // Substitute any nested %{SUBMACRO} references inside definition
  const nestedPatternRegex = /%\{([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?(?::([A-Za-z0-9_]+))?\}/g;
  const resolved = raw.replace(nestedPatternRegex, (_match, subMacro) => {
    const subResolved = resolveMacro(subMacro, dictionary, new Set(visited), depth + 1);
    return `(?:${subResolved})`;
  });

  visited.delete(macroName);
  return resolved;
}

/**
 * Transpiles a Grok/Logstash expression into standard JavaScript RegExp with named capture groups.
 */
export function transpilePattern(
  expression: string,
  customPatterns?: Record<string, string>
): TranspileResult {
  if (!expression || expression.trim().length === 0) {
    return {
      success: true,
      regexString: "",
      fields: [],
      fieldTypes: {},
    };
  }

  // Combine standard core patterns with optional custom patterns
  const dictionary: Record<string, string> = {};
  for (const [key, def] of Object.entries(CORE_PATTERNS)) {
    dictionary[key] = def.pattern;
  }
  if (customPatterns) {
    for (const [key, val] of Object.entries(customPatterns)) {
      dictionary[key] = val;
    }
  }

  const fields: ExtractedFieldMeta[] = [];
  const fieldTypes: Record<string, DataType> = {};
  const seenGroupNames = new Set<string>();

  // Token scanner for %{PATTERN:field:type} or %{PATTERN:field} or %{PATTERN}
  const grokTokenRegex = /%\{([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?(?::([A-Za-z0-9_]+))?\}/g;

  let lastIndex = 0;
  let transpiled = "";
  let match: RegExpExecArray | null;

  try {
    // Validate matching braces first
    let openBraceIndex = -1;
    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === "%" && expression[i + 1] === "{") {
        if (openBraceIndex !== -1) {
          return {
            success: false,
            regexString: "",
            fields: [],
            fieldTypes: {},
            error: {
              message: "Nested or unclosed '%{' tag encountered",
              column: openBraceIndex,
              length: 2,
            },
          };
        }
        openBraceIndex = i;
        i++;
      } else if (expression[i] === "}" && openBraceIndex !== -1) {
        openBraceIndex = -1;
      }
    }

    if (openBraceIndex !== -1) {
      return {
        success: false,
        regexString: "",
        fields: [],
        fieldTypes: {},
        error: {
          message: "Unclosed '%{' pattern macro. Missing closing '}'",
          column: openBraceIndex,
          length: expression.length - openBraceIndex,
        },
      };
    }

    // Main replacement loop
    while ((match = grokTokenRegex.exec(expression)) !== null) {
      const matchStart = match.index;
      const matchLength = match[0].length;
      const macroName = match[1];
      const rawFieldName = match[2];
      const fieldName = rawFieldName
        ? (/^[0-9]/.test(rawFieldName) ? `_${rawFieldName}` : rawFieldName).replace(/[^a-zA-Z0-9_$]/g, "_")
        : undefined;
      const typeStr = match[3];

      // Append text preceding the token
      transpiled += expression.slice(lastIndex, matchStart);
      lastIndex = matchStart + matchLength;

      // Check if macro exists in dictionary
      if (!dictionary[macroName]) {
        return {
          success: false,
          regexString: "",
          fields: [],
          fieldTypes: {},
          error: {
            message: `Unknown pattern macro '%{${macroName}}'`,
            column: matchStart,
            length: matchLength,
            macro: macroName,
          },
        };
      }

      // Check for duplicate group names in the same expression
      if (fieldName) {
        if (seenGroupNames.has(fieldName)) {
          return {
            success: false,
            regexString: "",
            fields: [],
            fieldTypes: {},
            error: {
              message: `Duplicate capture group name: '${fieldName}'`,
              column: matchStart,
              length: matchLength,
            },
          };
        }
        seenGroupNames.add(fieldName);
      }

      // Recursively expand the macro
      let baseRegex: string;
      try {
        baseRegex = resolveMacro(macroName, dictionary);
      } catch (err: unknown) {
        return {
          success: false,
          regexString: "",
          fields: [],
          fieldTypes: {},
          error: {
            message: err instanceof Error ? err.message : String(err),
            column: matchStart,
            length: matchLength,
            macro: macroName,
          },
        };
      }

      const dataType = normalizeDataType(typeStr);

      if (fieldName) {
        transpiled += `(?<${fieldName}>${baseRegex})`;
        fields.push({
          name: fieldName,
          macro: macroName,
          dataType,
          rawTypeString: typeStr,
        });
        fieldTypes[fieldName] = dataType;
      } else {
        transpiled += `(?:${baseRegex})`;
      }
    }

    // Append remaining characters
    transpiled += expression.slice(lastIndex);

    // Also detect any native named groups: (?<group_name>...)
    const nativeNamedGroupRegex = /\(\?<([a-zA-Z0-9_]+)>/g;
    let nativeMatch: RegExpExecArray | null;
    while ((nativeMatch = nativeNamedGroupRegex.exec(transpiled)) !== null) {
      const nativeName = nativeMatch[1];
      if (!fieldTypes[nativeName]) {
        fields.push({
          name: nativeName,
          dataType: "string",
        });
        fieldTypes[nativeName] = "string";
      }
    }

    // Attempt compilation with 'd' (hasIndices) flag
    const regExp = new RegExp(transpiled, "d");

    return {
      success: true,
      regexString: transpiled,
      regExp,
      fields,
      fieldTypes,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid regular expression syntax";
    return {
      success: false,
      regexString: transpiled,
      fields,
      fieldTypes,
      error: {
        message,
        column: 0,
        length: expression.length,
      },
    };
  }
}
