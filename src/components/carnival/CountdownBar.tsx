import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

type Props = {
  target?: string;
  title?: string;
  subtitle?: string;
  venue?: string;
  reporting?: string;
};

export function CountdownBar({
  target = "2026-08-01T09:00:00+06:00",
  title = "Registration closes",
  subtitle = "Build your squad and lock the roster.",
  venue = "BUP Campus · Cyber Arena",
  reporting = "Reporting 09:00 AM",
}: Props) {
  return (
    <div className="event-countdown-bar" role="region" aria-label="Registration countdown">
      <div className="ecb-left">
        <span className="live-dot" />
        <span className="ecb-live-label">Registration Live</span>
      </div>
      <div className="ecb-mid">
        <span className="ecb-title">{title}</span>
        <span className="ecb-sub">{subtitle}</span>
      </div>
      <div className="ecb-clock">
        <FlipClockCountdown
          to={new Date(target).getTime()}
          showLabels={false}
          showSeparators
          hideOnComplete={false}
          digitBlockStyle={{
            width: 22,
            height: 30,
            fontSize: 18,
            fontWeight: 700,
            background: "transparent",
            color: "var(--color-cn-gold, #f2b705)",
            boxShadow: "none",
          }}
          dividerStyle={{ color: "transparent", height: 0 }}
          separatorStyle={{ color: "var(--color-cn-gold, #f2b705)", size: "3px" }}
          duration={0.5}
        />
      </div>
      <div className="ecb-right">
        <strong>{venue}</strong>
        <span>{reporting}</span>
      </div>
    </div>
  );
}
