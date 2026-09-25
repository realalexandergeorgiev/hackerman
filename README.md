# Hackerman v1.20.0

> Single-file, offline Active Directory attack helper for Kali — fill in the context, get the next-step commands.

Built by **@bongoalex** with **deepseek**.

---

## What it is

`index.html` is a self-contained reference and wizard for AD penetration testing on HTB-style
labs and internal engagements. No server, no build step, no CDN, no telemetry — open the file in
a browser and everything works offline.

You enter what you have (domain, DC, hosts, credentials, hashes, keys, tickets, …) and every
recipe re-renders with your values, ranked by how likely it is to apply, with inline help for
non-obvious tools and attacks.

## Features

- **Context bar** — domain/realm, DC host/FQDN/IP/DN, target, user, password, NT hash, AES key,
  ccache, attacker IP/interface, listener port, rogue machine, CA/template, group, krbtgt key,
  SIDs, parent domain, wordlist, keytab, output file. Persisted in `localStorage`, plus named
  presets and JSON export/import.
- **Loot tab — multiple identities** — keep foothold, partner-domain, victim and impersonation
  accounts (password, NT hash, AES key, ccache, RID) in their own store; apply them per click or via
  the `▾` next to every credential field. Wizard steps and recipe cards show which credentials they
  use and suggest matching loot entries.
- **Derived fields** (`realm`, `domain_dn`, `dc_fqdn`, `target_fqdn`) are visually distinct
  (dashed border, cyan value, `auto` tag) and hovering them highlights the source fields they are
  computed from.
- **Required-field guard** — empty required fields get an amber marker; the header counter
  (`N required missing`) opens the context bar and flashes the missing fields on click.
- **Colored arguments** — domains cyan, hosts/DNs yellow, IPs orange, users green, secrets red,
  hashes magenta, AES keys purple, SPNs blue, file paths violet, SIDs indigo. Missing values are
  highlighted (`‹DC IP?›`), and the card gets a `missing:` badge. Related identity fields share a
  left-border hue (loot-entry colour when matched, role colour otherwise) so user/password/hash
  bundles are visible at a glance.
- **Click-to-set placeholders** — click any `‹value?›` inside a command or note to set it right
  there in a small popover. Rendered values are clickable too: click `eric.dutton` to change it
  (a selection guard keeps text marking/copying working). Derived values jump to their source
  fields instead.
- **Readiness highlighting** — commands that can run with the current context get a brighter
  background and a `ready` badge; `ready only` filter and `ready → priority` sort are available.
- **Applicability tiers** — every recipe/flow is ranked `always` / `common` / `situational` /
  `rare`. Default sort is priority → ready, with tier filter chips in the toolbar.
- **Hover help** — `?` markers on titles and command labels explain the attack or tool, with usage
  and pitfalls (66 tool entries, 57 attack entries); toggle with the `help` chip.
- **Context field tooltips** — hover any context label (dotted underline) for a structured
  **What / Where / Careful** explanation: `--get-sid` for SIDs, trust-account/key commands, hash
  sources, SPN/DN lookups, certipy fields, … Derived fields show their formula. Toggle with the
  `help` chip.
- **LDAPS by default** — every raw `ldapsearch` runs over `ldaps://` (636) with
  `LDAPTLS_REQCERT=never` (self-signed DC certs); a dedicated **LDAP over TLS** card covers the
  STARTTLS fallback, certificate grab and per-tool TLS flags (nxc `--port 636`, bloodyAD `-s`,
  impacket `-use-ldaps`, certipy defaults to LDAPS).
- **Cross-trust coercion & relay** — dedicated card: coerce a partner DC (PrinterBug, PetitPotam,
  WebDAV listener, coercer), relay the machine account to the partner LDAP(S)/ADCS (ESC8/ESC11), or
  into an unconstrained-delegation host of your own domain — with trust-direction,
  selective-authentication and EPA/signing pitfalls called out.
- **Recipe focus overlay** — click any recipe card for a full-width popup (Esc / backdrop / ×
  closes). Copy buttons, hover help and click-to-set keep working inside; the overlay refreshes
  when the context changes.
