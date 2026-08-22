# Softify 2.0

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

## Important production note

This is a broad, runnable reference implementation—not a finished regulated-enterprise SaaS deployment. Before production use, replace JSON persistence with PostgreSQL, add migrations, object storage, queues/workers, SSO/MFA, tenant isolation, CSRF strategy if cookie authentication is introduced, hardened secrets management, immutable audit storage, backup/restore, observability, external-tool adapters, malware scanning for uploads, and formal security review.
