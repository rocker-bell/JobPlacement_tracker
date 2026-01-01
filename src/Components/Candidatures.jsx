import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = "http://localhost:8000"; // adjust if needed

const Candidatures = () => {
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Candidatures for Stage ID: {id}</h2>
      {candidatures.length === 0 ? (
        <p>No candidatures found.</p>
      ) : (
        candidatures.map((c) => (
          <div key={c.candidature_id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p><strong>Name:</strong> {c.nom} {c.prenom}</p>
            <p><strong>Status:</strong> {c.statut}</p>
            <p><strong>Message:</strong> {c.message_motivation}</p>
            <p><strong>CV:</strong> {c.cv_path ? <a href={`${BASE_URL}/${c.cv_path}`} target="_blank">View CV</a> : "None"}</p>
            <p><strong>Photo:</strong> {c.photo_path ? <img src={`${BASE_URL}/${c.photo_path}`} alt="Photo" width="80" /> : "None"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Candidatures;
