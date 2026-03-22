import { useState } from 'react';
import Welcome from './components/Welcome';
import Quiz from './components/Quiz';
import Results from './components/Results';
import './App.css';

function App() {
  const [screen, setScreen] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [timeTaken, setTimeTaken] = useState(0);

  const handleStart = (name) => {
    setUserName(name);
    setScreen('quiz');
  };

  const handleFinish = (answers, time) => {
    setQuizAnswers(answers);
    setTimeTaken(time);
    setScreen('results');
    window.scrollTo(0, 0);
  };

  const handleRetake = () => {
    setQuizAnswers({});
    setTimeTaken(0);
    setScreen('quiz');
    window.scrollTo(0, 0);
  };

  if (screen === 'welcome') {
    return <Welcome onStart={handleStart} />;
  }

  if (screen === 'quiz') {
    return <Quiz userName={userName} onFinish={handleFinish} />;
  }

  return (
    <Results
      userName={userName}
      answers={quizAnswers}
      timeTaken={timeTaken}
      onRetake={handleRetake}
    />
  );
}

export default App;
