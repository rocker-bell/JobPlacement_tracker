// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const Rapport_encadrant = () => {
//     const { id } = useParams();
//     const [CandidatureId, setCandidatureId] = useState(null);
//     const [candidatureData, setCandidatureData] = useState({
//         candidature_id: "",
//         stagiaire_id: "",
//         offre_id: "",
//         statut: "En_attente",
//         message_motivation: "",
//         cv_path: "",
//         created_at: "",
//         updated_at: ""
//     });

//     // Fetch the candidature details by ID when component mounts
//     useEffect(() => {
//         if (id) {
//             setCandidatureId(id);
//             fetchCandidatureById(id);
//         }
//     }, [id]);

//     const fetchCandidatureById = async (id) => {
//         try {
//             const res = await fetch(`http://localhost:8000/fetchCandidatureById.php`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ candidature_id: id })
//             });
//             const data = await res.json();
//             if (data.success && data.candidature) {
//                 setCandidatureData(data.candidature);
//             } else {
//                 alert(data.message || "Candidature non trouvée");
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     // Handle input change for form
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setCandidatureData(prev => ({ ...prev, [name]: value }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await fetch(`http://localhost:8000/updateCandidature.php`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(candidatureData)
//             });
//             const data = await res.json();
//             if (data.success) {
//                 alert("Candidature mise à jour avec succès !");
//             } else {
//                 alert("Échec de la mise à jour : " + data.message);
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     return (
//         <div className="rapport_encadrant_wrapper">
//             <p>{CandidatureId}</p>
//             <h2>Détails de la candidature</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label>Candidature ID</label>
//                     <input type="text" name="candidature_id" value={candidatureData.candidature_id} readOnly />
//                 </div>

//                 <div className="form-group">
//                     <label>Stagiaire ID</label>
//                     <input type="text" name="stagiaire_id" value={candidatureData.stagiaire_id} onChange={handleChange} />
//                 </div>

//                 <div className="form-group">
//                     <label>Offre ID</label>
//                     <input type="text" name="offre_id" value={candidatureData.offre_id} onChange={handleChange} />
//                 </div>

//                 <div className="form-group">
//                     <label>Statut</label>
//                     <select name="statut" value={candidatureData.statut} onChange={handleChange}>
//                         <option value="En_attente">En attente</option>
//                         <option value="Acceptee">Acceptée</option>
//                         <option value="Refusee">Refusée</option>
//                     </select>
//                 </div>

//                 <div className="form-group">
//                     <label>Message de motivation</label>
//                     <textarea name="message_motivation" value={candidatureData.message_motivation || ""} onChange={handleChange}></textarea>
//                 </div>

//                 <div className="form-group">
//                     <label>CV Path</label>
//                     <input type="text" name="cv_path" value={candidatureData.cv_path || ""} onChange={handleChange} />
//                 </div>

//                 <div className="form-group">
//                     <label>Créée le</label>
//                     <input type="text" name="created_at" value={candidatureData.created_at} readOnly />
//                 </div>

//                 <div className="form-group">
//                     <label>Mise à jour</label>
//                     <input type="text" name="updated_at" value={candidatureData.updated_at} readOnly />
//                 </div>

//                 <button type="submit">Mettre à jour la candidature</button>
//             </form>
//         </div>
//     );
// };

// export default Rapport_encadrant;


// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const Rapport_encadrant = () => {
//   const { id } = useParams();
//   const [CandidatureId, setCandidatureId] = useState(null);
//   const user_id = localStorage.getItem("user_id")

//   const [candidatureData, setCandidatureData] = useState({
//     candidature_id: "",
//     stagiaire_id: "",
//     offre_id: "",
//     statut: "En_attente",
//     message_motivation: "",
//     cv_path: "",
//     created_at: "",
//     updated_at: ""
//   });

//   const [evaluationData, setEvaluationData] = useState({
//     evaluation_id: null,
//     candidature_id: "",
//     offre_id: "",
//     note_entreprise: "",
//     commentaire_entreprise: "",
//     note_pedagogique: "",
//     commentaire_pedagogique: "",
//     encadrant_pedagogique: user_id,
//     note_finale: ""
//   });

//   // Fetch candidature and evaluation
//   useEffect(() => {
//     if (id) {
//       setCandidatureId(id);
//       fetchCandidatureById(id);
//       fetchEvaluationByCandidature(id);
//     }
//   }, [id]);

//   const fetchCandidatureById = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:8000/fetchCandidatureById.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ candidature_id: id })
//       });
//       const data = await res.json();
//       if (data.success && data.candidature) {
//         setCandidatureData(data.candidature);
//       } else {
//         alert(data.message || "Candidature non trouvée");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchEvaluationByCandidature = async (candidature_id) => {
//     try {
//       const res = await fetch(`http://localhost:8000/fetchEvaluationByCandidature.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ candidature_id })
//       });
//       const data = await res.json();
//       if (data.success && data.evaluation) {
//         setEvaluationData(data.evaluation);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Handle input change for both forms
//   const handleCandidatureChange = (e) => {
//     const { name, value } = e.target;
//     setCandidatureData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleEvaluationChange = (e) => {
//     const { name, value } = e.target;
//     setEvaluationData(prev => ({ ...prev, [name]: value }));
//   };

//   // Submit candidature
//   const handleCandidatureSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`http://localhost:8000/updateCandidature.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(candidatureData)
//       });
//       const data = await res.json();
//       if (data.success) alert("Candidature mise à jour avec succès !");
//       else alert("Échec : " + data.message);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Submit evaluation
//   const handleEvaluationSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Make sure offre_id is filled from candidature
//       const payload = { ...evaluationData, offre_id: candidatureData.offre_id };
//       const res = await fetch(`http://localhost:8000/updateEvaluation.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       const data = await res.json();
//       if (data.success) alert("Évaluation enregistrée avec succès !");
//       else alert("Échec : " + data.message);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="rapport_encadrant_wrapper">
//       <h2>Détails de la candidature</h2>
//       <form onSubmit={handleCandidatureSubmit}>
//         <div className="form-group">
//           <label>Candidature ID</label>
//           <input type="text" name="candidature_id" value={candidatureData.candidature_id} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Stagiaire ID</label>
//           <input type="text" name="stagiaire_id" value={candidatureData.stagiaire_id} onChange={handleCandidatureChange} />
//         </div>
//         <div className="form-group">
//           <label>Offre ID</label>
//           <input type="text" name="offre_id" value={candidatureData.offre_id} onChange={handleCandidatureChange} />
//         </div>
//         <div className="form-group">
//           <label>Statut</label>
//           <select name="statut" value={candidatureData.statut} onChange={handleCandidatureChange}>
//             <option value="En_attente">En attente</option>
//             <option value="Acceptee">Acceptée</option>
//             <option value="Refusee">Refusée</option>
//           </select>
//         </div>
//         <div className="form-group">
//           <label>Message de motivation</label>
//           <textarea name="message_motivation" value={candidatureData.message_motivation || ""} onChange={handleCandidatureChange}></textarea>
//         </div>
//         <div className="form-group">
//           <label>CV Path</label>
//           <input type="text" name="cv_path" value={candidatureData.cv_path || ""} onChange={handleCandidatureChange} />
//         </div>
//         <div className="form-group">
//           <label>Créée le</label>
//           <input type="text" name="created_at" value={candidatureData.created_at} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Mise à jour</label>
//           <input type="text" name="updated_at" value={candidatureData.updated_at} readOnly />
//         </div>
//         <button type="submit">Mettre à jour la candidature</button>
//       </form>

//       <h2>Évaluation</h2>
//       <form onSubmit={handleEvaluationSubmit}>
//         <div className="form-group">
//           <label>Évaluation ID</label>
//           <input type="text" name="evaluation_id" value={evaluationData.evaluation_id || ""} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Candidature ID</label>
//           <input type="text" name="candidature_id" value={evaluationData.candidature_id} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Note Entreprise</label>
//           <input type="number" step="0.01" name="note_entreprise" value={evaluationData.note_entreprise || ""} onChange={handleEvaluationChange} />
//         </div>
//         <div className="form-group">
//           <label>Commentaire Entreprise</label>
//           <textarea name="commentaire_entreprise" value={evaluationData.commentaire_entreprise || ""} onChange={handleEvaluationChange}></textarea>
//         </div>
//         <div className="form-group">
//           <label>Note Pédagogique</label>
//           <input type="number" step="0.01" name="note_pedagogique" value={evaluationData.note_pedagogique || ""} onChange={handleEvaluationChange} />
//         </div>
//         <div className="form-group">
//           <label>Commentaire Pédagogique</label>
//           <textarea name="commentaire_pedagogique" value={evaluationData.commentaire_pedagogique || ""} onChange={handleEvaluationChange}></textarea>
//         </div>
//         <div className="form-group">
//           <label>Encadrant Pédagogique</label>
//           <input type="text" name="encadrant_pedagogique" value={evaluationData.encadrant_pedagogique || ""} onChange={handleEvaluationChange} />
//         </div>
//         <div className="form-group">
//           <label>Note Finale</label>
//           <input type="number" step="0.01" name="note_finale" value={evaluationData.note_finale || ""} onChange={handleEvaluationChange} />
//         </div>
//         <button type="submit">Enregistrer l'évaluation</button>
//       </form>
//     </div>
//   );
// };

// export default Rapport_encadrant;


// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const Rapport_encadrant = () => {
//   const { id } = useParams();
//   const [candidatureData, setCandidatureData] = useState({
//     candidature_id: "",
//     stagiaire_id: "",
//     offre_id: "",
//     statut: "En_attente",
//     message_motivation: "",
//     cv_path: "",
//     created_at: "",
//     updated_at: ""
//   });

//   const [evaluationData, setEvaluationData] = useState({
//     evaluation_id: null,
//     candidature_id: "",
//     offre_id: "",
//     note_entreprise: "",
//     commentaire_entreprise: "",
//     note_pedagogique: "",
//     commentaire_pedagogique: "",
//     encadrant_pedagogique: "",
//     note_finale: ""
//   });

//   useEffect(() => {
//     if (id) {
//       fetchCandidatureById(id);
//       fetchEvaluationByCandidature(id);
//     }
//   }, [id]);

//   const fetchCandidatureById = async (candidature_id) => {
//     try {
//       const res = await fetch(`http://localhost:8000/fetchCandidatureById.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ candidature_id })
//       });
//       const data = await res.json();
//       if (data.success && data.candidature) {
//         setCandidatureData(data.candidature);

//         // Set default evaluationData with matching candidature_id and offre_id
//         setEvaluationData(prev => ({
//           ...prev,
//           candidature_id: data.candidature.candidature_id,
//           offre_id: data.candidature.offre_id,
//           encadrant_pedagogique: localStorage.getItem("user_id") || ""
//         }));
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchEvaluationByCandidature = async (candidature_id) => {
//     try {
//       const res = await fetch(`http://localhost:8000/fetchEvaluationByCandidature.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ candidature_id })
//       });
//       const data = await res.json();
//       if (data.success && data.evaluation) {
//         setEvaluationData(prev => ({
//           ...prev,
//           ...data.evaluation,
//           encadrant_pedagogique: localStorage.getItem("user_id") || prev.encadrant_pedagogique
//         }));
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleCandidatureChange = (e) => {
//     const { name, value } = e.target;
//     setCandidatureData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleEvaluationChange = (e) => {
//     const { name, value } = e.target;
//     setEvaluationData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCandidatureSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`http://localhost:8000/updateCandidature.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(candidatureData)
//       });
//       const data = await res.json();
//       alert(data.success ? "Candidature mise à jour !" : "Erreur : " + data.message);
//     } catch (err) {
//       console.error(err);
//     }
//   };

// //   const handleEvaluationSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const payload = { ...evaluationData };
// //       const res = await fetch(`http://localhost:8000/updateEvaluation.php`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload)
// //       });
// //       const data = await res.json();
// //       alert(data.success ? "Évaluation enregistrée !" : "Erreur : " + data.message);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// const handleEvaluationSubmit = async (e) => {
//   e.preventDefault();

//   const payload = {
//     ...evaluationData,
//     candidature_id: candidatureData.candidature_id,
//     offre_id: candidatureData.offre_id,
//     encadrant_pedagogique: localStorage.getItem("user_id")
//   };

//   console.log("SENDING EVALUATION:", payload); // 🔍 DEBUG

//   const res = await fetch("http://localhost:8000/updateEvaluation.php", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   });

//   const data = await res.json();

//   if (data.success && data.evaluation_id) {
//     // ✅ VERY IMPORTANT
//     setEvaluationData(prev => ({
//       ...prev,
//       evaluation_id: data.evaluation_id
//     }));
//   }

//   alert(data.message);
// };


//   return (
//     <div className="rapport_encadrant_wrapper">
//       <h2>Détails de la candidature</h2>
//       <form onSubmit={handleCandidatureSubmit}>
//         {/* Candidature form fields */}
//         <div className="form-group">
//           <label>Candidature ID</label>
//           <input type="text" name="candidature_id" value={candidatureData.candidature_id} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Stagiaire ID</label>
//           <input type="text" name="stagiaire_id" value={candidatureData.stagiaire_id} onChange={handleCandidatureChange} />
//         </div>
//         <div className="form-group">
//           <label>Offre ID</label>
//           <input type="text" name="offre_id" value={candidatureData.offre_id} onChange={handleCandidatureChange} />
//         </div>
//         <div className="form-group">
//           <label>Statut</label>
//           <select name="statut" value={candidatureData.statut} onChange={handleCandidatureChange}>
//             <option value="En_attente">En attente</option>
//             <option value="Acceptee">Acceptée</option>
//             <option value="Refusee">Refusée</option>
//           </select>
//         </div>
//         <div className="form-group">
//           <label>Message de motivation</label>
//           <textarea name="message_motivation" value={candidatureData.message_motivation || ""} onChange={handleCandidatureChange}></textarea>
//         </div>
//         <div className="form-group">
//           <label>CV Path</label>
//           <input type="text" name="cv_path" value={candidatureData.cv_path || ""} onChange={handleCandidatureChange} />
//         </div>
//         <div className="form-group">
//           <label>Créée le</label>
//           <input type="text" name="created_at" value={candidatureData.created_at} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Mise à jour</label>
//           <input type="text" name="updated_at" value={candidatureData.updated_at} readOnly />
//         </div>
//         <button type="submit">Mettre à jour la candidature</button>
//       </form>

//       <h2>Évaluation</h2>
//       <form onSubmit={handleEvaluationSubmit}>
//         <div className="form-group">
//           <label>Évaluation ID</label>
//           <input type="text" name="evaluation_id" value={evaluationData.evaluation_id || ""} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Candidature ID</label>
//           <input type="text" name="candidature_id" value={evaluationData.candidature_id} readOnly />
//         </div>
//          {/* <div className="form-group">
//           <label>offre_id</label>
//           <input type="text" step="0.01" name="offre_id" value={evaluationData.offre_id || ""} onChange={handleEvaluationChange} />
//         </div> */}
//         <label>offre_id</label>
//         <input
//   type="text"
//   name="offre_id"
//   value={evaluationData.offre_id || ""}
//   readOnly   // 🔒 IMPORTANT
// />

//         <div className="form-group">
//           <label>Note Entreprise</label>
//           <input type="number" step="0.01" name="note_entreprise" value={evaluationData.note_entreprise || ""} onChange={handleEvaluationChange} />
//         </div>
//         <div className="form-group">
//           <label>Commentaire Entreprise</label>
//           <textarea name="commentaire_entreprise" value={evaluationData.commentaire_entreprise || ""} onChange={handleEvaluationChange}></textarea>
//         </div>
//         <div className="form-group">
//           <label>Note Pédagogique</label>
//           <input type="number" step="0.01" name="note_pedagogique" value={evaluationData.note_pedagogique || ""} onChange={handleEvaluationChange} />
//         </div>
//         <div className="form-group">
//           <label>Commentaire Pédagogique</label>
//           <textarea name="commentaire_pedagogique" value={evaluationData.commentaire_pedagogique || ""} onChange={handleEvaluationChange}></textarea>
//         </div>
//         <div className="form-group">
//           <label>Encadrant Pédagogique</label>
//           <input type="text" name="encadrant_pedagogique" value={evaluationData.encadrant_pedagogique || ""} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Note Finale</label>
//           <input type="number" step="0.01" name="note_finale" value={evaluationData.note_finale || ""} onChange={handleEvaluationChange} />
//         </div>
//         <button type="submit">Enregistrer l'évaluation</button>
//       </form>
//     </div>
//   );
// };

// export default Rapport_encadrant;


import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Rapport_encadrant = () => {
  const { id } = useParams();

  /* ===================== CANDIDATURE STATE (UNCHANGED) ===================== */
  const [candidatureData, setCandidatureData] = useState({
    candidature_id: "",
    stagiaire_id: "",
    offre_id: "",
    statut: "En_attente",
    message_motivation: "",
    cv_path: "",
    created_at: "",
    updated_at: ""
  });

  /* ===================== EVALUATION STATE ===================== */
  const [evaluationData, setEvaluationData] = useState({
    evaluation_id: null,
    candidature_id: "",
    offre_id: "",
    note_entreprise: "",
    commentaire_entreprise: "",
    note_pedagogique: "",
    commentaire_pedagogique: "",
    encadrant_pedagogique: "",
    note_finale: ""
  });

  /* ===================== FETCH CANDIDATURE ===================== */
  useEffect(() => {
    if (id) fetchCandidatureById(id);
  }, [id]);

  const fetchCandidatureById = async (candidature_id) => {
    try {
      const res = await fetch("http://localhost:8000/fetchCandidatureById.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidature_id })
      });

      const data = await res.json();

      if (data.success && data.candidature) {
        setCandidatureData(data.candidature);

        // 🔒 AUTHORITATIVE VALUES COME FROM CANDIDATURE
        setEvaluationData(prev => ({
          ...prev,
          candidature_id: data.candidature.candidature_id,
          offre_id: data.candidature.offre_id,
          encadrant_pedagogique: localStorage.getItem("user_id") || ""
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ===================== FETCH EVALUATION (SAFE) ===================== */
  useEffect(() => {
    if (candidatureData.candidature_id) {
      fetchEvaluationByCandidature(candidatureData.candidature_id);
    }
  }, [candidatureData.candidature_id]);

  const fetchEvaluationByCandidature = async (candidature_id) => {
    try {
      const res = await fetch("http://localhost:8000/fetchEvaluationByCandidature.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidature_id })
      });

      const data = await res.json();

      if (data.success && data.evaluation) {
        setEvaluationData(prev => ({
          ...prev,
          evaluation_id: data.evaluation.evaluation_id,
          note_entreprise: data.evaluation.note_entreprise,
          commentaire_entreprise: data.evaluation.commentaire_entreprise,
          note_pedagogique: data.evaluation.note_pedagogique,
          commentaire_pedagogique: data.evaluation.commentaire_pedagogique,
          note_finale: data.evaluation.note_finale
          // 🔒 candidature_id & offre_id NOT TOUCHED
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ===================== HANDLERS ===================== */
  const handleCandidatureChange = (e) => {
    const { name, value } = e.target;
    setCandidatureData(prev => ({ ...prev, [name]: value }));
  };

  const handleEvaluationChange = (e) => {
    const { name, value } = e.target;
    setEvaluationData(prev => ({ ...prev, [name]: value }));
  };

  /* ===================== SUBMITS ===================== */
  const handleCandidatureSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/updateCandidature.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidatureData)
    });

    const data = await res.json();
    alert(data.success ? "Candidature mise à jour !" : data.message);
  };

  const handleEvaluationSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...evaluationData,
      candidature_id: candidatureData.candidature_id,
      offre_id: candidatureData.offre_id,
      encadrant_pedagogique: localStorage.getItem("user_id")
    };

    const res = await fetch("http://localhost:8000/updateEvaluation.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success && data.evaluation_id) {
      setEvaluationData(prev => ({
        ...prev,
        evaluation_id: data.evaluation_id
      }));
    }

    alert(data.message);
  };

  /* ===================== UI ===================== */
  return (
    <div className="rapport_encadrant_wrapper">
      <h2>Détails de la candidature</h2>

      {/* <form onSubmit={handleCandidatureSubmit}>
        <input readOnly value={candidatureData.candidature_id} />
        <input value={candidatureData.stagiaire_id} onChange={handleCandidatureChange} name="stagiaire_id" />
        <input value={candidatureData.offre_id} onChange={handleCandidatureChange} name="offre_id" />
        <button type="submit">Mettre à jour la candidature</button>
      </form> */}

             <h2>Détails de la candidature</h2>
     <form onSubmit={handleCandidatureSubmit}>
       <div className="form-group">
         <label>Candidature ID</label>
        <input type="text" name="candidature_id" value={candidatureData.candidature_id} readOnly />
        </div>
        <div className="form-group">
         <label>Stagiaire ID</label>
         <input type="text" name="stagiaire_id" value={candidatureData.stagiaire_id} onChange={handleCandidatureChange} />        </div>
        <div className="form-group">
          <label>Offre ID</label>
          <input type="text" name="offre_id" value={candidatureData.offre_id} onChange={handleCandidatureChange} />
      </div>
        <div className="form-group">
         <label>Statut</label>
         <select name="statut" value={candidatureData.statut} onChange={handleCandidatureChange}>
            <option value="En_attente">En attente</option>
            <option value="Acceptee">Acceptée</option>
            <option value="Refusee">Refusée</option>
          </select>
        </div>
         <div className="form-group">
           <label>Message de motivation</label>
           <textarea name="message_motivation" value={candidatureData.message_motivation || ""} onChange={handleCandidatureChange}></textarea>
        </div>
         <div className="form-group">
           <label>CV Path</label>
           {candidatureData.cv_path ? (
              <a 
                href={`http://localhost:8000/${candidatureData.cv_path}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Voir CV
              </a>
            ) : "Aucun"}

        </div>         
        <div className="form-group">
         <label>Créée le</label>
           <input type="text" name="created_at" value={candidatureData.created_at} readOnly />
        </div>
       <div className="form-group">
         <label>Mise à jour</label>
          <input type="text" name="updated_at" value={candidatureData.updated_at} readOnly />
       </div>
        <button type="submit">Mettre à jour la candidature</button>
       </form>

      <h2>Évaluation</h2>

      {/* <form onSubmit={handleEvaluationSubmit}>
        <input readOnly value={evaluationData.evaluation_id || ""} />
        <input readOnly value={evaluationData.candidature_id} />
        <input readOnly value={evaluationData.offre_id} />

        <input name="note_entreprise" value={evaluationData.note_entreprise || ""} onChange={handleEvaluationChange} />
        <textarea name="commentaire_entreprise" value={evaluationData.commentaire_entreprise || ""} onChange={handleEvaluationChange} />
        <input name="note_pedagogique" value={evaluationData.note_pedagogique || ""} onChange={handleEvaluationChange} />
        <textarea name="commentaire_pedagogique" value={evaluationData.commentaire_pedagogique || ""} onChange={handleEvaluationChange} />

        <input readOnly value={evaluationData.encadrant_pedagogique} />
        <input name="note_finale" value={evaluationData.note_finale || ""} onChange={handleEvaluationChange} />

        <button type="submit">Enregistrer l’évaluation</button>
      </form> */}

        <h2>Évaluation</h2>

<form onSubmit={handleEvaluationSubmit}>

  <div className="form-group">
    <label>Évaluation ID</label>
    <input
      type="text"
      name="evaluation_id"
      value={evaluationData.evaluation_id || ""}
      readOnly
    />
  </div>

  <div className="form-group">
    <label>Candidature ID</label>
    <input
      type="text"
      name="candidature_id"
      value={evaluationData.candidature_id}
      readOnly
    />
  </div>

  {/* ✅ OFFRE ID INCLUDED (IMPORTANT) */}
  <div className="form-group">
    <label>Offre ID</label>
    <input
      type="text"
      name="offre_id"
      value={evaluationData.offre_id}
      readOnly
    />
  </div>

  <div className="form-group">
    <label>Note Entreprise</label>
    <input
      type="number"
      step="0.01"
      name="note_entreprise"
      value={evaluationData.note_entreprise || ""}
      onChange={handleEvaluationChange}
    />
  </div>

  <div className="form-group">
    <label>Commentaire Entreprise</label>
    <textarea
      name="commentaire_entreprise"
      value={evaluationData.commentaire_entreprise || ""}
      onChange={handleEvaluationChange}
    />
  </div>

  <div className="form-group">
    <label>Note Pédagogique</label>
    <input
      type="number"
      step="0.01"
      name="note_pedagogique"
      value={evaluationData.note_pedagogique || ""}
      onChange={handleEvaluationChange}
    />
  </div>

  <div className="form-group">
    <label>Commentaire Pédagogique</label>
    <textarea
      name="commentaire_pedagogique"
      value={evaluationData.commentaire_pedagogique || ""}
      onChange={handleEvaluationChange}
    />
  </div>

  <div className="form-group">
    <label>Encadrant Pédagogique</label>
    <input
      type="text"
      name="encadrant_pedagogique"
      value={evaluationData.encadrant_pedagogique || ""}
      readOnly
    />
  </div>

  <div className="form-group">
    <label>Note Finale</label>
    <input
      type="number"
      step="0.01"
      name="note_finale"
      value={evaluationData.note_finale || ""}
      onChange={handleEvaluationChange}
    />
  </div>

  <button type="submit">Enregistrer l'évaluation</button>

</form>


    </div>
  );
};

export default Rapport_encadrant;

