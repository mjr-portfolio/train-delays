import { Link } from "react-router-dom";

export default function ServicesTable({ services }) {
  return (
    <>
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
              <td>{s.operator || "-"}</td>
              <td>
                <Link to={`/service/${s.id}`}>{s.destination}</Link>
              </td>
              <td>{s.scheduled_time || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
