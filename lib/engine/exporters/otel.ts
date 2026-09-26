import { ExporterInput } from "./types";

/**
 * Generates OpenTelemetry Collector configuration using transform processor & filelog receiver.
 */
export function generateOtelConfig(input: ExporterInput): string {
  const { compiledRegex, fields } = input;

  const timeField = fields.find((f) =>
    ["timestamp", "time", "@timestamp", "datetime", "date", "req_time"].includes(
      f.name.toLowerCase()
    )
  );

  const timeKey = timeField ? timeField.name : "timestamp";

  const singleQuoteRegex = compiledRegex.replace(/'/g, "''");
  const doubleQuoteRegex = compiledRegex.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  return `# ==============================================================================
# OpenTelemetry Collector Configuration (otel-collector-config.yaml)
# Option 1: Filelog Receiver with regex_parser Operator
# ==============================================================================
receivers:
  filelog:
    include: [ /var/log/**/*.log ]
    start_at: beginning
    operators:
      - type: regex_parser
        id: logpipeline_regex_parser
        regex: '^${singleQuoteRegex}$'
        timestamp:
          parse_from: attributes.${timeKey}
          layout: '%Y-%m-%dT%H:%M:%S%z'

# ==============================================================================
# Option 2: Transform Processor (OTel Transformation Language - OTTL)
# ==============================================================================
processors:
  transform:
    error_mode: ignore
    log_statements:
      - context: log
        statements:
          - merge_maps(attributes, extract_patterns(body, "^${doubleQuoteRegex}$"), "insert")

service:
  pipelines:
    logs:
      receivers: [filelog]
      processors: [transform]
      exporters: [otlp]
`;
}
