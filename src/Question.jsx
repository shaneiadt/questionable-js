import { useState } from "react";

const getOptionStyle = (optionId, selectedOptionId, correctOptionId) => {
  if (!selectedOptionId) return undefined;

  if (optionId === correctOptionId) {
    return {
      background: "rgba(8, 99, 94, 1)",
      color: "#fff",
    };
  }

  if (optionId === selectedOptionId) {
    return {
      background: "lightcoral",
      color: "#fff",
    };
  }

  return undefined;
};

export const Question = ({
  title,
  promptHtml,
  options,
  answer,
  index,
  totalNumberOfQuestions,
  setQuestion,
}) => {
  const [show, setShow] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [score, setScore] = useState(0);

  const isQuizOver = index >= totalNumberOfQuestions;

  const handleOptionSelect = (optionId) => {
    if (selectedOptionId) return;

    setSelectedOptionId(optionId);

    if (optionId === answer.id) {
      setScore((currentScore) => currentScore + 1);
    }
  };

  const next = () => {
    setSelectedOptionId(null);
    setShow(false);
    setQuestion(index + 1);
  };

  return (
    <div className="question">
      {!isQuizOver && (
        <div className="scoreContainer">
          <span className="score">
            Score: {score}/{index + 1}
          </span>
          <span className="score">
            Number of Question: {totalNumberOfQuestions}
          </span>
        </div>
      )}
      <div className="card">
        {isQuizOver && <p>OVER</p>}
        {!isQuizOver && (
          <>
            <h2>{title}</h2>
            {promptHtml && (
              <div dangerouslySetInnerHTML={{ __html: promptHtml }} />
            )}
            <ul>
              {options.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  style={getOptionStyle(option.id, selectedOptionId, answer.id)}
                >
                  <strong>{option.id}:</strong> {option.content}
                </li>
              ))}
            </ul>
            <br />
            {!show && selectedOptionId && (
              <button onClick={() => setShow(true)}>Show Answer</button>
            )}
            {show && answer.detailHtml && (
              <div dangerouslySetInnerHTML={{ __html: answer.detailHtml }} />
            )}
          </>
        )}
      </div>
      {!isQuizOver && (
        <button disabled={!selectedOptionId} onClick={next}>
          Next
        </button>
      )}
    </div>
  );
};
