# Data Invariants
1. Users can only read and write their own profile, progress, and certificates.
2. `displayName` must be a string between 1 and 100 characters.
3. `challengeId` must follow the pattern `^[a-zA-Z0-9_\-]+$`.
4. `completedAt` and `issuedAt` must use `request.time` (server timestamp) on creation.
5. Certificates are immutable after creation.

# The Dirty Dozen Payloads (Rejection Tests)
1. Read another user's profile: `GET /users/victim-uid` as `attacker-uid`.
2. Write a challenge as completed for someone else: `CREATE /users/victim-uid/challenges/sql-1`.
3. Self-assign an admin role (if it existed, but we don't have it yet).
4. Inject a 2MB string into `displayName`.
5. Spoof `completedAt` with a client timestamp.
6. Delete a certificate.
7. Update an existing certificate's `rank`.
8. Create a user without `displayName`.
9. Create a progress entry with an invalid `challengeId` format.
10. Anonymous user attempting to read any data.
11. User with unverified email (assuming strictly mandated verified emails per instructions).
12. Relational write failure: Create progress for a non-existent user profile.
