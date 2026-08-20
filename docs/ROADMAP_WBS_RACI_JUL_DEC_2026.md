# SAKTI AI — WBS, RACI, dan Timeline Juli–Desember 2026

Dokumen ini disusun berdasarkan audit codebase per 26 Juli 2026 terhadap:

- `main-frontend`: Next.js 16, React 19, TypeScript, Tailwind CSS, Axios, dan Redux Toolkit.
- `main-backend`: NestJS, TypeORM, MySQL, autentikasi JWT, onboarding, dan orkestrasi pipeline AI.
- `SAKTI-AI`: FastAPI, DeepSeek-compatible LLM, LangGraph, CV parser, Double Diamond, JobMatcher, TalentForger, dan Brave Search.

Target akhir roadmap adalah **market launch pada 14 Desember 2026**, dilanjutkan masa hypercare sampai akhir Desember.

## 1. Ringkasan eksekutif

Fondasi MVP saat ini sudah mencakup alur pengguna dari autentikasi hingga rekomendasi karier personal:

1. Registrasi/login email dan Google.
2. Upload serta parsing CV.
3. Review profil, pengalaman, pendidikan, sertifikasi, skill, dan proyek.
4. Asesmen OCEAN dan RIASEC.
5. Eksplorasi karier dengan Double Diamond.
6. Job matching, breakdown skor, dan skill gap.
7. Learning path dan rekomendasi resource.

Lima fitur prioritas yang diminta belum berada pada tingkat kesiapan yang sama:

| Fitur | Status codebase saat ini | Gap utama |
|---|---|---|
| AI Chatbot | Placeholder di sidebar | Belum ada route, UI percakapan, API, penyimpanan sesi, RAG/tools, evaluasi, atau guardrail. |
| Eksplorasi Pekerjaan General | Parsial melalui hasil JobMatcher | Lowongan hanya muncul sebagai hasil pipeline personal; belum ada katalog umum, pencarian, filter, detail, simpan, histori, atau ingestion terjadwal. |
| Eksplorasi Kompetensi General | Fondasi data parsial | Tabel domain, kategori, skill bank, alias, dan relasi sudah ada di backend; belum ada module/controller read API, seed terkelola, pencarian, detail, tren, atau UI. |
| Analisis SAKTI AI | Parsial | Sudah ada OCEAN, RIASEC, career summary, work-style, readiness, strengths, barriers, match score, dan skill gap; belum menjadi laporan terpadu, terversi, dapat dijelaskan, diekspor, dan diperbarui. |
| Notifikasi | Placeholder visual | Ikon bell dan badge statis sudah ada; belum ada model data, event, preference, unread count, notification center, delivery worker, atau kanal email/push. |

Rekomendasi urutan pembangunan:

```text
Fondasi kualitas dan kontrak data
  → Katalog pekerjaan + katalog kompetensi
  → Analisis SAKTI AI terpadu
  → AI Chatbot berbasis tools/RAG
  → Notifikasi event-driven
  → Closed beta, hardening, dan market launch
```

## 2. Temuan audit codebase

### 2.1 Yang sudah tersedia

- Frontend memiliki route aktif untuk dashboard, onboarding, personality, job matches, dan learning paths.
- Backend memiliki module autentikasi, profil/CV, career onboarding, dan career pipeline.
- SAKTI-AI sudah menyediakan CV parsing, pertanyaan/analisis Double Diamond, JobMatcher, dan TalentForger.
- Pipeline JobMatcher dan TalentForger sudah memiliki status `PENDING`, `RUNNING`, `COMPLETED`, `FAILED`, retry, persistence hasil, serta polling dari frontend.
- JobMatcher sudah menghasilkan kandidat role, breakdown match score, skill gap, dan lowongan aktif.
- TalentForger sudah menghasilkan learning path, tahap mingguan, resource, material gratis, dan rekomendasi resource.
- Data model skill bank sudah mencakup domain, kategori bertingkat, skill, alias, dan hubungan skill-kategori.
- Backend memiliki unit test untuk sebagian onboarding, scoring, parser, dan infrastructure; service AI juga memiliki test parser, graph, search, dan scoring.

### 2.2 Gap lintas platform

- Frontend belum memiliki automated test suite atau test script selain lint/build.
- README frontend tidak lagi mencerminkan fitur dan integrasi yang sudah tersedia.
- Tidak ditemukan CI workflow di repository frontend.
- JWT disimpan di `localStorage`; sebelum public launch perlu mitigasi risiko XSS dan strategi refresh/revocation token.
- Worker pipeline AI masih berjalan sebagai polling worker di process backend. Ini cukup untuk MVP, tetapi berisiko saat horizontal scaling atau lonjakan job.
- Data lowongan tersimpan per pipeline run dan belum menjadi katalog global dengan freshness, deduplikasi lintas run, provenance, serta expiry.
- Skill bank sudah memiliki schema, tetapi belum terlihat module read API, lifecycle taxonomy, dan proses seed/update yang production-ready.
- Belum ada event/analytics taxonomy untuk mengukur funnel onboarding, eksplorasi, chatbot, notifikasi, dan conversion.
- Belum ada notification entity, preference, delivery log, atau service.
- Belum ada conversation/thread/message entity maupun endpoint chatbot.
- Belum ada kebijakan retention CV, transcript chatbot, consent AI, export data, dan delete account yang terlihat pada alur produk.

