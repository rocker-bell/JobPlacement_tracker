import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/Candidatures.css";
import { ArrowLeft} from "lucide-react";

const BASE_URL = "http://localhost:8000";

const Candidatures = () => {
  const navigate = useNavigate()
  const { id } = useParams(); // stage ID
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const formData = new FormData();
        formData.append("offre_id", id);

        const response = await fetch(`${BASE_URL}/fetchCandidaturebyStageid.php`, {
          method: "POST",
          body: formData,
        });

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

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="candidatures-container">
      < ArrowLeft
    size={24}
    onClick={() => navigate("/jobboard_Entreprise")}
    className="nav-icon"
  />
      <h2 className="candidatures-title">Candidatures for Stage ID: {id}</h2>

      {candidatures.length === 0 ? (
        <p className="no-candidatures">No candidatures found.</p>
      ) : (
        candidatures.map((c) => (
          <div key={c.candidature_id} className="candidature-card">
            <div className="candidature-header">
              <h1>{c.stagiaire_id}</h1>
              <h3>{c.nom} {c.prenom}</h3>
              <span className={`status-badge status-${c.statut.toLowerCase()}`}>
                {c.statut}
              </span>
            </div>
            <p><strong>Message Motivation:</strong> {c.message_motivation}</p>
            <p>
              <strong>CV:</strong>{" "}
              {c.cv_path ? (
                <a href={`${BASE_URL}/${c.cv_path}`} target="_blank" rel="noopener noreferrer">
                  View CV
                </a>
              ) : "None"}
            </p>
            <p>
              <strong>Photo:</strong>{" "}
              {c.photo_path ? (
                <img src={`${BASE_URL}/${c.photo_path}`} alt="Photo" className="candidature-photo" />
              ) : "None"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Candidatures;
