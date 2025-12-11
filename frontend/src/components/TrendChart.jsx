import Card from "./Card";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Left here otherwise Line doesnt seem to work

export default function TrendChart({ trend }) {
  return (
    <Card>
      {trend.length > 0 ? (
        <div>
          <h2 style={{ textAlign: "center" }}>Average Delay Trend</h2>

          <div style={{ marginBottom: "1rem" }}>
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
        </div>
      ) : (
        <div className="skeleton" style={{ height: 280, width: "100%" }} />
      )}
    </Card>
  );
}
