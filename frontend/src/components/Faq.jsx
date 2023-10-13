import React, { useState } from "react";
import './css/Faq.css'

export const Faq = (props) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleQuestionClick = (index) => {
    setSelectedQuestion(index === selectedQuestion ? null : index);
  };

  const faqItems = [
    {
      question: "What is LEOScope?",
      answer:
        "LEOScope is a measurement testbed for LEO networks. It allows users to measure and analyze LEO network performance.",
    },
    {
      question: "How can I get access to LEOScope?",
      answer:
        "You can request for access by clicking on the 'Request for Access' button and filling out the form.",
    },
    {
      question: "How does LEOScope benefit the community?",
      answer:
        "LEOScope provides an open-source measurement testbed for low earth orbit satellite networks, enabling researchers to perform experiments and gain insights that can further the development of innovative technologies.",
    },
  ];

  return (
    <div id="faq">
      <div className="faq-content">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-accordion">
          {faqItems.map((item, index) => (
            <div className="faq-item" key={index}>
              <button
                className="faq-question"
                onClick={() => handleQuestionClick(index)}
              >
                {item.question}
                {selectedQuestion === index ? (
                  <i className="fa fa-angle-up"></i>
                ) : (
                  <i className="fa fa-angle-down"></i>
                )}
              </button>
              {selectedQuestion === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
