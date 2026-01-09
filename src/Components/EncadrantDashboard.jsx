import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/EncadrantDashboard.css";
import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";
import Logo1 from "../assets/Logo1.svg"
import { User } from "lucide-react";

const EncadrantDashboard = () => {
  // State for active slider and mobile screen size
  const [Fetchuser, setFetchuser] = useState(null);
  const [cvFile, setCvFile] = useState(null);
const [photoFile, setPhotoFile] = useState(null);
  const [FetchEncadrant, setFetchEncadrant] = useState(
    {
  nom: "",
  prenom: "",
  agence_id: "",
  nom_d_agence: "",
  departement: ""
}
  );
  const [UserId, setUserId] = useState(null);
  const [ActiveSlider, setActiveSlider] = useState("ED_CB_default"); // Set default slider
  const [IsMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [CancelAddStage, setCancelAddStage] = useState(false)
  const [menuActive, setmenuActive] = useState(false);

  const [Showmenu, setShowmenu] = useState(false);
  const [Affectation, setAffectation] = useState(null);
  const [OffreId, setOffreId] = useState(null);
  const [Candidatures, setCandidatures] = useState([]);
  const [expandedAffectation, setExpandedAffectation] = useState(null);
  const [selectedAffectation, setSelectedAffectation] = useState(null);
  const handleAffectationClick = (affect) => {
  setSelectedAffectation(affect);
  setOffreId(affect.offre_id);

  if (affect.offre_id) {
    fetchCandidatures(affect.offre_id);
  } else {
    setCandidatures([]);
  }
};



  const navigate = useNavigate()
  const BASE_URL = "http://localhost:8000";


   async function FetchEncadrantfunction(user_id) {
  console.log("user id = " + user_id)
      try {
        const response = await fetch(`${BASE_URL}/Encadrantfetch.php`, {
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


    async function updateEncadrantdata(id) {
  try {
    const formData = new FormData();
    formData.append("encadrant_id", id);
    formData.append("nom", FetchEncadrant.nom);
    formData.append("prenom", FetchEncadrant.prenom);
    formData.append("agence_id", FetchEncadrant.agence_id);
    formData.append("nom_d_agence", FetchEncadrant.nom_d_agence);
    formData.append("departement", FetchEncadrant.departement);

   

    const response = await fetch(`${BASE_URL}/Encadrant_update.php`, {
      method: "POST",
      body: formData, // no need for headers, fetch sets multipart automatically
    });

    const data = await response.json();
    if (data.success) {
      alert("encadrant updated successfully!");
    } else {
      alert("Failed to update encadrant: " + data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// async function fetchAffectation(user_id) {
//   try {
//     const res = await fetch(`${BASE_URL}/fetch_affectation.php`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ encadrant_id: user_id })
//     });

//     const data = await res.json();
//     console.log("Data from PHP:", data);

//     if (data.success === true && data.user_data.length > 0) {
//       const userData = data.user_data; // 🔹 IMPORTANT
//       setAffectation(data.user_data);

//       const offreId = userData.offre_id;
//       setOffreId(offreId);

//       if (offreId) {
//         fetchCandidatures(offreId);
        
//       }

//     } else {
//       setAffectation(null);
//       setCandidatures([]);
//       alert(data.message || "Aucune affectation trouvée");
//     }

//   } catch (error) {
//     alert(`Erreur : ${error}`);
//   }
// }


async function fetchAffectation(user_id) {
  try {
    const res = await fetch(`${BASE_URL}/fetch_affectation.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ encadrant_id: user_id })
    });

    const data = await res.json();
    console.log("Data from PHP:", data);

    if (data.success === true && data.user_data.length > 0) {
      setAffectation(data.user_data);
    } else {
      setAffectation([]);
      setCandidatures([]);
    }

  } catch (error) {
    console.error(error);
  }
}


// async function fetchCandidatures(OffreId) {
//   if (!OffreId) return; // sécurité

//   const formData = new FormData();
//   formData.append("offre_id", OffreId);

//   try {
//     const res = await fetch(`${BASE_URL}/fetchCandidaturebyStageid.php`, {
//       method: "POST",
//       body: formData
//     });

//     const data = await res.json();

//     console.log("Data from PHP:", data); // <-- très important pour debug

//     if (data.success === true) {
//       setCandidatures(data.candidatures);
//     } else {
//       setCandidatures([]); 
//       console.warn(data.message);
//     }

//   } catch (error) {
//     setCandidatures([]);
//     console.error(error);
//   }
// }


// async function fetchCandidaturesByAffectation(affect) {
//   if (!affect.offre_id) return; // nothing to fetch

//   const formData = new FormData();
//   formData.append("offre_id", affect.offre_id);

//   try {
//     const res = await fetch(`${BASE_URL}/fetchCandidaturebyStageid.php`, {
//       method: "POST",
//       body: formData
//     });
//     const data = await res.json();

//     if (data.success) {
//       setAffectationCandidatures(data.candidatures);
//     } else {
//       setAffectationCandidatures([]);
//       console.warn(data.message);
//     }

//   } catch (error) {
//     console.error(error);
//     setAffectationCandidatures([]);
//   }
// }




  // Handle screen resizing to adjust the mobile state
  
  async function fetchCandidatures(OffreId) {
  if (!OffreId) return;

  const formData = new FormData();
  formData.append("offre_id", OffreId);

  try {
    const res = await fetch(`${BASE_URL}/fetchCandidaturebyStageid.php`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("Candidatures:", data);

    if (data.success === true) {
      setCandidatures(data.candidatures);
    } else {
      setCandidatures([]);
    }

  } catch (error) {
    setCandidatures([]);
    console.error(error);
  }
}

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowmenu(true);
      if (!mobile) setShowmenu(false)
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    
  }, []);

  // Function to handle the slider change
  const SliderContentHandler = (sliderName) => {
    setActiveSlider(sliderName);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/")
  }




  const handleCancel = () => {
    setCancelAddStage(true)
     setTimeout(() => setActiveSlider("ED_CB_default"), 500);

     setTimeout(() => setCancelAddStage(false), 500)

  }



  
     async function FetchuserData(userId) {
      try {
        const response = await fetch(`${BASE_URL}/fetch_profile.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // must match PHP POST
          },
          body: new URLSearchParams({ user_id: userId }), // send user_id
        });
  
        if (!response.ok) {
          console.error("HTTP error:", response.status);
          return;
        }
  
        const data = await response.json();
        if (data.success) {
          setFetchuser(data.user_data);
        } else {
          console.error("Error from API:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
  
    useEffect(() => {
      const user_id = localStorage.getItem("user_id");
      setUserId(user_id);
      // setenterpriseId(user_id)
      
      
      // fetchCandidatures(OffreId)
  
      if (user_id) {
        FetchuserData(user_id); // actually call the function
        fetchAffectation(user_id)
        FetchEncadrantfunction(user_id);
      }
    }, []);

  const handleClickMenu = () => {
    setmenuActive(true);

    setTimeout(() => {
        setmenuActive(false)
    }, 3000)
    

  }
async function DeleteAccount(UserId) {
  try {
    const response = await fetch(`${BASE_URL}/DeleteAccount.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: UserId }) // ✅ use parameter
    });

    const res = await response.json();
    console.log(res);

    if (res.success) {
      alert("User deleted successfully");
      localStorage.removeItem("user_id");
      navigate("/")
    } else {
      alert("Failed to delete user: " + res.message);
    }
  } catch (err) {
    console.error("Error deleting user:", err);
  }
}


const handleDelete = () => {
  if (!UserId) return alert("User ID not found");
  DeleteAccount(UserId);
};

const rapportEncadrant = (id) => {
  navigate(`/EncadrantRapport/${id}`)
}

const hanldeJobConnect = () => {
   SliderContentHandler("ED_CB_default")
}
const [dashboardStats, setDashboardStats] = useState({
  total_affectations: 0,
  pending_evaluations: 0,
  accepted_applicants: 0,
  refused_applicants: 0,
  pending_applicants: 0
});


useEffect(() => {
  if (!UserId) return;

  async function fetchStats() {
    try {
      const res = await fetch(`http://localhost:8000/dashboard_stats_encadrants.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ encadrant_id: UserId }) // <-- French key
      });
      const data = await res.json();
      console.log("stats", data)
      if (data.success) setDashboardStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }

  fetchStats();
}, [UserId]);




// affectatiion et candidature



  return (
    <div className="EncadrantDashboard_wrapper">
      <div className="EncadrantDashboard_container">
        <div className="EncadrantDashboard_sideNav">
          <nav >
            <div className="logo_actions_group">
                <img src={Logo1} alt="" className="jobconnectlogo" onClick={hanldeJobConnect} />
                <img src={menu} alt="" className={`dropdown_menu_logo ${Showmenu ? "mobile" : ""} ${menuActive ? "Active" : ""}`} onClick={handleClickMenu}/>
                <img src={menu_active} alt="" className={`menu_active ${menuActive ? "Active" : ""}`} />
            </div>
            <ul className={`EncadrantDashboard_navLists ${IsMobile ? "mobile" : ""} ${menuActive ? "Active" : ""}`}>
              {/* On click of each nav item, change the active slider */}
              {/* <li
                className="EncadrantDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_addStage")}
              >
                Ajouter Stage
              </li> */}
              <li
                className="EncadrantDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_Stages")}
              >
                affectation
              </li>
              <li
                className="EncadrantDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_profile")}
              >
                Profile
              </li>
              {/* <li
                className="EncadrantDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_statistiques")}
              >
                statistique
              </li> */}
              <li  className="EncadrantDashboard_nav_list" onClick={handleLogout}>Logout</li>
            </ul>
          </nav>
        </div>

        <div className="EncadrantDashboard_NavContentSlider">
          {/* Dynamically toggle content based on the active slider */}
          <span
            className={`EncadrantDashboard_contentAbout ED_CB_default ${
              ActiveSlider === "ED_CB_default" ? "Active" : ""
            }`}
          >
            Content 1: Default


                  <div className="general_statistique">
  <div className="statistique_card">
    <h3>Total Affectations</h3>
    <p>{dashboardStats.total_affectations}</p>
  </div>
  <div className="statistique_card">
    <h3>Pending Evaluations</h3>
    <p>{dashboardStats.pending_evaluations}</p>
  </div>
  <div className="statistique_card">
    <h3>Accepted Applicants</h3>
    <p>{dashboardStats.accepted_applicants}</p>
  </div>
  <div className="statistique_card">
    <h3>Refused Applicants</h3>
    <p>{dashboardStats.refused_applicants}</p>
  </div>
  <div className="statistique_card">
    <h3>Pending Applicants</h3>
    <p>{dashboardStats.pending_applicants}</p>
  </div>
</div>


          </span>
          {/* <span
            className={`EncadrantDashboard_contentAbout ED_CB_addStage ${
              ActiveSlider === "ED_CB_addStage" ? "Active" : ""
            }`}
          >
            Content 2: chercher stage


          </span> */}
          <span
            className={`EncadrantDashboard_contentAbout ED_CB_Stages ${
              ActiveSlider === "ED_CB_Stages" ? "Active" : ""
            }`}
          >
            Content 3: affectation

              {/* {Affectation && Affectation.length > 0 ? (
  <div>
    {Affectation.map((affect, index) => (
      <div key={affect.affectation_id} className="affectation-card">
        <p><strong>Affectation ID:</strong> {affect.affectation_id}</p>
        <p><strong>Encadrant ID:</strong> {affect.encadrant_id}</p>
        <p><strong>Offre ID:</strong> {affect.offre_id || "Non assignée"}</p>
        <p><strong>Status:</strong> {affect.affectation_status}</p>
        <p><strong>Créée le:</strong> {affect.created_at}</p>
        <p><strong>Dernière mise à jour:</strong> {affect.updated_at}</p>
      </div>
    ))}
  </div>
) : (
  <p>Il n’y a pas d’affectation pour le moment.</p>
)} */}

{Affectation && Affectation.length > 0 ? (
  <div>
    {Affectation.map(affect => (
      <div
        key={affect.affectation_id}
        className={`affectation-card ${
          selectedAffectation?.affectation_id === affect.affectation_id ? "active" : ""
        }`}
        onClick={() => handleAffectationClick(affect)}
      >
        <p><strong>Affectation ID:</strong> {affect.affectation_id}</p>
        <p><strong>Encadrant ID:</strong> {affect.encadrant_id}</p>
        <p><strong>Offre ID:</strong> {affect.offre_id || "Non assignée"}</p>
        <p><strong>Status:</strong> {affect.affectation_status}</p>
      </div>
    ))}
  </div>
) : (
  <p>Il n’y a pas d’affectation pour le moment.</p>
)}

         

{Candidatures && Candidatures.length > 0 ? (
  <table>
    <thead>
      <tr>
        <th>Stagiaire ID</th>
        <th>Offre ID</th>
        <th>Statut</th>
        <th>Message</th>
        <th>CV</th>
        <th>Créée le</th>
        <th>Mise à jour</th>
        <th>Action</th> 
      </tr>
    </thead>
    <tbody>
      {Candidatures.map(cand => (
        <tr key={cand.candidature_id}>
          <td>{cand.stagiaire_id}</td>
          <td>{cand.offre_id}</td>
          <td>{cand.statut}</td>
          <td>{cand.message_motivation || "Aucun"}</td>
          <td>
            {cand.cv_path ? (
              <a 
                href={`http://localhost:8000/${cand.cv_path}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Voir CV
              </a>
            ) : "Aucun"}
          </td>
          <td>{cand.created_at}</td>
          <td>{cand.updated_at}</td>
          <td>
            <button 
              className="btn_rapport_encadrant" 
              onClick={() => rapportEncadrant(cand.candidature_id)}
            >
              rapport
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>Il n'y a pas de candidature pour cette offre {OffreId}</p>
)}
        {/* {Affectation && Affectation.length > 0 ? (
  <div>
    {Affectation.map((affect) => (
      <div key={affect.affectation_id} className="affectation-card">
        <p><strong>Affectation ID:</strong> {affect.affectation_id}</p>
        <p><strong>Encadrant ID:</strong> {affect.encadrant_id}</p>
        <p><strong>Offre ID:</strong> {affect.offre_id || "Non assignée"}</p>
        <p><strong>Status:</strong> {affect.affectation_status}</p>
        <p><strong>Créée le:</strong> {affect.created_at}</p>
        <p><strong>Dernière mise à jour:</strong> {affect.updated_at}</p>

        
        <button
          className="show_candidatures_btn"
          onClick={() => setExpandedAffectation(prev => prev === affect.affectation_id ? null : affect.affectation_id)}
        >
          {expandedAffectation === affect.affectation_id ? "Cacher candidatures" : "Voir candidatures"}
        </button>

        
        {expandedAffectation === affect.affectation_id && Candidatures[affect.affectation_id] && Candidatures[affect.affectation_id].length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Stagiaire ID</th>
                <th>Offre ID</th>
                <th>Statut</th>
                <th>Message</th>
                <th>CV</th>
                <th>Créée le</th>
                <th>Mise à jour</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Candidatures[affect.affectation_id].map(cand => (
                <tr key={cand.candidature_id}>
                  <td>{cand.stagiaire_id}</td>
                  <td>{cand.offre_id}</td>
                  <td>{cand.statut}</td>
                  <td>{cand.message_motivation || "Aucun"}</td>
                  <td>
                    {cand.cv_path ? (
                      <a 
                        href={`http://localhost:8000/${cand.cv_path}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Voir CV
                      </a>
                    ) : "Aucun"}
                  </td>
                  <td>{cand.created_at}</td>
                  <td>{cand.updated_at}</td>
                  <td>
                    <button 
                      className="btn_rapport_encadrant" 
                      onClick={() => rapportEncadrant(cand.candidature_id)}
                    >
                      rapport
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : expandedAffectation === affect.affectation_id ? (
          <p>Il n'y a pas de candidature pour cette affectation</p>
        ) : null}

      </div>
    ))}
  </div>
) : (
  <p>Il n’y a pas d’affectation pour le moment.</p>
)} */}



          </span>
         

        

          <span
            className={`EncadrantDashboard_contentAbout ED_CB_profile ${
              ActiveSlider === "ED_CB_profile" ? "Active" : ""
            }`}
          >
            Content 4: Profile
           {Fetchuser && (
  
              <div className="profile_card">
                <div className="profile_form_group">
                  <label className="profile_form_label">User ID:</label>
                  <input 
                    className="profile_form_control" 
                    type="text" 
                    value={Fetchuser.user_id} 
                    readOnly 
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Email:</label>
                  <input 
                    className="profile_form_control" 
                    type="email" 
                    value={Fetchuser.email} 
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Telephone:</label>
                  <input 
                    className="profile_form_control" 
                    type="tel" 
                    value={Fetchuser.telephone} 
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Role:</label>
                  <input 
                    className="profile_form_control" 
                    type="text" 
                    value={Fetchuser.role} 
                    readOnly
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Account Status:</label>
                  <input 
                    className="profile_form_control" 
                    type="text" 
                    value={Fetchuser.account_status} 
                    readOnly
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Created At:</label>
                  <input 
                    className="profile_form_control" 
                    type="text" 
                    value={Fetchuser.created_at} 
                    readOnly
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Updated At:</label>
                  <input 
                    className="profile_form_control" 
                    type="text" 
                    value={Fetchuser.updated_at} 
                    readOnly
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Username:</label>
                  <input 
                    className="profile_form_control" 
                    type="text" 
                    value={Fetchuser.username} 
                  />
                </div>

                <div className="Candidatprofile_btn_actions">
                  <button className="modifier profile_actions_btn">modifier</button>
                </div>
              </div>


              )}


     

{/* {FetchEncadrant && (
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
      <label className="profile_form_label">agence_id :</label>
      <input
        type="text"
        value={FetchEncadrant.agence_id  || ""}
        placeholder="Entrez votre agence_id"
        onChange={(e) =>
          setFetchEncadrant(prev => ({ ...prev, prenom: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

     <div className="profile_form_group">
      <label className="profile_form_label">nom_d_agence :</label>
      <input
        type="text"
        value={FetchEncadrant.nom_d_agence  || ""}
        placeholder="Entrez votre nom_d_agence "
        onChange={(e) =>
          setFetchEncadrant(prev => ({ ...prev, prenom: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>


    <div className="profile_form_group">
      <label className="profile_form_label">departement :</label>
      <input
        type="text"
        value={FetchEncadrant.departement  || ""}
        placeholder="Entrez votre departement "
        onChange={(e) =>
          setFetchEncadrant(prev => ({ ...prev, prenom: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

  

   

     <button className="submit profile_actions_btn"  onClick={() => updateEncadrantdata(UserId)}>update stagiaire data</button>
      <button className="delete profile_actions_btn">delete account</button>
  </div>
)} */}

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
      onClick={() => updateEncadrantdata(UserId)}
    >
      Update Encadrant Data
    </button>

    {/* <button type="delete" className="delete profile_actions_btn" onClick={() => DeleteAccount(userId)}>Delete Account</button> */}
        <button
  type="button"
  className="delete_profile_actions_btn"
  onClick={handleDelete}
>
  Delete Account
</button>

  </div>
)}


          </span>
          {/* <span
            className={`EncadrantDashboard_contentAbout ED_CB_statistiques ${
              ActiveSlider === "ED_CB_statistiques" ? "Active" : ""
            }`}
          >
            Content 5: Statistiques
          </span> */}
        </div>
      </div>

      <footer>copyrights</footer>
    </div>
  );
};

export default EncadrantDashboard;