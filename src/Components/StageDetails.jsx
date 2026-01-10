// src/pages/StageDetails.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const StageDetails = () => {
  const location = useLocation();

  // Get stages passed from mobile navigation
  const stages = location.state?.stages || [];
  const [stage, setStage] = useState(stages[0] || null);

  // If no stage data is passed
  if (!stage) {
    return <p>No stage data available.</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>{stage.titre}</h2>
      <p><strong>Company:</strong> {stage.entreprise_id}</p>
      <p><strong>Location:</strong> {stage.emplacement}</p>
      <p><strong>Type:</strong> {stage.type_de_stage}</p>
      <h3>Description</h3>
      <p>{stage.description}</p>
      <h3>Required Skills</h3>
      <p>{stage.competences_requises}</p>
    </div>
  );
};

export default StageDetails;
