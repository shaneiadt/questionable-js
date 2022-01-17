import React from "react";

export const Footer = () => {
    return(
        <div className="footer" onClick={() => window.open('https://github.com/shaneiadt/questionable-js', '_blank')}>
            Click here to view on Github
            <img src="/github.png" height="15" alt="Shane O'Moore - Github" />
        </div>
    )
}