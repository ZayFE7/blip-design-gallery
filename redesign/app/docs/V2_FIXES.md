# v2 validation and fixes

The current assembled chat and 37-state mascot revision passes strict TypeScript and the production Vite build. A first Chromium route pass found no runtime exceptions or horizontal overflow on all 11 screens at 1440px and 390px.

Interaction checks passed for collapsed activity, on-demand workspace/options, offline message representation, all 37 mascot states including rapid interruption, actual pause freeze, and static reduced motion.

A concrete regression was found: leaving a conversation discarded the unsent draft. The composer now persists text and attachment metadata per conversation in browser storage, and clears them only after handing the message to the local simulator. Queue rows are collapsed under one compact count rather than permanently stacked. Model/attachment controls are quieter and helper text appears only during focus.

The global header no longer repeats a second live status in the chat reading path; the compact event summary is the single live activity line. Conversations are named in the thread, not duplicated in its breadcrumb.

The new draft/queue/header changes require a fresh build and browser recheck before the revision is marked release-ready. All execution remains explicitly simulated. No credentials or real account data are part of these changes.
