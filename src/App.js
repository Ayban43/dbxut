import React, { useState, useEffect } from 'react';
import questionsData from './questions.json';
import bgImage from './bg.jpg';
import { FaStar } from 'react-icons/fa';

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
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(20); // Timer in seconds

  useEffect(() => {
    const shuffled = shuffleArray(questionsData);
    const selectedQuestions = shuffled.slice(0, 7); // Select only the first 7 questions
    setQuestions(selectedQuestions);
    setShuffledQuestions(selectedQuestions);
  }, []);

  useEffect(() => {
    if (gameStarted) {
      const timer = setTimeout(() => {
        if (time === 0) {
          handleAnswerOptionClick(null, -1); // Automatically select wrong answer
        } else {
          setTime(time - 1);
        }
      }, 1000);

      return () => clearTimeout(timer); // Cleanup the timer when component unmounts or timer changes
    }
  }, [gameStarted, time]);

  const handlePlayClick = () => {
    setShowTitlePage(false);
    setGameStarted(true);
  };

  useEffect(() => {
    if (currentQuestion < shuffledQuestions.length && gameStarted) {
      setTime(20); // Reset the timer for each question
    }
  }, [currentQuestion, shuffledQuestions, gameStarted]);

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
              <h1 className=' font-semibold mb-4 mt-44 text-center text-red-900 font-mono leading-none' ><span className='text-yellow-400 drop-shadow-[5px_2px_4px_rgba(0,0,0,.9)] tracking-wide mr-14' style={{ fontSize: '12rem' }}>DRAGON</span><span className='text-yellow-400 drop-shadow-[5px_2px_4px_rgba(0,0,0,.9)] tracking-wide' style={{ fontSize: '12rem' }}>BALL</span> <br></br> <span className='pr-9 drop-shadow-[2px_2px_2px_rgba(255,240,0,1)]' style={{ fontSize: '8rem' }}>TRIVIA</span> <span className='drop-shadow-[2px_2px_2px_rgba(255,240,0,1)]' style={{ fontSize: '8rem' }}>GAME</span> </h1>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center mb-40">

              <button
                onClick={handlePlayClick}
                className='bg-orange-500 text-white font-mono tracking-wide text-5xl font-bold py-8 px-16 rounded-full border-2 border-red-500 drop-shadow-[1px_2px_2px_rgba(111,6,6,1)]'
              >
                PLAY
              </button>
            </div>
          </div>
        ) : showScore ? (
          <>
            <div className='score-section text-center h-screen grid items-center justify-center'>
              <div>
                <h2 className=' mt-20 text-red-900 font-bold drop-shadow-[1px_2px_2px_rgba(255,255,255,1)]' style={{ fontSize: '8rem' }}>CONGRATULATIONS</h2>
              </div>
              <div className='grid leading-none '>
                <span className='text-7xl text-orange-500 font-semibold drop-shadow-[2px_2px_2px_rgba(0,0,0,.9)]'>SCORE</span>
                <span className='font-bold text-red-950 mb-10 drop-shadow-[2px_2px_2px_rgba(255,255,255,1)]' style={{ fontSize: '18rem' }}>{score * 10}</span>
                <p className='text-xl text-gray-700'>
                  (You scored {score} out of {questions.length})
                </p>
              </div>
              <div>
                <button
                  onClick={handleRetryClick}
                  className='bg-orange-500 text-white font-mono font-bold py-8 px-10 tracking-wide m-1 text-5xl mb-40 rounded-full border-2 border-red-600 drop-shadow-[1px_2px_2px_rgba(111,6,6,1)]'
                >
                  RETRY
                </button>
              </div>

            </div>
          </>
        ) : (
          <div className="h-screen w-screen flex flex-col p-20 ">
            <div className='question-section flex-1 grid items-center justify-center'>
              <div className='flex-col timer justify-start text-4xl font-semibold font-mono pb-20 drop-shadow-[1px_1px_1px_rgba(255,255,255,1)]'>
                Time: {time}s
              </div>
              <div className='question-text flex justify-between text-7xl text-center text-red-950 tracking-tight font-bold leading-tight font-mono drop-shadow-[2px_2px_1px_rgba(255,255,255,1)]'>{questions[currentQuestion].questionText}</div>
              <div className='question-count flex justify-center items-center pb-40 text-xl font-semibold'>
                (Question {currentQuestion + 1}/{questions.length})
              </div>
            </div>

            <div className='answer-section grid grid-cols-2 gap-16 items-center justify-center flex-1 text-4xl px-36'>
              <div className='top-buttons grid gap-12'>
                {questions[currentQuestion].answerOptions.slice(0, 2).map((answerOption, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(answerOption, index)}
                    className={`text-white font-bold font-mono tracking-wide py-8 px-8 rounded-full m-1 w-full grid border-2 border-red-500 drop-shadow-[1px_2px_2px_rgba(111,6,6,1)] ${selectedAnswer === index
                      ? answerOption.isCorrect
                        ? 'bg-green-500'
                        : 'bg-red-700'
                      : 'bg-orange-500'
                      }`}
                    disabled={selectedAnswer !== null}
                  >
                    {answerOption.answerText}
                  </button>
                ))}
              </div>
              <div className='bottom-buttons grid gap-12'>
                {questions[currentQuestion].answerOptions.slice(2).map((answerOption, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(answerOption, index + 2)} // Adding an offset of 2 to the index
                    className={`text-white font-bold font-mono tracking-wide py-8 px-8 m-1 w-full rounded-full border-2 border-red-500 drop-shadow-[1px_2px_2px_rgba(111,6,6,1)] ${selectedAnswer === index + 2
                      ? answerOption.isCorrect
                        ? 'bg-green-500'
                        : 'bg-red-700'
                      : 'bg-orange-500'
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
        {/* ------------------------------- FLOATING FOOTER ------------------------------- */}
        <footer
          className="fixed bottom-0 left-0 w-full bg-orange-400 text-white text-center py-4 opacity-80"
          style={{ zIndex: 999 }}
        >
          <div className="container mx-auto">
            <p className="text-sm">
              BIRD STUDIO/SHUEISHA, TOEI ANIMATION © 1984 Toei Animation Co., Ltd.
            </p>
          </div>
        </footer>
      </div>
    </div >
  );
}
