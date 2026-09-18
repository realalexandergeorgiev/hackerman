# Hackerman v1.0

> Single-file, offline Active Directory attack helper for Kali — fill in the context, get the next-step commands.

Built by **@bongoalex** with **deepseek**.

---

## What it is

`index.html` is a self-contained reference and wizard for AD penetration testing on HTB-style
labs and internal engagements. No server, no build step, no CDN, no telemetry — open the file in
a browser and everything works offline.

You enter what you have (domain, DC, hosts, credentials, hashes, keys, tickets, DCSync targets,
…) and every recipe re-renders with your values, color-coded by argument type.

## Features

- **Context bar** — domain/realm, DC host/FQDN/IP/DN, target, user, password, NT hash, AES key,
  ccache, attacker IP/interface, listener port, rogue machine account, CA/template, group, krbtgt
  key, SIDs, parent domain, wordlist, keytab, output file. Persisted in `localStorage`, plus named
  presets and JSON export/import.
- **Colored arguments** — domains cyan, hosts/DNs yellow, IPs orange, users green, secrets red,
  hashes magenta, AES keys purple, SPNs blue, file paths violet, SIDs indigo. Missing values are
  highlighted (`‹DC IP?›`) and the card gets a `missing: …` badge.
- **`proxychains` toggle** — prefixes every network command, while local tools (Responder,
  hashcat, SMB server, krb5 tooling) are exempt.
- **74 recipes** across 13 categories, each with a copy button per command and for the whole card.
- **15 wizard flows** — pick what you have, get an ordered runbook with progress checkboxes and
  "copy flow as markdown".
- **16 BloodHound Cypher queries** — collection commands plus pathfinding snippets (CE / legacy).
- **Search** (`/` or `Ctrl/Cmd+K`), category filters, `localStorage` progress tracking.

## Quick start

```sh
xdg-open index.html        # or just double-click the file
```

1. Fill the **Context** bar (the more you add, the fewer `missing:` badges you see).
2. Open **Wizard** and pick your situation (credentials, hash, ccache, keytab, RBCD, ADCS, …).
3. Or use **Recipes** directly — search, filter, copy.
4. Toggle **proxychains** when you attack through a pivot.

## Coverage (74 recipes)

| Category | # | Highlights |
|---|---:|---|
| Recon & Auth | 6 | credential/PtH/ccache auth checks, shares, spider_plus, user/group enum |
| BloodyAD | 7 | auth styles (pw/hash/ccache/keytab), `get writable`, SPN add/del, password/UAC/groups |
| Kerberos | 10 | **kerberos-auth helper** (krb5.conf, /etc/hosts, kinit, per-tool cheat sheet), keytab extraction, AS-REP, kerberoasting, targeted kerberoast, getTGT/getST, golden/silver |
| Delegation & RBCD | 10 | **full RBCD runbook** (read → addcomputer → write → getST → use → cleanup), **SPN hijack → constrained delegation → DC takeover**, constrained/unconstrained abuse |
| ADCS / Certipy | 4 | find vulnerable, ESC1, ESC4, ESC8 relay |
| ACL / DACL Abuse | 8 | enum, GenericAll user/computer/group, ForceChangePassword/AddSelf, WriteDACL→DCSync, WriteOwner, shadow credentials |
| Creds & Secrets | 5 | DCSync, SAM/LSA/LSASS, DPAPI, gMSA/LAPS, offline ntds.dit |
| Poisoning & Relay | 6 | Responder, ntlmrelayx SMB/LDAP/ADCS/SOCKS, RBCD via relay, coercion |
| Lateral Movement | 6 | WinRM, nxc exec, impacket exec family, **rdp-auth helper** (Kerberos ccache / Restricted Admin / PtH), file transfer |
| Post-Exploitation | 3 | SeImpersonate potatoes, GPO abuse, ADIDNS takeover |
| MSSQL | 5 | connect (pw/hash/ccache), xp_cmdshell, impersonation, linked servers, NetNTLM theft |
| Trusts | 2 | trust enum, raiseChild / trust-key golden ticket |
| BloodHound Collection | 2 | bloodhound-python, nxc `--bloodhound` |

### Wizard flows

Valid credentials · NT hash (PtH) · AES key / ccache · keytab · **write rights over a computer
(RBCD)** · constrained delegation · unconstrained delegation / coercion · ADCS · ACL rights over
user/group/computer · MSSQL · no credentials (poison/relay/coerce) · Windows shell foothold ·
domain trusts · GPO/ADIDNS · Domain Admin / krbtgt endgame.

## Design notes

- Recipes are data: `R({id, cat, title, desc, cmds:[[template, label, flags]], note})`.
  Templates use `{{variable}}` placeholders; flags are `n` (no proxychains) and `s` (sudo).
  Add new recipes before the `/* @@RECIPES@@ */` marker.
- All state lives in `localStorage` (`adah.state.v1`, `adah.progress.v1`, `adah.presets.v1`) —
  export/import presets in the header before switching browser profiles.
- No external assets: fonts are system stacks, everything else is inline.

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
  [KeyTabExtract](https://github.com/sosdave/KeyTabExtract), FreeRDP
- Techniques documented by [The Hacker Recipes](https://www.thehacker.recipes) and the community

## Files

| File | Purpose |
|---|---|
| `index.html` | the tool (single file, open in any browser) |
| `README.md` | this file |
| `CHANGELOG.md` | version history |
| `.gitignore` | ignores pentest output (ccache, kirbi, hashes, loot) |
