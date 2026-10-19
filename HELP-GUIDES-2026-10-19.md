# Help guides update - 2026-10-19

Owner request: align the website animations with the current app's three-dot
menu, and fix the final public-server frame showing no results and a disabled
Connect button. Live site currently serves 50d2399f at ninitux.com; the
vpn.ninitux.com root is the separate static install page, not the guide player.

Scope: regenerate both-language frames from current Windows UI, show menu then
Advanced mode, and show offline sample public results before Connect. Update
bilingual captions, cursor positions and browser checks. Preserve visual design,
mascot, stable download version and original checkout/index.

Verification: Python renderer check, lint/types/production build/browser CI,
visual inspection of menu and final frame, public deployment exact-SHA and smoke.
Rollback: previous production directory/image. Changes and deploy are explicitly
requested; no default-branch migration or unrelated repository merge.

Outcome pending.
