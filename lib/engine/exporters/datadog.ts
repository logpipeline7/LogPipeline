import { ExporterInput } from "./types";

/**
 * Generates Datadog Log Pipeline Grok Parser JSON configuration.
 */
export function generateDatadogConfig(input: ExporterInput): string {
  const { pattern, fields } = input;

  // Datadog Grok match rules do not support type suffixes like :integer or :float
  const datadogPattern = pattern.replace(
    /%\{([A-Za-z0-9_]+):([A-Za-z0-9_-]+):([A-Za-z0-9_]+)\}/g,
    "%{$1:$2}"
  );

  const datadogPayload = {
    type: "grok-parser",
    name: "LogPipeline Grok Parser",
    is_enabled: true,
    source: "message",
    samples: [],
    grok: {
      match_rules: `rule ${datadogPattern}`,
      support_rules: "",
    },
  };

  const jsonRepresentation = JSON.stringify(datadogPayload, null, 2);

  return `# ==============================================================================
# Datadog Log Processing Pipeline Grok Parser
# Navigate to: Logs -> Configuration -> Pipelines -> Add Processor -> Grok Parser
# ==============================================================================

# Match Rule:
rule ${datadogPattern}

# Complete Datadog Pipeline Processor JSON:
${jsonRepresentation}

# Target Fields Created:
# ${fields.map((f) => `${f.name} (${f.type})`).join(", ")}
`;
}
