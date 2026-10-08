# Toilet Time Tracker

An open office game that tracks how long each colleague spends in the toilet and ranks them on a monthly leaderboard.

## Language

**Colleague**:
A person in the office whose toilet time is tracked, with their knowledge. Known to the app only by their alias.
_Avoid_: User, employee, player

**Alias**:
The made-up name that identifies a colleague everywhere in the app. Real names are never recorded.
_Avoid_: Name, nickname, username

**Avatar**:
The animated pirate-themed cartoon that represents a colleague, picked from a fixed set that ships with the app.
_Avoid_: Picture, gif, profile image

**Archived colleague**:
A colleague who has left the game: no new visits can be recorded for them, but their past visits and leaderboard places remain.
_Avoid_: Deleted, removed, inactive

**Operator**:
The one person who records visits by starting and stopping timers.
_Avoid_: Admin, user

**Visit**:
One trip to the toilet by one colleague, from the moment they leave to the moment they return. A colleague has at most one running visit; visits by different colleagues may overlap.
_Avoid_: Session, break, trip

**Month**:
A calendar month in local time. A visit belongs to the month in which it started, however long it runs.
_Avoid_: Period, season, round

**Closed month**:
A month that has ended. Its visits and leaderboard are final and can never be changed.
_Avoid_: Past month, locked month, archived month

**Leaderboard**:
The colleagues ranked by their total visit time in a month, most time first.
_Avoid_: Ranking, scoreboard

**Winner**:
The colleague at the top of the leaderboard when the month ends. Colleagues with exactly equal totals share the win.
_Avoid_: Champion, loser, worst offender
