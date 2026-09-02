# Arithmetic Steps demo sandbox

## Entry point

Open [`/?demo=1`](https://arithmetic-steps.sociobot.in/?demo=1), use `/demo`,
or press **Try it with sample data** on the landing page. The demo immediately opens a
part-complete `52 − 18` problem. It has already taken away 10, so the learner
can see `42 − 8`, choose the last chunk, finish, and replay the steps.

## Isolation and reset

Demo problems use the IndexedDB database named `demo:arithmetic-steps` and the
local checkpoint keys `demo:arithmetic-steps:active-route` and
`demo:arithmetic-steps:pending-attempts`. Real problems use `arithmetic-steps`
with the matching unprefixed checkpoint keys; the app selects every demo
namespace before any problem data is read or written. Each database is
opened and upgraded to the complete `attempts` and `settings` schema before
the app marks storage ready. The persistent banner identifies demo mode.

**Reset demo** deletes only the demo database and checkpoint, then reseeds the
supplied problem. **Start for real**, the normal Arithmetic Steps home link,
and any ordinary navigation away from demo first delete both demo stores, then
select the real stores. A real-app load also clears leftover demo data before
it reads real problems. No demo action reads or writes the real namespaces.

The isolation claim exercises both `/?demo=1` and `/demo`. The offline claim
is exercised from `/demo`, so the supplied sample remains
available after the first online visit when the browser is offline.