### 2.3 Batasan audit

Audit ini merupakan static code review terhadap snapshot working tree saat dokumen dibuat. Sebagian fitur career pipeline masih berupa perubahan lokal yang belum tercatat sebagai baseline release. Validasi end-to-end terhadap database, layanan AI, email provider, dan deployment production perlu dijadwalkan sebagai pekerjaan tersendiri.

## 3. Sasaran produk sampai market launch

### 3.1 Sasaran pengguna

- Pengguna dapat menjelajahi pekerjaan tanpa wajib menunggu rekomendasi personal.
- Pengguna dapat menjelajahi kompetensi, memahami hubungannya dengan role, dan melihat posisi kompetensinya sendiri.
- Pengguna mendapatkan satu laporan SAKTI AI yang merangkum profil, psikometri, career fit, skill gap, dan next best actions.
- Pengguna dapat bertanya kepada chatbot tentang profil, hasil analisis, pekerjaan, kompetensi, dan learning path dengan jawaban yang memiliki sumber atau dasar data.
- Pengguna menerima notifikasi yang relevan serta dapat mengontrol jenis dan kanal notifikasinya.

### 3.2 Sasaran bisnis

- Meningkatkan onboarding completion dan time-to-first-value.
- Mendorong pengguna kembali melalui lowongan baru, progress learning, dan rekomendasi berikutnya.
- Mengukur conversion dari eksplorasi ke job detail, outbound apply, learning path, dan penggunaan chatbot.
- Menyiapkan product narrative, demo, acquisition funnel, support, dan launch analytics untuk Desember.

## 4. Work Breakdown Structure (WBS)

### WBS 0 — Product, architecture, dan quality foundation

| ID | Work package | Deliverable / Definition of Done | Dependensi |
|---|---|---|---|
| 0.1 | Scope dan acceptance criteria | PRD ringkas, persona, use case, out-of-scope, acceptance criteria lima fitur disetujui. | Tidak ada |
| 0.2 | Information architecture | Sitemap, navigasi desktop/mobile, hubungan Dashboard–Explore–Analysis–Chat ditetapkan. | 0.1 |
| 0.3 | API contract governance | OpenAPI terversi, error code konsisten, pagination/filter convention, idempotency rule. | 0.1 |
| 0.4 | Event analytics taxonomy | Daftar event, property, funnel, dashboard KPI, dan aturan PII. | 0.1 |
| 0.5 | Test foundation frontend | Vitest/Jest, React Testing Library, Playwright, fixture API, dan script CI. | 0.3 |
| 0.6 | CI/CD dan environment | PR checks lint/type/test/build, staging environment, migration check, rollback procedure. | 0.5 |
| 0.7 | Security dan privacy baseline | Threat model, consent AI, retention, delete/export data, secret handling, rate limit, auth hardening. | 0.3 |
| 0.8 | Observability | Correlation ID FE–BE–AI, error tracking, structured logs, latency/cost/token dashboards, alerting. | 0.3 |

Checklist utama:

- [ ] Bekukan kontrak naming `snake_case` vs `camelCase` per boundary.
- [ ] Tentukan strategi generated API client atau shared schema.
- [ ] Tambahkan unit, integration, dan E2E test minimum untuk critical path.
- [ ] Evaluasi migrasi token dari `localStorage` ke secure HttpOnly cookie atau mitigasi setara.
- [ ] Tentukan feature flag untuk lima fitur baru.
- [ ] Pisahkan worker AI dari web process sebelum load test production bila concurrency meningkat.

### WBS 1 — Stabilization fitur inti yang sudah ada

| ID | Work package | Deliverable / Definition of Done | Dependensi |
|---|---|---|---|
| 1.1 | Auth hardening | Refresh/revocation strategy, logout semua device, expired-session UX, rate limit login. | 0.7 |
| 1.2 | Onboarding regression suite | E2E upload CV hingga onboarding complete, resume progress, error/retry, data validation. | 0.5 |
| 1.3 | Pipeline reliability | JobMatcher/TalentForger idempotent, queue-safe, retry terukur, stale-job recovery teruji. | 0.6, 0.8 |
| 1.4 | Empty/error/loading consistency | Semua dashboard dan pipeline mempunyai states yang konsisten dan actionable. | 0.2 |
| 1.5 | Documentation refresh | README, env setup, local stack, API dependency, migration, dan troubleshooting diperbarui. | 0.3 |

### WBS 2 — Eksplorasi Pekerjaan General

