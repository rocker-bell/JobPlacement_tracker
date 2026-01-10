import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageSquare, Bookmark, Star, Ban, Bell, Building2} from "lucide-react";
import "../Styles/UserJobBoard.css";
import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";
import Logo1 from "../assets/Logo1.svg";
import Profile from "../assets/profile.png";
import Logout from "../assets/Logout.svg"
import StatChart from "./StatChart";
const UserJobBoard = () => {
  // State for active slider and mobile screen size
  const [Fetchuser, setFetchuser] = useState(null);
  const [Query, setQuery] = useState({
  stage_search_querry: ""
});
  
const [cvFile, setCvFile] = useState(null);
const [photoFile, setPhotoFile] = useState(null);

const [submittedQuery, setSubmittedQuery] = useState("");
const [FetchedQuery, setFetchedQuery] = useState([]);
const [FetchStagiaire, setFetchStagiaire] = useState({
  nom: "",
  prenom: "",
  cv_path: "",
  photo_path: ""
});

const [FetchCandidature, setFetchCandidature] = useState(null)


  const [UserId, setUserId] = useState(null);
  const [ActiveSlider, setActiveSlider] = useState("ED_CB_default"); // Set default slider
  const [IsMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [CancelAddStage, setCancelAddStage] = useState(false)
  const [menuActive, setmenuActive] = useState(false);
  const [offre, offre_id] = useState(false)
  const [Showmenu, setShowmenu] = useState(false);
  const [candidature_dropdown, setcandidature_dropdown] = useState(false)
  // pagination


  const [currentPage, setCurrentPage] = useState(1); // for pagination
const [selectedStage, setSelectedStage] = useState(null); // for selected stage
const stagesPerPage = 3;

// Calculate paginated stages
const totalPages = Math.ceil(FetchedQuery.length / stagesPerPage);
const paginatedStages = FetchedQuery.slice(
  (currentPage - 1) * stagesPerPage,
  currentPage * stagesPerPage

  
);

// pagination

// Pagination & selected candidature
const [currentPageCandidature, setCurrentPageCandidature] = useState(1);
const [selectedCandidature, setSelectedCandidature] = useState(null);
const candidaturesPerPage = 3;

// Paginated candidatures
const totalPagesCandidatures = Math.ceil(FetchCandidature?.length / candidaturesPerPage);
const paginatedCandidatures = FetchCandidature?.slice(
  (currentPageCandidature - 1) * candidaturesPerPage,
  currentPageCandidature * candidaturesPerPage
);


  const navigate = useNavigate()
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownTimeoutRef = useRef(null);


  const toggleDropdown = (candidatureId) => {
  // If clicking the same card, close it
  if (openDropdownId === candidatureId) {
    setOpenDropdownId(null);
    clearTimeout(dropdownTimeoutRef.current);
    return;
  }

  setOpenDropdownId(candidatureId);

  // Clear previous timeout if exists
  if (dropdownTimeoutRef.current) {
    clearTimeout(dropdownTimeoutRef.current);
  }

  // Set timeout to auto-close after 4 seconds
  dropdownTimeoutRef.current = setTimeout(() => {
    setOpenDropdownId(null);
  }, 4000);
};


  // Handle screen resizing to adjust the mobile state
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

  
 async function FetchStagiairefunction(user_id) {
  console.log("user id = " + user_id)
      try {
        const response = await fetch(`${BASE_URL}/Stagiairefetch.php`, {
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
          setFetchStagiaire(data.user_data);
        } else {
          console.error("Error from API:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }



    async function fetchCandidatures(user_id) {
  try {
    const response = await fetch(
      `${BASE_URL}/FetchCandidaturebyStagiaireid.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          stagiaire_id: user_id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Candidatures:", data);

    if (data.success) {
      setFetchCandidature(data.candidatures);
    } else {
      console.error("API error:", data.message);
    }
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}




const handleChange = (e) => {
  const {name, value} = e.target;
  setQuery((prev) => ({...prev, [name]: value}))
}

  const BASE_URL = "http://localhost:8000"
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

   


    async function FetchSearchedStage(submittedQuery) {
  try {
    const response = await fetch(`${BASE_URL}/fetchStagebyQuerry.php`, {
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

    if (data.success) {
      setFetchedQuery(data.query_data); // ✅ FIXED key
    } else {
      console.error("API error:", data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}


// async function FetchOffreById(offre_id) {

// }

  
    useEffect(() => {
      const user_id = localStorage.getItem("user_id");
      setUserId(user_id);
      // setenterpriseId(user_id)
  
      if (user_id) {
        FetchuserData(user_id); // actually call the function
        FetchStagiairefunction(user_id);
        
        fetchCandidatures(user_id);
      }


      if(submittedQuery) {
        FetchSearchedStage(submittedQuery)
      }

     
    }, []);

  const handleClickMenu = () => {
    setmenuActive(true);

    setTimeout(() => {
        setmenuActive(false)
    }, 3000)
    


    
  }

  const handeleposutler = (id) => {

      alert("stage id = " + id)
      navigate(`/Postuler/${id}`)
  }








async function updateStagiairedata(id) {
  try {
    const formData = new FormData();
    formData.append("stagiaire_id", id);
    formData.append("nom", FetchStagiaire.nom);
    formData.append("prenom", FetchStagiaire.prenom);

    if (cvFile) formData.append("cv_file", cvFile);
    if (photoFile) formData.append("photo_file", photoFile);

    const response = await fetch(`${BASE_URL}/stagiaire_update.php`, {
      method: "POST",
      body: formData, // no need for headers, fetch sets multipart automatically
    });

    const data = await response.json();
    if (data.success) {
      alert("Stagiaire updated successfully!");
    } else {
      alert("Failed to update stagiaire: " + data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// const cancelcanidature = (id) => {
//   alert(id)
// }

// const rapportcandidature = (id) => {
//   alert(id)
// }


// Cancel a specific candidature
async function cancelcanidature(candidature_id) {
  if (!candidature_id) return alert("Candidature ID not provided");

  try {
    const response = await fetch(`${BASE_URL}/cancel_candidature.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidature_id }), // send the ID
    });

    const res = await response.json();
    console.log(res);

    if (res.success) {
      alert("Candidature cancelled successfully");

      // Optionally remove it from local state
      setFetchCandidature(prev =>
        prev.filter(c => c.candidature_id !== candidature_id)
      );

      // Clear the selected candidature if it was the one deleted
      if (selectedCandidature?.candidature_id === candidature_id) {
        setSelectedCandidature(null);
      }
    } else {
      alert("Failed to cancel candidature: " + res.message);
    }
  } catch (err) {
    console.error("Error cancelling candidature:", err);
    alert("Error cancelling candidature");
  }
}

const hanldeJobConnect = () => {
   SliderContentHandler("ED_CB_default")
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

const [dashboardStats, setDashboardStats] = useState({
    total_applications: 0,
    accepted_applications: 0,
    refused_applications: 0,
    pending_applications: 0,
    viewed_applications: 0,
    unviewed_applications: 0,
    total_affectations: 0,
    pending_evaluations: 0
  });

  useEffect(() => {
    if (!UserId) return;

    async function fetchStats() {
      try {
        const res = await fetch(
          `http://localhost:8000/dashboard_stats_stagiaire.php`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ stagiaire_id: UserId })
          }
        );

        const data = await res.json();
        console.log("Stagiaire stats:", data);
        if (data.success) setDashboardStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }

    fetchStats();
  }, [UserId]);


  const modifierPassword = () => {
    navigate('/AccountRecovery')
  }

  return (
    <div className="UserJobBoard_wrapper">
      <div className="UserJobBoard_container">
        <div className="UserJobBoard_sideNav">
          <nav >
            <div className="logo_actions_group">
               
                <img src={Logo1} alt="" className="jobconnectlogo" onClick={hanldeJobConnect} />
                <img src={menu} alt="" className={`dropdown_menu_logo ${Showmenu ? "mobile" : ""} ${menuActive ? "Active" : ""}`} onClick={handleClickMenu}/>
                <img src={menu_active} alt="" className={`menu_active ${menuActive ? "Active" : ""}`} />
            </div>
            <ul className={`UserJobBoard_navLists ${IsMobile ? "mobile" : ""} ${menuActive ? "Active" : ""}`}>
             
            <li className="UserJobBoard_nav_list">
  <input
    type="text"
    placeholder="search for stage here"
    className="stage_query_input"
    name="stage_search_querry"
    value={Query.stage_search_querry}
    onChange={handleChange}
  />

  <Search
    size={35}
    color="#333"
    onClick={() =>{ SliderContentHandler("ED_CB_addStage"),   setSubmittedQuery(Query.stage_search_querry),  FetchSearchedStage(Query.stage_search_querry)}}
    style={{ cursor: "pointer" }}
  />
</li>
             <li className="UserJobBoard_nav_list">
                          <MessageSquare size={24} className="UserJobBoard_nav_icons" />
                        
                        </li>
                        <li className="UserJobBoard_nav_list"><Bell size={24} className="UserJobBoard_nav_icons" /></li>

              {/* </li> */}
              
              <li
                className="UserJobBoard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_Stages")}
              >
                <img className="UserJobBoard_nav_icons" src="https://img.icons8.com/ios/50/lawyer.png" alt="lawyer"/>
                {/* <img  className="UserJobBoard_nav_icons" src="https://img.icons8.com/ios-filled/50/business.png" alt="business"/> */}
              </li>

{/*               
              <li
                className="UserJobBoard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_CV")}
              >
                <img className="UserJobBoard_nav_icons"  src="https://img.icons8.com/pulsar-gradient/48/parse-from-clipboard.png" alt="parse-from-clipboard"/>
              </li> */}

              
              <li
                className="UserJobBoard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_profile")}
              >
                {/* <img src={Profile} alt="" className="UserDashboard_nav_icons"/> */}
                <img  src="https://img.icons8.com/3d-fluency/94/resume.png" className="UserDashboard_nav_icons" alt="resume"/>
              </li>
              {/* <li
                className="UserJobBoard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_statistiques")}
              >
                statistique
              </li> */}
              <li  className="UserJobBoard_nav_list" onClick={handleLogout}>
                  <img src={Logout} alt="" className="UserDashboard_nav_icons" />
              </li>
            </ul>
          </nav>
        </div>

        <div className="UserJobBoard_NavContentSlider">
          {/* Dynamically toggle content based on the active slider */}
          <span
            className={`UserJobBoard_contentAbout ED_CB_default ${
              ActiveSlider === "ED_CB_default" ? "Active" : ""
            }`}
          >
            Content 1: Default

                    {/* <div className="general_statistique">
                              <div className="statistique_card">
                                <h3>Total Applications</h3>
                                <p>{dashboardStats.total_applications}</p>
                              </div>
                              <div className="statistique_card">
                                <h3>Accepted</h3>
                                <p>{dashboardStats.accepted_applications}</p>
                              </div>
                              <div className="statistique_card">
                                <h3>Refused</h3>
                                <p>{dashboardStats.refused_applications}</p>
                              </div>
                              <div className="statistique_card">
                                <h3>Pending</h3>
                                <p>{dashboardStats.pending_applications}</p>
                              </div>
                              <div className="statistique_card">
                                <h3>Viewed</h3>
                                <p>{dashboardStats.viewed_applications}</p>
                              </div>
                              <div className="statistique_card">
                                <h3>Unviewed</h3>
                                <p>{dashboardStats.unviewed_applications}</p>
                              </div>
                              <div className="statistique_card">
                                <h3>Total Affectations</h3>
                                <p>{dashboardStats.total_affectations}</p>
                              </div>
                              <div className="statistique_card">
                                <h3>Pending Evaluations</h3>
                                <p>{dashboardStats.pending_evaluations}</p>
                              </div>
                 </div> */}

                 <div className="general_statistique">
      <StatChart
        title="Total Applications"
        value={dashboardStats.total_applications}
        color="#4CAF50"
      />
      <StatChart
        title="Accepted"
        value={dashboardStats.accepted_applications}
        color="#2196F3"
      />
      <StatChart
        title="Refused"
        value={dashboardStats.refused_applications}
        color="#F44336"
      />
      <StatChart
        title="Pending"
        value={dashboardStats.pending_applications}
        color="#FF9800"
      />
      <StatChart
        title="Viewed"
        value={dashboardStats.viewed_applications}
        color="#9C27B0"
      />
      <StatChart
        title="Unviewed"
        value={dashboardStats.unviewed_applications}
        color="#795548"
      />
      <StatChart
        title="Total Affectations"
        value={dashboardStats.total_affectations}
        color="#009688"
      />
      <StatChart
        title="Pending Evaluations"
        value={dashboardStats.pending_evaluations}
        color="#607D8B"
      />
    </div>
          </span>
         {/* <span
  className={`UserJobBoard_contentAbout ED_CB_addStage ${
    ActiveSlider === "ED_CB_addStage" ? "Active" : ""
  }`}
>
  Content 2:  stage content :
  

{Array.isArray(FetchedQuery) && FetchedQuery.length > 0 ? (
  FetchedQuery.map((stage) => (
    <div key={stage.offre_id} className="stage_card">
      
      <h2>{stage.titre}</h2>

      <p><strong>Type:</strong> {stage.type_de_stage}</p>
      <p><strong>Category:</strong> {stage.stage_categorie}</p>
      <p><strong>Description:</strong> {stage.description}</p>

      <p><strong>Skills Required:</strong> {stage.competences_requises}</p>

      <p><strong>Start Date:</strong> {stage.date_debut}</p>
      <p><strong>Duration (weeks):</strong> {stage.duree_semaines}</p>

      <p><strong>Available Places:</strong> {stage.nombre_places}</p>
      <p><strong>Location:</strong> {stage.emplacement}</p>

      <p>
        <strong>Status:</strong>{" "}
        <span className={`status ${stage.statut}`}>
          {stage.statut}
        </span>
      </p>

      <small>
        <strong>Created:</strong> {stage.created_at} <br />
        <strong>Updated:</strong> {stage.updated_at}
      </small>
      <button className="Cancdidatstage_btn_actions" onClick={() => handeleposutler(stage.offre_id)}>postuler</button>

    </div>
  ))
) : (
  <p>No results found</p>
)}


</span> */}


