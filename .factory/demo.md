# Arithmetic Steps demo sandbox

## Entry point

Open [`/demo`](https://arithmetic-steps.sociobot.in/demo), or press **Try it
with sample data** on the landing page. The demo immediately opens a
part-complete `52 − 18` route: it has already taken away 10, so the learner
can see `42 − 8`, choose the last chunk, finish, and replay the trail.

## Isolation and reset

Demo routes use the IndexedDB database named `demo:arithmetic-steps`. Real
routes use `arithmetic-steps`; the app selects the demo database before any
route data is read or written. The persistent banner identifies demo mode.

**Reset demo** deletes only `demo:arithmetic-steps` and reseeds the supplied
route. **Start for real** deletes the demo database, returns to `/#learn`, and
selects the real database. No demo action reads or writes the real database.

The offline claim is exercised from `/demo`, so the supplied sample remains
available after the first online visit when the browser is offline.
