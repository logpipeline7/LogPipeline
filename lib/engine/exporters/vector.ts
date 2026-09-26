import { ExporterInput } from "./types";

/**
 * Generates Vector Remap Language (VRL) transform script and vector.yaml stanza.
 */
export function generateVectorConfig(input: ExporterInput): string {
  const { compiledRegex, fields } = input;

  // Build type coercions in VRL
  const coercions = fields
    .map((f) => {
      const lower = f.type.toLowerCase();
      if (lower === "integer" || lower === "int") {
        return `    .${f.name} = to_int!(.${f.name})`;
      }
      if (lower === "float" || lower === "number" || lower === "double") {
        return `    .${f.name} = to_float!(.${f.name})`;
      }
      if (lower === "boolean" || lower === "bool") {
        return `    .${f.name} = to_bool!(.${f.name})`;
      }
      return null;
    })
    .filter(Boolean);

  const coercionBlock =
    coercions.length > 0 ? `\n    # Type coercions\n${coercions.join("\n")}\n` : "";

  return `# ==============================================================================
# Vector.dev Remap Language (VRL) Transform
# Use inside a 'remap' transform in vector.yaml
# ==============================================================================
.parsed, err = parse_regex(.message, r'^${compiledRegex}$')

if err == null {
    . = merge(., .parsed)
    del(.parsed)
${coercionBlock}
} else {
    log("LogPipeline parsing warning: " + err, level: "warn")
}

# ==============================================================================
# vector.yaml Pipeline Component
# ==============================================================================
transforms:
  parse_logs:
    type: remap
    inputs: ["source_logs"]
    source: |
      .parsed, err = parse_regex(.message, r'^${compiledRegex}$')
      if err == null {
        . = merge(., .parsed)
        del(.parsed)
      }
`;
}
