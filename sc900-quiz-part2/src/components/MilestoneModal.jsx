function MilestoneModal({ sectionNumber, sectionScore, sectionMax, totalScore, totalMax, onContinue }) {
  const INTERVAL = 10;
  const startQ = 101 + (sectionNumber - 1) * INTERVAL;
  const endQ = Math.min(100 + sectionNumber * INTERVAL, 229);

  return (
    <div className="modal-overlay">
      <div className="milestone-modal glass-card">
        <h2>Section {sectionNumber} Complete!</h2>
        <p className="section-label">
          Questions {startQ} &ndash; {endQ}
        </p>
        <div className="milestone-stats">
          <div className="milestone-stat">
            <div className="stat-value">{sectionScore}/{sectionMax}</div>
            <div className="stat-label">Section Score</div>
          </div>
          <div className="milestone-stat">
            <div className="stat-value">{totalScore}/{totalMax}</div>
            <div className="stat-label">Running Total</div>
          </div>
        </div>
        <button className="btn-continue" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default MilestoneModal;
