import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get(`/api/services/${id}`).then((res) => setService(res.data));
  }, [id]);

  useEffect(() => {
    api
      .get(`/api/services/${id}/history`)
      .then((res) => setHistory(res.data.history));
  }, [id]);

  if (!service) return <p>Loading...</p>;

  return (
    <>
      <div>
        <h2>
          {service.origin} → {service.destination}
        </h2>
        <p>{service.operator}</p>
        <p>Scheduled: {service.scheduled_time}</p>
        <h3>Latest</h3>
        <p>Platform: {service.latest.platform}</p>
        <p>Status: {service.latest.status}</p>
        <p>Expected: {service.latest.expected_time}</p>
      </div>
      <div>
        <h3>History</h3>
        <table>
          <tbody>
            {/* below we currently set timestamp as key if available, if not we set the index - can update backend later to give an actual id as default */}
            {history.map((h, i) => (
              <tr key={h.timestamp ?? i}>
                <td>{h.timestamp}</td>
                <td>{h.expected_time}</td>
                <td>{h.delay_minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
