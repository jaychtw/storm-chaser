# Direct proxy check

Observed 2026-10-28 16:05:59 UTC, before any successful agency connection.

Command (read-only):

```
curl -sS -D - --max-time 20 https://www.jma.go.jp/bosai/typhoon/data/targetTc.json
```

Public response excerpt:

```
HTTP/1.1 403 Forbidden
content-type: text/plain
server: envoy
curl: (56) CONNECT tunnel failed, response 403
```

This is a proxy-level failure, not a retrieved JMA response. The active policy reported no custom allowed hosts; the saved draft contained proposed official hosts but had not been applied. Separately, batch probe metadata records failures with status `000` (no successful destination HTTP response); those observations must not be rewritten as a weather-provider 403. No successful weather payload was obtained or archived.
