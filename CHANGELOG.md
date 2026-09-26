# Changelog

All notable changes to **Hackerman** are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/).

## [2.0.0] — 2026-09-26

### Added

- **Flashcards (`flashcards.html`)** — a separate, mobile-first, offline study page: 106 cards on AD
  attack **strategies, principles and procedures** across 9 categories (Kerberos, ACL/DACL,
  Credentials, ADCS, Trusts, Relay & Coercion, Lateral & Privesc, Recon & Prinzipien, MSSQL) —
  no CLI-flag trivia, foundational lookups (e.g. `klist`) included. SM-2-lite spaced repetition:
  Again/Hard/Good/Easy with live interval previews, learning steps 1 min → 10 min → 1 d,
  in-session re-queue for due learning cards, ease/interval caps, daily new-card limit (5/10/20/40),
  streak, category filter and "nur fällige". Swipe (← Again, Good →) and keyboard control
  (Space flip, 1–4 rate), progress export/import as JSON, `localStorage` `hkm.flash.v1`. Linked
  from the header (`flashcards` button) and the README.
- **Context plausibility checks (warn-only)** — `validateField()` flags implausible values with a
  ⚠ badge, red input border and a tooltip explaining the expected shape; an `⚠ N` counter appears
  in the context summary. Rules cover NT hashes (32 hex; a whole `LM:NT` secretsdump line is
  called out), krbtgt (NT or AES256), AES keys (64 hex; 32 hex → AES128 hint), SIDs incl. the
  SID-filtering RID range, RIDs, ports, IPv4, FQDN/NetBIOS shape, `computer_name` with trailing
  `$`, spaces in passwords/paths, SPN/DN/proxy-chain formats. Values are **never rewritten** and
  the `ready` state is never blocked.
- **Conditional command templates** — `{{#if var}}…{{/if}}` and `{{#if !var}}…{{/if}}` blocks in
  recipe commands; inactive blocks are removed before placeholder substitution, so they produce no
  missing markers and do not affect readiness. Used for the Kerberos setup card.

### Fixed

- **krb5.conf ignored the second domain**: the Kerberos config now renders the partner
  `[realms]` entry and the `[domain_realm]` pairs automatically once `{{trust_domain}}` /
  `{{trust_dc_ip}}` are set, and the `/etc/hosts` command appends the partner DC line — one conf
  for both realms. Card note updated.

## [1.22.0] — 2026-09-26

### Added

