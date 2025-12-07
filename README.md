# Train Delays – Automated Scraper + REST API + Dashboard

This project automatically collects live UK train departure data from the TransportAPI,
stores historical snapshots in a Postgres database, and exposes a REST API for service
details, history, and average delay metrics.

## Current Status

- Backend running locally
- REST endpoints implemented
- Historical snapshots captured
- Deployment to Railway in progress

## Tech Stack

- Python (Flask)
- SQLAlchemy + Postgres
- TransportAPI (live UK train data)
- Railway (hosting, cron)
- React/Vite frontend (coming next)

## Next Steps

- Deploy backend + Postgres
- Enable cron scraping
- Build dashboard UI
