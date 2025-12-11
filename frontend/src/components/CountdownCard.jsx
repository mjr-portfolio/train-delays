import Card from "./Card";

export default function CountdownCard({ nextScrape, countdown }) {
  return (
    <Card style={{ textAlign: "center", width: "400px" }}>
      {countdown ? (
        <div style={{ fontSize: "1.1rem", marginBottom: "0.3rem" }}>
          <div>
            Approx Next Scrape: {new Date(nextScrape).toLocaleTimeString()}
          </div>
          <div style={{ fontWeight: "600" }}>Countdown: {countdown}</div>
        </div>
      ) : (
        <div
          className="skeleton"
          style={{ height: 58, width: "70%", margin: "0 auto" }}
        />
      )}
    </Card>
  );
}
