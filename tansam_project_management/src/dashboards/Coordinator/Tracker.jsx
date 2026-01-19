import React from "react";
import "./CSS/Tracker.css";

const BASE_STAGES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
];

const ProgressTracker = ({ currentStage }) => {
  let stages = [...BASE_STAGES];

  if (currentStage === "WON") {
    stages.push("WON");
  } else if (currentStage === "LOST") {
    stages.push("LOST");
  }

  const currentStep = stages.indexOf(currentStage);
  const filledLineWidth =
    currentStep >= 0
      ? `${(currentStep / (stages.length - 1)) * 100}%`
      : "0%";

  const isWon = currentStage === "WON";
  const isLost = currentStage === "LOST";

  return (
    <div
      className={`progress-container ${
        isWon ? "status-won" : isLost ? "status-lost" : ""
      }`}
    >
      <div className="progress-line-background"></div>

      <div
        className="progress-line-filled"
        style={{ width: filledLineWidth }}
      />

      <div className="steps">
        {stages.map((label, index) => (
          <div className="step" key={label}>
            <div
              className={`circle ${
                isWon
                  ? "won"
                  : isLost
                  ? "lost"
                  : index < currentStep
                  ? "completed"
                  : index === currentStep
                  ? "active"
                  : ""
              }`}
            ></div>

            <div className="step-label">
              {label.replace(/_/g, " ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