- **Wizard decision groups (`pick one`)**: flow steps can now be alternatives instead of a strict
  sequence — a group header asks the decision question (e.g. *"What is your position in the
  partner domain?"*), the alternatives render as sub-cards separated by OR lines with radio
  semantics: picking one marks the step done, dims the other paths and auto-advances. Groups
  count as one step in the progress bar; the pick persists per flow (`adah.progress.v1`,
  `pick:`n`` key — old flat progress never marks a group done without an explicit pick).
- **Conditional steps (`only if: …`)**: steps that apply only sometimes (e.g. *SPN hijack onto the
  DC — only if the delegation target SPN is missing or unreachable*) carry a dashed amber badge
  and render dimmed until opened or checked.
- `copy flow as markdown` renders groups as `### n. question — pick ONE path` with `#### Option A/B`
  sections and annotates conditional steps.

### Changed

- **9 flows restructured into decision trees**: `trusts` (trust key/DA vs coercion+relay vs hybrid
  identity — the user-named example), `dcacl` (RBCD vs shadow credentials, replacing the manual
  "Path A/B" titles), `dacl` (by object type: user/computer/group/dMSA/domain object), `adcs`
  (by ESC class: template rights vs weak mapping vs relay/exotic vs ESC8), `da` (golden ticket vs
  golden certificate), `mssql` (RCE vs SQL-internal vs hash theft), `nopwn` (relay target SMB vs
  LDAP(S) vs ADCS), `foothold` (SeImpersonate vs UAC vs KrbRelayUp, plus a conditional AV recon
  step), `creds` (ACL edges vs MSSQL). `constrained` gained the conditional SPN-hijack step.
- `trust-foreign-groups` moved into the trusts *Enumerate* step (recon, not an attack path);
  `av-defender` moved out of the foothold escalation step into its own conditional step.
- Wizard intro text explains groups and conditional steps; flows stay at 17.

## [1.21.0] — 2026-09-25

### Added

- **PtH pendant for every password command**: each command that authenticates with a password now
  has an NT-hash variant directly below it (label `… via PtH` / `… with NT hash`) — wherever the
  tool supports it. 402 new lines across ~80 recipes: NetExec (`-H`), impacket (`-hashes`),
  bloodyAD (`-p :NTHASH`), certipy (`-hashes`), coercer (`--hashes`), sccmhunter (`-hashes`),
  bloodhound-python (`--hashes`), pygpoabuse (`-hashes`), noPac/CVE-2021-1675 PoCs, samba
  (`--pw-nt-hash` for smbclient/net/rpcclient). With only a hash in the context, cards now render
  ready instead of showing `‹Password?›` everywhere.
- `shares`: the lone trailing `--shares` PtH line moved to its password counterpart (consistent
  pendant placement); `auth-check` ↔ `pth-check` cross-reference each other in their notes.

### Changed

- Tools that cannot pass-the-hash state so explicitly: `ldap-dump` and `ldap-tls` notes point at
  `nxc ldap -H` / `bloodyAD -p :NTHASH` for the hash-only case (ldapsearch/ldapdomaindump do
  plaintext simple binds only). RDP PtH stays a dedicated `/pth:` + `/restricted-admin` line
  (lat-rdp / rdp-auth) instead of per-line pendants.

## [1.20.0] — 2026-09-25

### Added

- **Loot tab — multiple identities**: persistent credential collection (`adah.loot.v1`) with domain,
  user, password, NT hash, AES key, ccache, RID and notes per entry. Apply an entry as
  *foothold / partner domain / impersonate / victim* with one click, or pick it from the new `▾`
  next to every credential field. Entries get their own colour; the store is independent from presets
  and has its own JSON export/import.
- **Loot suggestions**: recipe cards and wizard steps show which credentials they use and which are
  missing, and offer matching loot entries as clickable chips (for example
  `loot: eric.dutton — {{user}}+{{password}}`).
- **Identity colours**: related context fields (user/password/NT hash/AES key/ccache and their
  trust/target/victim counterparts) share a colour — the loot-entry hue when matched, a role hue
  otherwise. The semantic text colours stay unchanged.
- **New recipe `dc-rbcd`** — RBCD against a DC computer object (same-domain and cross-domain
  variants), including the bloodyAD naming rule (create without `$`, reference with `$`), the
  HOST-SPN getST and the `secretsdump -k -no-pass -just-dc` follow-up.
- **New wizard flow `dcacl`** — "I have write rights on a DC object": confirm the right → RBCD on the
  DC → shadow credentials on the DC → DCSync.
- New context variables `trust_dc_host` and derived `trust_dc_fqdn` (partner DC) and `user_rid`
  (for ticketer `-user-id` and ACEs that name your own SID).
- **NetExec RBCD coverage**: `rbcd-getst` and `dc-rbcd` document nxc **`--delegate`** usage
  (S4U2Self+S4U2Proxy; `--self`, `--spn`, `--generate-st`, `--u2u`), `rbcd-addcomputer` covers
  **`-M add-computer`** and `rbcd-read`/`deleg-enum` cover **`--find-delegation`**. The cards state
  explicitly that nxc **cannot write** `msDS-AllowedToActOnBehalfOfOtherIdentity` (no write module,
  open feature request #1219) — that step stays with impacket-rbcd or bloodyAD, with
  `-M shadow-creds` as the alternative takeover.

### Changed

- **Help texts expanded across the board**: every context-field tooltip now follows
  *What / Where / Careful*, and all 66 tool plus 57 attack hover texts gained usage and pitfall
  details; tooltip width/height increased.
- `golden-ticket`, `silver-ticket`, `gettgt`, `getst` and `constrained-getst`: **AES variants come
  first**, the NT hash is clearly labelled as RC4 fallback.
- `trust-sid-history`: steps 6/6e use `{{user_rid}}`; hardcoded cross-domain placeholders were
  replaced by the new `{{trust_dc_fqdn}}` / `{{trust_dc_host}}$`; `trust-dcsync` uses
  `{{trust_dc_fqdn}}` too.
- Preset save now suggests the currently selected (or last used) name — Enter overwrites — and asks
  for confirmation before overwriting a different preset.
- `rbcd-bloodyad` documents the Kerberos computer-create variant and points to `dc-rbcd` when the
  target is a DC.
- RID brute commands pin `--rid-brute 2000` (nxc default is 4000; RID ≤1000 are built-in/standard
  accounts, custom accounts usually sit in 1000–2000).
- README feature list/counts (128 recipes, 17 flows) updated.

## [1.19.0] — 2026-09-19

### Added

- **Collapsible wizard steps**: each step header is clickable (chevron + checkbox + title + summary
  `N cards · needs: …`); only the first unfinished step is open by default, manual toggles are
  persisted per step (`UI.stepOpen` in `adah.ui.v1`). Checking a step collapses it and opens the next
  unfinished one; `expand all` / `collapse all` buttons and a `done/total` counter sit in the flow
  header. Keyboard support (`aria-expanded`, Enter/Space) and the first open step is accent-marked.
- Wizard step cards now follow the global `compact` setting (collapsed overview, full details in the
  focus overlay) instead of always rendering every command inline.

### Changed

- README design note "Wizard steps always stay expanded" removed; feature list updated.

### Fixed

- Trust docs: `impacket-secretsdump -trust-keys` / `-just-trust-keys` exist **only on impacket master**
  (PR #2207, after the 0.13.1 release of 2026-05-19) — on pip/Kali 0.13.1 the flag fails with
  `unrecognized arguments`. `trust-sid-history`, `trust-raisechild`, `trust-dcsync` and the
  `trust_aeskey` tooltip now say so, add a
  `pipx install --force 'git+https://github.com/fortra/impacket'` step and point at mimikatz
  (`lsadump::trust /patch`, new step 5c) as the release fallback.
- `trust-sid-history`: ticketer forge commands no longer pass `-groups` — that flag only sets group RIDs
  of **your own** domain (impacket default `513,512,520,518,519`); target-domain SIDs belong in
  `-extra-sid`. Documented that `-extra-sid` takes **one comma-separated list** — a repeated flag
  overwrites the previous value (argparse `store`), so only the last SID survives.
- `trust-sid-history`: added `-user-id <RID>` to the forge commands (impacket default is `500`); the
  real RID is needed when the PAC user SID must match (new ACL pivot) and against
  `KDC_ERR_TGT_REVOKED`.
- `trust-sid-history`: new step **6e) ACL pivot** for cross-forest: if the surviving RID > 1000 is a
  group with WriteDACL/GenericAll on the target DC object, use the forged ticket (Kerberos) to add the
  ticket user's SID as GenericAll with bloodyAD, then continue via shadow credentials/RBCD on the DC.

## [1.18.3] — 2026-09-19

### Changed

- Disabled tiers ("always / common / situational / rare") are now **struck through everywhere** the
  label appears: the tier filter chips decorate their label span (renders reliably in every browser,
  not just Chromium), and the tier badges on wizard flow cards, recipe cards and the Legend table
  get the same `.off` state when the tier is disabled. Disabled tiers stay recognisable without
  reading the toolbar.

## [1.18.2] — 2026-09-19

### Added

- `trust-raisechild` / `trust-dcsync`: the **trust-attribute check is now the first command**
  (`--dc-list`) — `Within Forest` (0x20) means the extra-SID path is viable, cross-forest
  (`Forest Transitive`/`Treat as External`/`Quarantined`) means it is not. `trust-dcsync` additionally
  verifies the forged PAC with `impacket-describeTicket` (step 0d).
- `trust-sid-history`: new **cross-forest RID > 1000 variant** (step 6d) for trusts with SID history
  enabled (`Treat as External` 0x40).

### Fixed

- Cross-forest SID-filtering guidance corrected everywhere (`trust-enum`, `trust-sid-history`,
  `trust-raisechild`, `trust-dcsync` + hover help): the target forest's **RID 500–1000 (EA 519,
  DA 512, Account Operators 548) is always filtered**, even with `/enablesidhistory:yes` — only
  RID > 1000 can be spoofed when the trust is relaxed. The raiseChild module calls any inbound AD
  trust "parent domain"; it does not check `trustAttributes`, so a cross-forest partner fails with
  a valid TGT but `rpc_s_access_denied` (and a follow-up `ERROR_DS_DRA_BAD_DN` from `nxc --ntds`).

## [1.18.1] — 2026-09-19

### Added

- `trust-dcsync` is now self-contained: commands **0)** `nxc ldap … -M raisechild -o ETYPE=aes256`
  (automated ticket, saves `<USER>.ccache`) and **0b)** the manual `impacket-ticketer -aesKey …`
  forge with a pointer to the key acquisition in `trust-sid-history`; the dump commands are numbered
  accordingly. `desc` and note got a "Ticket first" explanation (ticket source vs. partner-credential
  paths), and `trust-raisechild` / `trust-sid-history` / the `trusts` flow now point to `trust-dcsync`
  for the dump.

