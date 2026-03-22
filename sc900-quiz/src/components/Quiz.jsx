import { useState, useEffect, useRef, useCallback } from 'react';
import { questions } from '../data/questions';
import Question from './Question';
import ProgressBar from './ProgressBar';
import MilestoneModal from './MilestoneModal';
import { getMaxPoints, scoreQuestion } from './Results';

function Quiz({ userName, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState('right');
  const [seconds, setSeconds] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneSection, setMilestoneSection] = useState(0);
  const [completedMilestones, setCompletedMilestones] = useState(new Set());
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const question = questions[currentIdx];

  const handleAnswer = useCallback((value) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }, [question.id]);

  const goTo = useCallback((idx) => {
    setDirection(idx > currentIdx ? 'right' : 'left');
    setCurrentIdx(idx);
  }, [currentIdx]);

  const handleNext = useCallback(() => {
    if (currentIdx === questions.length - 1) {
      clearInterval(intervalRef.current);
      onFinish(answers, seconds);
      return;
    }

    const nextIdx = currentIdx + 1;

    // Check milestone: after Q10, Q20 ... Q90 (indices 9, 19, ... 89)
    if ((currentIdx + 1) % 10 === 0 && currentIdx < 90 && !completedMilestones.has(currentIdx + 1)) {
      const section = Math.floor(currentIdx / 10) + 1;
      setMilestoneSection(section);
      setShowMilestone(true);
      return;
    }

    setDirection('right');
    setCurrentIdx(nextIdx);
  }, [currentIdx, answers, seconds, onFinish, completedMilestones]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      setDirection('left');
      setCurrentIdx(currentIdx - 1);
    }
  }, [currentIdx]);

  const handleMilestoneContinue = () => {
    setCompletedMilestones((prev) => new Set([...prev, milestoneSection * 10]));
    setShowMilestone(false);
    setDirection('right');
    setCurrentIdx(currentIdx + 1);
  };

  const getMilestoneScores = () => {
    const start = (milestoneSection - 1) * 10;
    const end = milestoneSection * 10;
    let sectionEarned = 0;
    let sectionMax = 0;
    let totalEarned = 0;
    let totalMax = 0;

    for (let i = 0; i < end; i++) {
      const q = questions[i];
      const earned = scoreQuestion(q, answers[q.id]);
      const max = getMaxPoints(q);
      totalEarned += earned;
      totalMax += max;
      if (i >= start) {
        sectionEarned += earned;
        sectionMax += max;
      }
    }

    return { sectionEarned, sectionMax, totalEarned, totalMax };
  };

  const isAnswered = (qId) => {
    const a = answers[qId];
    if (a === undefined || a === null) return false;
    if (Array.isArray(a)) return a.some((v) => v !== null && v !== '');
    return a !== '';
  };

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  const milestoneData = showMilestone ? getMilestoneScores() : null;

  return (
    <div className="quiz-layout">
      <div className="question-sidebar">
        <div className="sidebar-inner">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`nav-dot${idx === currentIdx ? ' current' : ''}${isAnswered(q.id) ? ' answered' : ''}`}
              onClick={() => goTo(idx)}
            >
              {q.id}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-container">
        <div className="quiz-header">
          <span className="user-name">{userName}</span>
          <span className="timer">{mins}:{secs}</span>
        </div>

        <ProgressBar current={currentIdx} total={questions.length} />

        <Question
          question={question}
          userAnswer={answers[question.id]}
          onChange={handleAnswer}
          direction={direction}
        />

        <div className="nav-buttons">
          <button
            className="btn-nav btn-prev"
            onClick={handlePrev}
            disabled={currentIdx === 0}
          >
            Previous
          </button>
          <button
            className="btn-nav btn-next"
            onClick={handleNext}
          >
            {currentIdx === questions.length - 1 ? 'Finish Exam' : 'Next'}
          </button>
        </div>
      </div>

      {showMilestone && milestoneData && (
        <MilestoneModal
          sectionNumber={milestoneSection}
          sectionScore={milestoneData.sectionEarned}
          sectionMax={milestoneData.sectionMax}
          totalScore={milestoneData.totalEarned}
          totalMax={milestoneData.totalMax}
          onContinue={handleMilestoneContinue}
        />
      )}
    </div>
  );
}

export default Quiz;
