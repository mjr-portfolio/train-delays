import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState("");
  const [services, setServices] = useState([]);
  const [delays, setDelays] = useState([]);

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
    if (!selected) return;
    api.get("/api/services?station=" + selected).then((res) => {
      setServices(res.data);
    });
  }, [selected]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
      <h1>Train Delays Dashboard</h1>

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
