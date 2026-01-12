import Card from "./Card";

export default function RecentDelays({ delays }) {
  return (
    <Card>
      {delays.length > 0 ? (
        <>
          <h2 className="centerTitle">Recent delays</h2>

          <ul style={{ padding: 0, margin: 0 }}>
            {delays.map((d) => (
              <li key={d.station} className="recentList">
                <span>{d.station}</span>
                <span>{d.avg_delay.toFixed(1)} min</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="skeleton recentSkeleton" />
      )}
    </Card>
  );
}
