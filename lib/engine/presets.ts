export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  pattern: string;
  rawLogs: string;
}

export const LOG_PRESETS: PresetTemplate[] = [
  {
    id: "nginx-combined",
    name: "Nginx Combined Log",
    description: "Standard combined access log format for Nginx and Apache web servers",
    pattern: `%{IPORHOST:client_ip} - %{USER:auth} \\[%{HTTPDATE:timestamp}\\] "%{WORD:method} %{NOTSPACE:request} HTTP/%{NUMBER:http_version}" %{INT:status:integer} %{NUMBER:bytes:integer} "%{DATA:referrer}" "%{DATA:user_agent}"`,
    rawLogs: `192.168.1.100 - frank [10/Oct/2026:13:55:36 +0000] "GET /api/v1/users HTTP/1.1" 200 2326 "https://example.com" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
10.0.0.15 - - [10/Oct/2026:13:55:37 +0000] "POST /api/v1/checkout HTTP/2.0" 201 1042 "-" "curl/7.68.0"
172.16.0.42 - admin [10/Oct/2026:13:55:38 +0000] "GET /admin/dashboard HTTP/1.1" 403 548 "https://example.com/login" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
192.168.1.100 - frank [10/Oct/2026:13:55:39 +0000] "GET /static/bundle.js HTTP/1.1" 304 0 "https://example.com" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"`,
  },
  {
    id: "aws-alb",
    name: "AWS ALB Access Log",
    description: "Amazon Application Load Balancer access log with request and backend latencies",
    pattern: `%{NOTSPACE:type} %{TIMESTAMP_ISO8601:timestamp} %{NOTSPACE:elb} %{IP:client_ip}:%{INT:client_port:integer} %{IP:target_ip}:%{INT:target_port:integer} %{NUMBER:request_processing_time:float} %{NUMBER:target_processing_time:float} %{NUMBER:response_processing_time:float} %{INT:elb_status_code:integer} %{INT:target_status_code:integer} %{INT:received_bytes:integer} %{INT:sent_bytes:integer} "%{WORD:method} %{NOTSPACE:request_url} HTTP/%{NUMBER:http_version}" "%{DATA:user_agent}" %{NOTSPACE:ssl_cipher} %{NOTSPACE:ssl_protocol}`,
    rawLogs: `https 2026-09-26T12:00:00.123456Z app/my-loadbalancer/50dc6c495c0c9188 192.168.1.1:2817 10.0.0.1:80 0.001 0.002 0.000 200 200 287 403 "GET https://example.com:443/api/v1/users HTTP/1.1" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" ECDHE-RSA-AES128-GCM-SHA256 TLSv1.2
https 2026-09-26T12:00:01.654321Z app/my-loadbalancer/50dc6c495c0c9188 192.168.1.2:3412 10.0.0.2:80 0.002 0.015 0.001 500 500 120 184 "POST https://example.com:443/api/v1/pay HTTP/1.1" "Stripe-Webhook/v1" ECDHE-RSA-AES128-GCM-SHA256 TLSv1.2`,
  },
  {
    id: "syslog-rfc5424",
    name: "Syslog RFC 5424",
    description: "Standard enterprise syslog header, structured data, and message body",
    pattern: `<%{INT:priority:integer}>%{INT:version:integer} %{TIMESTAMP_ISO8601:timestamp} %{HOSTNAME:hostname} %{WORD:app_name} %{INT:proc_id:integer} %{WORD:msg_id} (?:%{DATA:structured_data})? %{GREEDYDATA:message}`,
    rawLogs: `<34>1 2026-09-26T22:14:15.003Z mymachine.example.com su 7704 ID47 [exampleSDID@32473 iut="3" eventSource="Application"] 'su root' failed for lonvick on /dev/pts/8
<165>1 2026-09-26T22:15:01.120Z webserver01.corp nginx 1420 ID12 - Worker process exited normally`,
  },
];