- **Visible requirements** — every recipe carries requirement tags (DA, DCSync, local admin, write
  rights, ADCS enrollment, …) as amber chips with the full list on expand/overlay; wizard flows
  show prerequisites and per-step `needs:` hints, so it is clear what a technique actually requires.
- **Compact lists** — recipe cards render collapsed (header + short description) by default so 127
  recipes stay scannable; click a card to open it in the focus overlay, or switch the `compact`
  chip off to expand everything inline. Wizard steps collapse as well: only the first unfinished
  step is open, checking a step auto-advances to the next, and `expand all`/`collapse all` sit in
  the flow header.
- **zsh completion export** — the header button generates `_hackerman` from the embedded recipes
  (flags, subcommands, nxc `-M` modules, hashcat modes, xfreerdp options); see below.
- **`proxychains` toggle** — prefixes network commands, local tools (Responder, hashcat, SMB
  server, krb5 tooling) are exempt.
- **128 recipes** across 13 categories, each with a copy button per command and for the whole card.
- **17 wizard flows** — pick what you have, get an ordered runbook with collapsible steps, progress
  checkboxes, per-step credential needs and "copy flow as markdown". Includes the DC-object flow
  (write rights on a DC → RBCD/shadow credentials → DCSync).
- **43 BloodHound Cypher queries** — collection commands plus pathfinding/rights snippets (CE / legacy):
  high-value paths, DCSync/write rights, LAPS/gMSA readers, sessions on owned hosts, ADCS CA rights, domain SIDs, …
- **BH workflow (`bhcli`)** — terminal-first BloodHound: setup/audit recipes, **mark Owned/Tier Zero**
  (users + computers via `bhcli mark`, groups/Domains/OUs via the CE GUI), a `bhcli` copy button on
  every Cypher query and a JSON export for `bhcli queries` (see below).
- **Search** (`/` or `Ctrl/Cmd+K`), category/tier filters, `localStorage` UI state.

## Quick start

```sh
xdg-open index.html        # or just double-click the file
```

1. Fill the **Context** bar, or press **example** for the argon.htb demo values.
2. Open **Wizard** and pick your situation (credentials, hash, ccache, keytab, RBCD, ADCS, …).
3. Or use **Recipes** — search/filter, hover the `?` markers, click placeholders to fill them.
4. Toggle **proxychains** when you attack through a pivot.

## Coverage (128 recipes)

