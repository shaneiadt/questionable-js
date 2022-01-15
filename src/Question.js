import React, { useState } from "react";

export const Question = ({ title, code, options, detail, index, setQuestion }) => {
    const [show, setShow] = useState(false);

    const next = () => {
        setShow(false);
        setQuestion(index + 1);
    }

    return (
        <>
            <div className="question">
                <span className="score">0/150</span>
                <div className="card">
                    <h3>{title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: code }} />
                    <div dangerouslySetInnerHTML={{ __html: options }} />
                    <br />
                    {!show && <button onClick={() => setShow(true)}>Show Answer</button>}
                    {show && <div dangerouslySetInnerHTML={{ __html: detail }} />}
                </div>
                <button onClick={next}>Next</button>
            </div>
        </>
    )
}