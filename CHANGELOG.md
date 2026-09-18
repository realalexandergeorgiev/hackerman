# Changelog

All notable changes to **Hackerman** are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/).

## [1.0.0] — 2026-09-18

Initial release. Single-file, offline AD attack helper for Kali, built by @bongoalex with deepseek.

### Added

- **Context bar** with typed variables (domain, realm, DC host/FQDN/IP/DN, target host/FQDN/IP,
  user, password, NT hash, AES key, ccache, attacker IP/interface, listener port, rogue machine
  account, CA, template, group, krbtgt key, SIDs, parent domain, wordlist, keytab, output file)
  including derived values (`realm`, `dc_fqdn`, `target_fqdn`, `domain_dn`).
- **Typed argument coloring** for every resolved `{{variable}}`, plus missing-value highlighting
  and per-card `missing:` badges.
- **`proxychains` toggle** with per-command exemption for local tools.
- **74 recipes** in 13 categories: recon & auth, BloodyAD, Kerberos, delegation & RBCD, ADCS,
  ACL/DACL abuse, credentials & secrets, poisoning & relay, lateral movement, post-exploitation,
  MSSQL, trusts, BloodHound collection.
- **15 wizard flows** with ordered steps, progress checkboxes persisted in `localStorage`, and
  "copy flow as markdown": valid credentials, NT hash, AES/ccache, keytab, RBCD, constrained
  delegation, unconstrained delegation/coercion, ADCS, DACL rights, MSSQL, no-credentials
  poison/relay, Windows foothold, trusts, GPO/ADIDNS, DA/krbtgt endgame.
- **Kerberos auth helper** (`kerberos-auth`): generated `/etc/krb5.conf`, `/etc/hosts` entry,
  clock-skew handling, `kinit`/keytab/`klist`/`kvno`, `KRB5_TRACE` debugging, and a per-tool
  `-k -no-pass` / `--use-krb5-ccache` cheat sheet.
- **RDP auth helper** (`rdp-auth`): xfreerdp NLA with password, Kerberos-only enforcement,
  ccache-only via `/restricted-admin` and `/remoteGuard`, PtH fallback, Restricted Admin registry.
- **RBCD end-to-end runbook** (read state → rogue machine account → delegation write → getST →
  ticket use/dump → cleanup) incl. BloodyAD variant and `-k -no-pass` variants.
- **SPN hijack → constrained delegation → DC takeover**: SPN owner lookup, DC DN fetch,
  `delspn`/`addspn` via bloodyAD (v1 and v2 syntax), `getST -altservice HOST/<dc>`, DC dump,
  and restore/cleanup.
- **BloodHound tab** with collection recipes and 16 Cypher queries (owned→DA paths, roastable
  accounts, delegations, RBCD, AdminTo/CanPSRemote, DA sessions, GPO/ADCS edges, trusts).
- **Kerberos (`-k`) coverage** across ~30 commands in delegation, ACL, ADCS, MSSQL, lateral and
  trust recipes (`-k -no-pass`, `--use-kcache`, `-k ccache=`, `--use-krb5-ccache=`).
- **Presets, export/import, search and category filters**, dark theme, keyboard shortcuts
  (`/`, `Ctrl/Cmd+K`, `Esc`).

### Notes

- Verified after each change with a template/reference check (no unknown variables, no runtime
  errors) and a headless Chromium smoke test of all tabs.
- Tool syntax verified against upstream sources/docs: Impacket (`rbcd`, `addcomputer`,
  `GetUserSPNs`, `findDelegation`, `dacledit`, `owneredit`, `getST`, `secretsdump` support
  `-k`/`-no-pass`), bloodyAD v2, Certipy 5.x, NetExec, Samba `--use-krb5-ccache`, FreeRDP
  Kerberos/NLA behaviour.