| Category | # | Highlights |
|---|---:|---|
| Recon & Auth | 11 | auth checks (pw/PtH/ccache), shares, spider_plus, user/group enum, **kerbrute**, password spraying, **session hunting**, **LDAP dumps**, **LDAP over TLS** |
| BloodyAD | 8 | auth styles (pw/hash/ccache/keytab), `get writable`, SPN add/del, password/UAC/groups, **BadSuccessor/dMSA** |
| Kerberos | 11 | **kerberos-auth helper** (krb5.conf, hosts, ntp/rdate/faketime, unset, kinit/klist/kvno, per-tool cheat sheet), keytab extraction, AS-REP, kerberoasting, targeted kerberoast, getTGT/getST, golden/silver, **ticket inspection/renewal** |
| Delegation & RBCD | 11 | full RBCD runbook, **RBCD/shadow-cred path against a DC**, **SPN hijack → constrained delegation → DC takeover**, constrained/unconstrained abuse |
| ADCS / Certipy | 15 | find, ESC1, **ESC2/ESC3**, ESC4, **ESC5/12/14 recon**, **ESC6**, **ESC7**, ESC8 relay, **ESC9/ESC16**, **ESC10**, **ESC11**, **ESC13**, **ESC15 (EKUwu)**, **ESC17**, **golden certificate** |
| ACL / DACL Abuse | 9 | enum, GenericAll user/computer/group, ForceChangePassword/AddSelf, WriteDACL→DCSync, WriteOwner, shadow credentials, **AdminSDHolder** |
| Creds & Secrets | 8 | DCSync, SAM/LSA/LSASS, DPAPI, gMSA/LAPS, offline ntds.dit, **SeBackupPrivilege**, **Linux loot**, **Windows registry loot** |
| Poisoning & Relay | 7 | Responder, **mitm6**, ntlmrelayx SMB/LDAP(S) incl. LDAP shell + LAPS/gMSA dumps, ADCS/SOCKS relay, RBCD via relay, coercion |
| Lateral Movement | 7 | WinRM, nxc exec, impacket exec family, **dcomexec/services/reg**, **rdp-auth helper**, file transfer |
| Post-Exploitation | 17 | SeImpersonate, **UAC bypass**, **SeBackup**, **DSRM**, **DNSAdmins**, AV/Defender checks, **linpeas/winpeas**, **reverse shells**, GPO abuse, ADIDNS, **ZeroLogon**, **noPac**, **PrintNightmare**, **Certifried**, **KrbRelayUp**, **Entra ID Connect**, **ADFS Golden SAML**, **SCCM** |
| MSSQL | 6 | connect (pw/hash/ccache), xp_cmdshell, **OLE/CLR RCE**, impersonation, linked servers, NetNTLM theft |
| Trusts | 11 | trust enum (+ direction/attributes), **cross-domain roasting**, **SID history / ExtraSIDs**, **foreign group membership**, **cross-trust coercion & relay**, **DCSync across the trust** (who may replicate), raiseChild / trust-key golden ticket, **second-domain cards** (collect, recon, mark, abuse) |
| BloodHound | 7 | bloodhound-python / **bloodhound-ce-python**, nxc `--bloodhound`, **bhcli workflow** (CE setup, lists/audit, mark Owned, cypher, alternatives) |

### Wizard flows

Valid credentials · NT hash (PtH) · AES key / ccache · keytab · write rights over a computer
(RBCD) · **write rights over a DC object** (RBCD/shadow credentials → DCSync) · constrained
delegation · unconstrained delegation / coercion · ADCS · ACL rights over user/group/computer ·
MSSQL · no credentials (poison/relay/coerce) · Windows shell foothold · domain trusts ·
second/partner-domain foothold (collect, recon, mark, abuse) · GPO/ADIDNS · Domain Admin /
krbtgt endgame.

## Design notes

- Recipes are data: `R({id, cat, title, desc, cmds:[[template, label, flags]], note})`.
  Templates use `{{variable}}` placeholders; flags are `n` (no proxychains) and `s` (sudo).
- Central maps keep maintenance cheap: `PRI_TIERS`/`FLOW_PRI` (applicability), `HELP_TOOL` and
  `HELP_ATTACK` (hover help). New recipes go before the `/* @@RECIPES@@ */` marker.
- Clicking a `‹var?›` placeholder opens `#missPop`; derived variables redirect to their source
  fields via `focusContextFields()`.
- All state lives in `localStorage` (`adah.state.v1`, `adah.progress.v1`, `adah.presets.v1`,
  `adah.ui.v1`) — export/import presets in the header before switching browser profiles.
- No external assets: system font stacks, everything else inline.

### Verify after editing

```sh
python3 - <<'EOF'
import re
html = open('index.html').read()
js = re.search(r'<script>(.*)</script>', html, re.S).group(1)
open('/tmp/app.js','w').write(js.replace('initUI();', '/*disabled*/', 1))
EOF
node --check /tmp/app.js
```

Then open the page and check the browser console for errors.

## BloodHound without the GUI (bhcli)

The BloodHound tab includes a **CLI workflow** section. Start with a minimal local
BloodHound CE (Docker; **≥ 8 GB RAM**, otherwise the container may exit with code 137):

```sh
sudo apt update && sudo apt install -y docker.io docker-compose-v2   # Desktop/Podman also work
sudo usermod -aG docker $USER                                         # re-login afterwards
wget https://github.com/SpecterOps/bloodhound-cli/releases/latest/download/bloodhound-cli-linux-amd64.tar.gz
tar -xvzf bloodhound-cli-linux-amd64.tar.gz && sudo mv bloodhound-cli /usr/local/bin/
bloodhound-cli install     # prints the generated admin password
bloodhound-cli running     # container status; 'logs', 'resetpwd', 'update', 'down/up' for management
# UI: http://localhost:8080/ui/login  (user: admin)
```

