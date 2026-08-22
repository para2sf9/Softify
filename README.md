<img width="1366" height="768" alt="Screenshot (432)" src="https://github.com/user-attachments/assets/95aaf9bf-a6a5-4da5-a77e-d79cb8307884" /># Softify

Softify is a zero-runtime-dependency Node.js demonstration platform covering software engineering quality, QA/QC, SDLC/STLC, requirements, test management, security, automation, environments, releases, reporting, traceability, testing-tool integration concepts, and local test-generation assistance.

## Quick start

Requirements: Node.js 22 or newer.

```bash
npm start
```

Open `http://localhost:4000`.

Demo users:

| Role | Email | Password |
|---|---|---|
| Organization Admin | `admin@softify.local` | `Admin@123` |
| QA Engineer | `qa@softify.local` | `Quality@123` |
| Developer | `dev@softify.local` | `Develop@123` |
| Security Engineer | `security@softify.local` | `Security@123` |

Reset demo data:

```bash
npm run seed
```

Run tests:

```bash
npm test
```

## Included modules

- Dashboard and engineering-quality KPIs
- Project and SDLC lifecycle management
- Requirements engineering
- Traceability matrix
- Test assets, plans, cases, and executions
- Defect lifecycle and root-cause fields
- QA/QC audits and quality gates
- Vulnerability management for SAST, DAST, SCA and related categories
- Automation result repository
- Environment and release management
- Documentation repository
- Testing Tools Hub
- Reports and authenticated CSV export
- Rule-assisted local test generation and defect analysis
- JWT authentication, role permissions, audit events, validation, security headers, password hashing, and login rate limiting
- Responsive dark/light UI and four accent themes

## Architecture

- `server.js` — application entry point
- `src/app.js` — HTTP/static application handler
- `src/router.js` — authenticated API router
- `src/store.js` — atomic JSON persistence layer
- `src/routes/` — API modules
- `public/` — browser application
- `data/softify.json` — generated local data store

