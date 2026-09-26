import assert from "node:assert/strict";
import { test } from "node:test";
import { transpilePattern, castValue } from "../transpiler";

test("compiles %{IP:client_ip} %{INT:status} and matches 192.168.1.1 200", () => {
  const result = transpilePattern("%{IP:client_ip} %{INT:status}");
  assert.equal(result.success, true, "Transpilation should succeed");
  assert.ok(result.regExp, "RegExp must be compiled");

  const sample = "192.168.1.1 200";
  const match = result.regExp.exec(sample);
  assert.ok(match, "Sample should match");
  assert.ok(match.groups, "Groups should exist");
  assert.equal(match.groups.client_ip, "192.168.1.1");
  assert.equal(match.groups.status, "200");
});

test("handles data type casts: %{INT:status:integer} and %{NUMBER:latency:float}", () => {
  const result = transpilePattern("%{INT:status:integer} %{NUMBER:latency:float}");
  assert.equal(result.success, true);
  assert.equal(result.fieldTypes.status, "integer");
  assert.equal(result.fieldTypes.latency, "float");

  const sample = "404 12.34";
  const match = result.regExp!.exec(sample);
  assert.ok(match);

  const castedStatus = castValue(match.groups?.status, result.fieldTypes.status);
  const castedLatency = castValue(match.groups?.latency, result.fieldTypes.latency);

  assert.equal(castedStatus, 404);
  assert.equal(castedLatency, 12.34);
});

test("recursively resolves nested patterns like IP (IPV4 / IPV6)", () => {
  const result = transpilePattern("%{IP:ip}");
  assert.equal(result.success, true);

  const ipv4Match = result.regExp!.exec("10.0.0.1");
  assert.ok(ipv4Match);
  assert.equal(ipv4Match.groups?.ip, "10.0.0.1");

  const ipv6Match = result.regExp!.exec("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
  assert.ok(ipv6Match);
  assert.equal(ipv6Match.groups?.ip, "2001:0db8:85a3:0000:0000:8a2e:0370:7334");
});

test("supports non-capturing %{PATTERN} without field name", () => {
  const result = transpilePattern("%{WORD} %{INT:num}");
  assert.equal(result.success, true);
  assert.equal(result.fields.length, 1);
  assert.equal(result.fields[0].name, "num");

  const match = result.regExp!.exec("hello 42");
  assert.ok(match);
  assert.equal(match.groups?.num, "42");
});

test("supports native PCRE (?<field>...) interspersed with Grok", () => {
  const result = transpilePattern("(?<verb>[A-Z]+) %{IP:host}");
  assert.equal(result.success, true);
  const match = result.regExp!.exec("GET 127.0.0.1");
  assert.ok(match);
  assert.equal(match.groups?.verb, "GET");
  assert.equal(match.groups?.host, "127.0.0.1");
});

test("returns structured error on unknown pattern", () => {
  const result = transpilePattern("%{NON_EXISTENT_MACRO:foo}");
  assert.equal(result.success, false);
  assert.ok(result.error);
  assert.ok(result.error.message.includes("NON_EXISTENT_MACRO"));
});
