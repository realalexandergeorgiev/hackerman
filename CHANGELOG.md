# Changelog

All notable changes to **Hackerman** are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/).

## [1.9.0] — 2026-09-19

### Added

- **bhcli workflow** (BloodHound category 2 → 6 recipes, total 119): `bhcli-setup` (install, auth,
  upload, mark Owned), `bhcli-recon` (users/computers/groups, nested memberships, stats, audit),
  `bhcli-cypher` (run the 29 queries through the CE API with jq snippets) and
  `bhcli-alternatives` (Blade, CypherHound, deathhound, PyPI bloodhound-cli, cypher-shell).
- BloodHound tab now starts with a **"CLI workflow (bhcli)"** section; every Cypher query has a
  **bhcli copy button** and an **export for bhcli** action that downloads all queries as
  `hackerman-bhcli-queries.json` (native `{name, query, description}` array, importable with
  `bhcli queries <file>`; format verified against bhcli's source).
- New requirement tag `bh` ("BH data": a running BloodHound CE with ingested data); `bhcli` added
  to hover help and zsh completions (with subcommands).
- README section "BloodHound without the GUI (bhcli)" incl. alternatives table.

### Changed

- Category rename: "BloodHound Collection" → "BloodHound"; `completions/_hackerman` regenerated.

## [1.8.0] — 2026-09-19

### Added

- **13 new BloodHound queries** (16 → 29) in the BloodHound tab:
  - paths/rights: owned → any high-value target, DCSync/domain-object write rights, write rights
    over users, AddMember/write rights over groups, OU write rights (inheritance), sessions on
    owned computers.
  - credential access: LAPS readers, gMSA readers, passwords in user descriptions, privileged
    kerberoastable accounts (`adminCount=1`).
  - execution/ADCS: `CanRDP|ExecuteDCOM` from owned, ADCS CA permissions (ESC7, CE).
  - helper: shortest path between two named objects.
- CE/legacy differences are documented in the query notes (`highvalue` vs `system_tags`,
  `EnterpriseCA` nodes, description property availability).

### Changed

- Constrained delegation query now returns `trustedtoauth` as well, marking protocol transition
  (T2A4D) accounts where `getST -impersonate` needs no victim credentials.
- README and `completions/_hackerman` updated.

## [1.7.0] — 2026-09-19

### Added

- **Structured requirements** for all 115 recipes: 19 tags (`DA`, `DCSync`, `ManageCA`, `trust key`,
  `Backup Op`, `local admin`, `write rights`, `ADCS enroll`, `MachineQuota`, `role`, `coercion`,
  `relay target`, `MSSQL`, `shell`, `artifact`, `root`, `trust creds`, `creds`, `no creds`) with
  severity ordering and tooltips, maintained centrally in `REQ_DEFS`/`REQS`.
- Card meta rows show up to two requirement chips plus `+N`; expanded cards and the focus overlay
  list every requirement; the Legend documents all tags.
- Wizard flows carry prerequisites (`requires:` line on the flow card and a prerequisites box in
  the detail view) plus automatic per-step `needs:` hints derived from the step's recipes, with
  manual overrides on critical steps (RBCD, ADCS, trusts, foothold, unconstrained, da).
- Trust escalation recipes (`trust-sid-history`, `trust-raisechild`) spell out explicitly that they
  require Domain Admin / DCSync rights in the child domain; roasting and enumeration only need
  trusted credentials.

### Changed

- README feature list and Legend updated; `completions/_hackerman` regenerated.

## [1.6.1] — 2026-09-19

### Fixed

- **Wizard flow corrections** (audited all 15 flows against their recipes):
  - `keytab`: removed the generic user-oriented `gettgt` step — a keytab belongs to a machine
    account and the keytab recipe already requests the TGT with the trailing `$`; added
    `ticket-inspect` to the ticket step.
  - `dacl`: `bloodyad-badsuccessor` moved out of "User takeover" into its own step
    "dMSA / BadSuccessor (Server 2025)".
  - `foothold`: first step renamed to "Enumerate host & credential reach" (auth checks are
    reachability checks, not host enumeration).
  - `rbcd`: the full `rbcd-bloodyad` variant is no longer duplicated in the grant step and
    stays in the cleanup step where the remove commands live.
  - `unconstrained`: coercion step references `relay-coerce` only; `unconstrained-coerce` keeps
    its ticket-stealing role in the next step.

## [1.6.0] — 2026-09-19

### Added

- **Trust techniques** (Trusts category 2 → 5 recipes, total 115):
  - `trust-cross-domain-roast` — Kerberoast/AS-REP against the trusted domain with impacket
    `-target-domain`, nxc and hashcat.
  - `trust-sid-history` — inter-realm golden tickets with `-extra-sid` / `-groups` / `-extra-pac`
    from the trust key, plus ticket usage against the trusted DC and notes on SID filtering
    (intra-forest vs forest quarantine, `netdom trust … /quarantine:no`, mimikatz `/sids:`).
  - `trust-foreign-groups` — foreign security principals, `lookupsid`, group inspection and using
    credentials from the owning domain against the trusting domain.
- Trust context variables `trust_domain` and `trust_dc_ip`.
- `trust-enum` extended: `nltest /trusted_domains`, `netdom trust … /verify`, raw
  `trustedDomain` attribute query and notes on `trustDirection` / `trustAttributes`
  (0x1 non-transitive, 0x4 quarantine, 0x8 forest-transitive, 0x20 intra-forest).
- Hover help for the three new cards and a new `trusts` flow step
  ("Cross-domain & SID history").

### Changed

- Tier filter chips are struck through and dimmed while disabled, so the off state is obvious
  (`aria-pressed` added for screen readers).
- README coverage updated to 115 recipes; `completions/_hackerman` regenerated.

## [1.5.1] — 2026-09-19

### Changed

- Recipe card header is now two rows: the **title on its own line** (larger, full width) and the
  metadata (category, tier, ready/missing badges, focus marker, copy button) on a second line, so
  titles stand out better.

### Fixed

- The header copy button was absolutely positioned against the document (no positioned ancestor)
  and could float outside the card; it is now a static flex item inside the metadata row and sits
  in the card's top-right corner.

## [1.5.0] — 2026-09-19

### Added

- **Compact lists**: recipe cards in the Recipes tab and BloodHound collection render collapsed
  (category, tier, title, ready/missing badges, copy-all and a two-line description) so 112
  recipes stay scannable. Clicking a collapsed card opens the existing focus overlay with all
  commands, notes, hover help and click-to-set. A `compact` chip in the toolbar toggles inline
  expansion (persisted in `adah.ui.v1`, default on); Wizard step cards always stay expanded.

### Changed

- `recipeCard(r, alwaysExpanded)`: the previously unused second parameter now forces the expanded
  rendering for the focus overlay and the Wizard flows.
- Legend documents the compact mode; `completions/_hackerman` regenerated (version string).

## [1.4.0] — 2026-09-19

### Added

- **11 new recipes** (101 → 112, 13 categories):
  - `lat-impacket-extras` — DCOM execution (`dcomexec` MMC20/ShellWindows/ShellBrowserWindow), remote
    `services` management, remote `reg` query/save, `rdpcheck`.
  - `mitm6` — IPv6 DHCPv6/DNS takeover with ntlmrelayx (LDAPS escalate, RBCD, SOCKS).
  - `sebackup` — SeBackupPrivilege: `reg save` SAM/SYSTEM/SECURITY, `robocopy /b` for ntds.dit,
    offline secretsdump parsing.
  - `bloodyad-badsuccessor` — Windows Server 2025 dMSA abuse: `badsuccessor_check`, create a linked
    dMSA, read the managed password, cleanup.
  - `uac-bypass` — fodhelper / eventvwr / computerdefaults registry tricks via WinRM.
  - `dsrm` — dump and reuse the DC DSRM local Administrator hash (incl. logon behavior note).
  - `dnsadmins` — ServerLevelPluginDll DLL load as SYSTEM on the DC plus cleanup.
  - `cve-certifried` — CVE-2022-26923 machine account dNSHostName spoofing → DC certificate.
  - `krbrelay` — KrbRelayUp full/relay/spawn chain (RBCD, shadow credentials, ADCS variants).
  - `entra-connect` — MSOL/ADSync connector account recon, ROADtools tenant enumeration, DCSync path.
  - `adfs-goldensaml` — ADFSDump + ADFSpoof Golden SAML forging for federated apps.
- Extensions of existing cards: `relay-ldap` (interactive LDAP shell, `--dump-laps`, `--dump-gmsa`),
  `user-enum`/`anon-enum` (`--rid-brute`), `creds-gmsa` (Windows LAPS v2 `msLAPS-Password`),
  `linux-loot` (SSH key reuse), `bh-python` (`bloodhound-ce-python`).
- Hover help for `mitm6`, `roadrecon`, `ADFSpoof.py` and `bloodhound-ce-python`, plus 11 attack
  explanations and applicability tiers for all new cards.
- Wizard flows: `nopwn` + mitm6, `foothold` + UAC/KrbRelay/SeBackup, `dacl` + BadSuccessor,
  `adcs` + Certifried, `da` + DSRM/DNSAdmins, `trusts` + new "Hybrid identity" step
  (Entra ID Connect, ADFS Golden SAML).

### Changed

- Coverage is now **112 recipes**; README coverage table updated.
- `completions/_hackerman` regenerated (49 tools).

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
