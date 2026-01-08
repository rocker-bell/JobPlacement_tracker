import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageSquare, Bell} from "lucide-react";
import "../Styles/UserJobBoard.css";
import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";
import Logo1 from "../assets/Logo1.svg";
import Profile from "../assets/profile.png";
import Logout from "../assets/Logout.svg"

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

const cancelcanidature = (id) => {
  alert(id)
}

const rapportcandidature = (id) => {
  alert(id)
}

const hanldeJobConnect = () => {
   SliderContentHandler("ED_CB_default")
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
              <MessageSquare size={24} className="nav-icon" />
            
            </li>
            <li className="UserJobBoard_nav_list"><Bell size={24} className="nav-icon" /></li>

              {/* </li> */}
              
              <li
                className="UserJobBoard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_Stages")}
              >
                Candidature
              </li>
              <li
                className="UserJobBoard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_profile")}
              >
                <img src={Profile} alt="" className="UserDashboard_nav_icons"/>
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
    <div className="right-panel">
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

          <span
  className={`UserJobBoard_contentAbout ED_CB_Stages ${
    ActiveSlider === "ED_CB_Stages" ? "Active" : ""
  }`}
>
  Mes candidature:

  <div className="candidatures-container" style={{ display: 'flex', gap: '20px' }}>
    {/* --- LEFT PANEL: Paginated Candidature List --- */}
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

          {/* Pagination */}
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

    {/* --- RIGHT PANEL: Selected Candidature Detail --- */}
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
</span>

          <span
            className={`UserJobBoard_contentAbout ED_CB_profile ${
              ActiveSlider === "ED_CB_profile" ? "Active" : ""
            }`}
          >
            Content 4: Profile
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


     

{FetchStagiaire && (
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
      <button className="delete profile_actions_btn">delete account</button>
  </div>
)}



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
