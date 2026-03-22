import { useState, useMemo } from 'react';

function Welcome({ onStart }) {
  const [name, setName] = useState('');

  const particles = useMemo(() => {
    const colors = ['#39FF14', '#FF6EC7', '#00D4FF', '#BF40BF'];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      size: Math.random() * 20 + 8,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="welcome-container">
      <div className="floating-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="welcome-card glass-card">
        <h1>SC-900 Practice Exam</h1>
        <p className="subtitle">
          Microsoft Security, Compliance, and Identity Fundamentals
        </p>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your name to begin..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <button type="submit" className="btn-start" disabled={!name.trim()}>
          Start Exam
        </button>
      </form>
    </div>
  );
}

export default Welcome;
