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

Deployed content SHA b3ad55402456ee83c167d6d7e13c9a9b1827248d on the
existing prod container, healthy. CI run 39315409094: lint, types, production
Docker build and browser checks passed (27 passed, 0 failed). Public browser
verification exercised 15 frames in each language, menu transitions and final
results; 30/30 loaded, no script errors, 390 px mobile has no horizontal scroll.
Live RU final-frame SHA256 matches public/guide/ru/free-connect.webp.

Frames use the current Windows renderer plus the offline free-results fixture
from VPNRouter PR #606 (artifact at 0c5f22ca). Both final frames visibly show two
reserved example addresses, selected first row and enabled Connect. Added menu
steps and captions in both languages. Existing player and appearance unchanged.
Separate-context review found no supported website defect; fixture coverage was
strengthened to the exact window/navigation/language path with enabled-Button
assertions. No cross-family independent review was available.

Previous production source is retained at ninitux-landing-next.bak-help-20261019.
Its container image ID was not taggable after the fresh image build (Docker
reported no such image), so rollback to that exact source requires a rebuild;
the older rollback-20261009 image remains untouched. No unrelated images removed.
The live source is the task branch; no default-branch migration or broad merge.
App candidate v2.50.5-r3 is published separately; stable remains v2.50.4.