| ID | Work package | Deliverable / Definition of Done | Dependensi |
|---|---|---|---|
| 2.1 | Discovery dan UX | User flow browse/search/filter/detail/save/apply; wireframe desktop/mobile tervalidasi. | 0.1, 0.2 |
| 2.2 | Global job data model | Job, company, source, location, work mode, employment type, salary, skills, posted/expired timestamps. | 0.3 |
| 2.3 | Ingestion dan normalization | Connector/provider, scheduler, dedupe lintas sumber, canonical URL, expiry, provenance, retry. | 2.2, 0.8 |
| 2.4 | Search API | Pagination, full-text search, filter, sort, faceting, detail, related jobs. | 2.2, 2.3 |
| 2.5 | Relevance layer | Normalisasi role/skill, semantic retrieval opsional, ranking general, quality evaluation. | 2.3 |
| 2.6 | User action API | Save/unsave, viewed history, outbound apply tracking, report stale/invalid listing. | 2.4, 0.7 |
| 2.7 | Frontend explorer | Route, search, filters, list/grid, detail drawer/page, responsive states, deep link. | 2.1, 2.4 |
| 2.8 | Personalization bridge | Toggle “untuk saya”, match indicator, alasan relevansi, link ke skill gap/analysis. | 2.5, WBS 4 |
| 2.9 | Analytics dan QA | Search success, zero-result, detail CTR, save, outbound apply; contract/E2E/accessibility tests. | 0.4, 2.7 |

Checklist MVP:

- [ ] Tambahkan route `/job-seeker/jobs` atau `/job-seeker/explore/jobs`.
- [ ] Ubah menu “Eksplorasi Pekerjaan” dari placeholder menjadi link aktif.
- [ ] Sediakan filter kata kunci, lokasi, remote/hybrid/onsite, level, tipe kerja, dan freshness.
- [ ] Tampilkan sumber serta waktu terakhir lowongan diverifikasi.
- [ ] Pastikan lowongan general dapat dipakai tanpa onboarding selesai.
- [ ] Pertahankan Job Matches sebagai pengalaman personal yang terpisah dari katalog general.

### WBS 3 — Eksplorasi Kompetensi General

| ID | Work package | Deliverable / Definition of Done | Dependensi |
|---|---|---|---|
| 3.1 | Taxonomy governance | Definisi domain, category, competency class, scope, alias, version, owner, dan update policy. | 0.1 |
| 3.2 | Seed dan data quality | Dataset awal tervalidasi, alias deduplicated, orphan relation nol, migration/seed repeatable. | 3.1 |
| 3.3 | Competency read API | Browse domain/category, search/autocomplete, skill detail, related skills, pagination. | 0.3, 3.2 |
| 3.4 | Role–skill mapping | Required/nice-to-have skills, level, evidence, market demand, dan source timestamp. | 2.2, 3.2 |
| 3.5 | User comparison API | Skill pengguna vs kompetensi/role, evidence, learning/working hours, gap, next action. | 3.3, 3.4 |
| 3.6 | Frontend explorer | Route, taxonomy navigation, search, detail, relationship visualization, personal comparison. | 3.3, 3.5 |
| 3.7 | Learning bridge | Dari skill detail ke resource dan learning path; state tanpa match tetap berguna. | WBS 1, 3.6 |
| 3.8 | Analytics dan QA | Search-to-detail, saved skill, learning CTA, taxonomy contract, E2E, accessibility. | 0.4, 3.6 |

Checklist MVP:

- [ ] Registrasikan entity skill bank ke module khusus dan expose read-only API.
- [ ] Tambahkan route `/job-seeker/competencies` atau `/job-seeker/explore/competencies`.
- [ ] Ubah menu “Eksplorasi Kompetensi” dari placeholder menjadi link aktif.
- [ ] Sediakan tampilan general untuk pengguna yang belum onboarding.
- [ ] Setelah login/onboarding, overlay level pengguna, evidence, gap, dan rekomendasi belajar.
- [ ] Versioning taxonomy wajib agar hasil analisis lama tetap dapat direproduksi.

### WBS 4 — Analisis SAKTI AI

| ID | Work package | Deliverable / Definition of Done | Dependensi |
|---|---|---|---|
| 4.1 | Analysis specification | Struktur laporan: executive summary, evidence, psikometri, career fit, competencies, risks, actions. | 0.1, 3.1 |
| 4.2 | Snapshot dan versioning | Analysis run menyimpan input snapshot, model/prompt/taxonomy version, timestamp, confidence, status. | 0.3, 4.1 |
| 4.3 | Analysis pipeline | Agregasi onboarding, OCEAN/RIASEC, Double Diamond, JobMatcher, skill gap, market data. | 1.3, 2.5, 3.5 |
| 4.4 | Explainability dan sources | Setiap klaim penting memiliki evidence/source, confidence, dan penanda inferensi AI. | 4.3, 0.7 |
| 4.5 | Report API | Generate/refresh, latest/history, section detail, compare version, export payload. | 4.2, 4.3 |
| 4.6 | Frontend report | Halaman Analisis SAKTI AI terpisah dengan summary, charts, recommendations, sources, refresh. | 4.5 |
| 4.7 | Export dan sharing | PDF export dan share link yang aman/expiring; PII redaction sesuai consent. | 4.5, 0.7 |
| 4.8 | AI evaluation | Golden dataset, groundedness, consistency, fairness slices, hallucination/error review. | 4.3, 4.4 |
| 4.9 | Analytics dan QA | Generate success, report view, action CTR, helpfulness, snapshot reproducibility, E2E. | 0.4, 4.6 |

