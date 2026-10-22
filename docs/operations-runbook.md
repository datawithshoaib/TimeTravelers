# TimeTravelers Operations & Incident Runbook

## 1. Health Probes
- Liveness: `GET /health/live` (checks web service worker responsiveness)
- Readiness: `GET /health/ready` (checks catalog memory load and DB connectivity)

## 2. Ingestion & Reindexing Operations
When a new primary source transcription is verified:
1. Register source record in catalog with metadata and canonical URL.
2. Section-chunk the source text at semantic boundaries.
3. Call `POST /api/v1/admin/sources/{source_id}/reindex` to refresh index.
4. Verify via `GET /api/v1/admin/ingestion/jobs`.

## 3. Incident Procedures

### Broken Citations or Inaccuracy Reports
1. Inspect `feedback` table records via query or admin dashboard.
2. If citation excerpt does not match original manuscript, flag chunk for revision.
3. Bump `collection_version` and re-index.

### Disputed Attributions
If a letter's authorship is disputed by recent scholarship:
1. Change `is_primary_source` to `False` or tag as `scholarly_context`.
2. Update `evidence_status` default mapping to `unresolved`.
