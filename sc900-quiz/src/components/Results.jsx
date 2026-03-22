import { useState, useMemo, useEffect } from 'react';
import { questions } from '../data/questions';

function getMaxPoints(q) {
  if (q.type === 'mcq' || q.type === 'dropdown') return 1;
  if (q.type === 'multi') return q.answer.length;
  if (q.type === 'hotspot') return q.statements.length;
  if (q.type === 'drag') return q.matches.length;
  return 1;
}

function scoreQuestion(q, userAnswer) {
  if (!userAnswer) return 0;

  if (q.type === 'mcq') {
    return userAnswer === q.answer ? 1 : 0;
  }
  if (q.type === 'dropdown') {
    return userAnswer === q.answer ? 1 : 0;
  }
  if (q.type === 'multi') {
    const correctSet = new Set(q.answer);
    const selected = userAnswer || [];
    let score = 0;
    selected.forEach((s) => {
      const letter = s.charAt(0);
      if (correctSet.has(letter)) score += 1;
      else score -= 1;
    });
    return Math.max(0, Math.min(score, q.answer.length));
  }
  if (q.type === 'hotspot') {
    const ans = userAnswer || [];
    let score = 0;
    q.answers.forEach((correct, idx) => {
      if (ans[idx] === correct) score += 1;
    });
    return score;
  }
  if (q.type === 'drag') {
    const ans = userAnswer || [];
    let score = 0;
    q.matches.forEach((m, idx) => {
      if (ans[idx] === m.answer) score += 1;
    });
    return score;
  }
  return 0;
}