Checklist MVP:

- [ ] Jangan gunakan halaman personality sebagai satu-satunya tujuan menu Analisis SAKTI AI.
- [ ] Reuse data yang sudah tersedia: OCEAN, RIASEC, summaries, strengths, barriers, role scores, dan skill gaps.
- [ ] Bedakan fakta profil, hasil perhitungan, data pasar, dan narasi generatif secara visual.
- [ ] Tampilkan “mengapa rekomendasi ini muncul” dan next best action.
- [ ] Sediakan tombol refresh dengan aturan cooldown dan estimasi biaya.

### WBS 5 — AI Chatbot

| ID | Work package | Deliverable / Definition of Done | Dependensi |
|---|---|---|---|
| 5.1 | Use case dan conversation UX | Scope pertanyaan, starter prompts, empty/error/loading/streaming, mobile behavior. | 0.1, 0.2 |
| 5.2 | Conversation data model | Thread, message, role, citations, tool calls, feedback, timestamps, retention, ownership. | 0.3, 0.7 |
| 5.3 | Chat API dan streaming | Create/list thread, message streaming, retry/cancel, history pagination, delete thread. | 5.2 |
| 5.4 | Context/RAG layer | Context profil dan analysis snapshot; retrieval kompetensi, pekerjaan, dan learning resources. | WBS 2, WBS 3, WBS 4 |
| 5.5 | Tool calling | Tools pencarian job, competency detail, explain analysis, learning path, dan navigation action. | 5.3, 5.4 |
| 5.6 | Safety dan privacy | Prompt injection defense, PII boundary, moderation, allowlist tools, output schema, rate limit. | 0.7, 5.5 |
| 5.7 | Frontend chatbot | Sidebar/dedicated route, responsive chat, citations, action cards, feedback, conversation history. | 5.1, 5.3 |
| 5.8 | Evaluation dan observability | Golden conversations, groundedness, tool success, refusal correctness, latency, token/cost. | 0.8, 5.5 |
| 5.9 | Analytics dan QA | Activation, retained users, helpfulness, unresolved intent, E2E streaming, accessibility. | 0.4, 5.7 |

Scope MVP chatbot:

- [ ] Menjelaskan hasil Analisis SAKTI AI dengan citation ke section laporan.
- [ ] Mencari pekerjaan general menggunakan tool, bukan mengarang lowongan.
- [ ] Menjelaskan kompetensi dan skill gap menggunakan skill bank terversi.
- [ ] Mengarahkan pengguna ke halaman/aksi relevan tanpa melakukan apply otomatis.
- [ ] Menyimpan history per user dan menyediakan delete conversation.
- [ ] Menampilkan disclaimer untuk keputusan karier dan provenance jawaban.

Out-of-scope launch awal:

- Auto-apply tanpa konfirmasi pengguna.
- Chat lintas user/recruiter.
- Voice assistant.
- Fine-tuning dari transcript pengguna tanpa consent eksplisit.

### WBS 6 — Notifikasi

| ID | Work package | Deliverable / Definition of Done | Dependensi |
|---|---|---|---|
| 6.1 | Event catalog | Event, audience, priority, template, deep link, dedupe key, expiry, dan channel policy. | 0.4 |
| 6.2 | Notification data model | Notification, delivery attempt, preference, read/archive status, metadata, timestamps. | 0.3, 0.7 |
| 6.3 | Event producer | Pipeline complete/failed, new match, learning reminder, onboarding reminder, system update. | 1.3, WBS 2–5 |
| 6.4 | Delivery worker | Idempotent queue, retry/backoff, dead-letter handling, provider abstraction, observability. | 0.6, 6.2 |
| 6.5 | In-app API | List/pagination, unread count, mark read/all read, archive, preferences. | 6.2 |
| 6.6 | Notification center UI | Bell dinamis, unread badge, popover/page, grouping, empty/loading/error, deep links. | 6.5 |
| 6.7 | Email channel | Transactional provider, verified domain, templates, unsubscribe/preferences, bounce handling. | 6.1, 6.4 |
| 6.8 | Push/PWA decision | Feasibility dan consent; implement hanya jika PWA foundation benar-benar tersedia. | 0.7, 6.4 |
| 6.9 | Analytics dan QA | Delivery/open/action/opt-out, dedupe test, preference enforcement, accessibility. | 0.4, 6.6 |

Prioritas event launch:

- [ ] JobMatcher selesai atau gagal.
- [ ] Learning path selesai atau gagal.
- [ ] Lowongan relevan baru atau mendekati expiry.
- [ ] Onboarding belum selesai setelah periode tertentu.
- [ ] Reminder learning mingguan yang opt-in.
- [ ] Pengumuman sistem yang benar-benar penting.

### WBS 7 — Beta, launch readiness, dan GTM