Then talk to it from the terminal with
[bhcli](https://github.com/exploide/bhcli), an unofficial client for the BloodHound CE API
(works with the default PostgreSQL backend and Neo4j alike):

```sh
git clone https://github.com/exploide/bhcli.git && cd bhcli && pipx install .
bhcli auth http://localhost:8080          # store an API token
bhcli upload *.zip                        # ingest collector output
bhcli mark Owned --file valid-users.txt   # mark owned accounts
bhcli audit -d corp.local                 # quick findings list
bhcli cypher 'MATCH (c:Computer {unconstraineddelegation:true}) RETURN c.name' | jq
```

Every Cypher query in the BloodHound tab has a **bhcli** copy button that produces the exact
`bhcli cypher '<query>'` command, and **export for bhcli** downloads all 43 queries as
`hackerman-bhcli-queries.json`, importable with:

```sh
bhcli queries hackerman-bhcli-queries.json
```

Alternatives (covered in the `bhcli-alternatives` recipe): **Blade** (CE + Neo4j, ready-made
ADCS/privilege lists), **CypherHound** (query templates + CE importer), **deathhound** (Neo4j),
the PyPI **bloodhound-cli** (legacy + CE, `--edition`), and `cypher-shell` (Neo4j backend only).
SpecterOps' `bloodhound-cli` only installs/manages the server — it does not query.

## zsh completions

The **zsh** button in the header generates a single `_hackerman` completion file from the recipe
data and offers it in a modal with copy and download. The same output is committed and can be
regenerated headlessly:

```sh
node tools/gen-zsh-completions.mjs
```

Install:

```zsh
mkdir -p ~/.zsh/completions
cp completions/_hackerman ~/.zsh/completions/
# in ~/.zshrc:
fpath=(~/.zsh/completions $fpath)
autoload -Uz compinit && compinit
```

Completions are generated for directly callable binaries (`impacket-*`, `nxc`, `certipy`,
`bloodyAD`, `kerbrute`, `xfreerdp3`, `hashcat`, …) including subcommands, nxc modules, hashcat
modes and xfreerdp options. `*.py` helpers are skipped (they need a `python3` prefix, which zsh
cannot key on).

## Disclaimer

For **authorized security testing only** — HTB labs, your own infrastructure, or engagements with
a signed scope. Syntax of bloodyAD, NetExec, Certipy, Impacket and FreeRDP changes between
versions; every card notes version caveats, but always cross-check against your target versions
and [thehacker.recipes](https://www.thehacker.recipes).

## Credits

- [Impacket](https://github.com/fortra/impacket), [NetExec](https://github.com/Pennyw0rth/NetExec),
  [bloodyAD](https://github.com/CravateRouge/bloodyAD), [Certipy](https://github.com/ly4k/Certipy),
  [BloodHound](https://github.com/SpecterOps/BloodHound), [Responder](https://github.com/lgandx/Responder),
  [Kerbrute](https://github.com/ropnop/kerbrute), [SCCMHunter](https://github.com/garrettfoster13/sccmhunter),
  [PEASS-ng](https://github.com/peass-ng/PEASS-ng), [KeyTabExtract](https://github.com/sosdave/KeyTabExtract), FreeRDP
- Techniques documented by [The Hacker Recipes](https://www.thehacker.recipes) and the community

## Files

| File | Purpose |
|---|---|
| `index.html` | the tool (single file, open in any browser) |
| `completions/_hackerman` | generated zsh completions |
| `tools/gen-zsh-completions.mjs` | headless generator for `completions/_hackerman` |
| `README.md` | this file |
| `CHANGELOG.md` | version history |
| `.gitignore` | ignores pentest output (ccache, kirbi, hashes, loot) |
