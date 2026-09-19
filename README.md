# Hackerman v1.2.0

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
- **Derived fields** (`realm`, `domain_dn`, `dc_fqdn`, `target_fqdn`) are visually distinct
  (dashed border, cyan value, `auto` tag) and hovering them highlights the source fields they are
  computed from.
- **Required-field guard** — empty required fields get an amber marker; the header counter
  (`N required missing`) opens the context bar and flashes the missing fields on click.
- **Colored arguments** — domains cyan, hosts/DNs yellow, IPs orange, users green, secrets red,
  hashes magenta, AES keys purple, SPNs blue, file paths violet, SIDs indigo. Missing values are
  highlighted (`‹DC IP?›`), and the card gets a `missing:` badge.
- **Click-to-set placeholders** — click any `‹value?›` inside a command or note to set it right
  there in a small popover. Rendered values are clickable too: click `eric.dutton` to change it
  (a selection guard keeps text marking/copying working). Derived values jump to their source
  fields instead.
- **Readiness highlighting** — commands that can run with the current context get a brighter
  background and a `ready` badge; `ready only` filter and `ready → priority` sort are available.
- **Applicability tiers** — every recipe/flow is ranked `always` / `common` / `situational` /
  `rare`. Default sort is priority → ready, with tier filter chips in the toolbar.
- **Hover help** — `?` markers on titles and command labels explain the attack or tool
  (54 tool entries, 34 attack entries); toggle with the `help` chip.
- **`proxychains` toggle** — prefixes network commands, local tools (Responder, hashcat, SMB
  server, krb5 tooling) are exempt.
- **93 recipes** across 13 categories, each with a copy button per command and for the whole card.
- **15 wizard flows** — pick what you have, get an ordered runbook with progress checkboxes and
  "copy flow as markdown".
- **16 BloodHound Cypher queries** — collection commands plus pathfinding snippets (CE / legacy).
- **Search** (`/` or `Ctrl/Cmd+K`), category/tier filters, `localStorage` UI state.

## Quick start

```sh
xdg-open index.html        # or just double-click the file
```

1. Fill the **Context** bar, or press **example** for the argon.htb demo values.
2. Open **Wizard** and pick your situation (credentials, hash, ccache, keytab, RBCD, ADCS, …).
3. Or use **Recipes** — search/filter, hover the `?` markers, click placeholders to fill them.
4. Toggle **proxychains** when you attack through a pivot.

## Coverage (93 recipes)

| Category | # | Highlights |
|---|---:|---|
| Recon & Auth | 10 | auth checks (pw/PtH/ccache), shares, spider_plus, user/group enum, **kerbrute**, password spraying, **session hunting**, **LDAP dumps** |
| BloodyAD | 7 | auth styles (pw/hash/ccache/keytab), `get writable`, SPN add/del, password/UAC/groups |
| Kerberos | 11 | **kerberos-auth helper** (krb5.conf, hosts, ntp/rdate/faketime, unset, kinit/klist/kvno, per-tool cheat sheet), keytab extraction, AS-REP, kerberoasting, targeted kerberoast, getTGT/getST, golden/silver, **ticket inspection/renewal** |
| Delegation & RBCD | 10 | full RBCD runbook, **SPN hijack → constrained delegation → DC takeover**, constrained/unconstrained abuse |
| ADCS / Certipy | 15 | find, ESC1, **ESC2/ESC3**, ESC4, **ESC5/12/14 recon**, **ESC6**, **ESC7**, ESC8 relay, **ESC9/ESC16**, **ESC10**, **ESC11**, **ESC13**, **ESC15 (EKUwu)**, **ESC17**, **golden certificate** |
| ACL / DACL Abuse | 9 | enum, GenericAll user/computer/group, ForceChangePassword/AddSelf, WriteDACL→DCSync, WriteOwner, shadow credentials, **AdminSDHolder** |
| Creds & Secrets | 7 | DCSync, SAM/LSA/LSASS, DPAPI, gMSA/LAPS, offline ntds.dit, **Linux loot**, **Windows registry loot** |
| Poisoning & Relay | 6 | Responder, ntlmrelayx SMB/LDAP/ADCS/SOCKS, RBCD via relay, coercion |
| Lateral Movement | 6 | WinRM, nxc exec, impacket exec family, **rdp-auth helper**, file transfer |
| Post-Exploitation | 10 | SeImpersonate potatoes, **AV/Defender checks**, **linpeas/winpeas**, **reverse shells**, GPO abuse, ADIDNS, **ZeroLogon**, **noPac**, **PrintNightmare**, **SCCM** |
| MSSQL | 6 | connect (pw/hash/ccache), xp_cmdshell, **OLE/CLR RCE**, impersonation, linked servers, NetNTLM theft |
| Trusts | 2 | trust enum, raiseChild / trust-key golden ticket |
| BloodHound Collection | 2 | bloodhound-python, nxc `--bloodhound` |

### Wizard flows

Valid credentials · NT hash (PtH) · AES key / ccache · keytab · write rights over a computer
(RBCD) · constrained delegation · unconstrained delegation / coercion · ADCS · ACL rights over
user/group/computer · MSSQL · no credentials (poison/relay/coerce) · Windows shell foothold ·
domain trusts · GPO/ADIDNS · Domain Admin / krbtgt endgame.

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
| `README.md` | this file |
| `CHANGELOG.md` | version history |
| `.gitignore` | ignores pentest output (ccache, kirbi, hashes, loot) |