| ID | Work package | Deliverable / Definition of Done | Dependensi |
|---|---|---|---|
| 7.1 | Closed beta | Cohort terkontrol, consent, feedback loop, issue triage, weekly review. | WBS 2–6 |
| 7.2 | Accessibility dan responsive audit | Keyboard, screen reader, contrast, zoom, mobile/tablet/desktop critical flows. | WBS 2–6 |
| 7.3 | Performance/load test | API p95, concurrency AI, queue throughput, DB indexes, frontend Core Web Vitals. | 0.8, WBS 2–6 |
| 7.4 | Security review | Auth, authorization/ownership, PII, injection, SSRF, upload, secrets, rate limit. | 0.7, WBS 2–6 |
| 7.5 | Launch analytics | Production dashboards, funnel, alerts, attribution, experiment flags. | 0.4 |
| 7.6 | GTM assets | Positioning, landing page, demo, FAQ, onboarding content, launch campaign, partner kit. | 0.1 |
| 7.7 | Support dan operations | Help center, escalation, incident runbook, status communication, owner rota. | 0.8 |
| 7.8 | Release candidate | Zero open P0/P1, migration rehearsal, backup/restore, rollback, sign-off. | 7.1–7.7 |
| 7.9 | Market launch | Staged rollout, monitoring, communication, daily launch review, hypercare. | 7.8 |

## 5. RACI

### 5.1 Legenda dan asumsi

- **R — Responsible:** mengerjakan pekerjaan.
- **A — Accountable:** pemilik keputusan akhir dan hasil; satu A utama per baris.
- **C — Consulted:** memberi input sebelum keputusan/hasil.
- **I — Informed:** menerima perkembangan atau hasil.

Karena role dibatasi menjadi empat, aktivitas QA, backend, frontend, DevOps, security implementation, dan release engineering berada di bawah **Software Engineer**. Fungsi product owner, business decision, launch approval, dan customer discovery berada di bawah **Market & GTM**.

| Work package / keputusan | AI/ML Engineer | Software Engineer | Market & GTM | UI/UX Designer |
|---|---|---|---|---|
| Product scope, persona, KPI, dan acceptance criteria | C | C | A/R | C |
| Information architecture dan end-to-end journey | C | C | C | A/R |
| Design system, prototype, usability test | I | C | C | A/R |
| API contract dan application architecture | C | A/R | I | C |
| Database, backend, frontend, CI/CD, security implementation | C | A/R | I | C |
| AI architecture, prompts, RAG, tools, model selection | A/R | R | C | C |
| AI evaluation, groundedness, fairness, cost/latency | A/R | C | C | I |
| Job data source, relevance rules, dan market taxonomy | R | R | A | C |
| Job ingestion, search API, dan Job Explorer frontend | C | A/R | C | R |
| Competency taxonomy dan role–skill mapping | A/R | R | C | C |
| Competency Explorer frontend dan visualization | C | R | I | A/R |
| Analisis SAKTI AI specification dan narrative policy | R | C | A | C |
| Analisis SAKTI AI pipeline dan explainability | A/R | R | C | C |
| Analisis SAKTI AI report UI dan export UX | C | R | C | A/R |
| Chatbot conversation UX | C | R | C | A/R |
| Chatbot API, streaming, persistence, dan tool integration | R | A/R | I | C |
| Chatbot safety policy dan escalation rule | R | C | A | C |
| Notification event policy dan content template | C | R | A | R |
| Notification backend, queue, API, dan delivery | I | A/R | C | C |
| Notification center UI dan preference UX | I | R | C | A/R |
| Analytics instrumentation dan experiment implementation | C | A/R | R | C |
| Closed beta recruitment dan feedback operations | I | C | A/R | C |
| Test, performance, accessibility, dan release readiness | R | A/R | C | R |
| Privacy notice, terms, campaign, partnership, dan support content | C | C | A/R | R |
| Go/no-go market launch | C | C | A/R | C |
| Launch monitoring dan hypercare | R | A/R | R | C |

## 6. Timeline Juli–Desember 2026

### 6.1 Milestone utama

| Periode | Fokus | Exit milestone |
|---|---|---|
| 27–31 Juli | Audit, scope, architecture, prioritization | Roadmap, RACI, scope MVP, KPI, risk owner disetujui. |
| Agustus | Foundation + data/catalog backend | Contract stabil, CI/test baseline, Job Catalog API alpha, Competency API alpha. |
| September | General explorers + Analysis pipeline | Job Explorer beta, Competency Explorer beta, Analisis SAKTI AI alpha. |
| Oktober | Chatbot + notifications + integrated beta | Chatbot alpha, notification center alpha, Analisis SAKTI AI beta. |
| November | Closed beta, hardening, GTM preparation | Release candidate candidate; P0/P1 beta ditutup; launch assets siap. |
| 1–13 Desember | Release candidate dan staged rollout | Go-live checklist dan go/no-go disetujui. |
| **14 Desember** | **Market launch** | Production launch dan campaign aktif. |
| 15–31 Desember | Hypercare dan optimization | Stabilitas terjaga, issue launch ditangani, post-launch report selesai. |

