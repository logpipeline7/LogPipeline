/**
 * Standard log macro patterns dictionary.
 * Compatible with Logstash / Grok macro specifications converted to valid JavaScript RegExp.
 */

export interface PatternDefinition {
  name: string;
  pattern: string;
  category: "base" | "network" | "web" | "common" | "time";
  description?: string;
}

export const CORE_PATTERNS: Record<string, PatternDefinition> = {
  // Base primitives
  USERNAME: {
    name: "USERNAME",
    category: "base",
    pattern: `[a-zA-Z0-9._-]+`,
    description: "Alphanumeric username with period, dash, and underscore",
  },
  USER: {
    name: "USER",
    category: "base",
    pattern: `%{USERNAME}`,
    description: "Alias for USERNAME",
  },
  INT: {
    name: "INT",
    category: "base",
    pattern: `(?:[+-]?(?:[0-9]+))`,
    description: "Signed integer",
  },
  POSINT: {
    name: "POSINT",
    category: "base",
    pattern: `\b(?:[1-9][0-9]*)\b`,
    description: "Positive integer greater than zero",
  },
  NONNEGINT: {
    name: "NONNEGINT",
    category: "base",
    pattern: `\b(?:[0-9]+)\b`,
    description: "Non-negative integer (0 and above)",
  },
  BASE10NUM: {
    name: "BASE10NUM",
    category: "base",
    pattern: `(?:[+-]?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+))`,
    description: "Base-10 number including optional decimal and sign",
  },
  NUMBER: {
    name: "NUMBER",
    category: "base",
    pattern: `(?:%{BASE10NUM})`,
    description: "General floating point or integer number",
  },
  WORD: {
    name: "WORD",
    category: "base",
    pattern: `\\b\\w+\\b`,
    description: "Contiguous word characters",
  },
  NOTSPACE: {
    name: "NOTSPACE",
    category: "base",
    pattern: `\\S+`,
    description: "Non-whitespace contiguous sequence",
  },
  SPACE: {
    name: "SPACE",
    category: "base",
    pattern: `\\s*`,
    description: "Zero or more whitespace characters",
  },
  DATA: {
    name: "DATA",
    category: "base",
    pattern: `.*?`,
    description: "Non-greedy arbitrary match",
  },
  GREEDYDATA: {
    name: "GREEDYDATA",
    category: "base",
    pattern: `.*`,
    description: "Greedy match up to the end of line or next delimiter",
  },
  QUOTEDSTRING: {
    name: "QUOTEDSTRING",
    category: "base",
    pattern: `(?:"(?:\\\\.|[^\\\\"])*"|'(?:\\\\.|[^\\\\'])*'|\`(?:\\\\.|[^\\\\\`])*\`)`,
    description: "Double, single, or backtick quoted string with escaped characters",
  },

  // Network
  IPV4: {
    name: "IPV4",
    category: "network",
    pattern: `(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)`,
    description: "Standard IPv4 dotted quad address",
  },
  IPV6: {
    name: "IPV6",
    category: "network",
    pattern: `(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?:(?::[0-9A-Fa-f]{1,4}){1,6})|:(?:(?::[0-9A-Fa-f]{1,4}){1,7}|:)|fe80:(?::[0-9A-Fa-f]{0,4}){0,4}%[0-9a-zA-Z]+|::(?:ffff(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])|(?:[0-9A-Fa-f]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9]))`,
    description: "Standard IPv6 hexadecimal colon notation",
  },
  IP: {
    name: "IP",
    category: "network",
    pattern: `(?:%{IPV6}|%{IPV4})`,
    description: "Either an IPv4 or IPv6 address",
  },
  HOSTNAME: {
    name: "HOSTNAME",
    category: "network",
    pattern: `\\b(?:[0-9A-Za-z][0-9A-Za-z-]{0,62})(?:\\.(?:[0-9A-Za-z][0-9A-Za-z-]{0,62}))*?(?:\\.?|\\b)`,
    description: "Fully qualified domain name or single hostname",
  },
  IPORHOST: {
    name: "IPORHOST",
    category: "network",
    pattern: `(?:%{IP}|%{HOSTNAME})`,
    description: "An IP address or hostname",
  },

  // Web & URI
  URIPROTO: {
    name: "URIPROTO",
    category: "web",
    pattern: `[A-Za-z]+(?:\\+[A-Za-z+]+)?`,
    description: "URI protocol (http, https, ws, etc.)",
  },
  URIHOST: {
    name: "URIHOST",
    category: "web",
    pattern: `%{IPORHOST}(?::[0-9]+)?`,
    description: "Host with optional port",
  },
  URIPATH: {
    name: "URIPATH",
    category: "web",
    pattern: `(?:/[A-Za-z0-9$.+!*'(){},~:;=@#%_\\-]*)+`,
    description: "Path component of a URL",
  },
  URIPARAM: {
    name: "URIPARAM",
    category: "web",
    pattern: `\\?[A-Za-z0-9$.+!*'(){},~#%&/=:;@_~\\[\\]\\-]*`,
    description: "Query string parameters beginning with ?",
  },
  URIPATHPARAM: {
    name: "URIPATHPARAM",
    category: "web",
    pattern: `%{URIPATH}(?:%{URIPARAM})?`,
    description: "Path and optional query parameters",
  },

  // Time & Dates
  MONTH: {
    name: "MONTH",
    category: "time",
    pattern: `\\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\b`,
    description: "Month name abbreviation or full string",
  },
  MONTHNUM: {
    name: "MONTHNUM",
    category: "time",
    pattern: `(?:0?[1-9]|1[0-2])`,
    description: "Month number 1-12",
  },
  MONTHDAY: {
    name: "MONTHDAY",
    category: "time",
    pattern: `(?:(?:0[1-9])|(?:[12][0-9])|(?:3[01])|[1-9])`,
    description: "Day of month 1-31",
  },
  YEAR: {
    name: "YEAR",
    category: "time",
    pattern: `\\b[0-9]{4}\\b`,
    description: "Four digit year",
  },
  HOUR: {
    name: "HOUR",
    category: "time",
    pattern: `(?:2[0123]|[01]?[0-9])`,
    description: "Hour 0-23",
  },
  MINUTE: {
    name: "MINUTE",
    category: "time",
    pattern: `(?:[0-5][0-9])`,
    description: "Minute 0-59",
  },
  SECOND: {
    name: "SECOND",
    category: "time",
    pattern: `(?:(?:[0-5]?[0-9]|60)(?:[:.,][0-9]+)?)`,
    description: "Second with optional decimal fractional seconds",
  },
  TIME: {
    name: "TIME",
    category: "time",
    pattern: `(?:%{HOUR}:%{MINUTE}(?::%{SECOND}))`,
    description: "HH:MM:SS time string",
  },
  ISO8601_TIMEZONE: {
    name: "ISO8601_TIMEZONE",
    category: "time",
    pattern: `(?:Z|[+-]%{HOUR}(?::?%{MINUTE}))`,
    description: "ISO8601 timezone offset (Z or +/-HH:MM)",
  },
  TIMESTAMP_ISO8601: {
    name: "TIMESTAMP_ISO8601",
    category: "time",
    pattern: `%{YEAR}-%{MONTHNUM}-%{MONTHDAY}[T ]%{HOUR}:?%{MINUTE}(?::?%{SECOND})?%{ISO8601_TIMEZONE}?`,
    description: "Standard ISO-8601 / RFC-3339 timestamp",
  },
  HTTPDATE: {
    name: "HTTPDATE",
    category: "time",
    pattern: `%{MONTHDAY}/%{MONTH}/%{YEAR}:%{TIME} %{ISO8601_TIMEZONE}`,
    description: "Standard Apache/Nginx combined log date (e.g. 10/Oct/2000:13:55:36 -0700)",
  },

  // Common Utilities
  LOGLEVEL: {
    name: "LOGLEVEL",
    category: "common",
    pattern: `\\b(?:[tT][rR][aA][cC][eE]|[dD][eE][bB][uU][gG]|[iI][nN][fF][oO]|[nN][oO][tT][iI][cC][eE]|[wW][aA][rR][nN](?:[iI][nN][gG])?|[eE][rR][rR](?:[oO][rR])?|[cC][rR][iI][tT](?:[iI][cC][aA][lL])?|[fF][aA][tT][aA][lL]|[sS][eE][vV][eE][rR][eE]|[eE][mM][eE][rR][gG](?:[eE][nN][cC][yY])?)\\b`,
    description: "Common log levels (DEBUG, INFO, WARN, ERROR, FATAL)",
  },
  UUID: {
    name: "UUID",
    category: "common",
    pattern: `[A-Fa-f0-9]{8}-(?:[A-Fa-f0-9]{4}-){3}[A-Fa-f0-9]{12}`,
    description: "Standard 36-character UUIDv4 / UUIDv1 string",
  },
};
