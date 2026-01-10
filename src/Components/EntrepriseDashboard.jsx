import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/EntrepriseDashboard.css";
import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";
import Logo1 from "../assets/Logo1.svg";
import Profile from "../assets/profile.png";
import Logout from "../assets/Logout.svg"
import {MessageSquare, Bell} from "lucide-react";
import Ajouter from "../assets/Ajouter.gif"
import StatChart from "./StatChart";

const Entreprise_dashboard = () => {
  // State for active slider and mobile screen size
  const [Fetchuser, setFetchuser] = useState(null)
  const [stages, setStages] = useState([]);
  const [UserId, setUserId] = useState(null);
   const [enterpriseId, setenterpriseId] = useState(localStorage.getItem("user_id"));
  const [editingStageId, setEditingStageId] = useState(null);
const [editedStage, setEditedStage] = useState({});
const [logoFile, setLogoFile] = useState(null);


 
  
  
  const [activeStageId, setActiveStageId] = useState(null);

  const [ActiveSlider, setActiveSlider] = useState("ED_CB_default"); 
  const [IsMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [CancelAddStage, setCancelAddStage] = useState(false)
  const [menuActive, setmenuActive] = useState(false);
  const [fetchEntreprise, setFetchEntreprise] = useState()

  const [Showmenu, setShowmenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
    const [FetchEncadrant, setFetchEncadrant] = useState(
    {
  nom: "",
  prenom: "",
  agence_id: "",
  nom_d_agence: "",
  departement: "",
  
}
  );


//   const toggleDropdown = (stageId) => {
//   setActiveStageId(prev => (prev === stageId ? null : stageId));
// };

// const [showMenu, setShowMenu] = useState(false);
// const [timer, setTimer] = useState(null);

//   const handleMouseOver = () => {
//     if (timer) clearTimeout(timer); // Clear any existing timeout
//     setShowMenu(true); // Show the dropdown menu immediately
//   };

//   const handleMouseOut = () => {
//     const newTimer = setTimeout(() => {
//       setShowMenu(false); // Hide the dropdown after 300ms
//     }, 300); // You can adjust the delay here
//     setTimer(newTimer);
//   };

 
const [currentPage, setCurrentPage] = useState(1);

const stagesPerPage = 3;


const indexOfLastStage = currentPage * stagesPerPage;
const indexOfFirstStage = indexOfLastStage - stagesPerPage;

const currentStages = stages.slice(
  indexOfFirstStage,
  indexOfLastStage
);

const totalPages = Math.ceil(stages.length / stagesPerPage);



 const SliderContentHandler = (sliderName) => {
    setActiveSlider(sliderName);
  };

    useEffect(() => {
    if (location.state?.content) {
      SliderContentHandler(location.state.content);
    }
  }, [location.state]);

 


  const [formData, setFormData] = useState({
    entreprise_id: localStorage.getItem("user_id") || "",
    nom_entreprise: "",
    description: "",
    adresse: "",
    logo_path: "",
    site_web: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  

  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form submitted:", formData);
  InsertEnterprise();
  window.location.reload()
  setTimeout(() => {
    SliderContentHandler("ED_CB_profile")
  }, 300)
  
  
};

const handleModifier = (stageId, e) => {
  e.preventDefault();
  setEditingStageId(stageId);

  // Find the stage in the state and set it for editing
  const stageToEdit = stages.find(stage => stage.offre_id === stageId);
  setEditedStage(stageToEdit);
};

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditedStage(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleCancelEditStage = (offre_id, e) => {
  e.preventDefault();

  // Exit edit mode
  setEditingStageId(null);

};


const handleSaveStage = async (stageId, e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${BASE_URL}/update_stage.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editedStage,
        offre_id: stageId,
        entreprise_id: editedStage.entreprise_id
      })
    });

    const result = await response.json();
    if (result.success) {
      alert("Stage mis à jour !");
      setStages(prev =>
        prev.map(stage => stage.offre_id === stageId ? editedStage : stage)
      );
      setEditingStageId(null);
    } else {
      alert("Erreur: " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la mise à jour.");
  }
};



// async function InsertEnterprise() {
//   try {
//     const response = await fetch(`${BASE_URL}/update_entreprise.php`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams(formData) 
//     });

//     if (!response.ok) {
//       console.error("HTTP error:", response.status);
//       return;
//     }

//     const data = await response.json();
//     console.log("Server response:", data.data);
    

//     if (data.success) {
//       alert("Entreprise added successfully!");
//     } else {
//       alert("Error: " + data.message);
//     }
//   } catch (err) {
//     console.error("Fetch error:", err);
//   }
// }


async function InsertEnterprise() {
  try {
    // Create FormData object
    const data = new FormData();
    data.append("entreprise_id", formData.entreprise_id);
    data.append("nom_entreprise", formData.nom_entreprise);
    data.append("description", formData.description);
    data.append("adresse", formData.adresse);
    data.append("site_web", formData.site_web);

    // Only append logo if a new file is selected
    if (logoFile) {
      data.append("logo", logoFile);
    }

    const response = await fetch(`${BASE_URL}/update_entreprise.php`, {
      method: "POST",
      body: data, // <-- send FormData directly
    });

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return;
    }

    const result = await response.json();
    console.log("Server response:", result);

    if (result.success) {
      alert("Entreprise updated successfully!");
      // Optionally, update the UI immediately
      if (result.logo_path) {
        setFetchEntreprise(prev => ({ ...prev, logo_path: result.logo_path }));
      }
    } else {
      alert("Error: " + result.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}


const fetchentreprise = async (userId) => {
  const response = await fetch("http://localhost:8000/fetch_enterprise.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId, // 👈 ONLY this
    }),
  });

  const data = await response.json();

  if (data.success) {
    setFetchEntreprise(data.data);
  } else {
    setFetchEntreprise(null);
  }
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


  // fetch user
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



  // Function to handle the slider change
 
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/")
  }


  useEffect(() => {
  if (fetchEntreprise) {
    setFormData({
      entreprise_id: fetchEntreprise.entreprise_id,
      nom_entreprise: fetchEntreprise.nom_entreprise ?? "",
      description: fetchEntreprise.description ?? "",
      adresse: fetchEntreprise.adresse ?? "",
      site_web: fetchEntreprise.site_web ?? "",
    });
  }
}, [fetchEntreprise]);




useEffect(() => {
  async function fetchStages() {
    if (!enterpriseId) return; // safety check

    try {
      const response = await fetch(`${BASE_URL}/stage_fetch.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ entreprise_id: enterpriseId }) // MUST match PHP
      });

      const data = await response.json();
      if (data.success) {
        setStages(data.stages);
      } else {
        console.error("Fetch stages error:", data.message);
      }
    } catch (err) {
      console.error("Network or parsing error:", err);
    }
  }

  fetchStages();
}, [enterpriseId]);


 const handleSubmitStage = async (e) => {
  e.preventDefault();


   if (Fetchuser.account_status !== "Verified") {
    alert("Please complete your account activation to submit a stage.");
    SliderContentHandler("ED_CB_profile"); // redirect to profile
    return; // stop further execution
  }


 

  const form = e.currentTarget;
  const typeStage = form.elements["type_stage"].value.trim();
  const categorieStage = form.elements["categorie_stage"].value.trim();
  const emplacement = form.elements["emplacement"].value.trim();
  const nombrePlace = form.elements["nombre_place"].value.trim();
  const debutStage = form.elements["debut_stage"].value.trim();
  const dureeStage = form.elements["duree_semaines"].value.trim();
  const titreStage = form.elements["titre_stage"].value.trim();
  const descriptionStage = form.elements["description_stage"].value.trim();
  const competencesRequises = form.elements["competence_requise"].value.trim();


    const entreprise_id = localStorage.getItem("user_id")
  const stageInfo = {
     entreprise_id: entreprise_id,
      typeStage,
      categorieStage,
      emplacement,
      nombrePlace,
      debutStage,
      dureeStage,
      titreStage,
      descriptionStage,
      competencesRequises
  }

  console.log(stageInfo)

  // Validate form fields
  if (!typeStage || !categorieStage || !emplacement || !nombrePlace || !debutStage || !dureeStage || !titreStage || !descriptionStage || !competencesRequises) {
    return alert("All fields are required!");
  }

  try {
    const res = await fetch("http://localhost:8000/handle_stage.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        entreprise_id:  entreprise_id,
        type_stage: typeStage,
        titre_stage: titreStage,
        categorie_stage: categorieStage,
        description_stage: descriptionStage,
        competence_requise: competencesRequises,
        debut_stage: debutStage,
        duree_semaines: dureeStage,
        emplacement: emplacement,
        nombre_place: nombrePlace,
        
        
        
       // Pass entreprise_id (or fetch dynamically)
      }),
    });

    
    const data = await res.json();
    if (data.success) {
      alert("Stage added successfully!");

      // Optionally, clear the form or redirect
      setCancelAddStage(true)
      window.location.reload()
      SliderContentHandler("ED_CB_Stages");


    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
};


  const handleCancel = () => {
    setCancelAddStage(true)
     setTimeout(() => setActiveSlider("ED_CB_default"), 500);

     setTimeout(() => setCancelAddStage(false), 500)

  }


  const handleClickMenu = () => {
    setmenuActive(true);

    setTimeout(() => {
        setmenuActive(false)
    }, 3000)
    

  }

   const handleMouseEnter = (id) => {
    setActiveStageId(id);  // Show dropdown
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setActiveStageId(false);  
    }, 5000);
     // Hide dropdown
  };



  const actions = [
    { name: "Modifier", className: "modifier" },
    { name: "Remove", className: "delete" },
    { name: "Candidature", className: "candidature" },
    { name: "Encadrants", className: "encadrant" },
    { name: "Rapport", className: "rapport" }
  ];




const handleCandidature = (id, e) => {
  e.preventDefault();
  alert("Candidature " + id);
  navigate(`/Candidatures/${id}`)
};

const handleRapport = (id, e) => {
  e.preventDefault();
  alert("Rapport " + id);
  navigate(`/Rapports/${id}`)
};

const handleEncadrants = (id, e) => {
  e.preventDefault();
  alert("Encadrant " + id);
  navigate(`/Encadrant/${id}`)
};




const handleSupprimer = async (id, enterpriseId, e) => {
  e.preventDefault(); // optional for button

  const confirmDelete = window.confirm("Supprimer le stage " + id + " ?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${BASE_URL}/delete_stage.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({
        entreprise_id: enterpriseId,
        stage_id: id
      })
    });

    const res = await response.json();

    if (res.success) {
      alert(`Stage avec ID ${id} supprimé avec succès`);
      // Update local state instead of reloading
      setStages((prev) => prev.filter(stage => stage.offre_id !== id));
      SliderContentHandler("ED_CB_Stages");
    } else {
      alert("Erreur: " + res.message);
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur lors de la suppression du stage");
  }
};


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


 useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    setUserId(user_id);
    setenterpriseId(user_id)

    if (user_id) {
      FetchuserData(user_id); // actually call the function
      fetchentreprise(user_id)
      
    }
  }, []);


const [dashboardStats, setDashboardStats] = useState({
  encadrants_count: 0,
  active_stages: 0,
  applicants_count: 0,
  ratio: 0
});

useEffect(() => {
  if (!enterpriseId) return;

  async function fetchStats() {
    try {
      const res = await fetch(`http://localhost:8000/dashboard_stats_entreprise.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ entreprise_id: enterpriseId }) // <-- French key
      });
      const data = await res.json();
      if (data.success) setDashboardStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }

  fetchStats();
}, [enterpriseId]);



 
  const modifierPassword = () => {
    navigate('/AccountRecovery')
  }




  return (
    <div className="EntrepriseDashboard_wrapper">
      <div className="EntrepiriseDashboard_container">
        <div className="EntrepiriseDashboard_sideNav">
          <nav >
              <div className="logo_actions_group">
                           
                            <img src={Logo1} alt="" className="jobconnectlogo" onClick={hanldeJobConnect} />
                            <img src={menu} alt="" className={`dropdown_menu_logo ${Showmenu ? "mobile" : ""} ${menuActive ? "Active" : ""}`} onClick={handleClickMenu}/>
                            <img src={menu_active} alt="" className={`menu_active ${menuActive ? "Active" : ""}`} />
                        </div>
            <ul className={`EntrepiriseDashboard_navLists ${IsMobile ? "mobile" : ""} ${menuActive ? "Active" : ""}`}>
              {/* On click of each nav item, change the active slider */}
               <li className="EntrepiriseDashboard_nav_list">
              <MessageSquare size={24} className="EntrepriseDashboard_nav_icons" />
            
            </li>
            <li className="EntrepiriseDashboard_nav_list"><Bell size={24} className="EntrepriseDashboard_nav_icons" /></li>
              <li
                className="EntrepiriseDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_addStage")}
              >
                <img src={Ajouter} alt=""  className="EntrepriseDashboard_nav_icons" />
              </li>
              <li
                className="EntrepiriseDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_Stages")}
              >
                <img className="EntrepriseDashboard_nav_icons" src="https://img.icons8.com/wired/64/lawyer.png" alt="lawyer"/>
              </li>
              <li
                className="EntrepiriseDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_profile")}
              >
                {/* <img src={Profile} alt="" className="EntrepriseDashboard_nav_icons"/> */}
                <img  src="https://img.icons8.com/3d-fluency/94/resume.png" className="EntrepriseDashboard_nav_icons" alt="resume"/>
              </li>
              <li
                className="EntrepiriseDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_statistiques")}
              >
                statistique
              </li>
              <li  className="EntrepiriseDashboard_nav_list" onClick={handleLogout}>
                <img src={Logout} alt="" className="EntrepriseDashboard_nav_icons" />
                
                </li>
            </ul>
          </nav>
        </div>

        <div className="EntrepiriseDashboard_NavContentSlider">
          {/* Dynamically toggle content based on the active slider */}
          <span
            className={`EntrepiriseDashboard_contentAbout ED_CB_default ${
              ActiveSlider === "ED_CB_default" ? "Active" : ""
            }`}
          >
            Content 1: Default
             Welcome to your Entreprise Dashboard 
              {/* how many encadrants - how many active stages - how many applicants - ratio */}
              {/* <div className="general_statistique">
  <div className="statistique_card">
    <h3>Encadrants</h3>
    <p>{dashboardStats.encadrants_count}</p>
  </div>
  <div className="statistique_card">
    <h3>Active Stages</h3>
    <p>{dashboardStats.active_stages}</p>
  </div>
  <div className="statistique_card">
    <h3>Applicants</h3>
    <p>{dashboardStats.applicants_count}</p>
  </div>
  <div className="statistique_card">
    <h3>Applicants per Stage</h3>
    <p>{dashboardStats.ratio}</p>
  </div>
</div> */}
          {/* <div className="general_statistique">
  <div className="statistique_card">
    <h3 className="statisque_card_title">Encadrants</h3>
    <p className="statistique_card_mesure">{dashboardStats.encadrants_count}</p>
  </div>
  <div className="statistique_card">
    <h3>Active Stages</h3>
    <p>{dashboardStats.active_stages}</p>
  </div>
  <div className="statistique_card">
    <h3>Applicants</h3>
    <p>{dashboardStats.applicants_count}</p>
  </div>
  <div className="statistique_card">
    <h3>Applicants per Stage</h3>
    <p>{dashboardStats.ratio}</p>
  </div>
</div> */}

