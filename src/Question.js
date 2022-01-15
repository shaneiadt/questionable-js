import React, { useState, useEffect } from "react";

export const Question = ({ title, code, options, detail, index, totalNumberOfQuestions, setQuestion }) => {
    const [show, setShow] = useState(false);
    const [userAnswer, setUserAnswer] = useState(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const listItems = [...document.querySelectorAll('li')];

        const listItemListener = (e) => {
            if (userAnswer) return;

            const el = e.target.getAttribute('data-selection') ? e.target : e.target.parentElement;
            const selection = el.getAttribute('data-selection');
            const answer = el.innerText;
            const correctAnswer = detail.match(/Answer: [A|B|C|D|E]/g)[0].replace('Answer: ', '').toLowerCase();

            console.log({ el, selection, answer, correctAnswer });

            setUserAnswer(answer);

            el.style.color = '#fff';

            if (selection === correctAnswer) {
                el.style.background = 'rgba(8, 99, 94, 1)';
                setScore(score + 1);
            } else {
                el.style.background = 'lightcoral';
            }

            for (const item of listItems) {
                if (item.getAttribute('data-selection') === correctAnswer) {
                    item.style.color = '#fff';
                    item.style.background = 'rgba(8, 99, 94, 1)';
                }
            }
        }

        for (const li of listItems) {
            const match = li.innerText.match(/[A|B|C|D|E]/g);
            if (!match) return;

            const letter = match[0];

            li.setAttribute('data-selection', letter.toLowerCase());
            li.addEventListener('click', listItemListener);
        }

        return () => {
            [...document.querySelectorAll('li')].forEach(el => el.removeEventListener('click', listItemListener));
        }
    }, [options, detail, score, userAnswer]);

    const next = () => {
        setUserAnswer(null);
        setShow(false);
        setQuestion(index + 1);
    }

    return (
        <>
            <div className="question">
                {index < totalNumberOfQuestions && (
                    <div className="scoreContainer">
                        <span className="score">Score: {score}/{index + 1}</span>
                        <span className="score">Number of Question: {totalNumberOfQuestions}</span>
                    </div>
                )}
                <div className="card">
                    {index === totalNumberOfQuestions && <p>OVER</p>}
                    {index < totalNumberOfQuestions && (
                        <>
                            <h2>{title}</h2>
                            <div dangerouslySetInnerHTML={{ __html: code }} />
                            <div dangerouslySetInnerHTML={{ __html: options }} />
                            <br />
                            {!show && userAnswer && <button onClick={() => setShow(true)}>Show Answer</button>}
                            {show && <div dangerouslySetInnerHTML={{ __html: detail }} />}
                        </>
                    )}
                </div>
                {index < totalNumberOfQuestions && <button disabled={!userAnswer} onClick={next}>Next</button>}
            </div>
        </>
    )
}