## [1.18.0] — 2026-09-19

### Added

- New Trusts recipe **`trust-dcsync` — "DCSync the partner domain (across the trust)"**: ticket-based
  dump (`--ntds`, `impacket-secretsdump -k -no-pass -just-dc`), partner-credential variants
  (password + PtH) and a note with the decision tree — replication rights live on the target domain
  NC, a transitive trust does not pass them on; intra-forest works via trust key / extra-SID
  (Enterprise Admins), cross-forest needs real rights, and transitive forest trusts do not chain
  across forests. Technique hover + `REQS` (`DCSync`, `trust key`) added.

### Fixed

- `trusts` wizard flow: final "Dump" step pointed at `creds-dcsync`, which targets your own domain —
  it now uses `trust-dcsync` (the partner domain).
- `trust-enum` note states explicitly that a trust never grants replication rights and links the new
  card.

## [1.17.2] — 2026-09-19

### Added

- `trust-raisechild` / `trust-sid-history`: **real-world failure diagnosis** for the extra-SID
  shortcut — Kerberos auth succeeds but the parent denies RemoteOperations/DCSync
  (`rpc_s_access_denied`, then a misleading `ERROR_DS_DRA_BAD_DN` from `nxc smb --ntds`).
  - how to recognise SID filtering: `--dc-list` shows `Within Forest` (ok) vs `Forest Transitive` /
    `Treat as External` / `Quarantined Domain` (filtered), `Get-ADTrust … SIDFilteringQuarantined`,
    `netdom trust <parent> /domain:<child> /quarantine`;
  - note that different namespaces (argon.htb ↔ ofc.local) are usually separate forests, so
    filtering is on by default and the nxc module's `parent domain` is just the first trusted
    AD domain;
  - `impacket-describeTicket '<USER>.ccache'` command to check whether the extra SID is in the PAC
    (present but denied = stripped by the parent);
  - DCSync tip: prefer
    `impacket-secretsdump -k -no-pass -just-dc '<child-realm>/<user>@<parent-dc>.<parent>'` over
    `nxc --ntds` (which needs local admin for RemoteOperations);
  - lab fixes: `netdom trust … /quarantine:no` (external/domain trust) or
    `/enablesidhistory:yes` (forest trust, at the trusting forest root).