### 6.2 Gantt tingkat workstream

Keterangan: **●** fokus utama, **○** support/hardening, **▲** milestone.

| Workstream | Jul | Agu | Sep | Okt | Nov | Des |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Product/architecture/quality foundation | ● | ● | ○ | ○ | ○ | ○ |
| Stabilization core flow | ○ | ● | ● | ○ | ● | ○ |
| Eksplorasi Pekerjaan General |  | ● | ● | ○ | ● | ▲ |
| Eksplorasi Kompetensi General |  | ● | ● | ○ | ● | ▲ |
| Analisis SAKTI AI |  | ○ | ● | ● | ● | ▲ |
| AI Chatbot |  | ○ | ○ | ● | ● | ▲ |
| Notifikasi |  | ○ | ○ | ● | ● | ▲ |
| Closed beta & GTM |  |  | ○ | ○ | ● | ● |
| Market launch |  |  |  |  |  | **▲ 14 Des** |

### 6.3 Timeline to-do per bulan

#### Juli 2026 — Alignment dan baseline

- [ ] Setujui scope MVP dan out-of-scope lima fitur prioritas.
- [ ] Setujui KPI produk, AI, reliability, dan GTM.
- [ ] Dokumentasikan arsitektur frontend–backend–SAKTI-AI dan critical data flow.
- [ ] Buat initial backlog dari WBS dengan owner serta acceptance criteria.
- [ ] Tetapkan feature flag dan branch/release strategy.
- [ ] Catat baseline build, test, latency, AI success rate, dan known defects.

**Milestone:** scope dan delivery plan terkunci pada 31 Juli.

#### Agustus 2026 — Foundation dan backend alpha

- [ ] Implementasikan frontend test foundation, E2E critical flow, dan CI checks.
- [ ] Definisikan API convention, generated contract, error code, pagination, dan idempotency.
- [ ] Implementasikan correlation ID, error tracking, AI latency/cost metrics, dan alert dasar.
- [ ] Desain final Job Explorer, Competency Explorer, Analysis Report, Chatbot, dan Notification Center.
- [ ] Bangun global job model, ingestion, dedupe, freshness, dan search API alpha.
- [ ] Seed serta validasi skill taxonomy; bangun Competency read API alpha.
- [ ] Definisikan schema analysis snapshot dan report sections.
- [ ] Definisikan conversation schema, chatbot tools, notification events, dan preference model.
- [ ] Mulai auth/privacy hardening serta policy CV/chat retention.

**Milestone:** internal API alpha dan prototype tervalidasi pada 31 Agustus.

#### September 2026 — Explorer beta dan analysis alpha

- [ ] Rilis internal Job Explorer: browse, search, filter, detail, save, outbound apply tracking.
- [ ] Rilis internal Competency Explorer: taxonomy, search, detail, related skill, user comparison.
- [ ] Integrasikan role–skill mapping dan bridge ke learning resources.
- [ ] Bangun Analisis SAKTI AI pipeline dengan input snapshot dan versioning.
- [ ] Implementasikan evidence, source, confidence, serta batas fakta vs inferensi.
- [ ] Bangun report API dan frontend Analysis alpha.
- [ ] Bangun conversation API skeleton dan streaming proof-of-concept.
- [ ] Bangun notification entity, API unread/read, preference, dan event producer dasar.
- [ ] Jalankan contract test serta E2E untuk dua explorer.

**Milestone:** general exploration beta dan Analysis alpha pada 30 September.

#### Oktober 2026 — AI experience dan integrated beta

- [ ] Selesaikan Analisis SAKTI AI beta, refresh, history, action CTA, dan export draft.
- [ ] Implementasikan chatbot RAG/context dari profile dan analysis snapshot.
- [ ] Implementasikan chatbot tools untuk pekerjaan, kompetensi, dan learning path.
- [ ] Implementasikan chatbot UI streaming, citation, history, retry/cancel, feedback, dan delete.
- [ ] Terapkan prompt injection defense, rate limit, PII guard, dan tool allowlist.
- [ ] Implementasikan notification worker, retry, dedupe, deep link, dan notification center.
- [ ] Hubungkan notifikasi pipeline completed/failed, onboarding reminder, dan new relevant jobs.
- [ ] Instrumentasikan funnel lengkap dan dashboard internal.
- [ ] Jalankan AI golden-set evaluation serta UX usability round kedua.

**Milestone:** integrated closed-beta build pada 31 Oktober.

#### November 2026 — Closed beta dan hardening

- [ ] Rekrut cohort closed beta yang mewakili persona utama.
- [ ] Jalankan weekly feedback, analytics review, bug triage, dan model error review.
- [ ] Tutup defect P0/P1; prioritaskan P2 berdasarkan impact funnel.
- [ ] Jalankan load test API, database, queue, job ingestion, dan AI concurrency.
- [ ] Jalankan security/privacy review, authorization audit, retention/delete test.
- [ ] Jalankan accessibility serta responsive audit seluruh critical path.
- [ ] Kalibrasi relevansi job, taxonomy coverage, analysis quality, dan chatbot groundedness.
- [ ] Finalisasi notification preference dan email transactional jika launch scope mengizinkan.
- [ ] Siapkan landing page, demo, FAQ, help center, campaign, partner kit, dan support runbook.
- [ ] Lakukan migration rehearsal, backup/restore, incident drill, dan rollback rehearsal.

