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

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
      <h1>Train Delays Dashboard</h1>

      {trend.length > 0 && (
        <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
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

      <h2>Recent delays</h2>

      <ul>
        {delays.map((d) => (
          <li style={{ listStyleType: "none" }} key={d.station}>
            {d.station}: {d.avg_delay.toFixed(1)} min
          </li>
        ))}
      </ul>

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
