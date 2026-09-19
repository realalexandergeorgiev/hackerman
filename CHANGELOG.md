# Changelog

All notable changes to **Hackerman** are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/).

## [1.3.0] — 2026-09-19

### Added

- **Recipe focus overlay**: click any recipe card (Recipes, Wizard steps, BloodHound collection) to
  open it centered in a scrollable overlay. Closes via ×, `Esc` or backdrop click; body scroll is
  locked and focus is moved into the panel. Guards keep buttons, badges, `‹var?›` placeholders and
  text selections from opening the overlay. The content refreshes automatically when the context
  changes, and hover help / click-to-set / copy keep working inside.
- **zsh completion export**: the header button `zsh` generates a single `_hackerman` completion
  file from the embedded recipes — per-tool flags, subcommands (certipy, bloodyAD, nxc,
  sccmhunter), nxc `-M` modules, hashcat `-m` modes and xfreerdp slash options. The modal offers
  copy and download and includes install instructions.
- `tools/gen-zsh-completions.mjs` (dependency-free) regenerates `completions/_hackerman`
  headlessly; the generated file is committed.
- Legend documents both features.

### Changed

- Recipe cards now show a small `⤢` marker and a pointer cursor as the focus affordance.
- README gained a zsh-completions section and updated tool help count (42 attack explanations).

## [1.2.0] — 2026-09-19

### Added

- **Complete AD CS ESC coverage (ESC1–ESC17)** with 8 new cards (ADCS category 7 → 15 recipes, total 101):
  - `adcs-esc6` — CA SAN injection via request attributes, plus the ESC6+ESC9/16 combination.
  - `adcs-esc9-esc16` — missing / CA-wide disabled SID security extension with victim UPN swap, shadow-credentials shortcut, revert and `-username` PKINIT override.
  - `adcs-esc10` — weak Schannel mapping (`CertificateMappingMethods 0x4`) leading to an LDAPS shell.
  - `adcs-esc11` — NTLM relay to the CA RPC/ICPR interface with coercion.
  - `adcs-esc13` — issuance policy linked to a privileged group (group SID in the TGT).
  - `adcs-esc15` — EKUwu / CVE-2024-49019 with Schannel and enrollment-agent scenarios.
  - `adcs-esc17` — server-auth SAN for service impersonation (e.g. WSUS).
  - `adcs-esc5-esc12-esc14` — PKI object ACLs, YubiHSM2 niche and weak `altSecurityIdentities` recon incl. OID group-link query.
- New context variable `victim` (writeable victim account) for the ESC9/10/16 UPN-swap flows.
- Hover help entries for all eight cards; `adcs-find` note now points to every ESC card.
- Wizard `adcs` flow grew two steps: missing/weak mapping & CA flags, and relay/OID/EKUwu/server-auth.

### Changed

- Applicability tiers extended (`adcs-esc6` common; ESC9/10/11/13/15 situational; ESC17 and ESC5/12/14 rare). The PRI distribution check now validates coverage instead of exact counts.

## [1.1.1] — 2026-09-19

### Added

- **Edit values by click**: rendered `{{variables}}` in commands and notes are clickable now and
  open the popover in `Change` mode with the current value pre-filled (`eric.dutton` →
  `Change User {{user}}`). A selection guard prevents the popover from opening while text is
  selected, so marking and copying inside commands keeps working.
- Derived values (`realm`, `domain_dn`, `dc_fqdn`, `target_fqdn`) are clickable as well and jump
  to the source fields they are computed from (with the usual flash highlight).
- Legend documents the click-to-set / click-to-change behavior.

## [1.1.0] — 2026-09-19

### Added

- **Click-to-set placeholders**: every missing `‹value?›` in commands and notes is clickable and
  opens an inline popover (save / context / cancel) that writes the value into the context and
  re-renders instantly. Derived variables redirect to their source fields.
- **Applicability tiers** for all recipes and flows: `always` / `common` / `situational` / `rare`
  with colored badges, centrally maintained in `PRI_TIERS` / `FLOW_PRI`.
- **Sort selector** `priority → ready` (new default), `ready → priority`, `data order`; tier
  filter chips (multi-toggle, persisted) plus the existing `ready only` filter.
- **Hover help**: 54 tool explanations and 34 attack explanations behind `?` markers on titles and
  command labels (custom tooltip panel, keyboard focusable, `help` chip to toggle).
- **Readiness UI**: ready commands get a brighter background and `ready` badge; cards show
  `ready n/m`; `ready only` filter and ready counter in the toolbar.
- **Derived-field UX**: dashed border, cyan value, `auto` tag, formula tooltip, and hover/focus
  highlights the source fields (`src`/`hint` metadata).
- **Required-field guard**: amber marker on empty required fields, header counter
  (`N required missing` → `all required set`) that opens and flashes the missing fields.
- **`example` button** in the header: fills the context with the argon.htb demo values.
- **19 new recipes** (74 → 93) in 13 categories:
  - Recon: `kerbrute`, `pw-spray`, `session-hunt`, `ldap-dump`
  - Kerberos: `ticket-inspect`
  - ADCS: `adcs-esc2-esc3`, `adcs-esc7`, `adcs-golden-cert`
  - DACL: `dacl-adminsdholder`
  - Creds: `linux-loot`, `win-registry-loot`
  - Post: `av-defender`, `pe-suites` (linpeas/winPEAS), `revshells`, `cve-zerologon`,
    `cve-nopac`, `cve-printnightmare`, `sccm`
  - MSSQL: `mssql-alt-rce` (OLE/CLR)
- **Kerberos auth helper expanded** (`kerberos-auth`, now 32 commands): clock-skew tooling
  (`date`, `ntpdate -u`, `rdate -n`, `chronyc makestep`, `faketime` for single commands),
  environment troubleshooting (`echo $KRB5CCNAME`, `unset KRB5CCNAME`, `klist -A/-c`), verbose
  `kinit -V`, `kvno -e`, and a "where tickets land" section.

### Changed

- **Inline `KRB5CCNAME`** on all 55 env-dependent commands (`-k -no-pass`, `--use-kcache`,
  `certipy -k`) so every command is copy-paste safe; fixed the double-path bug in `ccache-usage`.
- Wizard flows integrated with the new recipes: `nopwn` + kerbrute/pw-spray, `creds` +
  session-hunt, `keytab` + linux-loot, `foothold` + pe-suites/av-defender/win-registry-loot/
  revshells, `adcs` + ESC2/3/7/Golden, `dacl` + AdminSDHolder, `mssql` + alt-rce, `da` +
  golden-cert.
- Legend documents tiers and hover help; toolbar reorganized (sort selector, tier chips, help
  chip, ready counter).

### Fixed

- `ccache-usage` export no longer prefixes an absolute ccache path with `$(pwd)/`.
- Kerberos recipes no longer rely on an implicitly exported `KRB5CCNAME`.

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