**Milestone:** release candidate siap pada 30 November.

#### Desember 2026 — Launch dan hypercare

##### 1–6 Desember

- [ ] Freeze fitur; hanya menerima release blocker dan compliance fix.
- [ ] Regression E2E production-like untuk auth sampai analysis/chat/explore/notification.
- [ ] Verifikasi migration, seed taxonomy, job ingestion, provider quota, secrets, dan alerts.
- [ ] Final AI evaluation dan sign-off kualitas.

##### 7–11 Desember

- [ ] Staged rollout internal lalu early-access users.
- [ ] Verifikasi KPI dashboard, attribution, email domain, support channel, dan status communication.
- [ ] Go/no-go review dengan seluruh role.

##### 14 Desember — Market launch

- [ ] Buka feature flags untuk target audience.
- [ ] Jalankan campaign, partnership activation, dan demo publik.
- [ ] Monitor error, latency, AI success/cost, conversion, dan support ticket secara real time.

##### 15–31 Desember — Hypercare

- [ ] Daily launch review selama minggu pertama.
- [ ] Perbaiki issue berdasarkan severity dan user impact.
- [ ] Optimalkan prompt, ranking, dan notification frequency dengan guardrail eksperimen.
- [ ] Susun post-launch report dan backlog Q1 2027.

## 7. Critical path dan dependensi

Critical path menuju launch:

1. API governance, test foundation, privacy, dan observability.
2. Job catalog serta competency taxonomy yang production-ready.
3. Analysis snapshot/pipeline yang grounded pada data tersebut.
4. Chatbot tools yang hanya membaca sumber terverifikasi.
5. Notification event producer dari proses yang sudah stabil.
6. Closed beta, security/load test, release candidate, lalu launch.

Pekerjaan yang dapat berjalan paralel:

- UI/UX seluruh fitur dapat dimulai saat kontrak data dibahas.
- Notification model dan preference dapat dibangun sebelum seluruh producer tersedia.
- GTM discovery, positioning, dan beta recruitment dapat dimulai sejak Agustus.
- AI evaluation dataset dapat disusun bersamaan dengan implementasi Analysis dan Chatbot.

## 8. Launch gate yang direkomendasikan

Market launch hanya dilakukan bila seluruh gate berikut terpenuhi:

- [ ] Tidak ada defect P0/P1 terbuka pada critical path.
- [ ] Auth, onboarding, job explorer, competency explorer, analysis, chatbot, dan notification center lulus E2E.
- [ ] Ownership/authorization test memastikan data user tidak dapat dibaca user lain.
- [ ] AI groundedness dan tool-call success memenuhi threshold yang disepakati dari golden set.
- [ ] Semua lowongan menampilkan source dan freshness; stale/invalid listing dapat dinonaktifkan.
- [ ] Notification dedupe dan preference enforcement lulus integration test.
- [ ] Migration, backup/restore, dan rollback sudah direhearsal di staging.
- [ ] Production observability, alert, quota, cost limit, dan on-call owner aktif.
- [ ] Privacy notice, consent AI, retention, delete/export flow, terms, dan support channel tersedia.
- [ ] KPI funnel dan attribution terbaca sebelum campaign dinyalakan.

Target teknis awal yang disarankan:

| Area | Target launch |
|---|---|
| Availability core API | ≥ 99,5% selama launch window |
| Standard API p95 | < 800 ms di luar pekerjaan AI asynchronous |
| Chat first-token p95 | < 3 detik |
| AI pipeline completion | ≥ 95% tanpa intervensi manual |
| Valid PDF parse success | ≥ 95% untuk PDF berbasis teks sesuai batas ukuran |
| Critical E2E pass rate | 100% pada release candidate |
| Open P0/P1 | 0 |

## 9. KPI pasca-launch

| Funnel | KPI utama |
|---|---|
| Activation | Registration completion, onboarding start, onboarding completion, time-to-complete. |
| Time to value | Waktu dari registrasi ke analysis pertama dan job match pertama. |
| Job Explorer | Search success, zero-result rate, detail CTR, save rate, outbound apply CTR. |
| Competency Explorer | Search-to-detail, skill saved, personal comparison viewed, learning CTA. |
| Analisis SAKTI AI | Generation success, report completion, section engagement, action CTR, helpfulness. |
| Chatbot | Activated users, helpful answer rate, groundedness, tool success, unresolved intent, D7 reuse. |
| Notification | Delivery, open, action conversion, unread backlog, opt-out, complaint/bounce. |
| Reliability | Error rate, p95 latency, pipeline duration/success, queue depth, stale job, MTTR. |
| AI economics | Token/cost per analysis, chat session, job match, dan learning path. |
| GTM | Visitor-to-register, source attribution, activated user, retained user, partner conversion. |

