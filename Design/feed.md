# Materialized Feed Service (BullMQ + Redis + MongoDB)

## Overview
This project demonstrates a scalable feed architecture using:
- **MongoDB** as the primary data store (Questions, Likes, Answers) and a denormalized **Feed** collection (materialized view).
- **Redis + BullMQ** for reliable, asynchronous job processing.
- **Node.js / Express** API to accept writes and serve the feed.
- **Workers** to consume jobs and update the Feed collection.

Reads are fast (single query to `Feed`), and expensive aggregations are handled asynchronously.

## Components
- **API Server** (`/api`): Handles user requests (create question, like, answer) and pushes jobs into BullMQ.
- **Redis / BullMQ**: Queue for feed update jobs (`feed-updates`).
- **Worker**: Processes jobs (`like-added`, `answer-added`, `question-created`, ...) and updates the `Feed` collection with atomic `$inc` or `upsert`.
- **Feed Collection**: Denormalized documents matching the front-end response shape:
  ```json
  {
    "_id": "<questionId>",
    "title": "...",
    "body": "...",
    "topics": ["javascript","nodejs"],
    "userId": {"_id": "...", "username": "..."},
    "createdAt": "...",
    "updatedAt": "...",
    "likes": 0,
    "dislikes": 0,
    "replies": 0
  }```



* **Backfill script**: Recompute and populate `Feed` documents from primary DB to recover drift.

## Event types

* `question-created`, `question-updated`
* `like-added`, `like-removed`
* `dislike-added`, `dislike-removed`
* `answer-added`, `answer-removed`

## Getting started (local)

Prereqs: Node.js, MongoDB, Redis

1. Install deps:

   ```bash
   npm install
   ```

2. Start Redis:

   * locally: `redis-server`
   * or via Docker: `docker run -p 6379:6379 redis`

3. Start MongoDB:

   * locally or `docker run -p 27017:27017 mongo`

4. Configure env (create `.env`):

   ```
   MONGO_URI=mongodb://localhost:27017/mydb
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   ```

5. Start API:

   ```bash
   npm run start:api
   ```

6. Start Worker:

   ```bash
   npm run start:worker
   ```

7. (Optional) Backfill feed:

   ```bash
   node scripts/backfillFeed.js
   ```

## Patterns & best practices

* **Atomic counters**: worker uses `$inc` for likes/dislikes/replies.
* **Idempotency**: include `jobId` or event `requestId` metadata to detect duplicates when needed.
* **Batching**: when traffic is very high, consider coalescing frequent increments (e.g., per-second batches).
* **Personalization**: `isLike` handled at read time by fetching all liked IDs for the current user (single query).
* **Monitoring**: track queue depth, job failure rates, and worker lag.
* **Resilience**: use BullMQ retries and dead-letter queue (DLQ) for poisoned messages.

## Operational notes

* Accept eventual consistency — counts can be seconds behind.
* Run periodic reconciliation (nightly or hourly) to correct drift.
* When scaling workers, `$inc` is safe for concurrent increments.
* For strict ordering or partitioned ordering guarantees, prefer Kafka.

## Troubleshooting

* Worker not processing jobs: check Redis connection and queue names.
* Drift between primary and feed: run backfill and verify event consumer logs.
* Duplicate increments: ensure idempotency or check producer logic to avoid duplicate job enqueueing.

## License

MIT




# 3 — Cause-of-change examples in STAR format

Below are short STAR entries for the common events that cause the feed to change. Use these as clear documentation for product/QA/ops.

### Example A — Like added (user likes a question)
**Situation:** A user views a question in the app and taps the like button.  
**Task:** Ensure the feed shows the updated likes count quickly while keeping the API fast and reliable.  
**Action:** The API saves a `Like` document to the `Likes` collection and enqueues a BullMQ job `like-added` with `{ questionId }`. A worker consumes the job and performs `Feed.findByIdAndUpdate(questionId, { $inc: { likes: 1 } })`.  
**Result:** The denormalized `Feed` document increments `likes` by 1. The `GET /feed/public` endpoint returns the updated count (within seconds). The API response to the user is immediate because job enqueueing is fast and non-blocking.

---

### Example B — Answer added (new reply)
**Situation:** A user posts an answer to a public question.  
**Task:** Reflect the increased reply count in the feed without blocking the user's POST response.  
**Action:** API persists the `Answer` doc and enqueues `answer-added` job. Worker increments `replies` via `$inc: { replies: 1 }` for the feed doc. Optionally, worker updates `updatedAt` and recalculates ranking score.  
**Result:** Feed shows `replies` +1 shortly after the answer is posted. The writer experiences low latency; the feed remains read-optimized.

---

### Example C — Question updated (title/body edited)
**Situation:** The question author edits the title or body.  
**Task:** Keep the feed text consistent with the primary question content.  
**Action:** API updates the `Question` document and enqueues `question-updated` job. Worker reads latest question snapshot from Mongo and performs `Feed.findOneAndUpdate({ _id: q._id }, { $set: { title, body, topics, updatedAt } }, { upsert: true })`.  
**Result:** Feed gets the latest title/body. Because worker does an upsert, missing feed docs are created if needed. The change is reflected in the UI once the job is processed.

---

### Example D — Like removed (user unlikes)
**Situation:** A user toggles off a previous like.  
**Task:** Decrement the feed `likes` counter safely and avoid negative counts.  
**Action:** API deletes the `Like` document and enqueues `like-removed`. Worker runs `Feed.findByIdAndUpdate(questionId, { $inc: { likes: -1 } })` then optionally clamps negatives: `if (doc.likes < 0) set to 0`.  
**Result:** Feed decrements likes. Negative counts are prevented by a safe clamp in the worker or via a reconciliation job.

---

# Final notes & next steps
- Want me to produce:
  - a) runnable code files (publisher + worker + models + backfill) wired for BullMQ?  
  - b) a PlantUML PNG/SVG export (I can only give the PlantUML code here — use any PlantUML tool to render)?  
  - c) the worker code with idempotency (event dedupe with Redis or Mongo dedupe table)?

Tell me which of (a–c) to deliver next and I’ll produce the code files ready to paste into your project.