<div className="general_statistique">
      <StatChart
        title="Encadrants"
        value={dashboardStats.encadrants_count}
        color="#4CAF50"
      />

      <StatChart
        title="Active Stages"
        value={dashboardStats.active_stages}
        color="#2196F3"
      />

      <StatChart
        title="Applicants"
        value={dashboardStats.applicants_count}
        color="#FF9800"
      />

      <StatChart
        title="Applicants / Stage"
        value={dashboardStats.ratio}
        color="#9C27B0"
      />
    </div>


          </span>
          <span
            className={`EntrepiriseDashboard_contentAbout ED_CB_addStage ${
              ActiveSlider === "ED_CB_addStage" ? "Active" : ""
            }`}
          >
            Content 2: Ajouter Stage

                    <div className={`ED_stage_form_wrapper ${CancelAddStage ? "cancel" : ""}`}>
  <form className="ED_stage_form" onSubmit={handleSubmitStage}>

    <div className="ED_stage_form_formGroupe">
      <label className="ED_stage_form_label">Type de stage</label>
      <textarea name="type_stage" className="ED_stage_form_control" />
    </div>

    <div className="ED_stage_form_formGroupe">
      <label className="ED_stage_form_label">Catégorie</label>
      <textarea name="categorie_stage" className="ED_stage_form_control" />
    </div>

    <div className="ED_stage_form_formGroupe">
      <label className="ED_stage_form_label">Emplacement</label>
      <input name="emplacement" type="text" className="ED_stage_form_control" />
    </div>

    <div className="ED_stage_form_formGroupe">
      <label className="ED_stage_form_label">Nombre de places</label>
      <input name="nombre_place" type="number" className="ED_stage_form_control" />
    </div>

    <div className="ED_stage_form_formGroupe">
      <label className="ED_stage_form_label">Début du stage</label>
      <input name="debut_stage" type="date" className="ED_stage_form_control" />
    </div>

    <div className="ED_stage_form_formGroupe">
      <label className="ED_stage_form_label">Durée du stage</label>
      <input name="duree_semaines" type="text" className="ED_stage_form_control" />
    </div>

    <div className="ED_stage_form_formGroupe">
      <label className="ED_stage_form_label">Titre du stage</label>
      <input name="titre_stage" type="text" className="ED_stage_form_control" />
    </div>

    <div className="ED_stage_form_formGroupe">
      <label className="ED_stage_form_label">Description</label>
      <textarea name="description_stage" className="ED_stage_form_control" />
    </div>

    <div className="ED_stage_form_formGroupe">
      <label className="ED_stage_form_label">Compétences requises</label>
      <textarea name="competence_requise" className="ED_stage_form_control" />
    </div>

    <div className="ED_stage_form_btn_group">
      
      <button type="submit" className="submit-stage">
        <img className="EntrepriseDashboard_nav_icons"  src="https://img.icons8.com/color/48/submit-progress--v1.png" alt="submit-progress--v1"/>
      </button>
      <button type="button" onClick={handleCancel} className="cancel-stage">Cancel</button>
    </div>

  </form>
