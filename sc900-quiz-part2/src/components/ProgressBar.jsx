function ProgressBar({ current, total }) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="progress-text">
        Question {current + 1} of {total}
      </div>
    </div>
  );
}

export default ProgressBar;