## 10. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi | Owner utama |
|---|---|---|---|
| Scope terlalu besar untuk empat role | Launch terlambat atau kualitas turun | Feature flag, MVP ketat, out-of-scope eksplisit, weekly scope review. | Market & GTM |
| Hallucination chatbot/analysis | Kepercayaan dan keputusan pengguna terdampak | Tool-first answer, citations, confidence, golden set, refusal policy, human review sample. | AI/ML Engineer |
| Lowongan stale atau melanggar source terms | UX buruk dan risiko legal | Approved provider/source, provenance, TTL, dedupe, takedown/report flow. | Market & GTM |
| Taxonomy kompetensi tidak konsisten | Search/matching/analysis tidak stabil | Versioning, governance, alias review, validation job, quality dashboard. | AI/ML Engineer |
| Worker AI in-process tidak scalable | Duplicate/stuck job saat scale-out | External queue, distributed lock, idempotency, dead-letter, load test. | Software Engineer |
| JWT di localStorage | Risiko token theft melalui XSS | HttpOnly cookie/refresh strategy, CSP, sanitization, short TTL, revocation. | Software Engineer |
| PII CV dan transcript | Risiko privacy/compliance | Consent, minimization, encryption, retention, delete/export, redaction, access audit. | Software Engineer |
| Contract drift tiga codebase | Runtime error meski build masing-masing lulus | OpenAPI/generated clients, schema validation, contract test di CI. | Software Engineer |
| Frontend tanpa automated tests | Regression tinggi menjelang launch | Unit/component/E2E foundation pada Agustus dan release gate wajib. | Software Engineer |
| AI cost/latency tidak terkendali | Margin dan UX memburuk | Caching, budget, model routing, token cap, async jobs, monitoring per feature. | AI/ML Engineer |

## 11. Keputusan scope yang disarankan

Untuk menjaga target Desember, market launch sebaiknya berfokus pada **Job Seeker Portal**. Recruiter Portal, dashboard government/company, auto-apply, voice chatbot, dan PWA push dapat tetap berada di luar scope launch kecuali tim bertambah atau fitur inti selesai lebih cepat.

Urutan prioritas jika kapasitas tertekan:

1. Stabilitas auth/onboarding/pipeline dan quality foundation.
2. Eksplorasi Pekerjaan General.
3. Eksplorasi Kompetensi General.
4. Analisis SAKTI AI.
5. AI Chatbot dengan use case terbatas dan grounded.
6. In-app notifications.
7. Email notification.
8. Push notification/PWA.

Dokumen ini perlu direview setiap akhir bulan. Perubahan scope harus memperbarui WBS, RACI, dependency, launch gate, dan tanggal milestone secara bersamaan.

## 12. Traceability audit ke codebase

| Area | Bukti implementasi yang ditelaah |
|---|---|
| Auth frontend | `src/api/auth.api.ts`, `src/features/auth/store/auth.slice.ts`, `src/lib/axios.ts`, route login/register. |
| Dashboard/navigation | `src/app/(portal)/job-seeker/(dashboard)`, `src/components/dashboard/sidebar.tsx`, `dashboard-navigation.tsx`. |
| Onboarding frontend | `src/components/onboarding/onboarding-wizard.tsx`, `repeatable-profile-forms.tsx`, `career-journey.tsx`. |
| Career pipeline frontend | `src/api/seeker.api.ts`, `src/features/career-pipeline/use-career-pipeline.ts`, `src/types/career-pipeline.types.ts`. |
| Job Matches | `src/app/(portal)/job-seeker/(dashboard)/job-matches/page.tsx`. |
| Learning Paths | `src/app/(portal)/job-seeker/(dashboard)/learning-paths/page.tsx`. |
| Analysis yang sudah ada | Dashboard `CareerForecast`, personality page, `onboarding-result-overview.tsx`, `ai-insight.tsx`. |
| Backend onboarding | `main-backend/src/features/job-seeker-onboarding` dan `features/career-onboarding`. |
| Backend AI pipeline | `main-backend/src/features/career-pipeline`, entity pipeline/match/gap/job/learning, dan migration career pipeline. |
| Competency data foundation | Entity dan migration `skill_domain`, `skill_category`, `skill_bank`, `skill_alias`, `skill_bank_category`. |
| SAKTI-AI | CV parser, Double Diamond, JobMatcher, TalentForger, graph, LLM client, Brave Search, dan test di `SAKTI-AI/src` serta `SAKTI-AI/tests`. |
| Chatbot gap | Menu sudah terlihat sebagai placeholder, tetapi tidak ditemukan route frontend, conversation model, API backend, atau chatbot feature di SAKTI-AI. |
| Notification gap | Bell/badge visual tersedia, tetapi tidak ditemukan notification entity, preference, controller, delivery service, atau provider integration. |
| General exploration gap | Lowongan tersedia sebagai output JobMatcher per pipeline; skill taxonomy tersedia sebagai schema. Keduanya belum memiliki pengalaman katalog general end-to-end. |
