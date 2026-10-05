# Architectural Decisions

## 1. Safety First (Tools Layer)
The LLM is strictly a routing engine. All state changes occur in `tools.py`. The LLM cannot alter the database directly. If the LLM hallucinates an available time, `book_appointment` will catch the conflict and return an error, preventing data corruption.

## 2. Concurrency (Threading Lock)
A `threading.Lock()` encapsulates the read/write logic inside `book_appointment`, `reschedule_appointment`, and `cancel_appointment`. This guarantees that if two simulated callers ask for `10:15` simultaneously, the first thread locks the DB, writes, and the second thread reads the new state and rejects the booking.

## 3. Strict Handoff Boundaries
The `escalate_to_human` function immediately terminates the API request, returning a schema-compliant JSON block. This ensures that in a medical emergency, the model cannot be tricked into continuing a friendly conversation—it acts as a hard circuit breaker.