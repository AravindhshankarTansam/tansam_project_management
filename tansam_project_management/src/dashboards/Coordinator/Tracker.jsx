import React from "react";
import "./CSS/Tracker.css";

const ProgressTracker = ({ currentStage }) => {
  const stages = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "PROPOSAL_SENT",
    "NEGOTIATION",
    "WON",
    "LOST",
  ];

  const currentStep = stages.indexOf(currentStage);

  const filledLineWidth = `${(currentStep / (stages.length - 1)) * 100}%`;

  return (
    <div className="progress-container">
      <div className="progress-line-background"></div>

      <div
        className="progress-line-filled"
        style={{ width: filledLineWidth }}
      ></div>

      <div className="steps">
        {stages.map((label, index) => (
          <div className="step" key={index}>
            <div
              className={`circle ${
                index < currentStep
                  ? "completed"
                  : index === currentStep
                  ? "active"
                  : ""
              }`}
            ></div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