<span
  className={`UserJobBoard_contentAbout ED_CB_addStage ${
    ActiveSlider === "ED_CB_addStage" ? "Active" : ""
  }`}
>
  {/* Header */}
  <h2>Stage Listings</h2>

  <div className="stages-container">
    {/* --- LEFT PANEL: Paginated Stage List --- */}
    <div className="left-panel">
      {FetchedQuery.length > 0 ? (
        <>
          {paginatedStages.map((stage) => (
            <div
              key={stage.offre_id}
              className={`stage-card ${
                selectedStage?.offre_id === stage.offre_id ? "active" : ""
              }`}
              onClick={() => setSelectedStage(stage)}
            >
              <h3>{stage.titre}</h3>
              <p><strong>Location:</strong> {stage.emplacement}</p>
              <p><strong>Type:</strong> {stage.type_de_stage}</p>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  className={currentPage === idx + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>No stages found</p>
      )}
    </div>

    {/* --- RIGHT PANEL: Selected Stage Details --- */}
    {/* <div className="right-panel">
      {selectedStage ? (
        <div className="stage-detail">
          <h2>{selectedStage.titre}</h2>
          <p><strong>Company:</strong> {selectedStage.entreprise_id}</p>
          <p><strong>Location:</strong> {selectedStage.emplacement}</p>
          <p><strong>Type:</strong> {selectedStage.type_de_stage}</p>
          <p><strong>Category:</strong> {selectedStage.stage_categorie}</p>
          <p><strong>Description:</strong> {selectedStage.description}</p>
          <p><strong>Start Date:</strong> {selectedStage.date_debut}</p>
          <p><strong>Duration:</strong> {selectedStage.duree_semaines} weeks</p>
          <p><strong>Available Places:</strong> {selectedStage.nombre_places}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${selectedStage.statut}`}>
              {selectedStage.statut}
            </span>
          </p>
          <button
            className="Cancdidatstage_btn_actions"
            onClick={() => handeleposutler(selectedStage.offre_id)}
          >
            Postuler
          </button>
        </div>
      ) : (
        <p>Select a stage to see details</p>
      )}
    </div> */}


    {/* <div className="right-panel">
  {selectedStage ? (
    <div className="stage-detail-form">
      <h2>{selectedStage.titre}</h2>

      <div className="form-group">
        <label className="form-label">Company:</label>
        <input
          type="text"
          className="form-control"
          value={selectedStage.entreprise_id}
          readOnly
        />
      </div>

      <div className="form-group">
        <label className="form-label">Location:</label>
        <input
          type="text"
          className="form-control"
          value={selectedStage.emplacement}
          readOnly
        />
      </div>

      <div className="form-group">
        <label className="form-label">Type:</label>
        <input
          type="text"
          className="form-control"
          value={selectedStage.type_de_stage}
          readOnly
        />
      </div>

      <div className="form-group">
        <label className="form-label">Category:</label>
        <input
          type="text"
          className="form-control"
          value={selectedStage.stage_categorie}
          readOnly
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description:</label>
        <textarea
          className="form-control"
          value={selectedStage.description}
          readOnly
          rows={4}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Start Date:</label>
        <input
          type="text"
          className="form-control"
          value={selectedStage.date_debut}
          readOnly
        />
      </div>

      <div className="form-group">
        <label className="form-label">Duration (weeks):</label>
        <input
          type="number"
          className="form-control"
          value={selectedStage.duree_semaines}
          readOnly
        />
      </div>

      <div className="form-group">
        <label className="form-label">Available Places:</label>
        <input
          type="number"
          className="form-control"
          value={selectedStage.nombre_places}
          readOnly
        />
      </div>

      <div className="form-group">
        <label className="form-label">Status:</label>
        <input
          type="text"
          className={`form-control status ${selectedStage.statut}`}
          value={selectedStage.statut}
          readOnly
        />
      </div>

      <button
        className="candidature-btn"
        onClick={() => handeleposutler(selectedStage.offre_id)}
      >
        Postuler
      </button>
    </div>
  ) : (
    <p>Select a stage to see details</p>
  )}
</div> */}

<div className="detail-panel">
  {selectedStage ? (
    <>
      {/* Header */}
      <div className="detail-header">
        <h2 className="detail-title">{selectedStage.titre}</h2>
          
        <div className="detail-company-link">
          <a href="#">{selectedStage.nom_entreprise}</a> • {selectedStage.emplacement}
        </div>

        <div className="action-buttons">
          <button
            className="btn-apply"
            onClick={() => handeleposutler(selectedStage.offre_id)}
          >
            Postuler maintenant
          </button>
          <button className="btn-icon">
            <Bookmark size={24} />
          </button>
          <button className="btn-icon">
            <Ban size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Stage type badge */}
        <h3 className="section-title">Détails du stage</h3>
        <div style={{ marginBottom: "20px" }}>
          <span className="badge-gray">
            <Building2 size={14} /> {selectedStage.type_de_stage}
          </span>
        </div>

        {/* Stage category */}
        <h3 className="section-title">Catégorie</h3>
        <div className="job-description-text">{selectedStage.stage_categorie}</div>

        {/* Full description */}
        <h3 className="section-title">Description complète</h3>
        <div className="job-description-text">{selectedStage.description}</div>

        {/* Dates and duration */}
        <h3 className="section-title">Détails temporels</h3>
        <div className="job-description-text">
          <p>
            <strong>Date de début:</strong> {selectedStage.date_debut}
          </p>
          <p>
            <strong>Durée (semaines):</strong> {selectedStage.duree_semaines}
          </p>
          <p>
            <strong>Places disponibles:</strong> {selectedStage.nombre_places}
          </p>
          <p>
            <strong>Statut:</strong>{" "}
            <span className={`status ${selectedStage.statut}`}>
              {selectedStage.statut}
            </span>
          </p>
        </div>

        {/* Actions */}
        <button className="selected_job_actions_group">
          <Bookmark
            size={20}
            color="blue"
            strokeWidth={1.5}
            onClick={() => console.log("Bookmark clicked")}
          />
          <Star
            size={20}
            className="text-yellow-500"
            onClick={() => console.log("Star clicked")}
          />
        </button>
        {/* <button className="Cancdidatstage_btn_actions" onClick={() => handeleposutler(selectedStage.offre_id)}>postuler</button> */}
      </div>
    </>
  ) : (
    <p>Select a stage to see details</p>
  )}
</div>


  </div>
</span>


          {/* <span
            className={`UserJobBoard_contentAbout ED_CB_Stages  ${
              ActiveSlider === "ED_CB_Stages" ? "Active" : ""
            }`}
          >
            Mes candidature:

           

    {FetchCandidature && FetchCandidature.length > 0 ? (
  FetchCandidature.map((candidature) => (
    <div key={candidature.candidature_id} className="candidature-card">
      <p><strong>Offre ID:</strong> {candidature.offre_id}</p>
      <p><strong>Status:</strong> {candidature.statut}</p>
      <p><strong>Message:</strong> {candidature.message_motivation}</p>

      {candidature.cv_path && (
        <a
          href={`${BASE_URL}/${candidature.cv_path}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View CV
        </a>
      )}

      <p>
        <small>Applied at: {candidature.created_at}</small>
      </p>

      <div className="UserjobBoard_candidatureactions">
        
        <button
  type="button"
  className={`stage_drop_down ${
    openDropdownId === candidature.candidature_id ? "Active" : ""
  }`}
  onClick={() => toggleDropdown(candidature.candidature_id)}
>
  ...
</button>

        <div
          className={`candidature_actions ${
            openDropdownId === candidature.candidature_id ? "Active" : ""
          }`}
        >
          <button className="cancel_candidature" onClick={() => cancelcanidature(candidature.offre_id)}>cancel candidature</button>
          <button className="candidature_rapport" onClick={() => rapportcandidature(candidature.offre_id)}>rapport</button>
        </div>
      </div>
    </div>
  ))
) : (
  <p>No candidatures found.</p>
)}


          </span> */}

          {/* <span
  className={`UserJobBoard_contentAbout ED_CB_Stages ${
    ActiveSlider === "ED_CB_Stages" ? "Active" : ""
  }`}
>
  Mes candidature:

  <div className="candidatures-container" style={{ display: 'flex', gap: '20px' }}>
   
    <div className="left-panel" style={{ width: '40%', maxHeight: '500px', overflowY: 'auto' }}>
      {FetchCandidature && FetchCandidature.length > 0 ? (
        <div className="candidatures_cards_container">
          {paginatedCandidatures.map((candidature) => (
            <div
              key={candidature.candidature_id}
              className={`candidature-card ${
                selectedCandidature?.candidature_id === candidature.candidature_id ? 'active' : ''
              }`}
              onClick={() => setSelectedCandidature(candidature)}
            >
              <p><strong>Offre ID:</strong> {candidature.offre_id}</p>
              <p><strong>Status:</strong> {candidature.statut}</p>
              <p><strong>Message:</strong> {candidature.message_motivation}</p>
              {candidature.cv_path && (
                <a
                  href={`${BASE_URL}/${candidature.cv_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View CV
                </a>
              )}
              <p><small>Applied at: {candidature.created_at}</small></p>
            </div>
          ))}

          
          {totalPagesCandidatures > 1 && (
            <div className="pagination" style={{ marginTop: '10px' }}>
              {Array.from({ length: totalPagesCandidatures }, (_, idx) => (
                <button
                  key={idx + 1}
                  className={currentPageCandidature === idx + 1 ? 'active' : ''}
                  onClick={() => setCurrentPageCandidature(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>No candidatures found.</p>
      )}
    </div>

   
    <div className="right-panel" style={{ width: '60%', borderLeft: '1px solid #ccc', padding: '10px' }}>
      {selectedCandidature ? (
        <div className="candidature-detail">
          <h2>Candidature Details</h2>
          <p><strong>Offre ID:</strong> {selectedCandidature.offre_id}</p>
          <p><strong>Status:</strong> {selectedCandidature.statut}</p>
          <p><strong>Message:</strong> {selectedCandidature.message_motivation}</p>
          {selectedCandidature.cv_path && (
            <a
              href={`${BASE_URL}/${selectedCandidature.cv_path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View CV
            </a>
          )}
          <p><small>Applied at: {selectedCandidature.created_at}</small></p>

          <div className="UserjobBoard_candidatureactions">
            <button
              className="cancel_candidature"
              onClick={() => cancelcanidature(selectedCandidature.offre_id)}
            >
              Cancel Candidature
            </button>
            <button
              className="candidature_rapport"
              onClick={() => rapportcandidature(selectedCandidature.offre_id)}
            >
              Rapport
            </button>
          </div>
        </div>
      ) : (
        <p>Select a candidature to see details</p>
      )}
    </div>
  </div>
</span> */}

  {/* <span
  className={`UserJobBoard_contentAbout ED_CB_Stages ${
    ActiveSlider === "ED_CB_Stages" ? "Active" : ""
  }`}
>
  Mes candidature:

  <div
    className="candidatures-container"
    style={{ display: "flex", gap: "20px" }}
  >
 
    <div
      className="left-panel"
      style={{ width: "40%", maxHeight: "500px", overflowY: "auto" }}
    >
      {FetchCandidature && FetchCandidature.length > 0 ? (
        <div className="candidatures_cards_container">
          {paginatedCandidatures.map((candidature) => (
            <div
              key={candidature.candidature_id}
              className={`candidature-card ${
                selectedCandidature?.candidature_id ===
                candidature.candidature_id
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedCandidature(candidature)}
            >
              <div className="form-column">
                <div className="form-group">
                  <label className="form-label">Offre ID:</label>
                  <span className="form-control">
                    {candidature.offre_id}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Status:</label>
                  <span className="form-control">
                    {candidature.statut}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Message:</label>
                  <span className="form-control">
                    {candidature.message_motivation}
                  </span>
                </div>

                {candidature.cv_path && (
                  <div className="form-group">
                    <label className="form-label">CV:</label>
                    <a
                      className="form-control"
                      href={`${BASE_URL}/${candidature.cv_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View CV
                    </a>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Applied at:</label>
                  <span className="form-control">
                    {candidature.created_at}
                  </span>
                </div>
              </div>
            </div>
          ))}

          
          {totalPagesCandidatures > 1 && (
            <div className="pagination" style={{ marginTop: "10px" }}>
              {Array.from(
                { length: totalPagesCandidatures },
                (_, idx) => (
                  <button
                    key={idx + 1}
                    className={
                      currentPageCandidature === idx + 1
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPageCandidature(idx + 1)
                    }
                  >
                    {idx + 1}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ) : (
        <p>No candidatures found.</p>
      )}
    </div>

    
    <div
      className="right-panel"
      style={{
        width: "60%",
        borderLeft: "1px solid #ccc",
        padding: "10px",
      }}
    >
      {selectedCandidature ? (
        <div className="candidature-detail form-column">
          <h2>Candidature Details</h2>
           <div className="form-group">
            <label className="form-label">Candidature_id:</label>
            <span className="form-control">
              {selectedCandidature.candidature_id}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Offre ID:</label>
            <span className="form-control">
              {selectedCandidature.offre_id}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Status:</label>
            <span className="form-control">
              {selectedCandidature.statut}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Message:</label>
            <span className="form-control">
              {selectedCandidature.message_motivation}
            </span>
          </div>

          {selectedCandidature.cv_path && (
            <div className="form-group">
              <label className="form-label">CV:</label>
              <a
                className="form-control"
                href={`${BASE_URL}/${selectedCandidature.cv_path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View CV
              </a>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Applied at:</label>
            <span className="form-control">
              {selectedCandidature.created_at}
            </span>
          </div>

          <div className="UserjobBoard_candidatureactions">
            <button
              className="cancel_candidature"
              onClick={() =>
                cancelcanidature(selectedCandidature.offre_id)
              }
            >
              Cancel Candidature
            </button>

            <button
              className="candidature_rapport"
              onClick={() =>
                rapportcandidature(selectedCandidature.offre_id)
              }
            >
              Rapport
            </button>
          </div>
        </div>
      ) : (
        <p>Select a candidature to see details</p>
      )}
    </div>
  </div>
</span> */}
{/* <span
  className={`UserJobBoard_contentAbout ED_CB_Stages ${
    ActiveSlider === "ED_CB_Stages" ? "Active" : ""
  }`}
>
  Mes candidature:

  <div
    className="candidatures-container"
    
  >
    
    <div
      className="left-panel"
      style={{ width: "40%", maxHeight: "500px", overflowY: "auto" }}
    >
      {FetchCandidature && FetchCandidature.length > 0 ? (
        <div className="candidatures_cards_container">
         
          {FetchCandidature.slice(
            (currentPageCandidature - 1) * 3,
            currentPageCandidature * 3
          ).map((candidature) => (
            <div
              key={candidature.candidature_id}
              className={`candidature-card ${
                selectedCandidature?.candidature_id === candidature.candidature_id
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedCandidature(candidature)}
            >
              <div className="form-column">
                <div className="form-group">
                  <label className="form-label">offre_id:</label>
                  <span className="form-control">{candidature.offre_id}</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Status:</label>
                  <span className="form-control">{candidature.statut}</span>
                </div>

               

                <div className="form-group">
                  <label className="form-label">Applied at:</label>
                  <span className="form-control">{candidature.created_at}</span>
                </div>
              </div>
            </div>
          ))}

          
          {Math.ceil(FetchCandidature.length / 3) > 1 && (
            <div className="pagination" style={{ marginTop: "10px" }}>
              {Array.from({ length: Math.ceil(FetchCandidature.length / 3) }, (_, idx) => (
                <button
                  key={idx + 1}
                  className={currentPageCandidature === idx + 1 ? "active" : ""}
                  onClick={() => setCurrentPageCandidature(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>No candidatures found.</p>
      )}
    </div>

    
    <div
      className="right-panel"
      style={{ width: "60%", borderLeft: "1px solid #ccc", padding: "10px" }}
    >
      {selectedCandidature ? (
        <div className="candidature-detail form-column">
          <h2>Candidature Details</h2>

          <div className="form-group">
            <label className="form-label">Candidature ID:</label>
            <span className="form-control">{selectedCandidature.candidature_id}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Offre ID:</label>
            <span className="form-control">{selectedCandidature.offre_id}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Status:</label>
            <span className="form-control">{selectedCandidature.statut}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Message:</label>
            <span className="form-control">{selectedCandidature.message_motivation}</span>
          </div>

          {selectedCandidature.cv_path && (
            <div className="form-group">
              <label className="form-label">CV:</label>
              <a
                className="form-control"
                href={`${BASE_URL}/${selectedCandidature.cv_path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View CV
              </a>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Applied at:</label>
            <span className="form-control">{selectedCandidature.created_at}</span>
          </div>

          <div className="UserjobBoard_candidatureactions">
            <button
              className="cancel_candidature"
              onClick={() => cancelcanidature(selectedCandidature.offre_id)}
            >
              Cancel Candidature
            </button>

            <button
              className="candidature_rapport"
              onClick={() => rapportcandidature(selectedCandidature.offre_id)}
            >
              Rapport
            </button>
          </div>
        </div>
      ) : (
        <p>Select a candidature to see details</p>
      )}
    </div>
  </div>
</span> */}

      <span
  className={`UserJobBoard_contentAbout ED_CB_Stages ${
    ActiveSlider === "ED_CB_Stages" ? "Active" : ""
  }`}
>
  Mes candidatures:

  <div
    className="candidatures-container"
    style={{ display: "flex", gap: "20px" }}
  >
    {/* --- LEFT PANEL: Paginated Candidature List --- */}
    <div
      className="left-panel"
      style={{
        width: "40%",
        maxHeight: "500px",
        overflowY: "auto",
        borderRight: "1px solid #ccc",
        paddingRight: "10px",
      }}
    >
      {FetchCandidature && FetchCandidature.length > 0  ? (
        <div className="candidatures_cards_container">
          {/** Slice 3 per page */}
          {FetchCandidature.slice(
            (currentPageCandidature - 1) * 3,
            currentPageCandidature * 3
          ).map((candidature) => (
            <div
              key={candidature.candidature_id}
              className={`candidature-card ${
                selectedCandidature?.candidature_id === candidature.candidature_id
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedCandidature(candidature)}
              style={{
                cursor: "pointer",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor:
                  selectedCandidature?.candidature_id === candidature.candidature_id
                    ? "#f0f8ff"
                    : "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span><strong>Offre:</strong> {candidature.offre_id}</span>
                <span>{candidature.statut}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
                Applied at: {candidature.created_at}
              </div>
            </div>
          ))}

          {/* Pagination buttons */}
          {Math.ceil(FetchCandidature.length / 3) > 1 && (
            <div
              className="pagination"
              style={{
                marginTop: "10px",
                display: "flex",
                gap: "5px",
                justifyContent: "center",
              }}
            >
              {Array.from({ length: Math.ceil(FetchCandidature.length / 3) }, (_, idx) => (
                <button
                  key={idx + 1}
                  className={currentPageCandidature === idx + 1 ? "active" : ""}
                  onClick={() => setCurrentPageCandidature(idx + 1)}
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    border: currentPageCandidature === idx + 1 ? "2px solid #007bff" : "1px solid #ccc",
                    borderRadius: "3px",
                    backgroundColor: currentPageCandidature === idx + 1 ? "#e6f0ff" : "#fff",
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>No candidatures found.</p>
      )}
    </div>

    {/* --- RIGHT PANEL: Selected Candidature Detail --- */}
    {/* <div
      className="right-panel"
      style={{ width: "60%", padding: "10px" }}
    >
      {selectedCandidature ? (
        <div className="candidature-detail form-column">
          <h2>Candidature Details</h2>

          <div className="form-group">
            <label className="form-label">Candidature ID:</label>
            <span className="form-control">{selectedCandidature.candidature_id}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Offre ID:</label>
            <span className="form-control">{selectedCandidature.offre_id}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Status:</label>
            <span className="form-control">{selectedCandidature.statut}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Message:</label>
            <span className="form-control">{selectedCandidature.message_motivation}</span>
          </div>

          {selectedCandidature.cv_path && (
            <div className="form-group">
              <label className="form-label">CV:</label>
              <a
                className="form-control"
                href={`${BASE_URL}/${selectedCandidature.cv_path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View CV
              </a>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Applied at:</label>
            <span className="form-control">{selectedCandidature.created_at}</span>
          </div>

          <div className="UserjobBoard_candidatureactions">
            <button
              className="cancel_candidature"
              onClick={() => cancelcanidature(selectedCandidature.candidature_id)}
            >
              Cancel Candidature
            </button>

            
          </div>
        </div>
      ) : (
        <p>Select a candidature to see details</p>
      )}
    </div> */}


    <div className="detail-panel right-panel">
  {selectedCandidature ? (
    <>
      {/* Header */}
      <div className="detail-header">
        <h2 className="detail-title">Candidature Details</h2>
        <div className="action-buttons">
          <button
            className="btn-apply"
            onClick={() => cancelcanidature(selectedCandidature.candidature_id)}
          >
            Cancel Candidature
          </button>
          {/* <button
            className="btn-icon"
            onClick={() => rapportcandidature(selectedCandidature.offre_id)}
          >
            Rapport
          </button> */}
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        <h3 className="section-title">Candidature Information</h3>
        <div className="form-group">
          <label className="form-label">Candidature ID:</label>
          <span className="form-control">{selectedCandidature.candidature_id}</span>
        </div>

        <div className="form-group">
          <label className="form-label">Offre ID:</label>
          <span className="form-control">{selectedCandidature.offre_id}</span>
        </div>

        <div className="form-group">
          <label className="form-label">Status:</label>
          <span className="form-control status">{selectedCandidature.statut}</span>
        </div>

        <div className="form-group">
          <label className="form-label">Message:</label>
          <span className="form-control">{selectedCandidature.message_motivation}</span>
        </div>

        {selectedCandidature.cv_path && (
          <div className="form-group">
            <label className="form-label">CV:</label>
            <a
              className="form-control"
              href={`${BASE_URL}/${selectedCandidature.cv_path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View CV
            </a>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Applied at:</label>
          <span className="form-control">{selectedCandidature.created_at}</span>
        </div>
      </div>
    </>
  ) : (
    <p>Select a candidature to see details</p>
  )}
</div>

  </div>
</span>



          <span
            className={`UserJobBoard_contentAbout ED_CB_profile ${
              ActiveSlider === "ED_CB_profile" ? "Active" : ""
            }`}
          >
            Content 4: Profile

            {FetchStagiaire && (
  <div className="profile_card_1">

    {/* NOM */}
    <div className="profile_form_group">
      <label className="profile_form_label">Nom:</label>
      <input
        type="text"
        value={FetchStagiaire.nom || ""}
        placeholder="Entrez votre nom"
        onChange={(e) =>
          setFetchStagiaire(prev => ({ ...prev, nom: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

    {/* PRENOM */}
    <div className="profile_form_group">
      <label className="profile_form_label">Prénom:</label>
      <input
        type="text"
        value={FetchStagiaire.prenom || ""}
        placeholder="Entrez votre prénom"
        onChange={(e) =>
          setFetchStagiaire(prev => ({ ...prev, prenom: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

    {/* CV */}
    <div className="profile_form_group">
      <label className="profile_form_label">CV:</label>

      {FetchStagiaire.cv_path && (
        <div className="existing-file">
          <a
            href={`${BASE_URL}/${FetchStagiaire.cv_path}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 View current CV
          </a>
        </div>
      )}

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="profile_form_control"
        onChange={(e) => setCvFile(e.target.files[0])}
      />

      {cvFile && <p>Selected CV: {cvFile.name}</p>}
    </div>

    {/* PHOTO */}
    <div className="profile_form_group">
      <label className="profile_form_label">Photo:</label>

      {FetchStagiaire.photo_path && (
        <div className="existing-photo">
          <img
            src={`${BASE_URL}/${FetchStagiaire.photo_path}`}
            alt="Profile"
            width="120"
            style={{ borderRadius: "8px" }}
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className="profile_form_control"
        onChange={(e) => setPhotoFile(e.target.files[0])}
      />

      {photoFile && <p>Selected photo: {photoFile.name}</p>}
    </div>

    {/* ACTIONS */}
    <button
      className="submit profile_actions_btn"
      onClick={() => updateStagiairedata(UserId)}
    >
      Update stagiaire data
    </button>

    <button
      type="button"
      className="delete_profile_actions_btn"
      onClick={handleDelete}
    >
      Delete Account
    </button>
  </div>
)}

           {Fetchuser && (
  // <div className="profile_card">
  //   <strong>User ID:</strong> {Fetchuser.user_id} <br />
  //   <strong>Email:</strong> {Fetchuser.email} <br />
  //   <strong>Telephone:</strong> {Fetchuser.telephone} <br />
  //   <strong>Role:</strong> {Fetchuser.role} <br />
  //   <strong>Account Status:</strong> {Fetchuser.account_status} <br />
  //   <strong>Created At:</strong> {Fetchuser.created_at} <br />
  //   <strong>Updated At:</strong> {Fetchuser.updated_at} <br />
  //   <strong>Username:</strong> {Fetchuser.username} <br />
  //     <div className="Candidatprofile_btn_actions">
  //             <button className="modifier profile_actions_btn">modifier</button>
              
  //     </div>
  // </div>

//   <div className="profile_card">
//   <label className="profile_form_label">
//     User ID:
//     <input 
//       className="profile_form_control" 
//       type="text" 
//       value={Fetchuser.user_id} 
//       readOnly 
//     />
//   </label>
  
//   <label className="profile_form_label">
//     Email:
//     <input 
//       className="profile_form_control" 
//       type="email" 
//       value={Fetchuser.email} 
//     />
//   </label>
  
//   <label className="profile_form_label">
//     Telephone:
//     <input 
//       className="profile_form_control" 
//       type="tel" 
//       value={Fetchuser.telephone} 
//     />
//   </label>
  
//   <label className="profile_form_label">
//     Role:
//     <input 
//       className="profile_form_control" 
//       type="text" 
//       value={Fetchuser.role} 
//       readOnly
//     />
//   </label>
  
//   <label className="profile_form_label">
//     Account Status:
//     <input 
//       className="profile_form_control" 
//       type="text" 
//       value={Fetchuser.account_status} 
//       readOnly
//     />
//   </label>
  
//   <label className="profile_form_label">
//     Created At:
//     <input 
//       className="profile_form_control" 
//       type="text" 
//       value={Fetchuser.created_at} 
//       readOnly
//     />
//   </label>
  
//   <label className="profile_form_label">
//     Updated At:
//     <input 
//       className="profile_form_control" 
//       type="text" 
//       value={Fetchuser.updated_at} 
//       readOnly
//     />
//   </label>
  
//   <label className="profile_form_label">
//     Username:
//     <input 
//       className="profile_form_control" 
//       type="text" 
//       value={Fetchuser.username} 
//     />
//   </label>

//   <div className="Candidatprofile_btn_actions">
//     <button className="modifier profile_actions_btn">modifier</button>
//   </div>
// </div>

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
    <label className="profile_form_label">password:</label>
    <input 
      className="profile_form_control" 
      type="password" 
      value={Fetchuser.password} 
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
    <button className="modifier profile_actions_btn" onClick={modifierPassword}>modifier</button>
  </div>
</div>


)}


     

{/* {FetchStagiaire && (
  <div className="profile_card_1">
    <div className="profile_form_group"> 
      <label className="profile_form_label">Nom:</label>
      <input
        type="text"
        value={FetchStagiaire.nom || ""}
        placeholder="Entrez votre nom"
        onChange={(e) =>
          setFetchStagiaire(prev => ({ ...prev, nom: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Prénom:</label>
      <input
        type="text"
        value={FetchStagiaire.prenom || ""}
        placeholder="Entrez votre prénom"
        onChange={(e) =>
          setFetchStagiaire(prev => ({ ...prev, prenom: e.target.value }))
        }
        className="profile_form_control"
      />
    </div>

  

    <div className="profile_form_group">
  <label className="profile_form_label">CV:</label>
  <input
    type="file"
    onChange={(e) => setCvFile(e.target.files[0])} // store actual file
    className="profile_form_control"
  />
</div>

<div className="profile_form_group">
  <label className="profile_form_label">Photo:</label>
  <input
    type="file"
    onChange={(e) => setPhotoFile(e.target.files[0])} // store actual file
    className="profile_form_control"
  />
</div>

     <button className="submit profile_actions_btn"  onClick={() => updateStagiairedata(UserId)}>update stagiaire data</button>
      <button
  type="button"
  className="delete_profile_actions_btn"
  onClick={handleDelete}
>
  Delete Account
</button>
  </div>
)} */}





          </span>
          {/* <span
            className={`UserJobBoard_contentAbout ED_CB_statistiques ${
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

export default UserJobBoard;
