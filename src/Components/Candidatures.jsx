// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../Styles/Candidatures.css";
// import { ArrowLeft} from "lucide-react";

// const BASE_URL = "http://localhost:8000";

// const Candidatures = () => {
//   const navigate = useNavigate()
//   const { id } = useParams(); // stage ID
//   const [candidatures, setCandidatures] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCandidatures = async () => {
//       try {
//         const formData = new FormData();
//         formData.append("offre_id", id);

//         const response = await fetch(`${BASE_URL}/fetchCandidaturebyStageid.php`, {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();
//         if (data.success) {
//           setCandidatures(data.candidatures);
//         } else {
//           console.error(data.message);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCandidatures();
//   }, [id]);

//   if (loading) return <p className="loading-text">Loading...</p>;

//   return (
//     <div className="candidatures-container">
//       < ArrowLeft
//     size={24}
//     onClick={() => navigate("/jobboard_Entreprise")}
//     className="nav-icon"
//   />
//       <h2 className="candidatures-title">Candidatures for Stage ID: {id}</h2>

//       {candidatures.length === 0 ? (
//         <p className="no-candidatures">No candidatures found.</p>
//       ) : (
//         candidatures.map((c) => (
//           <div key={c.candidature_id} className="candidature-card">
//             <div className="candidature-header">
//               <h1>{c.stagiaire_id}</h1>
//               <h3>{c.nom} {c.prenom}</h3>
//               <span className={`status-badge status-${c.statut.toLowerCase()}`}>
//                 {c.statut}
//               </span>
//             </div>
//             <p><strong>Message Motivation:</strong> {c.message_motivation}</p>
//             <p>
//               <strong>CV:</strong>{" "}
//               {c.cv_path ? (
//                 <a href={`${BASE_URL}/${c.cv_path}`} target="_blank" rel="noopener noreferrer">
//                   View CV
//                 </a>
//               ) : "None"}
//             </p>
//             <p>
//               <strong>Photo:</strong>{" "}
//               {c.photo_path ? (
//                 <img src={`${BASE_URL}/${c.photo_path}`} alt="Photo" className="candidature-photo" />
//               ) : "None"}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Candidatures;


// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../Styles/Candidatures.css";
// import { ArrowLeft } from "lucide-react";

// const BASE_URL = "http://localhost:8000";

// const Candidatures = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); // stage ID
//   const [candidatures, setCandidatures] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [Rapport, setRapport] = useState(false);
  
//   // const [contentHandler, setContentHandler] = useState("");

//   useEffect(() => {
//     const fetchCandidatures = async () => {
//       try {
//         const formData = new FormData();
//         formData.append("offre_id", id);

//         const response = await fetch(`${BASE_URL}/fetchCandidaturebyStageid.php`, {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();
//         if (data.success) {
//           setCandidatures(data.candidatures);
//         } else {
//           console.error(data.message);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCandidatures();
//   }, [id]);

//   if (loading) return <p className="loading-text">Loading...</p>;




//   const handleVoirRapport = async (candidature_id) => {
//   try {
//     const response = await fetch(`${BASE_URL}/fetchRapports.php`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         candidature_id: candidature_id,
//       }),
//     });

//     const data = await response.json();

//     if (data.success) {
//       console.log("Rapport:", data.rapport);
//       // 👉 open modal / set state / navigate to report page
//       setRapport(data.rapport)
//     } else {
//       alert(data.message);
//     }
//   } catch (error) {
//     console.error("Erreur:", error);
//   }
// };


//   return (
//     <div className="candidatures-container">
      
//    <ArrowLeft
//   size={24}
//   onClick={() => navigate("/jobboard_Entreprise", { state: { content: "ED_CB_Stages" } })}
//   className="nav-icon"
// />
//       <h2 className="candidatures-title">Candidatures for Stage ID: {id}</h2>

//       {candidatures.length === 0 ? (
//         <p className="no-candidatures">No candidatures found.</p>
//       ) : (
//         candidatures.map((c) => (
//           <div key={c.candidature_id} className="candidature-card">
//             <div className="candidature-header">
//               <h3>
//                 {c.nom} {c.prenom} 
//               </h3>

//               <span className={`status-badge status-${c.statut.toLowerCase()}`}>
//                 {c.statut.replace("_", " ")}
//               </span>
//             </div>
//             <div className="form-group">
//               <label>Photo:</label>
//               {c.photo_path ? (
//                 <img src={`${BASE_URL}/${c.photo_path}`} alt="Photo" className="candidature-photo" />
//               ) : (
//                 <span>None</span>
//               )}
//             </div>
//             <div className="form-group">
//               <label>Stagiaire ID:</label>
//               <span>{c.stagiaire_id}</span>
//             </div>

