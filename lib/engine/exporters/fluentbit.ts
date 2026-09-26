import { ExporterInput } from "./types";

/**
 * Generates Fluent Bit [PARSER] and [FILTER] configuration blocks.
 */
export function generateFluentBitConfig(input: ExporterInput): string {
  const { compiledRegex, fields } = input;

  // Detect time field
  const timeField = fields.find((f) =>
    ["timestamp", "time", "@timestamp", "datetime", "date", "req_time"].includes(
      f.name.toLowerCase()
    )
  );

  const timeKey = timeField ? timeField.name : "timestamp";

  // Build Types line for numeric and boolean fields
  const typeMappings = fields
    .map((f) => {
      const lower = f.type.toLowerCase();
      if (lower === "integer" || lower === "int") return `${f.name}:integer`;
      if (lower === "float" || lower === "number" || lower === "double") return `${f.name}:float`;
      if (lower === "boolean" || lower === "bool") return `${f.name}:bool`;
      return null;
    })
    .filter(Boolean);

  const typesLine =
    typeMappings.length > 0 ? `    Types       ${typeMappings.join(" ")}\n` : "";

  return `# ==============================================================================
# Fluent Bit Parser Configuration (parsers.conf)
# ==============================================================================
[PARSER]
    Name        logpipeline_parser
    Format      regex
    Regex       ^${compiledRegex}$
    Time_Key    ${timeKey}
    Time_Format %Y-%m-%dT%H:%M:%S%z
${typesLine}
# ==============================================================================
# Fluent Bit Pipeline Filter (fluent-bit.conf)
# ==============================================================================
[FILTER]
    Name         parser
    Match        *
    Key_Name     log
    Parser       logpipeline_parser
    Reserve_Data On
`;
}
