# Fiori Resume Application
### SAP UI5 · JSON Data · Weather API · PDF Export

**Live Demo:** https://ramil-shakirov.github.io/resume-1.1/

---

## Über das Projekt
Eine Freestyle SAP Fiori/UI5-Anwendung als interaktives 
Lebenslauf-Projekt. Demonstriert praktische Erfahrung 
mit moderner SAP UI5-Entwicklung, API-Integration 
und CI/CD-Deployment.

Ursprünglich mit SAP BTP ABAP Environment Backend 
(OData-Service) entwickelt — für das Hosting auf 
GitHub Pages auf eine statische JSON-Datenquelle 
migriert.

## Technologie-Stack
- SAP UI5 (Freestyle)
- Lokale JSON-Datenquelle
- OpenWeatherMap API Integration
- PDF-Export-Funktion
- GitHub Actions CI/CD → GitHub Pages

## Architektur
Siehe [docs/architecture.md](docs/architecture.md)

## Funktionen
- Lebenslaufdaten aus lokalem JSON
- Echtzeit-Wetter-Widget (Berlin)
- PDF-Export per Knopfdruck
- Responsives Fiori-Design

## Lokale Entwicklung
```
cd frontend
npm install
npm start
```
