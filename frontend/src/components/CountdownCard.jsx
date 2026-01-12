import Card from "./Card";

export default function CountdownCard({ nextScrape, countdown }) {
  return (
    <Card className="cardCentered">
      {countdown ? (
        <div className="countdownWrapper">
          <div>
            Approx Next Scrape: {new Date(nextScrape).toLocaleTimeString()}
          </div>
          <div className="countdownBoldText">Countdown: {countdown}</div>
        </div>
      ) : (
        <div className="skeleton countdownSkeleton" />
      )}
    </Card>
  );
}
