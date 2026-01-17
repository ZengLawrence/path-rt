import { ArrowClockwise } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";

function LastUpdatedPanel(
  {
    lastUpdated,
    refreshSchedule,
    isStale,
  }: {
    lastUpdated: Date | null;
    refreshSchedule: () => void;
    isStale?: boolean;
  }
) {

  const className = (isStale ? "bg-warning" : "");
  const updatedTimeSpan = <span className={className}>{lastUpdated?.toLocaleString()}</span>;

  return (<div className="mb-2">
    <span className="me-2">
      Last updated: {lastUpdated ? updatedTimeSpan : "Pending..."}
    </span>
    <Button
      variant="outline-secondary"
      onClick={refreshSchedule}
    >
      <ArrowClockwise />
    </Button>
  </div>);
}

export default LastUpdatedPanel;