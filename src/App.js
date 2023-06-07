import React, { useState, useEffect } from 'react';
import questionsData from './questions.json';
import bgImage from './bg.jpg';

function shuffleArray(array) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showTitlePage, setShowTitlePage] = useState(true);
  const [time, setTime] = useState(20); // Timer in seconds

  useEffect(() => {
    const shuffled = shuffleArray(questionsData);
    setQuestions(shuffled);
    setShuffledQuestions(shuffled);
  }, []);

  useEffect(() => {
    if (currentQuestion < shuffledQuestions.length) {
      setTime(200); // Reset the timer for each question
    }
  }, [currentQuestion, shuffledQuestions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (time === 0) {
        handleAnswerOptionClick(null, -1); // Automatically select wrong answer
      } else {
        setTime(time - 1);
      }
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer when component unmounts or timer changes
  }, [time]);

  const handlePlayClick = () => {
    setShowTitlePage(false);
  };

  const handleRetryClick = () => {
    setShowScore(false);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowTitlePage(true);
    setShuffledQuestions(shuffleArray(questions));
  };

  const handleAnswerOptionClick = (answerOption, index) => {
    setSelectedAnswer(index);
    if (answerOption && answerOption.isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < shuffledQuestions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
      setSelectedAnswer(null);
    }, 200);
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center'
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className=''>
        {/* -------------------------------TITLE PAGE ------------------------------- */}
        {showTitlePage ? (
          <div className='title-page text-center h-screen flex flex-col'>
            <div className="flex-1  flex justify-center items-center">
              <h1 className='text-8xl font-bold mb-4 mt-44'>Dragon Ball Trivia Game</h1>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center mb-40">
              <button
                onClick={handlePlayClick}
                className='bg-blue-300 text-white text-4xl font-bold py-4 px-8 rounded-lg'
              >
                PLAY
              </button>
            </div>
          </div>

        ) : showScore ? (

          <div className='score-section text-center'>
            <h2 className='text-xl font-bold mb-4'>Quiz Score</h2>
            <p>
              You scored {score} out of {questions.length}
            </p>
            <button
              onClick={handleRetryClick}
              className='bg-blue-300 text-white font-bold py-2 px-4 rounded m-1'
            >
              Retry
            </button>
          </div>
        ) : (

          <div className="h-screen w-screen flex flex-col p-20">
            <div className='question-section'>
              <div className='flex-col timer justify-start text-4xl'>
                Time: {time}s
              </div>
              <div className='question-count'>
                <span>Question {currentQuestion + 1}</span>/{questions.length}
              </div>

              <div className='question-text flex justify-center text-8xl items-center'>{questions[currentQuestion].questionText}</div>

            </div>

            <div className='answer-section grid grid-cols-2 gap-4'>
              <div className='top-buttons'>
                {questions[currentQuestion].answerOptions.slice(0, 2).map((answerOption, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(answerOption, index)}
                    className={`text-white font-bold py-2 px-4 rounded m-1 w-full ${selectedAnswer === index
                      ? answerOption.isCorrect
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-blue-300'
                      }`}
                    disabled={selectedAnswer !== null}
                  >
                    {answerOption.answerText}
                  </button>
                ))}
              </div>

              <div className='bottom-buttons'>
                {questions[currentQuestion].answerOptions.slice(2).map((answerOption, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(answerOption, index + 2)} // Adding an offset of 2 to the index
                    className={`text-white font-bold py-2 px-4 rounded m-1 w-full ${selectedAnswer === index + 2
                      ? answerOption.isCorrect
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-blue-300'
                      }`}
                    disabled={selectedAnswer !== null}
                  >
                    {answerOption.answerText}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
