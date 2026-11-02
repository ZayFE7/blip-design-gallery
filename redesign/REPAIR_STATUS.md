# Interrupted revision repair

2026-11-02 UTC

The branch at `1bd92be` reproduced two TypeScript errors: missing `utils/mascotEngine` and missing `utils/mascot-poses.js`. The preparation script retired those baseline files before the replacement was committed.

The script now preserves the complete original renderer and original state mappings unless all three required replacement modules are actually present. Retirement, state extension and new phase mappings are gated together. The original ZIP and main remain untouched.

This commit repairs the dependency-order defect. Fresh typecheck/build and browser verification are the next step; no unrun checks are claimed here.
