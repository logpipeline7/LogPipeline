import { ExporterInput } from "./types";

/**
 * Generates standard Logstash pipeline filter configuration block.
 */
export function generateLogstashConfig(input: ExporterInput): string {
  const { pattern, fields } = input;

  const timeField = fields.find((f) =>
    ["timestamp", "time", "@timestamp", "datetime", "date", "req_time"].includes(
      f.name.toLowerCase()
    )
  );

  const timeKey = timeField ? timeField.name : "timestamp";
  const escapedPattern = pattern.replace(/"/g, '\\"');

  return `# ==============================================================================
# Logstash Pipeline Configuration (/etc/logstash/conf.d/logpipeline.conf)
# ==============================================================================
filter {
  grok {
    match => { "message" => "${escapedPattern}" }
    tag_on_failure => [ "_grokparsefailure" ]
  }

  date {
    match => [ "${timeKey}", "ISO8601", "dd/MMM/yyyy:HH:mm:ss Z" ]
    target => "@timestamp"
    remove_field => [ "${timeKey}" ]
  }
}
`;
}