This build deliberately uses only Node.js built-ins, so `npm install` is not required.
<img width="1366" height="768" alt="Screenshot (465)" src="https://github.com/user-attachments/assets/77fb2d92-b2c5-4b8c-bb7e-88b811d5aa69" />
<img width="1366" height="768" alt="Screenshot (432)" src="https://github.com/user-attachments/assets/73ebc8a2-f74f-49c0-a4ee-adfb49c360e3" />
<img width="1366" height="768" alt="Screenshot (433)" src="https://github.com/user-attachments/assets/1e6421fd-b4c2-4d5a-9f59-84c6876c1a27" />
<img width="1366" height="768" alt="Screenshot (434)" src="https://github.com/user-attachments/assets/a9a1cd18-a153-415d-b578-02e174ce026e" />
<img width="1366" height="768" alt="Screenshot (435)" src="https://github.com/user-attachments/assets/77bc2e6b-1b3f-4cd2-8f39-9d07a56bf9fe" />
<img width="1366" height="768" alt="Screenshot (436)" src="https://github.com/user-attachments/assets/292c4258-82f8-4db4-ae1d-b5e06565c4fc" />
<img width="1366" height="768" alt="Screenshot (437)" src="https://github.com/user-attachments/assets/f305e1a8-f839-4b19-a182-0bfbb191c59b" />
<img width="1366" height="768" alt="Screenshot (438)" src="https://github.com/user-attachments/assets/739d1bc7-32f5-46cf-8b17-d9b631209720" />
<img width="1366" height="768" alt="Screenshot (439)" src="https://github.com/user-attachments/assets/f3da7500-edc8-4dae-a030-204c73c127b0" />
<img width="1366" height="768" alt="Screenshot (440)" src="https://github.com/user-attachments/assets/4b24b14b-1993-4a14-9615-9ebdcfb4167c" />
<img width="1366" height="768" alt="Screenshot (441)" src="https://github.com/user-attachments/assets/09032da5-3020-477c-b17d-933835de7ac7" />
<img width="1366" height="768" alt="Screenshot (442)" src="https://github.com/user-attachments/assets/3506536e-6131-458c-ad4b-be23d396a7aa" />
<img width="1366" height="768" alt="Screenshot (443)" src="https://github.com/user-attachments/assets/cc54fbf9-52be-4942-9eff-eb2ef98fda02" />
<img width="1366" height="768" alt="Screenshot (444)" src="https://github.com/user-attachments/assets/57b25889-fd58-4383-979a-32059f480bc8" />
<img width="1366" height="768" alt="Screenshot (445)" src="https://github.com/user-attachments/assets/4bfb7588-b111-4df6-ba92-6306712a7e16" />
<img width="1366" height="768" alt="Screenshot (446)" src="https://github.com/user-attachments/assets/00f8fd93-0a1b-4749-a01a-e6f3e16dd9a2" />
<img width="1366" height="768" alt="Screenshot (447)" src="https://github.com/user-attachments/assets/7caa11eb-9e84-47bf-a802-c0e473060cd8" />
<img width="1366" height="768" alt="Screenshot (448)" src="https://github.com/user-attachments/assets/a112d2ec-13a6-4697-b097-bfeb9af5f119" />
<img width="1366" height="768" alt="Screenshot (449)" src="https://github.com/user-attachments/assets/83b629f1-e044-41d1-8ecc-8a8fbeccbe23" />
<img width="1366" height="768" alt="Screenshot (450)" src="https://github.com/user-attachments/assets/026ab2fc-c0a2-4f95-98e7-c161d15272f2" />
<img width="1366" height="768" alt="Screenshot (451)" src="https://github.com/user-attachments/assets/c5fb2841-85f8-414d-bbd6-d63fa264ad33" />
<img width="1366" height="768" alt="Screenshot (452)" src="https://github.com/user-attachments/assets/e17c5079-7e22-423e-8ece-1a4b1cf9ecd8" />
<img width="1366" height="768" alt="Screenshot (453)" src="https://github.com/user-attachments/assets/00b40468-fc6f-40d0-a889-5e41fc07970e" />
<img width="1366" height="768" alt="Screenshot (454)" src="https://github.com/user-attachments/assets/de7fbf8c-d716-4097-a56d-664a77c254eb" />
<img width="1366" height="768" alt="Screenshot (455)" src="https://github.com/user-attachments/assets/d32bf1b9-d5dc-4d8f-83bf-1275ef06b75e" />
<img width="1366" height="768" alt="Screenshot (456)" src="https://github.com/user-attachments/assets/ee20472e-8724-431a-bf86-c4123f45ed6f" />
<img width="1366" height="768" alt="Screenshot (457)" src="https://github.com/user-attachments/assets/6aea15d3-8c51-4c52-9446-b7b7699233ae" />
<img width="1366" height="768" alt="Screenshot (458)" src="https://github.com/user-attachments/assets/b91e825f-7092-4005-be76-a87d958077ea" />
<img width="1366" height="768" alt="Screenshot (459)" src="https://github.com/user-attachments/assets/4f60c2fa-5765-4b4e-9e63-3d80569e65bb" />
<img width="1366" height="768" alt="Screenshot (460)" src="https://github.com/user-attachments/assets/3a3ca252-cc84-41f5-8f89-73cce7b27336" />
<img width="1366" height="768" alt="Screenshot (461)" src="https://github.com/user-attachments/assets/75e33e5c-3399-4454-8359-74c21ea5852f" />
<img width="1366" height="768" alt="Screenshot (462)" src="https://github.com/user-attachments/assets/d3bdd8f0-c958-4391-acb9-704af5243def" />
<img width="1366" height="768" alt="Screenshot (463)" src="https://github.com/user-attachments/assets/b82256d2-8c42-49bf-96cb-58d780650f58" />
<img width="1366" height="768" alt="Screenshot (464)" src="https://github.com/user-attachments/assets/2dbf7ea8-9901-45fc-add6-0a4df9cc838c" />
<img width="1366" height="768" alt="Screenshot (466)" src="https://github.com/user-attachments/assets/af96276b-6b66-4212-acbb-2f9b43bfedd0" />






## Important production note

This is a broad, runnable reference implementation—not a finished regulated-enterprise SaaS deployment. Before production use, replace JSON persistence with PostgreSQL, add migrations, object storage, queues/workers, SSO/MFA, tenant isolation, CSRF strategy if cookie authentication is introduced, hardened secrets management, immutable audit storage, backup/restore, observability, external-tool adapters, malware scanning for uploads, and formal security review.
