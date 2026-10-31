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

Deployment access: direct LAN SSH to site-and-git times out from the workstation.
The existing `dsh@harness-test` Tailnet hop is available, but the `user` account
on site-and-git rejects that hop's key. No production file/container was changed.
The endpoint's first-seen ED25519 public host key was recorded using OpenSSH
accept-new; changed host keys remain refused. Do not report this source checkpoint
as a deployed site. Existing deployment instructions remain in README.md.
