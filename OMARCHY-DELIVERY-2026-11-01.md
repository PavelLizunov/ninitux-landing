# Omarchy delivery update — 2026-11-01

Source base: `e7d001f` on `fix/current-help-guides`, the documented live-site line.
`main` is still the historical static page, so this change does not migrate it.

Adds a bilingual Omarchy section after download, an exact native plugin install
command with the existing copy control, real installation/privilege steps, and
EN/RU videos. Linux download now links to this native option. Existing standalone
Windows/macOS/Linux guides retain their scope and point out that Omarchy differs.

The 24-second videos are captured frames of the actual VPNRouter QML consumer,
with inert sample data, not reconstructed HTML or a real network connection.
Source: plugin `4e66c9e` plus Header/HeroCard sourceSize+mipmap corrections.
QML Qt 6.12 software/offscreen; eight runs, 60 frames each at 440x764, ten fps.
No unexpected recording diagnostics. Each route holds for two seconds; all nine
advanced sections, Home and subscription entry are shown. WebM VP9 and MP4 H264
are supplied with posters. The page does not autoplay the videos.

Plugin evidence: 13 JS suites, 42 packaging checks, 68 native-QML interaction
cases passed; final decode sizing has 16 DPR1/2 theme/locale renders. The package
is byte-identical to successful upstream exact-source CI artifact 40348520604,
not an independently reproduced build. A native fresh clone/validate/enable
check passed with explicitly stubbed shell IPC. This is not live VPN acceptance.

Site source/diff read directly. PR #6 merged the section/media; PR #7 added
actual bilingual video playback, decoded size/duration/seek, exact command
clipboard and Linux anchor checks. CI run 41245485534 passed lint, types,
production Docker build and 29 browser checks, zero failures. The captured
Omarchy section at playback time 22 seconds was inspected inline. Final live-
source branch SHA: `583041d02aeb59660d17177dcf0ada1c5e4f1b8b`.
This is successful isolated browser evidence, not a production deployment.

Initial deployment attempt: direct LAN SSH to site-and-git timed out from the workstation.
The existing `dsh@harness-test` Tailnet hop is available, but the `user` account
on site-and-git rejects that hop's key. No production file/container was changed.
The endpoint's first-seen ED25519 public host key was recorded using OpenSSH
accept-new; changed host keys remain refused. Do not report this source checkpoint
as a deployed site. Existing deployment instructions remain in README.md.

## Production publication completed — 2026-11-01

Resumed from pi session `01a193b2-b54e-7265-b61c-ec718c914ccd`.
Deployed `583041d02aeb59660d17177dcf0ada1c5e4f1b8b` to the existing
`ninitux-landing` container on site-and-git (VM 118). Its tree is identical to
the successful CI candidate `e93729366d41c0eff992db81aaab6fd6d986cf3c`.

Used the existing authenticated harness-test → pve-ninitux3 → QEMU Guest Agent
management path. No SSH keys, SSH configuration or access policies were changed.
The previous production files matched `b3ad55402456ee83c167d6d7e13c9a9b1827248d`
exactly, apart from `DEPLOYED_SHA`; no server-local source edits were overwritten.
Downloaded the exact commit archive, built it in a staging directory, then
replaced the existing Compose service. Build and activation units exited 0;
the new container reported `healthy`.

Production image: `sha256:4cee228e345c251c61e77d4f7ab4bd7a029ba7f914883ac30eed9007edd0f56c`.
Source marker: `/home/user/ninitux-landing-next/DEPLOYED_SHA`.
Previous source: `/home/user/ninitux-landing-next.bak-omarchy-20261101`.
Previous image retained as `ninitux-landing:rollback-omarchy-20261101`.

Public browser smoke at `https://ninitux.com/` confirmed the Omarchy section,
the exact install command and the Linux installation link. Both EN/RU videos
decoded at 440×764, played and sought to 22 seconds of their 24-second duration.
The live copy handler reached its success state; reading the system clipboard
was unavailable through the preview browser, so clipboard equality is supported
by the earlier CI result, not a new production clipboard read. Desktop layout
was inspected. After navigation applied the requested 390px viewport, the public
RU page and Omarchy section loaded without horizontal document overflow
(`scrollWidth` and `clientWidth` both 375px, excluding the scrollbar).

The Marketplace submission remains open with `validated` and
`security-review-required` labels; publication there still needs maintainer
review: https://github.com/omacom/omarchy-plugin-marketplace/issues/13500.

## Installation placement correction — 2026-11-01

Owner correction: Omarchy belongs inside “Download and install”. Removed its
standalone page section and added an Omarchy installation tab alongside Windows,
macOS, Linux and Android. The command, steps and bilingual videos are now inside
that tab. The Linux link selects it; existing `#omarchy` links and `?os=omarchy`
open it directly. Updated the standalone guide wording in both languages.

Deployed source: `9b41082f95457516cfcc61bbcf7bb66a537daae3` on
`fix/current-help-guides`. The production build and Compose activation both
exited 0; container health is `healthy`. Image:
`sha256:7ed0be63355c186c23b40eda9131d5d1d3445a4f39b212d5f265262758032616`.
Previous source/image are retained at
`/home/user/ninitux-landing-next.bak-omarchy-tab-9b41082` and
`ninitux-landing:rollback-omarchy-tab-9b41082`. No new browser or test-suite run
was performed for this placement change; the earlier browser evidence above
describes the preceding deployment.

### Follow-up after Marketplace acceptance

Re-read issue #13500 and the specifically supplied validation comment
https://github.com/omacom/omarchy-plugin-marketplace/issues/13500#issuecomment-6549573810.
It says “Ready for listing review”; the issue still has
`security-review-required`, without `approved-and-verified`. The current official
registry contains no matching repository or plugin ID. The marketplace homepage
redirects from https://omarchyplugins.com/ to https://plugins.omarchy.org/.

Once the plugin is accepted and its public card exists, add that exact card link
to this site's “Download and install → Omarchy” panel in both languages. Keep
the working direct installation command. This is a recorded follow-up, not an
automatic status watcher; no Marketplace listing claim or guessed card URL was
published.
