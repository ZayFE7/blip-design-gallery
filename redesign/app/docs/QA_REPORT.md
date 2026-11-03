# BLIP v2 validation

The source remains based on the user's byte-identical first redesign checkpoint, not a replacement app.

Fresh strict TypeScript and Vite production builds passed after the continuous-clock fix. A fresh Chromium pass rendered all 11 screens at 1440x1000 and 390x844 without crashes, runtime exceptions or horizontal document overflow. Default route browsing made no external network requests.

Targeted interaction checks passed for:

1. Conversation-first layout, closed activity and on-demand workspace.
2. Draft text and attachment metadata surviving history navigation and reload.
3. Honest offline queue handoff with collapsed queue details.
4. All 37 mascot state controls rendering, plus rapidly interrupted recovery states.
5. Pause freezing the exact current pose.
6. Reduced motion yielding unchanged canvas output.
7. The selected mobile conversation and its dismissible options menu.
8. Progress arcs staying monotonically continuous across a full pose-cycle wrap.

A remaining defect was identified and fixed: the renderer previously tied progress-arc angle to the wrapping facial-pose time. It now uses a separate continuous clock which still freezes during pause or reduced motion. An instrumented Chromium check crossed the cycle boundary and found no backward angular step.

`redesign/smoke.py` saves a reproducible machine-readable report to `workspace/docs/QA_V2_RESULTS.json`. Run it after building. These are targeted Chromium smoke checks, not an exhaustive regression suite, security assessment, cross-browser guarantee or WCAG certification. Agent execution and connected accounts remain simulated.