## [1.17.1] — 2026-09-19

### Added

- `trust-raisechild`: **nxc `raisechild` module** as the primary automation
  (`nxc ldap <child-dc> -u … -p … -M raisechild`, plus `-o ETYPE=aes256` for AES-only domains);
  documented options `USER`, `USER_ID`, `RID`, `ETYPE` — the module DCSyncs the child krbtgt itself
  and saves the forged ticket to `<USER>.ccache`. `impacket-raiseChild` stays as the alternative.
- **SID filtering warning + detection**: note explains that the extra-SID shortcut fails when the
  parent trust is quarantined, and how to recognise it — `--dc-list` decodes 0x4 as
  `Quarantined Domain`, LDAP `trustAttributes`, Windows `Get-ADTrust … SIDFilteringQuarantined`, or
  `netdom trust <child> /domain:<parent> /quarantine` on the parent (symptom: valid TGT, extra SID
  stripped, access denied on the parent).
- `trust-enum`: `Get-ADTrust` now selects `SIDFilteringQuarantined`, `SIDFilteringForestAware` and
  `TreatAsExternal`; note documents the quick check.

## [1.17.0] — 2026-09-19

### Added

- New context variable **`trust_aeskey`** (inter-realm AES256 key of the TrustedDomain object) next to
  `trust_key` (RC4).
