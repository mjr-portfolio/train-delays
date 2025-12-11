import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";

import CountdownCard from "../components/CountdownCard";
import TrendChart from "../components/TrendChart";
import RecentDelays from "../components/RecentDelays";
import StationSelect from "../components/StationSelect";
import ServicesTable from "../components/ServicesTable";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState("");
  const [services, setServices] = useState([]);
  const [delays, setDelays] = useState([]);
  const [trend, setTrend] = useState([]);
  const [last, setLast] = useState([]);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    api.get("/api/stations").then((res) => {
      setStations(res.data);
    });
  }, []);

  useEffect(() => {
    api.get("/api/stations/delays/recent").then((res) => {
      setDelays(res.data);
    });
  }, []);

  useEffect(() => {
    api.get("/api/delay-trend").then((res) => {
      setTrend(res.data);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get("/api/services?station=" + selected).then((res) => {
      setServices(res.data);
    });
  }, [selected]);

  const fetchLastScrape = useCallback(() => {
    api.get("/api/last-scrape").then((res) => {
      setLast(res.data.last);
    });
  }, []);

  useEffect(() => {
    fetchLastScrape();
  }, [fetchLastScrape]);

  const nextScrape = last
    ? new Date(last).getTime() + 4 * 60 * 60 * 1000 // 4h in ms
    : null;

  useEffect(() => {
    if (!nextScrape) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = nextScrape - now;

      if (diff <= 0) {
        setCountdown("Refreshing soon, please wait…");
        // Grab the latest last-scrape from the API to rerun useEffect
        fetchLastScrape();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setCountdown(`${hours}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextScrape, fetchLastScrape]);

  return (
    <>
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <h1>🚆 UK Train Delays Dashboard 🚆</h1>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <CountdownCard countdown={countdown} nextScrape={nextScrape} />
      </div>

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "2rem",
          marginTop: "1rem",
          marginBottom: "2rem",
        }}
      >
        <TrendChart trend={trend} />
        <RecentDelays delays={delays} />
      </div>

      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <StationSelect
          stations={stations}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <ServicesTable services={services} />
      </div>
    </>
  );
}
