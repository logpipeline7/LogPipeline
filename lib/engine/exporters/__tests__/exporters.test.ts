import assert from "node:assert/strict";
import { test } from "node:test";
import {
  generateFluentBitConfig,
  generateVectorConfig,
  generateDatadogConfig,
  generateLogstashConfig,
  generateOtelConfig,
  ExporterInput,
} from "../index";

const mockInput: ExporterInput = {
  pattern: "%{IP:client_ip} %{INT:status:integer} %{NUMBER:latency:float}",
  compiledRegex: "(?<client_ip>\\d+\\.\\d+\\.\\d+\\.\\d+) (?<status>\\d+) (?<latency>\\d+\\.\\d+)",
  fields: [
    { name: "client_ip", type: "string" },
    { name: "status", type: "integer" },
    { name: "latency", type: "float" },
    { name: "timestamp", type: "string" },
  ],
};

test("fluentbit exporter generates [PARSER] with types mapping", () => {
  const conf = generateFluentBitConfig(mockInput);
  assert.ok(conf.includes("[PARSER]"), "Must contain [PARSER]");
  assert.ok(conf.includes("Regex       ^"), "Must wrap regex");
  assert.ok(conf.includes("status:integer"), "Must map integer type");
  assert.ok(conf.includes("latency:float"), "Must map float type");
});

test("vector exporter generates valid VRL parse_regex script", () => {
  const vrl = generateVectorConfig(mockInput);
  assert.ok(vrl.includes("parse_regex"), "Must call parse_regex");
  assert.ok(vrl.includes(".status = to_int!(.status)"), "Must coerce integer");
  assert.ok(vrl.includes(".latency = to_float!(.latency)"), "Must coerce float");
});

test("datadog exporter generates pipeline JSON structure", () => {
  const dd = generateDatadogConfig(mockInput);
  assert.ok(dd.includes("rule %{IP:client_ip}"), "Must include match_rules");
  assert.ok(dd.includes('"type": "grok-parser"'), "Must include JSON config");
});

test("logstash exporter generates filter grok block", () => {
  const ls = generateLogstashConfig(mockInput);
  assert.ok(ls.includes("filter {"), "Must include filter block");
  assert.ok(ls.includes('match => { "message" =>'), "Must include grok match");
});

test("otel exporter generates transform and filelog yaml", () => {
  const otel = generateOtelConfig(mockInput);
  assert.ok(otel.includes("regex_parser"), "Must include regex_parser operator");
  assert.ok(otel.includes("transform:"), "Must include transform processor");
});
