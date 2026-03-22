function Question({ question, userAnswer, onChange, direction }) {
  const animClass = direction === 'right' ? 'slide-right' : 'slide-left';

  const renderMCQ = () => (
    <div className="options-list">
      {question.options.map((opt) => (
        <div
          key={opt}
          className={`option-item${userAnswer === opt ? ' selected' : ''}`}
          onClick={() => onChange(opt)}
        >
          <div className="option-radio" />
          <span>{opt}</span>
        </div>
      ))}
    </div>
  );

  const renderMulti = () => {
    const selected = userAnswer || [];
    const expectedCount = question.answer.length;
    const toggle = (opt) => {
      if (selected.includes(opt)) {
        onChange(selected.filter((s) => s !== opt));
      } else {
        onChange([...selected, opt]);
      }
    };
    return (
      <>
        <span className="multi-note">Select {expectedCount} answer{expectedCount > 1 ? 's' : ''}</span>
        <div className="options-list">
          {question.options.map((opt) => (
            <div
              key={opt}
              className={`option-item${selected.includes(opt) ? ' selected' : ''}`}
              onClick={() => toggle(opt)}
            >
              <div className="option-checkbox" />
              <span>{opt}</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderHotspot = () => {
    const answers = userAnswer || Array(question.statements.length).fill(null);
    const setYN = (idx, val) => {
      const updated = [...answers];
      updated[idx] = val;
      onChange(updated);
    };
    return (
      <table className="hotspot-table">
        <thead>
          <tr>
            <th>Statement</th>
            <th>Yes</th>
            <th>No</th>
          </tr>
        </thead>
        <tbody>
          {question.statements.map((stmt, idx) => (
            <tr key={idx}>
              <td className="statement-cell">{stmt}</td>
              <td className="yn-cell">
                <button
                  className={`yn-btn${answers[idx] === 'Yes' ? ' active-yes' : ''}`}
                  onClick={() => setYN(idx, 'Yes')}
                >
                  Yes
                </button>
              </td>
              <td className="yn-cell">
                <button
                  className={`yn-btn${answers[idx] === 'No' ? ' active-no' : ''}`}
                  onClick={() => setYN(idx, 'No')}
                >
                  No
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderDropdown = () => (
    <>
      {question.sentence && (
        <div className="question-sentence">{question.sentence}</div>
      )}
      <select
        className={`dropdown-select${userAnswer ? ' has-value' : ''}`}
        value={userAnswer || ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">-- Select an answer --</option>
        {question.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </>
  );

  const renderDrag = () => {
    const answers = userAnswer || Array(question.matches.length).fill('');
    const setMatch = (idx, val) => {
      const updated = [...answers];
      updated[idx] = val;
      onChange(updated);
    };
    return (
      <div className="drag-matches">
        {question.matches.map((m, idx) => (
          <div key={idx} className="drag-match-row">
            <span className="action-text">{m.action}</span>
            <span className="arrow-icon">&rarr;</span>
            <select
              className={answers[idx] ? 'has-value' : ''}
              value={answers[idx] || ''}
              onChange={(e) => setMatch(idx, e.target.value || '')}
            >
              <option value="">-- Select --</option>
              {question.dragOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };

  const renderers = {
    mcq: renderMCQ,
    multi: renderMulti,
    hotspot: renderHotspot,
    dropdown: renderDropdown,
    drag: renderDrag,
  };

  return (
    <div className="question-area">
      <div className={`question-card glass-card ${animClass}`} key={question.id}>
        <div className="question-number">Question {question.id}</div>
        <div className="question-text">{question.text}</div>
        {renderers[question.type]()}
      </div>
    </div>
  );
}

export default Question;