function Confetti() {
  const pieces = useMemo(() => {
    const colors = ['#39FF14', '#FF6EC7', '#00D4FF', '#BF40BF', '#FFD700', '#FF4500', '#7B68EE'];
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
      size: Math.random() * 8 + 6,
      shape: Math.random() > 0.5 ? '50%' : '2px',
    }));
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function Results({ userName, answers, timeTaken, onRetake }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    return questions.map((q) => {
      const maxPts = getMaxPoints(q);
      const earned = scoreQuestion(q, answers[q.id]);
      let status = 'incorrect';
      if (earned === maxPts) status = 'correct';
      else if (earned > 0) status = 'partial';
      return { question: q, maxPts, earned, status, userAnswer: answers[q.id] };
    });
  }, [answers]);

  const totalEarned = results.reduce((s, r) => s + r.earned, 0);
  const totalMax = results.reduce((s, r) => s + r.maxPts, 0);
  const pct = Math.round((totalEarned / totalMax) * 100);
  const passed = pct >= 70;

  const fullyCorrect = results.filter((r) => r.status === 'correct').length;
  const partialCredit = results.filter((r) => r.status === 'partial').length;
  const incorrect = results.filter((r) => r.status === 'incorrect').length;

  const sections = useMemo(() => {
    const s = [];
    for (let i = 0; i < 10; i++) {
      const batch = results.slice(i * 10, (i + 1) * 10);
      const earned = batch.reduce((sum, r) => sum + r.earned, 0);
      const max = batch.reduce((sum, r) => sum + r.maxPts, 0);
      s.push({ label: `Q${i * 10 + 1}-${(i + 1) * 10}`, earned, max });
    }
    return s;
  }, [results]);

  const filteredResults = results.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const formatTimeTaken = () => {
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;
    return `${mins}m ${secs}s`;
  };

  const handleShare = () => {
    const text = `SC-900 Practice Exam Result\nName: ${userName}\nScore: ${totalEarned}/${totalMax} (${pct}%)\nResult: ${passed ? 'PASS' : 'FAIL'}\nTime: ${formatTimeTaken()}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatUserAnswer = (r) => {
    const q = r.question;
    const ua = r.userAnswer;
    if (!ua) return 'No answer';
    if (q.type === 'mcq' || q.type === 'dropdown') return String(ua);
    if (q.type === 'multi') return (ua || []).join(', ') || 'No answer';
    if (q.type === 'hotspot') return (ua || []).map((v, i) => `S${i + 1}: ${v || '-'}`).join(', ');
    if (q.type === 'drag') return (ua || []).map((v, i) => `${q.matches[i].action.substring(0, 25)}... = ${v || '-'}`).join('; ');
    return String(ua);
  };

  const formatCorrectAnswer = (q) => {
    if (q.type === 'mcq' || q.type === 'dropdown') return String(q.answer);
    if (q.type === 'multi') return q.answer.join(', ');
    if (q.type === 'hotspot') return q.answers.map((v, i) => `S${i + 1}: ${v}`).join(', ');
    if (q.type === 'drag') return q.matches.map((m) => `${m.action.substring(0, 25)}... = ${m.answer}`).join('; ');
    return '';
  };

  return (
    <div className="results-container">
      {passed && <Confetti />}

      <div className="results-header">
        <h1 className={passed ? 'pass' : 'fail'}>
          {passed ? `CONGRATULATIONS ${userName}!` : `Keep Studying ${userName}!`}
        </h1>
        <p className="result-subtitle">
          {passed
            ? 'You passed the SC-900 Practice Exam!'
            : 'You need 70% to pass. Review the questions below and try again!'}
        </p>
      </div>

      <div className="score-circle-wrapper">
        <div
          className="score-circle"
          style={{
            background: `conic-gradient(${passed ? '#39FF14' : '#FF6EC7'} ${pct * 3.6}deg, #e8e8e8 0deg)`,
          }}
        >
          <div className="score-circle-inner">
            <span className="score-pct">{pct}%</span>
            <span className="score-label">Score</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-number blue">{totalEarned}/{totalMax}</div>
          <div className="stat-desc">Total Points</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-number green">{fullyCorrect}</div>
          <div className="stat-desc">Fully Correct</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-number orange">{partialCredit}</div>
          <div className="stat-desc">Partial Credit</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-number red">{incorrect}</div>
          <div className="stat-desc">Incorrect</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-number blue">{formatTimeTaken()}</div>
          <div className="stat-desc">Time Taken</div>
        </div>
      </div>

      <div className="section-breakdown">
        <h3>Section Breakdown</h3>
        <div className="section-bars">
          {sections.map((sec) => (
            <div key={sec.label} className="section-bar-row">
              <span className="section-bar-label">{sec.label}</span>
              <div className="section-bar-track">
                <div
                  className="section-bar-fill"
                  style={{ width: `${sec.max > 0 ? (sec.earned / sec.max) * 100 : 0}%` }}
                >
                  <span className="bar-text">{sec.earned}/{sec.max}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="review-section">
        <h3>Review Questions</h3>
        <div className="filter-buttons">
          {[
            { key: 'all', label: `All (${results.length})` },
            { key: 'correct', label: `Correct (${fullyCorrect})` },
            { key: 'partial', label: `Partial (${partialCredit})` },
            { key: 'incorrect', label: `Incorrect (${incorrect})` },
          ].map((f) => (
            <button
              key={f.key}
              className={`filter-btn${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredResults.map((r) => (
          <div key={r.question.id} className="review-item">
            <button
              className="review-item-header"
              onClick={() => setExpandedId(expandedId === r.question.id ? null : r.question.id)}
            >
              <span className={`review-indicator ${r.status}`} />
              <span className="review-q-text">Q{r.question.id}. {r.question.text.substring(0, 80)}{r.question.text.length > 80 ? '...' : ''}</span>
              <span className="review-points">{r.earned}/{r.maxPts}</span>
              <span className={`review-expand-icon${expandedId === r.question.id ? ' open' : ''}`}>
                &#9660;
              </span>
            </button>
            {expandedId === r.question.id && (
              <div className="review-detail">
                <div className="answer-row">
                  <span className="label">Your Answer: </span>
                  <span className={r.status === 'correct' ? 'correct-val' : 'wrong-val'}>
                    {formatUserAnswer(r)}
                  </span>
                </div>
                <div className="answer-row">
                  <span className="label">Correct Answer: </span>
                  <span className="correct-val">{formatCorrectAnswer(r.question)}</span>
                </div>
                <div className="answer-row">
                  <span className="label">Points: </span>
                  <span>{r.earned} / {r.maxPts}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="results-actions">
        <button className="btn-retake" onClick={onRetake}>Retake Exam</button>
        <button className="btn-share" onClick={handleShare}>
          {copied ? 'Copied!' : 'Share Score'}
        </button>
      </div>
    </div>
  );
}

export { getMaxPoints, scoreQuestion };
export default Results;
