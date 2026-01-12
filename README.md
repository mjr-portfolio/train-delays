🚆 Train Delays Dashboard

A full-stack data project that tracks UK train delays over time by scraping live departure data, normalising it into a relational database, and visualising trends in a simple dashboard.

This project was built to demonstrate real-world backend and data engineering skills: working with external APIs, building reliable pipelines, designing schemas, and deploying production services.

📊 What the project does

Scrapes live train departure data from the TransportAPI

Normalises raw API responses into structured relational models

Stores historical snapshots to track how delays change over time

Computes aggregate metrics (e.g. average delay per scrape)

Exposes data via a Flask API

Displays trends in a lightweight frontend dashboard

The scraper runs on a schedule and continuously builds a dataset that becomes more useful over time.

🧱 Tech Stack

Backend

Python

Flask

SQLAlchemy + Postgres

Railway (API + scheduled scraper)

Data & Architecture

Relational schema design

Data normalisation

Upserts and snapshot history

Logging and scrape summaries

Retry logic for production reliability (cold starts, sleeping DB, etc.)

Frontend

Simple dashboard UI (HTML/CSS/JS)

Focused on clarity rather than heavy frameworks

🧠 Key Engineering Considerations

This project intentionally handles realistic production concerns, including:

Cold starts from hosted databases

Retry logic for transient DB failures

Structured logging for observability

Separation of raw data → normalised models

Avoiding duplicated records via deterministic upserts

Historical snapshots for trend analysis

It’s designed to behave more like a small real-world data pipeline than a toy scraper.

🌍 Live Demo

Note: The deployed services may take up to 30 seconds to wake up on first visit due to hosting cold starts.<br>
If it seems to be stuck after 20-30 seconds, refresh the page to allow it to work correctly.

Frontend:
https://train-delays.vercel.app/

Backend:
https://train-delays-production.up.railway.app/

🗂️ Project Structure (high level)

services/ – scraper, API client, transformations

db/ – models and database setup

routes/ – Flask API endpoints

scraper.py – scheduled job entrypoint

dashboard/ – simple frontend for visualisation

🚧 Possible Improvements

Future enhancements (not yet implemented):

Support for more stations to widen the dataset

Stronger visualisations

Alerting on severe delays

Public API documentation

Containerised local setup

✍️ Why this project exists

This project was built to demonstrate:

Backend engineering skills

Data modelling and pipeline thinking

Practical reliability concerns

Comfort with production deployments

Ability to design end-to-end systems independently
