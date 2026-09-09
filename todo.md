# ToDo-app – Opgaveplan

Plan i faser til udvikling af ToDo-appen. Tag dem én ad gangen.

## 1. Opsætning
- Opret projektmappe + git repo (til aflevering)
- Lav `index.html`, `style.css`, `script.js`
- Byg det simple skelet: input-felt, "tilføj"-knap, to lister (ToDo / Færdig)

## 2. Grundlæggende CRUD-funktionalitet (Create, read, update, delete)
- Opret task-objekt med `id`, `text`, `done`, `date`, `outdoor`, `weather`
- Vis tasks i DOM ud fra et array
- Tilføj ny task (generér unikt ID, fx `crypto.randomUUID()` eller timestamp)
- Marker som færdig → flyt til "Færdig"-liste
- Fortryd færdig → flyt tilbage til ToDo
- Slet task

## 3. Datovælger
- Tilføj `<input type="date">` ved oprettelse
- Vis dato pænt på hver task

## 4. Outdoor + vejr
- Checkbox/toggle "Udendørs" på hver task
- Integrér Open-Meteo API (kald med lat/lon)
- Vis vejret for taskens dato på task-kortet
- Logik: hvis regn + outdoor → vis som "utilgængelig" med besked til brugeren
- Fejlhåndtering: hvad sker der hvis API'et fejler eller er langsomt? (loading state, fallback-besked)

## 5. localStorage (ekstra, men gør det let)
- Gem hele task-listen i localStorage ved hver ændring
- Indlæs fra localStorage ved page load

## 6. Lokation for vejr (ekstra)
- Lad bruger vælge/indtaste by eller bruge geolocation
- Slå by op til koordinater (fx via Open-Meteo's geocoding API)

## 7. Design & feedback
- Styling: farver, spacing, hover/active states
- Feedback: toasts/animationer ved tilføj/slet/færdig, loading spinner ved vejr-kald, fejlbeskeder

## 8. Dokumentation
- Skriv 1-3 siders procesdokumentation (tekst + screendumps)
- Optag screencast (max 3 min, individuel selvom I er to)
- Saml links (app, GitHub, screencast) øverst i PDF'en

## 9. Aflevering
- Tjek alt virker end-to-end
- Aflever i WiseFlow senest torsdag d. 10. september kl. 23:59