</div>

          </span>
          <span
            className={`EntrepiriseDashboard_contentAbout ED_CB_Stages ${
              ActiveSlider === "ED_CB_Stages" ? "Active" : ""
            }`}
          >
           


                            <div className="stage-section">
                
                                      {currentStages.map(stage => (
                                <form key={stage.offre_id} className="stage-form">
                                  <div className="ED_stage_form_formGroupe_stage">
                                    <label className="ED_stage_form_label">stage id:</label>
                                    <input
                                      className="ED_stage_form_control"
                                      type="text"
                                      name="type_de_stage"
                                      value={editingStageId === stage.offre_id ? editedStage.offre_id : stage.offre_id}
                                      readOnly

                                      onChange={handleEditChange}
                                    />
                                  </div>
                                  <div className="ED_stage_form_formGroupe_stage">
                                    <label className="ED_stage_form_label">Type de Stage:</label>
                                    <input
                                      className="ED_stage_form_control"
                                      type="text"
                                      name="type_de_stage"
                                      value={editingStageId === stage.offre_id ? editedStage.type_de_stage : stage.type_de_stage}
                                      readOnly={editingStageId !== stage.offre_id}
                                      onChange={handleEditChange}
                                    />
                                  </div>

                                  <div className="ED_stage_form_formGroupe_stage">
                                    <label className="ED_stage_form_label">Catégorie:</label>
                                    <input
                                    className="ED_stage_form_control"
                                      type="text"
                                      name="stage_categorie"
                                      value={editingStageId === stage.offre_id ? editedStage.stage_categorie : stage.stage_categorie}
                                      readOnly={editingStageId !== stage.offre_id}
                                      onChange={handleEditChange}
                                    />
                                  </div>

                                  <div className="ED_stage_form_formGroupe_stage">
                                    <label className="ED_stage_form_label">Titre:</label>
                                    <input
                                      className="ED_stage_form_control"
                                      type="text"
                                      name="titre"
                                      value={editingStageId === stage.offre_id ? editedStage.titre : stage.titre}
                                      readOnly={editingStageId !== stage.offre_id}
                                      onChange={handleEditChange}
                                    />
                                  </div>

                                  <div className="ED_stage_form_formGroupe_stage">
                                    <label className="ED_stage_form_label">Description:</label>
                                    <textarea
                                    className="ED_stage_form_control"
                                      name="description"
                                      value={editingStageId === stage.offre_id ? editedStage.description : stage.description}
                                      readOnly={editingStageId !== stage.offre_id}
                                      onChange={handleEditChange}
                                    />
                                  </div>

                                  <div className="ED_stage_form_formGroupe_stage">
                              <label className="ED_stage_form_label">Compétences requises:</label>
                              <textarea
                              className="ED_stage_form_control"
                                name="competences_requises"
                                value={editingStageId === stage.offre_id ? editedStage.competences_requises : stage.competences_requises}
                                readOnly={editingStageId !== stage.offre_id}
                                onChange={handleEditChange}
                              />
                            </div>

                            <div className="ED_stage_form_formGroupe_stage">
                              <label className="ED_stage_form_label">Date début:</label>
                              <input
                              className="ED_stage_form_control"
                                type="date"
                                name="date_debut"
                                value={editingStageId === stage.offre_id ? editedStage.date_debut : stage.date_debut}
                                readOnly={editingStageId !== stage.offre_id}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="ED_stage_form_formGroupe_stage">
                              <label className="ED_stage_form_label">duree_semaines:</label>
                              {/* <input
                                className="ED_stage_form_control"
                                type="number"
                                name="dduree_semaines"
                                value={editingStageId === stage.offre_id ? editedStage.duree_semaines : stage.duree_semaines}
                                readOnly={editingStageId !== stage.offre_id}
                                onChange={handleEditChange}
                              /> */}
                              <input
  className="ED_stage_form_control"
  type="number"
  name="duree_semaines"
  value={editingStageId === stage.offre_id ? editedStage.duree_semaines : stage.duree_semaines}
  readOnly={editingStageId !== stage.offre_id} // only read-only if not editing
  onChange={handleEditChange}
/>

                            </div>

                            <div className="ED_stage_form_formGroupe_stage">
                              <label className="ED_stage_form_label">nombre_places:</label>
                              <input
                                className="ED_stage_form_control"
                                type="number"
                                name="nombre_places"
                                value={editingStageId === stage.offre_id ? editedStage.nombre_places : stage.nombre_places}
                                readOnly={editingStageId !== stage.offre_id}
                                onChange={handleEditChange}
                              />
                            </div>

                            <div className="ED_stage_form_formGroupe_stage">
                              <label className="ED_stage_form_label">emplacement:</label>
                              <input
                                className="ED_stage_form_control"
                                type="text"
                                name="emplacement"
                                value={editingStageId === stage.offre_id ? editedStage.emplacement  : stage.emplacement }
                                readOnly={editingStageId !== stage.offre_id}
                                onChange={handleEditChange}
                              />
                            </div>

                            <div className="ED_stage_form_formGroupe_stage">
                              <label className="ED_stage_form_label">Statut:</label>
                              <select
                                className="ED_stage_form_control"
                                name="statut"
                                value={editingStageId === stage.offre_id ? editedStage.statut : stage.statut}
                                disabled={editingStageId !== stage.offre_id}
                                onChange={handleEditChange}
                              >
                                <option value="Ouverte">Ouverte</option>
                                <option value="Fermée">Fermée</option>
                                <option value="Expirée">Expirée</option>
                              </select>
                            </div>

                                        {editingStageId === stage.offre_id && (
                              <div className="stages_stage_btn_actions">
                                <button
                                  type="button"
                                  onClick={(e) => handleSaveStage(stage.offre_id, e)}
                                >
                                  Sauvegarder
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => handleCancelEditStage(stage.offre_id, e)}
                                >
                                  Annuler
                                </button>
                              </div>
                            )}


                                  <div className="stage_action_dropdown_container">
                                    <button
                                      type="button"
                                      className={`stage_action_dropdown ${activeStageId === stage.offre_id ? "ActiveStageAction" : ""}`}
                                      onMouseEnter={() => handleMouseEnter(stage.offre_id)}
                                      onMouseLeave={handleMouseLeave}
                                    >
                                      Actions
                                    </button>
                                    <div className={`stage_actions ${activeStageId === stage.offre_id ? "show" : "hidden"}`}>
                                      <button className="modifier" onClick={(e) => handleModifier(stage.offre_id, e)}>Modifier</button>
                                      <button className="delete" onClick={(e) => handleSupprimer(stage.offre_id, stage.entreprise_id, e)}>Supprimer</button>
                                      <button className="candidature" onClick={(e) => handleCandidature(stage.offre_id, e)}>Candidature</button>
                                      <button className="encadrant" onClick={(e) => handleEncadrants(stage.offre_id, e)}>Encadrants</button>
                                      <button className="rapport" onClick={(e) => handleRapport(stage.offre_id, e)}>Rapport</button>
                                    </div>
                                  </div>

                                  {/* <div className="stage_action_dropdown_container">
  <button
    className="stage_action_dropdown"
    onClick={() => toggleDropdown(stage.offre_id)}
  >
    Actions
  </button>

  <div className={`stage_actions ${activeStageId === stage.offre_id ? "show" : "hidden"}`}>
    <button className="modifier" onClick={(e) => handleModifier(stage.offre_id, e)}>Modifier</button>
    <button className="delete" onClick={(e) => handleSupprimer(stage.offre_id, stage.entreprise_id, e)}>Supprimer</button>
    <button className="candidature" onClick={(e) => handleCandidature(stage.offre_id, e)}>Candidature</button>
    <button className="encadrant" onClick={(e) => handleEncadrants(stage.offre_id, e)}>Encadrants</button>
    <button className="rapport" onClick={(e) => handleRapport(stage.offre_id, e)}>Rapport</button>
  </div>
</div> */}
                                          {/* <div
      className="stage_action_dropdown_container"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <button className="stage_action_dropdown">
        Actions
      </button>

      <div className={`stage_actions ${showMenu ? "show" : "hidden"}`}>
        <button className="modifier" onClick={(e) => handleModifier(stage.offre_id, e)}>
          Modifier
        </button>
        <button className="delete" onClick={(e) => handleSupprimer(stage.offre_id, stage.entreprise_id, e)}>
          Supprimer
        </button>
        <button className="candidature" onClick={(e) => handleCandidature(stage.offre_id, e)}>
          Candidature
        </button>
        <button className="encadrant" onClick={(e) => handleEncadrants(stage.offre_id, e)}>
          Encadrants
        </button>
        <button className="rapport" onClick={(e) => handleRapport(stage.offre_id, e)}>
          Rapport
        </button>
      </div>
    </div> */}
                                </form>
                              ))}

                                  {/* <div className="page_navigation">page navigation</div> */}

                                 

                                  
                            </div>
                             <div className="page_navigation">
                              <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                              >
                                Prev
                              </button>

                              {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                  key={i}
                                  className={`pagination_btns ${currentPage === i + 1 ? "active" : ""}`}
                                  onClick={() => setCurrentPage(i + 1)}
                                >
                                  {i + 1}
                                </button>
                              ))}

                              <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                              >
                                Next
                              </button>
                            </div>
          </span>


       

          

                  <span
                    className={`EntrepiriseDashboard_contentAbout ED_CB_profile ${
                      ActiveSlider === "ED_CB_profile" ? "Active" : ""
                    }`}
                  >
                    Content 4: Profile
                    <div>

                       {fetchEntreprise && (
  <>
    <div className="profile_form_group">
  <label className="profile_form_label">Logo:</label>

  {/* Show existing logo */}
  {fetchEntreprise.logo_path && !logoFile && (
    <div className="existing-file">
      <img
        src={`${BASE_URL}/${fetchEntreprise.logo_path}`}
        alt="Entreprise Logo"
        width="120"
        style={{ borderRadius: "8px" }}
      />
    </div>
  )}

  {/* File input for new logo */}
  <input
    type="file"
    accept="image/*"
    className="profile_form_control"
    onChange={(e) => setLogoFile(e.target.files[0])} // store the new file
  />

  {/* Show selected file name */}
  {logoFile && <p>Selected file: {logoFile.name}</p>}
</div>
    <div className="profile_form_group">
      <label className="profile_form_label">Entreprise ID:</label>
      <input
        type="text"
        name="entreprise_id"
        value={formData.entreprise_id}
        readOnly
        placeholder={`${UserId}`}
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Nom Entreprise:</label>
      <input
        type="text"
        name="nom_entreprise"
        value={formData.nom_entreprise}
        onChange={handleChange}
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Adresse:</label>
      <input
        type="text"
        name="adresse"
        value={formData.adresse}
        onChange={handleChange}
        className="profile_form_control"
      />
    </div>

    <div className="profile_form_group">
      <label className="profile_form_label">Site Web:</label>
      <input
        type="text"
        name="site_web"
        value={formData.site_web}
        onChange={handleChange}
        className="profile_form_control"
      />
    </div>

    {/* Company Logo */}
    


    {/* Company Document (Optional) */}
    {/* <div className="profile_form_group">
      <label className="profile_form_label">Document:</label>

      {fetchEntreprise.document_path && (
        <div className="existing-file">
          <a
            href={`${BASE_URL}/{fetchEntreprise.document_path}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 View current document
          </a>
        </div>
      )}

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="profile_form_control"
        onChange={(e) => setDocumentFile(e.target.files[0])} // store the new document
      />

      {documentFile && <p>Selected file: {documentFile.name}</p>}
    </div> */}
  </>
)}
                      
              {Fetchuser ? (
          <form onSubmit={handleSubmit} className="profile_form">

            <div className="profile_user_info">
              <div className="profile_form_group">
                <label className="profile_form_label">User ID:</label>
                <input
                  type="text"
                  value={Fetchuser?.user_id || ""}
                  readOnly
                  className="profile_form_control"
                />
              </div>

              <div className="profile_form_group">
                <label className="profile_form_label">Email:</label>
                <input
                  type="text"
                  value={Fetchuser?.email || ""}
                  readOnly
                  className="profile_form_control"
                />
              </div>

              <div className="profile_form_group form-group-password">
    <label className="profile_form_label">password:</label>
    <input 
      className="profile_form_control"  
      type="password" 
      value={Fetchuser.password} 
    />
    <img className="EntrepriseDashboard_nav_icons nav_icon_password" src="https://img.icons8.com/ios-glyphs/30/create-new.png" alt="create-new" onClick={modifierPassword}/>
  </div>

              <div className="profile_form_group">
                <label className="profile_form_label">Telephone:</label>
                <input
                  type="text"
                  value={Fetchuser?.telephone || ""}
                  readOnly
                  className="profile_form_control"
                />
              </div>

              <div className="profile_form_group">
                <label className="profile_form_label">Role:</label>
                <input
                  type="text"
                  value={Fetchuser?.role || ""}
                  readOnly
                  className="profile_form_control"
                />
              </div>

              <div className="profile_form_group">
                <label className="profile_form_label">Account Status:</label>
                <input
                  type="text"
                  value={Fetchuser?.account_status || ""}
                  readOnly
                  className="profile_form_control"
                />
              </div>

              <div className="profile_form_group">
                <label className="profile_form_label">Created At:</label>
                <input
                  type="text"
                  value={Fetchuser?.created_at || ""}
                  readOnly
                  className="profile_form_control"
                />
              </div>

              <div className="profile_form_group">
                <label className="profile_form_label">Updated At:</label>
                <input
                  type="text"
                  value={Fetchuser?.updated_at || ""}
                  readOnly
                  className="profile_form_control"
                />
              </div>

              <div className="profile_form_group">
                <label className="profile_form_label">Username:</label>
                <input
                  type="text"
                  value={Fetchuser?.username || ""}
                  readOnly
                  className="profile_form_control"
                />
              </div>
            </div>

            {/* Editable Entreprise Info */}
            
            {/* {fetchEntreprise ? (
              <>
                <div className="profile_form_group">
                  <label className="profile_form_label">Entreprise ID:</label>
                  <input
                    type="text"
                    name="entreprise_id"
                    value={formData.entreprise_id}
                    readOnly
                    placeholder={`${UserId}`}
                    className="profile_form_control"
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Nom Entreprise:</label>
                  <input
                    type="text"
                    name="nom_entreprise"
                    value={formData.nom_entreprise}
                    onChange={handleChange}
                    className="profile_form_control"
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="profile_form_control"
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Adresse:</label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="profile_form_control"
                  />
                </div>

                <div className="profile_form_group">
                  <label className="profile_form_label">Site Web:</label>
                  <input
                    type="text"
                    name="site_web"
                    value={formData.site_web}
                    onChange={handleChange}
                    className="profile_form_control"
                  />
                </div>
              </>
            ) : null} */}

           


            <button type="submit" className="profile_form_submit_entreprise">Submit account data</button>
            {/* <button type="update" className="profile_form_submit_entreprise">update</button> */}
          </form>
        ) : (
          <p>Loading user data...</p>
        )}
                <button className="btn_delete_account" onClick={handleDelete}>delete account</button>

                    </div>
                  </span>
          <span
            className={`EntrepiriseDashboard_contentAbout ED_CB_statistiques ${
              ActiveSlider === "ED_CB_statistiques" ? "Active" : ""
            }`}
          >
            Content 5: Statistiques
          </span>

          
        </div>
      </div>

      <footer>copyrights</footer>
    </div>
  );
};

export default Entreprise_dashboard;