//             <div className="form-group">
//               <label>Message Motivation:</label>
//               <span>{c.message_motivation || "None"}</span>
//             </div>

//             <div className="form-group">
//               <label>CV:</label>
//               {c.cv_path ? (
//                 <a href={`${BASE_URL}/${c.cv_path}`} target="_blank" rel="noopener noreferrer">
//                   View CV
//                 </a>
//               ) : (
//                 <span>None</span>
//               )}
//             </div>


//             <div className="form-group">
//               <label>Rapport:</label>
//               <button type="submit" onClick={() => handleVoirRapport(c.candidature_id, ic)}>
//                   Voire rapport
//               </button>

               
              
                
              
//             </div>
            

            
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Candidatures;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/Candidatures.css";
import { ArrowLeft } from "lucide-react";

const BASE_URL = "http://localhost:8000";

const Candidatures = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // stage ID

  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // store rapports per candidature
  const [rapports, setRapports] = useState({});

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const formData = new FormData();
        formData.append("offre_id", id);

        const response = await fetch(
          `${BASE_URL}/fetchCandidaturebyStageid.php`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.success) {
          setCandidatures(data.candidatures);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, [id]);

  const handleVoirRapport = async (candidature_id) => {
    try {
      const response = await fetch(`${BASE_URL}/fetchRapports.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidature_id }),
      });

      const data = await response.json();

      if (data.success) {
        setRapports((prev) => ({
          ...prev,
          [candidature_id]: data.rapport,
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="candidatures-container">
      <ArrowLeft
        size={24}
        onClick={() =>
          navigate("/jobboard_Entreprise", {
            state: { content: "ED_CB_Stages" },
          })
        }
        className="nav-icon"
      />

      <h2 className="candidatures-title">
        Candidatures for Stage ID: {id}
      </h2>

      {candidatures.length === 0 ? (
        <p className="no-candidatures">No candidatures found.</p>
      ) : (
        candidatures.map((c) => (
          <div key={c.candidature_id} className="candidature-card">
            <div className="candidature-header">
              <h3>
                {c.nom} {c.prenom}
              </h3>

              <span
                className={`status-badge status-${c.statut.toLowerCase()}`}
              >
                {c.statut.replace("_", " ")}
              </span>
            </div>

            <div className="form-group">
              <label>Photo:</label>
              {c.photo_path ? (
                <img
                  src={`${BASE_URL}/${c.photo_path}`}
                  alt="Photo"
                  className="candidature-photo"
                />
              ) : (
                <span>None</span>
              )}
            </div>

            <div className="form-group">
              <label>Stagiaire ID:</label>
              <span>{c.stagiaire_id}</span>
            </div>

            <div className="form-group">
              <label>Message Motivation:</label>
              <span>{c.message_motivation || "None"}</span>
            </div>

            <div className="form-group">
              <label>CV:</label>
              {c.cv_path ? (
                <a
                  href={`${BASE_URL}/${c.cv_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View CV
                </a>
              ) : (
                <span>None</span>
              )}
            </div>

            <div className="form-group">
              <label>Rapport:</label>
              <button
                type="button"
                onClick={() => handleVoirRapport(c.candidature_id)}
              >
                Voire rapport
              </button>
            </div>

            {rapports[c.candidature_id] && (
              <div className="rapport-box">
                <h4>Rapport d'évaluation</h4>

                <p>
                  <strong>Note entreprise:</strong>{" "}
                  {rapports[c.candidature_id].note_entreprise ?? "—"}
                </p>

                <p>
                  <strong>Commentaire entreprise:</strong>{" "}
                  {rapports[c.candidature_id]
                    .commentaire_entreprise ?? "—"}
                </p>

                <p>
                  <strong>Note pédagogique:</strong>{" "}
                  {rapports[c.candidature_id].note_pedagogique ?? "—"}
                </p>

                <p>
                  <strong>Commentaire pédagogique:</strong>{" "}
                  {rapports[c.candidature_id]
                    .commentaire_pedagogique ?? "—"}
                </p>

                <p>
                  <strong>Note finale:</strong>{" "}
                  {rapports[c.candidature_id].note_finale ?? "—"}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Candidatures;
