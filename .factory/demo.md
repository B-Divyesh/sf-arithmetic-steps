# Arithmetic Steps demo sandbox

## Entry point

Open [`/demo`](https://arithmetic-steps.sociobot.in/demo), or press **Try it
with sample data** on the landing page. The demo immediately opens a
part-complete `52 − 18` problem. It has already taken away 10, so the learner
can see `42 − 8`, choose the last chunk, finish, and replay the steps.

## Isolation and reset

Demo problems use the IndexedDB database named `demo:arithmetic-steps`. Real
problems use `arithmetic-steps`; the app selects the demo database before any
problem data is read or written. The persistent banner identifies demo mode.

**Reset demo** deletes only `demo:arithmetic-steps` and reseeds the supplied
problem. **Start for real**, the normal Arithmetic Steps home link, and any
ordinary navigation away from demo first delete the demo database, then select
the real database. A real-app load also clears a leftover demo namespace before
it reads real problems. No demo action reads or writes the real database.

The offline claim is exercised from `/demo`, so the supplied sample remains
available after the first online visit when the browser is offline.
