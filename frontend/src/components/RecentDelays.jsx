import Card from "./Card";

export default function RecentDelays({ delays }) {
  return (
    <Card>
      {delays ? (
        <>
          <h2 style={{ textAlign: "center" }}>Recent delays</h2>

          <ul style={{ padding: 0, margin: 0 }}>
            {delays.map((d) => (
              <li
                key={d.station}
                style={{
                  listStyle: "none",
                  padding: "0.4rem 0",
                  fontSize: "1.1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #444",
                }}
              >
                <span>{d.station}</span>
                <span>{d.avg_delay.toFixed(1)} min</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="skeleton" style={{ height: 280, width: "100%" }} />
      )}
    </Card>
  );
}
