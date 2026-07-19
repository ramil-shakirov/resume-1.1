# Architecture

Static fork of `Resume/frontend/Resume_freestyle`, migrated off SAP BTP so it can run on GitHub Pages without a live backend.

## What changed vs. the BTP version
- **Data source**: the app no longer calls the OData V4 service (`/sap/opu/odata4/...`). `backend/resume.json` is now the single source of truth for resume content (pulled once from the live `ZRS_RESUME` / `ZRS_EXPERIENCE` / `ZRS_EDUCATION` tables via the ABAP ADT MCP server).
- **UI5 runtime**: `frontend/webapp/index.html` bootstraps SAPUI5 from the public CDN (`sdk.openui5.org`) instead of `resources/sap-ui-core.js`, which was only served locally by the UI5 dev server / BTP destination.
- **Controller**: `CV.controller.js#_loadData` does a plain `fetch("model/resume.json")` into a `JSONModel` named `cv`, instead of binding an OData v4 list. The view (`CV.view.xml`) and CSS (`cv.css`) are untouched — same bindings (`cv>/...`), same design.
- **manifest.json**: the `sap.app.dataSources` and `sap.ui5.models[""]` OData entries are removed; nothing else changed.

## What did NOT change
- Design, layout, Fiori styling — identical to the BTP version.
- Weather widget (`_loadWeather`) — still calls `api.openweathermap.org` client-side with the same (hardcoded) API key. Revisiting that key is a deliberately separate, later step.
- PDF export (`onPrint`) — pure client-side HTML/print generation, never touched the backend.

## Data flow
```
backend/resume.json  (source of truth, edit this)
        │  copied by frontend/scripts/sync-data.js (local) or the deploy workflow (CI)
        ▼
frontend/webapp/model/resume.json  (what the running app actually fetches)
        │
        ▼
CV.controller.js → JSONModel "cv" → CV.view.xml bindings
```

To update the resume content: edit `backend/resume.json`, then run `npm run sync-data` inside `frontend/` before testing locally with `npm start`. The GitHub Actions deploy workflow does this copy automatically on every push, so `frontend/webapp/model/resume.json` never needs to be hand-edited.

## Deployment
See [github-pages-setup.md](github-pages-setup.md). Deploys via a GitHub Actions workflow (`.github/workflows/deploy.yml`) that publishes `frontend/webapp/` as the Pages artifact root — so the published site's root URL serves `index.html` directly, independent of where the app lives in this source tree.
