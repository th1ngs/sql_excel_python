# Data Invariants
1. Users can only read and write their own profile, progress, and certificates.
2. `displayName` must be a string between 1 and 100 characters.
3. `challengeId` must follow the pattern `^[a-zA-Z0-9_\-]+$`.
4. `completedAt` and `issuedAt` must use `request.time` (server timestamp) on creation.
5. Certificates are immutable after creation.
6. Duels can only be created by an authenticated user setting themselves as `hostUid` with `status == 'waiting'`.
7. Once a duel reaches `status == 'completed'`, it is terminal and cannot be modified further.
8. Only `hostUid` or `guestUid` (or a joining guest when `status == 'waiting'`) may update a duel, and each action strictly restricts `affectedKeys()`.

# The Dirty Dozen Payloads (Rejection Tests)
1. Read another user's profile: `GET /users/victim-uid` as `attacker-uid`.
2. Write a challenge as completed for someone else: `CREATE /users/victim-uid/challenges/sql-1`.
3. Create a duel pretending to be another host: `CREATE /duels/DUEL-123` with `hostUid: 'victim-uid'`.
4. Inject a 2MB string into `displayName` or `hostQuery`.
5. Spoof `completedAt` or `createdAt` with a client timestamp.
6. Delete a certificate or duel.
7. Update an existing certificate's `rank`.
8. Modify a completed duel (`status == 'completed'`).
9. Create a progress entry with an invalid `challengeId` format.
10. Anonymous user attempting to read or write any data.
11. Shadow update on `/duels/{duelId}` adding an undeclared field `isAdmin: true`.
12. Uninvolved third-party user attempting to update an active duel between two other players.
