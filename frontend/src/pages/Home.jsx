import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

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
    api.get("/api/last-scrape").then((res) => {
      setLast(res.data.last);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get("/api/services?station=" + selected).then((res) => {
      setServices(res.data);
    });
  }, [selected]);

  const nextScrape = last
    ? new Date(last).getTime() + 4 * 60 * 60 * 1000 // 4h in ms
    : null;

  useEffect(() => {
    if (!nextScrape) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = nextScrape - now;

      if (diff <= 0) {
        setCountdown("Refreshing soon…");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setCountdown(`${hours}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextScrape]);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      <h1>🚆 UK Train Delays Dashboard 🚆</h1>

      {countdown && (
        <div style={{ marginBottom: "1rem", fontWeight: "bold" }}>
          <div>
            Approx Next Scrape: {new Date(nextScrape).toLocaleTimeString()}
          </div>
          <div>Countdown: {countdown}</div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {trend.length > 0 && (
          <div
            style={{
              minWidth: "400px",
              maxWidth: "600px",
              margin: "2rem auto",
            }}
          >
            <h2>Average Delay Trend</h2>
            <Line
              data={{
                labels: trend.map((t) =>
                  new Date(t.timestamp).toLocaleTimeString()
                ),
                datasets: [
                  {
                    label: "Avg Delay (mins)",
                    data: trend.map((t) => t.avg_delay),
                    tension: 0.3,
                  },
                ],
              }}
            />
          </div>
        )}

        <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
          <h2>Recent delays</h2>

          <ul>
            {delays.map((d) => (
              <li style={{ listStyleType: "none" }} key={d.station}>
                {d.station}: {d.avg_delay.toFixed(1)} min
              </li>
            ))}
          </ul>
        </div>
      </div>

      <select onChange={(e) => setSelected(e.target.value)}>
        <option>Select station...</option>
        {stations.map((s) => (
          <option key={s.id} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>

      <table>
        <thead>
          <tr>
            <th>Operator</th>
            <th>Destination</th>
            <th>Scheduled</th>
          </tr>
        </thead>

        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.operator}</td>
              <td>
                <Link to={`/service/${s.id}`}>{s.destination}</Link>
              </td>
              <td>{s.scheduled_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