- `trust-sid-history` and `trust-raisechild`: **AES256 forge variants**
  (`impacket-ticketer -aesKey '{{trust_aeskey}}' …`) and the acquisition command
  `impacket-secretsdump -just-trust-keys …` (current impacket; derives AES + RC4 for both trust
  directions). RC4 stays as a clearly labelled fallback.

### Fixed

- `trust-sid-history` claimed "Only RC4/NT works for forging and mimikatz AES values cannot request
  a TGT" — wrong and now corrected: AES works, but its key is salted **per direction**
  (`YOURDOMAINkrbtgtPARTNER`), so it must come from the TrustedDomain object, not the ordinary
  trust-account DCSync. RC4 has no salt, but the account dump only covers the outgoing direction and
  can diverge from the incoming key after the 30-day rotation — noted on `trust_key` too.
- `trust-sid-history` note now mentions the intra-forest shortcut (child krbtgt AES key + extra-sid
  without any trust key).

## [1.16.0] — 2026-09-19

### Added

- Split the second-domain workflow into focused Trusts cards, all driven by the `trust_*` context
  (no more first-domain commands inside a partner-domain flow):
  - `second-domain` is now **collect & ingest** only (nxc/bloodhound-python + `bhcli upload`).
  - `second-domain-recon` — groups, nested memberships (`bloodyad get membership`, `memberOf`,
    `bhcli members --indirect`) plus `bhcli users/computers/groups/stats/audit` for the partner.
  - `second-domain-mark` — `bhcli mark Owned` for the partner foothold and bulk users/computers.
  - `second-domain-abuse` — partner-context `get writable`, `certipy find`, shadow credentials,
    group takeover, `add dcsync` and the follow-up DCSync dump.
- `trust-coerce-relay` gained a coercion variant fired with partner-domain credentials.

### Fixed

- Second-domain wizard flow: steps no longer reference first-domain recipes (`bhcli-mark-owned`,
  `bhcli-recon`, `dacl-*`, `shadow-creds`, `adcs-find`) or duplicate the collect card; each step now
  maps to one partner-domain card.
- `second-domain` bloodhound-python invocations were missing `--zip`, so `bhcli upload *.zip` had
  nothing to ingest.
- Flow readiness for the second-domain flow now requires `trust_domain`/`trust_dc_ip`/`trust_user`
  and accepts `trust_nthash` as the credential variant.
- `FLOW_PRI` now lists `second-domain` explicitly (was silently defaulting to tier 2).
- `da` flow: a Domain Admin with only a password is now recognised as ready.
- `unconstrained` flow: removed the `unconstrained-coerce` duplicate from the coercion step (the
  card stays in the ticket-stealing step, restoring the 1.6.1 split).
- README coverage corrected (126 recipes, 16 flows, actual per-category counts).

## [1.15.1] — 2026-09-19

### Added

- Second-domain card: **`-H` (pass-the-hash) variants** for the nxc collector, the bloodhound-python
  collector (`--hashes`) and the `--groups` lookup.
