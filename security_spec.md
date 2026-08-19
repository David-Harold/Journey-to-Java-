# Security Specification for Journey to Java

## Data Invariants
1. A task must always belong to the user who created it and remain bound to them.
2. User profile progress cannot be modified by anyone except the owner.
3. Pomodoro sessions are append-only for the owner.
4. Timestamps (`createdAt`, `updatedAt`) must be validated against `request.time` where applicable (future refinement).

## The Dirty Dozen Payloads (Rejection Targets)
1. **Unauthorized User Access**: User A tries to read User B's profile.
2. **Task Ownership Theft**: User A tries to create a task for User B's UID.
3. **Ghost Field Injection**: Adding an `isAdmin` field to the User document during update.
4. **Invalid State Skip**: Updating task status to an unknown value.
5. **ID Poisoning**: Using a 1MB string as a task ID.
6. **Immutable Field Tampering**: Changing `createdAt` on an existing task.
7. **Cross-User Task Read**: Requesting a list of tasks where `userId` doesn't match the auth token.
8. **Resource Exhaustion**: Sending a 10MB string in the task `description`.
9. **Fake Mastery**: Reporting `masteryLevel: 999`.
10. **Session Spoofing**: Logging a Pomodoro session for another user.
11. **Illegal Category**: Setting task category to `hacking`.
12. **Blanket Read Attack**: Unauthenticated user trying to read any collection.

## Test Strategy
- Use `firebase/rules-unit-testing` (conceptual) to verify all above payloads return `PERMISSION_DENIED`.
