# Architektur

## Übersicht

Freestyle SAP Fiori/UI5-Anwendung mit statischer 
JSON-Datenquelle, deployed via GitHub Actions 
auf GitHub Pages. Entwickelt mit Unterstützung 
von Claude Code (KI-gestützte Entwicklung).

## Technische Entscheidungen

### Datenschicht
- Ursprünglich: OData V4 Service auf SAP BTP 
  ABAP Environment (Tabellen ZRS_RESUME, 
  ZRS_EXPERIENCE, ZRS_EDUCATION)
- Aktuell: statisches `backend/resume.json`
- Datenmigration via ABAP ADT MCP Server

### Frontend
- SAP UI5 Freestyle (keine Fiori Elements Templates)
- UI5 Runtime: CDN (sdk.openui5.org)
- Controller: JSON-Datei statt OData V4 Binding
- View und CSS unverändert — gleiche Bindings

### Integrationen
- OpenWeatherMap API (client-side)
- PDF Export (client-side, HTML/Print)

## Deployment
GitHub Actions → GitHub Pages  
Workflow: `.github/workflows/deploy.yml`  
Jeder Push auf `main` triggert automatischen Redeploy.

## Entwicklungswerkzeuge
- VSCode/Claude AI — KI-gestützte Entwicklung & Code-Review
- ABAP ADT MCP Server — SAP-Integration
- abapGit — Versionskontrolle