- **Membership discovery** in the second-domain card: `bloodyad get membership` (password + PtH) and
  an LDAPS `ldapsearch … memberOf` — answers "which group is my user in?" before flattening with
  `bhcli members --indirect`.
- Context variables **`trust_nthash`** and derived **`trust_domain_dn`** (45 → 47 fields).
- BloodHound query **"Groups of owned users (which group am I in?)"** (42 → 43).

### Changed

- `second-domain` wizard flow: step "Map your group" now starts with finding your own groups.

## [1.15.0] — 2026-09-19

### Added

- BloodHound card **"bhcli — mark Owned / Tier Zero (pwned objects)"**: `bhcli mark` for users and
  computers (single, `--file`, stdin, bulk piping from `bhcli users`/`computers`), CE GUI
  right-click marking for groups/OUs/GPOs/CAs **and Domain nodes**, verification query.
- BloodHound card **"Second domain foothold — collect, map, mark"** plus wizard flow **"I have a
  foothold in the second/partner domain"**: collector against the partner DC, `bhcli upload`,
  group flattening (`bhcli members --indirect 'IT@REALM'`), marking, group queries, abuse and
  cross-domain follow-up.
- BloodHound queries **30 → 42**: owned per domain, owned→Tier Zero (CE `system_tags` + legacy
  `highvalue`), owned→any Domain Admins group, "what a group controls", effective members,
  sessions/local admin of group members, shadow-credential/WriteSPN rights, Coerce-and-relay edges,
  cross-domain sessions, foreign members both directions, Tier Zero inventory.
- Context variables **`trust_user`**, **`trust_pass`** and derived **`trust_realm`** for the second
  domain (copy-paste-ready partner-domain commands).

### Fixed

- BloodHound **"Domain trusts"** query used `TrustedBy`, which CE 7.4 replaced with
  `SameForestTrust`/`CrossForestTrust` and the traversable `SpoofSIDHistory`/`AbuseTGTDelegation`.
- `unconstrained-coerce` coerced the wrong host: target is now the DC and `LISTENER` the
  delegation host; added the LSASS→ccache path (`nxc -M lsassy` saves tickets to
  `~/.nxc/modules/lsassy/`) and DCSync-as-DC$ commands. Note explains that coercion alone prints no
  ticket and that DC machine hashes are uncrackable.
- `trust-coerce-relay`: listener-first ordering documented (ntlmrelayx/responder before coercing),
  `relay-coerce` note now explains LISTENER semantics (Kali vs delegation host).

## [1.14.0] — 2026-09-19

### Added

- New recipe **"Cross-trust coercion & relay"** (Trusts): coerce a partner DC (`coerce_plus`,
  PrinterBug, PetitPotam incl. WebDAV listener, coercer), relay its machine account into the partner
  domain (LDAP(S) `--escalate-user`/`--delegate-access`, ESC8 `--adcs --template DomainController`,
  `certipy relay` ESC11) or coerce it into an unconstrained-delegation host of your own domain.
- Note documents the constraints: trust direction / pass-through, selective authentication,
  `ldap-checker` for signing/channel binding, Server 2025 default EPA, SMB-sourced NTLM vs WebDAV
  and why DC machine credentials are not crackable.
- `trusts` wizard flow gained a **"Coerce & relay across the trust"** step; `relay-coerce` and
  `trust-enum` notes cross-link the new card.

## [1.13.0] — 2026-09-19

### Added

- New recipe **"LDAP over TLS — LDAPS vs STARTTLS"** (Recon & Auth): port check, anonymous RootDSE
  over LDAPS, encrypted password bind, DC certificate grab via `openssl s_client` and
  `LDAPTLS_CACERT`, plus a tool support matrix.
- Per-tool TLS variants: nxc `--port 636` (plus note about the automatic LDAPS fallback on
  signing-required), bloodyAD `-s` (`-ss`/`-sss` to relax signing/CBT), impacket `-use-ldaps`
  for dacledit/rbcd/owneredit, certipy defaults-to-LDAPS note.

