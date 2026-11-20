# TripForge Backend

Express REST API for the TripForge frontend. The API is served at `http://localhost:5000/api`.

## Setup

```bash
cd server
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

SQLite is the default. The seed users use fake `.test` email addresses. Existing frontend login assumptions are represented by demo passwords:

- `demo-joy@tripforge.test` / `@1111111`
- `demo-tonmoy@tripforge.test` / `tonmoy1234`
- `demo-arafat@tripforge.test` / `password123`
- `demo-nadia@tripforge.test` / `password123`
- `demo-tariq@tripforge.test` / `password123`
- `demo-samira@tripforge.test` / `password123`

## Scripts

| Script | Command |
|---|---|
| dev | `nodemon src/server.js` |
| start | `node src/server.js` |
| migrate | Apply pending Knex migrations |
| seed | Run seed data |
| test | Run Vitest unit and integration tests |

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | HTTP port |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS origin |
| `JWT_SECRET` | development fallback | JWT signing secret |
| `JWT_EXPIRES_IN` | `1d` | JWT lifetime |
| `DB_CLIENT` | `sqlite` | `sqlite` or `mysql2` |
| `DB_FILENAME` | `./data/tripforge.sqlite` | SQLite file |
| `DB_HOST` | unset | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | unset | MySQL user |
| `DB_PASSWORD` | unset | MySQL password |
| `DB_NAME` | unset | MySQL database |
| `WEATHER_API_KEY` | empty | OpenWeather-compatible provider key |
| `WEATHER_BASE_URL` | OpenWeather v2.5 base URL | Weather provider base URL |

Switch to MySQL by setting `DB_CLIENT=mysql2`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`. No application code change is required.

## Response format

Success:
```json
{ "success": true, "data": {} }
```

Error:
```json
{ "success": false, "message": "Error text", "code": "VALIDATION_ERROR" }
```

Authenticated endpoints require `Authorization: Bearer <JWT>`.

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user |
| PATCH | `/auth/profile` | Update profile |
| GET | `/trips` | My trips |
| POST | `/trips` | Create trip |
| GET | `/trips/:tripId` | Trip detail |
| PATCH | `/trips/:tripId` | Update trip (creator) |
| DELETE | `/trips/:tripId` | Delete trip (creator) |
| POST | `/trips/join-request` | Join by invite code |
| GET | `/users/me/join-requests` | My join requests |
| DELETE | `/users/me/join-requests/:requestId` | Cancel pending request |
| GET | `/trips/:tripId/updates` | Recent trip updates |
| GET | `/trips/:tripId/members` | Members |
| GET | `/trips/:tripId/join-requests` | Pending requests (creator) |
| POST | `/trips/:tripId/join-requests/:requestId/approve` | Approve (creator) |
| POST | `/trips/:tripId/join-requests/:requestId/reject` | Reject (creator) |
| POST | `/trips/:tripId/invite-code` | Generate/regenerate code (creator) |
| DELETE | `/trips/:tripId/members/:memberId` | Remove member (creator) |
| POST | `/trips/:tripId/leave` | Leave trip |
| GET | `/trips/:tripId/itinerary` | Itinerary |
| POST | `/trips/:tripId/itinerary` | Add activity |
| PATCH | `/trips/:tripId/itinerary/reorder` | Reorder activity |
| PATCH | `/trips/:tripId/itinerary/:activityId` | Edit activity (owner/creator) |
| DELETE | `/trips/:tripId/itinerary/:activityId` | Delete activity (owner/creator) |
| GET | `/trips/:tripId/ideas` | Ideas |
| POST | `/trips/:tripId/ideas` | Suggest idea |
| POST | `/trips/:tripId/ideas/:ideaId/vote` | Vote / toggle / change idea vote |
| PATCH | `/trips/:tripId/ideas/:ideaId` | Mark added to itinerary |
| PATCH | `/trips/:tripId/ideas/:ideaId/status` | Set accepted/rejected/pending status |
| GET | `/trips/:tripId/polls` | Polls |
| POST | `/trips/:tripId/polls` | Create poll |
| POST | `/trips/:tripId/polls/:pollId/vote` | Vote once |
| PATCH | `/trips/:tripId/polls/:pollId/close` | Close poll |
| GET | `/trips/:tripId/expenses` | Expenses |
| POST | `/trips/:tripId/expenses` | Add expense |
| PATCH | `/trips/:tripId/expenses/:expenseId` | Edit expense (payer/creator) |
| DELETE | `/trips/:tripId/expenses/:expenseId` | Delete expense (payer/creator) |
| GET | `/trips/:tripId/packing` | Packing items |
| POST | `/trips/:tripId/packing` | Add item |
| PATCH | `/trips/:tripId/packing/:itemId/toggle` | Toggle packed |
| PATCH | `/trips/:tripId/packing/:itemId` | Assign item |
| DELETE | `/trips/:tripId/packing/:itemId` | Delete item |
| GET | `/trips/:tripId/discussion` | Discussion posts |
| POST | `/trips/:tripId/discussion` | Create post |
| POST | `/trips/:tripId/discussion/:postId/replies` | Reply |
| GET | `/notifications` | Notifications |
| GET | `/notifications/unread-count` | Unread count |
| PATCH | `/notifications/:notificationId/read` | Mark one read |
| PATCH | `/notifications/read-all` | Mark all read |
| GET | `/trips/:tripId/weather` | Weather (mock fallback) |
| GET | `/trips/:tripId/summary` | Read-only combined summary |

## Assumptions

- Mock string IDs are kept verbatim in API responses.
- BDT amounts are returned as decimal numbers and stored in paise.
- Pending join requests are represented in `join_requests`; approved requests become `trip_members` rows.
- Polls allow one vote per member but permit the frontend to change neither; repeat vote requests return `409` rather than changing votes.
- Idea voting allows toggle/change behavior exactly as the mock.
- Poll/idea status strings are normalized to `open`/`closed` and `accepted`/`rejected`/`pending` at API boundaries.
