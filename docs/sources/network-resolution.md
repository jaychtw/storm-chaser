> Historical diagnosis from the previous instance. **Resolved in the newly published environment on 2026-10-29 Asia/Taipei.** See [current M0 results](README.md) and [active policy](evidence/2026-10-29/active-network.json). The old draft/runtime mismatch below must not be treated as current.

# M0 network blocker diagnosis

The saved network draft is not applied to the running environment. The draft is revision 3, with restricted access and six custom official domains; the runtime reports current observations, an enforced restricted policy, desired/observed runtime revision 1, and an empty custom-host list. Draft and runtime revisions are separate counters; the decisive evidence is the host-list mismatch. No runtime setup failure is reported.

One controlled retry used the inherited proxy, TLS verification, no redirects, no automatic retries, and a 20-second timeout against the JMA candidate. It failed with curl exit 56, proxy CONNECT 403 and destination HTTP status 000. No request reached a verified agency endpoint and no payload was retrieved. No further requests were attempted on this unchanged policy.

See [structured comparison and retry result](evidence/network-draft-comparison.json). This evidence supports an unapplied-setting diagnosis, not an agency outage or missing API key. No organization-level denial has been established. Available tools can read/write configuration drafts but cannot activate runtime network settings or publish the environment. Re-saving the identical draft would not resolve this.

## User action

Open the settings/editor for the **storm-chaser cloud environment**, then its network/Internet access section. Keep **Restricted** access and the existing package-manager preset. The custom allowed-domain list is already saved; review and save these entries:

```
opendata.cwa.gov.tw
www.cwa.gov.tw
www.data.jma.go.jp
www.jma.go.jp
www.metoc.navy.mil
www.ncei.noaa.gov
```

Review/save the configuration, then publish the environment through the product to activate the reviewed configuration when required. Publishing the development environment is distinct from deploying Storm Chaser. No unrestricted access, wildcard, proxy bypass, VPN or new credential is required for this network change.

This expands outbound web access to the six named hosts: processes in the environment can contact them and send data, so it is not a read-only network permission. It does not add secret bindings, open inbound ports, or disable TLS verification. Keep requests limited to public documentation and permitted products.

After the setting is applied, compare the runtime policy again. Once connectivity is available, resume the existing M0 dossiers, terms inspection and official sample verification. M0 remains blocked until then; a successful connection alone will not establish reuse permission.
