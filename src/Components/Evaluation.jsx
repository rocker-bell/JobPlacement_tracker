import { useState } from "react";
import "../Styles/Evaluation.css";

const Evaluation = ({ offre_id, candidature_id }) => {
  const [evaluation, setEvaluation] = useState({
    note_entreprise: "",
    commentaire_entreprise: "",
    note_pedagogique: "",
    commentaire_pedagogique: "",
    encadrant_pedagogique: "",
    note_finale: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluation((prev) => ({ ...prev, [name]: value }));
  };

  // Calcul automatique de la note finale (ex: moyenne)
  const calculerNoteFinale = () => {
    const ne = parseFloat(evaluation.note_entreprise);
    const np = parseFloat(evaluation.note_pedagogique);

    if (!isNaN(ne) && !isNaN(np)) {
      const moyenne = ((ne + np) / 2).toFixed(2);
      setEvaluation((prev) => ({ ...prev, note_finale: moyenne }));
    }
  };

  const submitEvaluation = async () => {
    try {
      const res = await fetch("http://localhost:8000/submitEvaluation.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          offre_id,
          candidature_id,
          ...evaluation
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Évaluation enregistrée avec succès");
      } else {
        alert(data.message || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="evaluation_container">
      <h2>Évaluation du stagiaire</h2>

      {/* ENTREPRISE */}
      <section className="evaluation_section">
        <h3>Évaluation Entreprise</h3>

        <label>Note entreprise</label>
        <input
          type="number"
          step="0.01"
          name="note_entreprise"
          value={evaluation.note_entreprise}
          onChange={handleChange}
        />

        <label>Commentaire entreprise</label>
        <textarea
          name="commentaire_entreprise"
          value={evaluation.commentaire_entreprise}
          onChange={handleChange}
        />
      </section>

      {/* PEDAGOGIQUE */}
      <section className="evaluation_section">
        <h3>Évaluation Pédagogique</h3>

        <label>Encadrant pédagogique</label>
        <input
          type="text"
          name="encadrant_pedagogique"
          value={evaluation.encadrant_pedagogique}
          onChange={handleChange}
        />

        <label>Note pédagogique</label>
        <input
          type="number"
          step="0.01"
          name="note_pedagogique"
          value={evaluation.note_pedagogique}
          onChange={handleChange}
        />

        <label>Commentaire pédagogique</label>
        <textarea
          name="commentaire_pedagogique"
          value={evaluation.commentaire_pedagogique}
          onChange={handleChange}
        />
      </section>

      {/* NOTE FINALE */}
      <section className="evaluation_section">
        <h3>Note finale</h3>

        <input
          type="number"
          value={evaluation.note_finale}
          readOnly
        />

        <button onClick={calculerNoteFinale}>
          Calculer la note finale
        </button>
      </section>

      <button className="evaluation_submit_btn" onClick={submitEvaluation}>
        Enregistrer l’évaluation
      </button>
    </div>
  );
};

export default Evaluation;
