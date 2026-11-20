# Frontend Connection Guide

Set the frontend environment variable in `Project_Code/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The frontend mock functions should keep returning their current unwrapped mock payload. In the real Axios integration, unwrap `response.data.data` because all server success responses use `{ "success": true, "data": ... }`.

## API mappings

| Frontend file/function | Endpoint | Body | Response data |
|---|---|---|---|
| `authApi.login` | `POST /auth/login` | `{ email, password }` | `{ user, token }` |
| `authApi.register` | `POST /auth/register` | `{ name, email, password, phone, university, department }` | `{ user, token }` |
| `authApi.getCurrentUser` | `GET /auth/me` | None | User object or `null` when unauthenticated |
| `authApi.updateProfile` | `PATCH /auth/profile` | Profile fields | User object |
| `authApi.logout` | None required | None | Frontend clears token |
| `tripsApi.getTrips` | `GET /trips` | None | Trip array with mock enrichment fields |
| `tripsApi.getTripById` | `GET /trips/:tripId` | None | Enriched trip object |
| `tripsApi.createTrip` | `POST /trips` | `{ name, destination, startDate, endDate, budget, description }` | Enriched trip |
| `tripsApi.updateTrip` | `PATCH /trips/:tripId` | Partial trip fields | Enriched trip |
| `tripsApi.deleteTrip` | `DELETE /trips/:tripId` | None | `{ deleted, id }` |
| `tripsApi.requestJoinTripByCode` / `joinTripByCode` | `POST /trips/join-request` | `{ inviteCode }` | `{ status, request, trip, message }` |
| `tripsApi.getUserPendingRequests` | `GET /users/me/join-requests` | None | Join request array |
| `tripsApi.cancelUserPendingRequest` | `DELETE /users/me/join-requests/:requestId` | None | `{ canceled, request }` |
| `tripsApi.getRecentUpdates` | `GET /trips/:tripId/updates` | None | `{ id, text, createdAt }[]` |
| `membersApi.getMembers` | `GET /trips/:tripId/members` | None | Member array |
| `membersApi.getPendingJoinRequests` | `GET /trips/:tripId/join-requests` | None | Pending request array |
| `membersApi.approveJoinRequest` | `POST /trips/:tripId/join-requests/:requestId/approve` | None | `{ approved, member, request }` |
| `membersApi.rejectJoinRequest` | `POST /trips/:tripId/join-requests/:requestId/reject` | None | `{ rejected, requestId }` |
| `membersApi.regenerateInviteCode` | `POST /trips/:tripId/invite-code` | None | `{ inviteCode }` |
| `membersApi.removeMember` | `DELETE /trips/:tripId/members/:memberId` | None | `{ removed, memberId }` |
| `itineraryApi.getItinerary` | `GET /trips/:tripId/itinerary` | None | Activity array |
| `itineraryApi.addActivity` | `POST /trips/:tripId/itinerary` | `{ day, title, time, location, cost, notes }` | Activity |
| `itineraryApi.updateActivity` | `PATCH /trips/:tripId/itinerary/:activityId` | Partial activity fields | Activity |
| `itineraryApi.deleteActivity` | `DELETE /trips/:tripId/itinerary/:activityId` | None | `{ deleted, id }` |
| `itineraryApi.reorderDayActivity` | `PATCH /trips/:tripId/itinerary/reorder` | `{ day, activityId, direction }` | Reordered activity array |
| `ideasApi.getIdeas` | `GET /trips/:tripId/ideas` | None | Idea array |
| `ideasApi.createIdea` | `POST /trips/:tripId/ideas` | `{ title, location, estimatedCost, notes }` | Idea |
| `ideasApi.voteIdea` | `POST /trips/:tripId/ideas/:ideaId/vote` | `{ value }` where `1` or `-1` | Idea |
| `ideasApi.markIdeaAddedToItinerary` | `PATCH /trips/:tripId/ideas/:ideaId` | `{ addedToItinerary: true }` | Idea |
| `pollsApi.getPolls` | `GET /trips/:tripId/polls` | None | Poll array |
| `pollsApi.createPoll` | `POST /trips/:tripId/polls` | `{ question, options }` | Poll |
| `pollsApi.votePoll` | `POST /trips/:tripId/polls/:pollId/vote` | `{ optionId }` | Poll |
| `pollsApi.closePoll` | `PATCH /trips/:tripId/polls/:pollId/close` | None | Poll |
| `expensesApi.getExpenses` | `GET /trips/:tripId/expenses` | None | Expense array |
| `expensesApi.addExpense` | `POST /trips/:tripId/expenses` | `{ title, amount, payerId, participantIds, date }` | Expense |
| `expensesApi.deleteExpense` | `DELETE /trips/:tripId/expenses/:expenseId` | None | `{ deleted, id }` |
| `expensesApi` frontend add/edit utility | `PATCH /trips/:tripId/expenses/:expenseId` | Partial expense fields | Expense |
| `packingApi.getPackingItems` | `GET /trips/:tripId/packing` | None | Packing item array |
| `packingApi.addPackingItem` | `POST /trips/:tripId/packing` | `{ title, assigneeId }` | Packing item |
| `packingApi.togglePackingItem` | `PATCH /trips/:tripId/packing/:itemId/toggle` | None | Packing item |
| `packingApi.assignPackingItem` | `PATCH /trips/:tripId/packing/:itemId` | `{ assigneeId }` | Packing item |
| `packingApi.deletePackingItem` | `DELETE /trips/:tripId/packing/:itemId` | None | `{ deleted, id }` |
| `discussionApi.getDiscussionPosts` | `GET /trips/:tripId/discussion` | None | Post array with replies |
| `discussionApi.createDiscussionPost` | `POST /trips/:tripId/discussion` | `{ content }` | Post |
| `discussionApi.addDiscussionReply` | `POST /trips/:tripId/discussion/:postId/replies` | `{ content }` | Reply |
| `notificationsApi.getNotifications` | `GET /notifications` | None | Notification array |
| `notificationsApi.getUnreadNotificationCount` | `GET /notifications/unread-count` | None | Number |
| `notificationsApi.markNotificationAsRead` | `PATCH /notifications/:notificationId/read` | None | Notification or `null` |
| `notificationsApi.markAllNotificationsAsRead` | `PATCH /notifications/read-all` | None | `[]` |
| `weatherApi.getWeatherForDestination` | `GET /trips/:tripId/weather` | None | Weather object or `{ available: false }` |
| Summary page local read | `GET /trips/:tripId/summary` | None | `{ trip, members, itinerary, acceptedIdeas, closedPolls, expenses, balances, packing }` |

## Shape and mismatch rules

- IDs remain frontend-style strings such as `trip-1`, `user-1`, `poll-1`, and `exp-1`; no numeric IDs are introduced.
- Success responses are `{ success, data }`; Axios clients must use `response.data.data`.
- Money fields remain decimal BDT numbers (for example `2400`), not paise.
- Internal storage and calculator intermediate values use paise/integer cents.
- Mock users and trip IDs match seed data. Demo emails were changed to `.test` addresses to ensure no real addresses or passwords are seeded.
- The frontend currently calculates expenses locally. The summary and expense responses include server-calculated balances through the summary shape, while the frontend should reuse the existing `calculateExpenseSummary` until it is explicitly switched.
