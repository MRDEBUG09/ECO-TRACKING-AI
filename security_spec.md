# Security Specification & Threat Model for EcoTrack AI

This document establishes the security guidelines, access controls, and threat mitigation scenarios for the EcoTrack AI Firebase Firestore database architecture.

---

## 1. Data Invariants

A clear set of constraints defining valid and secure application state:
1. **User Identity Isolation**: A user can only access, modify, query, or append sub-collections under `/users/{userId}` where `{userId}` is structurally equivalent to their verified user ID (`request.auth.uid`).
2. **Strict Attribute Validation**: User profile data, tracked emissions activities, habits, commitments, and diagnostics must conform to exact type, format, and range limits.
3. **Temporal Sanity**: `createdAt` timestamps must be structurally static after initialization; `updatedAt` values must be synchronized via server-relative request timestamps (`request.time`).
4. **Denial-of-Wallet Guarding**: Document IDs must conform to reasonable limits to avert junk-character database overflow attacks.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following scenarios represent malicious, unauthorized, or structurally malformed data formats designed to bypass security protocols. Our security rules are architected to categorically block these payloads:

1. **Identity Spoofing - Profiling**:
   An authenticated user `attacker123` attempts to write/overwrite the profile document in `/users/victim456`.
2. **Identity Spoofing - Activities**:
   An authenticated user `attacker123` tries to log a carbon activity directly inside `/users/victim456/activities/act_val_1`.
3. **Creation Timestamp Poisoning**:
   A user sends a client-determined past/future date-string in `createdAt` instead of a server-relative timestamp (`request.time`).
4. **Immutability Bypass**:
   An attacker tries to mutate their immutable `createdAt` timestamp during a standard profile edit.
5. **ID Poisoning Attack**:
   An attacker attempts to create a document with an extremely large, randomized 50KB string as the doc ID.
6. **Negative Value Exhaustion**:
   A user logs an activity with negative carbon emissions `emissionsKg: -99999` to cheat the analytics leaderboard.
7. **Invalid Enum Spoofing**:
   A user tries to set their diet preference `lifestylePreference` to `Cheesetarian` or `Carnivore_Elite` (which are invalid enums).
8. **Blind Listing of Profiles**:
   An authenticated user initiates a full collection query for `/users` without a target user ID restrictor, attempting to parse private user email IDs.
9. **Unauthorized Challenger Progression**:
   An attacker tries to complete a challenge directly by skipping the "joined" status key, directly updating their user challenge status to `completed` without active participation.
10. **System Field Compromise**:
    An attacker attempts to inject a custom `carbonScore` or XP points directly on profile updates without completing the activities.
11. **Malicious Global Override**:
    A user tries to overwrite global community challenge details `/challenges/challenge_1` with custom metrics.
12. **Leaderboard Spoofing**:
    A user attempts to post a high score under another user's document path in `/leaderboard/victim456`.

---

## 3. Planned Fortress Firestore Rules Layout

The rules file will incorporate the global catch-all deny-by-default, static type verification, size controls, action-based key diffing, and resource-owner mapping.