### Changed

- **All `ldapsearch` commands now run over LDAPS (636)** with `LDAPTLS_REQCERT=never` (self-signed
  DC certificates) — `ldap-dump`, ESC5/ESC13/ESC14, Entra Connect, trust-enum, foreign groups.
  Notes explain the STARTTLS fallback (`-H ldap://<dc> -ZZ`) for DCs without a certificate.
- Context tooltips and the `ldapsearch` help entry prefer `-H ldaps://<dc>`.

## [1.12.0] — 2026-09-19

### Added

- **Context field tooltips** — hovering any context label (dotted underline) now shows *how to get
  that value*: the exact acquisition commands for SIDs (`nxc --get-sid`, `lookupsid`, `objectSid`),
  trust NetBIOS/key, hashes/AES keys, ccache, SPN/DN, certipy CA/template fields, attacker
  IP/interface, wordlists, keytabs, … Derived fields show their formula instead of the native
  `title` and are covered by the `help` chip toggle like everything else.
- All 38 editable fields carry a tip; the legend explains the hover behaviour.

## [1.11.0] — 2026-09-19

### Added

- Trust context variables **`trust_netbios`**, **`trust_domain_sid`** and **`trust_key`**; own vs
  trusted SIDs are now clearly separated (`Own domain SID` vs `Trust SID`).
- SID/NetBIOS acquisition commands in the trust recipes: `nxc ldap … --get-sid` (own and trusted
  DC), `--dc-list` / `ldapsearch` for the partner NetBIOS (`flatName`) and domain SID
  (`securityIdentifier`), plus trust-account listing before dumping the key.
- BloodHound query **"Domain SIDs"** (`d.objectid`) — quick source for `trust_domain_sid`/extra-sid
  (29 → 30 queries).
- `trust-sid-history` is now a collect → forge → use runbook with an explicit
  **flag → domain mapping table** in the note (which SID/FQDN/NetBIOS goes where, RC4-vs-AES caveat).

### Fixed

- `trust-raisechild` used **your own NetBIOS** (`{{netbios}}$`) for the trust account — trust
  accounts are named after the **partner** domain, so it now uses `{{trust_netbios}}$`
  (e.g. `HTB$` on the child for parent `HTB`).
- Removed the ambiguous `parent_domain` variable (consolidated into `trust_domain`); ticketer now
  uses `{{trust_key}}`/`{{domain_sid}}`/`{{trust_domain_sid}}-519`/`krbtgt/{{trust_domain}}`
  consistently across both trust cards.

## [1.10.0] — 2026-09-19

### Fixed

- `trust-enum`: replaced the removed NetExec `-M enum_trusts` module with the `--dc-list` LDAP flag
  (lists DCs of the current and trusted domains including trust attributes).
- **`bloodyad` spelling**: all 100 command templates now use the Kali binary name `bloodyad`
  (pipx installs both `bloodyad` and `bloodyAD`). `HELP_TOOL` has entries for both spellings, zsh
  completions include both, and the basics note explains the naming.
- **bloodyAD BloodHound collector**: `--path` must point to an existing directory — `bloodyad-enum`
  and `bh-nxc` now run `mkdir -p bloodhound` first and collect into `./bloodhound`
  (previously `--path {{hashfile}}` / `--path loot.zip` aborted). Notes updated, `bloodhound/`
  added to `.gitignore`.

### Added

- **BloodHound CE minimal setup** integrated into `bhcli-setup`: Docker install, official
  `bloodhound-cli` download/unpack, `install` (prints the admin password), `running`, `logs`
  (exit 137 = out of memory), `resetpwd`, `down/up`, `update` — plus the existing bhcli
  auth/upload/mark workflow. Notes cover RAM (≥ 8 GB), localhost binding and ingest paths.
- Hover help and zsh completions for `bloodhound-cli` (with subcommands).
- README "BloodHound without the GUI" section starts with the CE setup snippet.

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
