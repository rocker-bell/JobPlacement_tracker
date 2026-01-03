import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import "../Styles/Encadrant_dasboard_ref_entreprise.css";
import Logo1 from "../assets/Logo1.svg";
import "../Styles/Encadrant.css";

const Encadrant = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [stageId, setStageId] = useState(null);
  const [Query, setQuery] = useState({
    encadrant_search_querry: "",
  });
  const [submitQuerry, setSubmitQuerry] = useState("");
  const [FetchedSearchedencadrantdata, setFetchedSearchedencadrantdata] = useState(null)


     async function FetchSearchedEncadrant(submittedQuery) {
  try {
    const response = await fetch(`${BASE_URL}/fetchEncadrantbyQuerry.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: submittedQuery, // ✅ FIXED key
      }),
    });

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return;
    }

    const data = await response.json();
    console.log("fetched encadrant ", data.user_data)

    if (data.success) {
      setFetchedSearchedencadrantdata(data.user_data); // ✅ FIXED key
    } else {
      console.error("API error:", data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}


  const [FetchEncadrant, setFetchEncadrant] = useState(
    {
  nom: "",
  prenom: "",
  agence_id: "",
  nom_d_agence: "",
  departement: ""
}
  );

  const BASE_URL = "http://localhost:8000"

  async function FetchEncadrantfunction(user_id) {
  console.log("user id = " + user_id)
      try {
        const response = await fetch(`${BASE_URL}/FetchencadrantByAgence.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // must match PHP POST
          },
          body: new URLSearchParams({ user_id: user_id }), // send user_id
        });
  
        if (!response.ok) {
          console.error("HTTP error:", response.status);
          return;
        }
  
        const data = await response.json();
        console.log(data)
        if (data.success) {
          setFetchEncadrant(data.user_data);
        } else {
          console.error("Error from API:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }



  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setStageId(id);
  }, [id]);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if(user_id) {
        FetchEncadrantfunction(user_id);
    }

   
    
  }, [])

  // Runs every time submitQuerry changes
useEffect(() => {
  if (submitQuerry) {
    FetchSearchedEncadrant(submitQuerry);
  }
}, [submitQuerry]);

  return (
    <div className="Encadrant_dasboard_ref_entreprise">
      <p className="stage_id_ref_entreprise">
        stage id is : {stageId}
      </p>

      <nav className="encadrant_nav">
        <img src={Logo1} alt="" className="Encadrant_nav_logo" />

        <ArrowLeft
          size={24}
          onClick={() => navigate("/jobboard_Entreprise")}
          className="nav-icon"
        />

        <ul className="encadrant_navLists">
          <li className="encadrant_nav_list">
            <input
              type="text"
              placeholder="search for encadrant here"
              className="encadrant_query_input"
              name="encadrant_search_querry"
              value={Query.encadrant_search_querry}
              onChange={handleChange}
            />

            <Search
              size={28}
              color="#333"
              onClick={() =>
                setSubmitQuerry(Query.encadrant_search_querry)
              }
              style={{ cursor: "pointer" }}
            />
          </li>
        </ul>
      </nav>

      <div className="main_encadrant_container">
        <p><strong>Live query:</strong> {Query.encadrant_search_querry}</p>
        <p><strong>Submitted query:</strong> {submitQuerry}</p>
      </div>

      <div>

        {submitQuerry && FetchedSearchedencadrantdata && (
  <div className="profile_card_1">

    <div className="profile_form_group"> 
      <label className="profile_form_label">Nom:</label>
      <input
        type="text"
        value={FetchedSearchedencadrantdata.nom || ""}
        readOnly
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Prénom:</label>
      <input
        type="text"
        value={FetchedSearchedencadrantdata.prenom || ""}
        readOnly
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Agence ID:</label>
      <input
        type="text"
        value={FetchedSearchedencadrantdata.agence_id || ""}
        readOnly
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Nom d'agence:</label>
      <input
        type="text"
        value={FetchedSearchedencadrantdata.nom_d_agence || ""}
        readOnly
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Département:</label>
      <input
        type="text"
        value={FetchedSearchedencadrantdata.departement || ""}
        readOnly
        className="profile_form_control"
      />
    </div>

    <button
      className="submit profile_actions_btn"
      onClick={() => affecterEncadrant(FetchedSearchedencadrantdata.encadrant_id)}
    >
      affecter encadrant
    </button>

    <button
      className="delete profile_actions_btn"
      onClick={() => demissionnerEncadrant(FetchedSearchedencadrantdata.encadrant_id)}
    >
      démissionner encadrant
    </button>

  </div>
)}


        {FetchEncadrant && (
  <div className="profile_card_1">
    
    <div className="profile_form_group"> 
      <label className="profile_form_label">Nom:</label>
      <input
        type="text"
        value={FetchEncadrant.nom || ""}
        placeholder="Entrez votre nom"
        onChange={(e) =>
          setFetchEncadrant(prev => ({ ...prev, nom: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Prénom:</label>
      <input
        type="text"
        value={FetchEncadrant.prenom || ""}
        placeholder="Entrez votre prénom"
        onChange={(e) =>
          setFetchEncadrant(prev => ({ ...prev, prenom: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Agence ID:</label>
      <input
        type="text"
        value={FetchEncadrant.agence_id || ""}
        placeholder="Entrez votre agence_id"
        onChange={(e) =>
          setFetchEncadrant(prev => ({ ...prev, agence_id: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Nom d'agence:</label>
      <input
        type="text"
        value={FetchEncadrant.nom_d_agence || ""}
        placeholder="Entrez votre nom_d_agence"
        onChange={(e) =>
          setFetchEncadrant(prev => ({ ...prev, nom_d_agence: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Département:</label>
      <input
        type="text"
        value={FetchEncadrant.departement || ""}
        placeholder="Entrez votre departement"
        onChange={(e) =>
          setFetchEncadrant(prev => ({ ...prev, departement: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

    <button
      className="submit profile_actions_btn"
      // onClick={() => updateEncadrantdata(UserId)}
    >
      affecter encadrant
    </button>

    <button className="delete profile_actions_btn">demisionner encadrant</button>
  </div>
)}
      </div>
    </div>
  );
};

export default Encadrant;
