// import { useState, useEffect } from "react";
// import "../Styles/EntrepriseDashboard.css";


// const Entreprise_dashboard = () => {

//     const [ActiveSlider, setActiveSlider] = useState(null)
//     const [IsMobile, setIsMobile] = useState(window.innerWidth < 786);
    

//         useEffect(() => {
//   const handleResize = () => {
//     const mobile = window.innerWidth < 768;
//     setIsMobile(mobile);

//     // close menu when switching to desktop
//     if (!mobile) setShowMenu(false);
//   };

//   window.addEventListener("resize", handleResize);
//   handleResize();

//   return () => window.removeEventListener("resize", handleResize);
// }, []);

// const SliderContentHandler = () => {

// }
   
//     return (
//         <>
//             <div className="EntrepriseDashboard_wrapper">
                
//                 <div className="EntrepiriseDashboard_container">
//                     <div className="EntrepiriseDashboard_sideNav">
//                         <nav>
//                             <ul className="EntrepiriseDashboard_navLists">
//                                 <li className="EntrepiriseDashboard_nav_list" onClick={SliderContentHandler}>ajouter stage</li>
//                                 <li className="EntrepiriseDashboard_nav_list" onClick={SliderContentHandler}>stages</li>
//                                 <li className="EntrepiriseDashboard_nav_list" onClick={SliderContentHandler}>profile</li>
//                                 <li className="EntrepiriseDashboard_nav_list" onClick={SliderContentHandler}>logout</li>
//                             </ul>
//                         </nav>

//                     </div>

//                     <div className="EntrepiriseDashboard_NavContentSlider"> 
                                
//                             <span className={`EntrepiriseDashboard_contentAbout ED_CB_default  {${ActiveSlider} ? "Active" : ""}`}>content1 default</span>
//                             <span className={`EntrepiriseDashboard_contentAbout ED_CB_addStage`}>content2</span>
//                             <span className={`EntrepiriseDashboard_contentAbout ED_CB_Stages`}>content3</span>
//                             <span className={`EntrepiriseDashboard_contentAbout ED_CB_profile`}>content4</span>
//                             <span className={`EntrepiriseDashboard_contentAbout ED_CB_statistiques`}>content5</span>
                    
//                     </div>

                    
//                 </div>

//                 <footer>
//                                 copyrights
//                 </footer>
                
//             </div>
//         </>
//     )
// }

// export default Entreprise_dashboard;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/EntrepriseDashboard.css";
import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";
import Logo1 from "../assets/Logo1.svg"

const Entreprise_dashboard = () => {
  // State for active slider and mobile screen size
  const [Fetchuser, setFetchuser] = useState(null)
  const [stages, setStages] = useState([]);
  const [UserId, setUserId] = useState(null);
  const [enterpriseId, setenterpriseId] = useState(localStorage.getItem("user_id"));
  // const [ActiveStageAction, setActiveStageAction] = useState(false);
  const [activeStageId, setActiveStageId] = useState(null);

  const [ActiveSlider, setActiveSlider] = useState("ED_CB_default"); // Set default slider
  const [IsMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [CancelAddStage, setCancelAddStage] = useState(false)
  const [menuActive, setmenuActive] = useState(false);

  const [Showmenu, setShowmenu] = useState(false);
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    entreprise_id: localStorage.getItem("user_id") || "",
    nom_entreprise: "",
    description: "",
    adresse: "",
    // logo_path: "",
    site_web: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", formData);
  //   // send formData to backend
  // };

  // async function InsertEnterprise() {
  //   const response = await fetch(`${BASE_URL}/add_entreprise.php`, {
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/x-www-form-urlencoded", // must match PHP POST
  //       },
  //       body : formData
  //   })

  //    if (!response.ok) {
  //       console.error("HTTP error:", response.status);
  //       return;
  //     }

  // }


  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form submitted:", formData);
  InsertEnterprise();
};

async function InsertEnterprise() {
  try {
    const response = await fetch(`${BASE_URL}/add_entreprise.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData) // <-- encode formData
    });

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return;
    }

    const data = await response.json();
    console.log("Server response:", data);

    if (data.success) {
      alert("Entreprise added successfully!");
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}


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

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    setUserId(user_id);
    setenterpriseId(user_id)

    if (user_id) {
      FetchuserData(user_id); // actually call the function
    }
  }, []);


  // Function to handle the slider change
  const SliderContentHandler = (sliderName) => {
    setActiveSlider(sliderName);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/JobBoard")
  }

// fetch all stages
// useEffect(() => {
//     async function fetchStages() {
//       try {
//         const response = await fetch(`${BASE_URL}/fetch_stage.php`);
//         const data = await response.json();
//         if (data.success) {
//           setStages(data.stages);
//         } else {
//           console.error(data.message);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     }

//     fetchStages();
//   }, []);

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

  const form = e.target;
  const typeStage = form.elements["type_stage"].value.trim();
  const categorieStage = form.elements["categorie_stage"].value.trim();
  const emplacement = form.elements["emplacement"].value.trim();
  const nombrePlace = form.elements["nombre_place"].value.trim();
  const debutStage = form.elements["debut_stage"].value.trim();
  const dureeStage = form.elements["durre_stage"].value.trim();
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
        durre_stage: dureeStage,
        emplacement: emplacement,
        nombre_place: nombrePlace,
        
        
        
       // Pass entreprise_id (or fetch dynamically)
      }),
    });

    
    const data = await res.json();
    if (data.success) {
      alert("Stage added successfully!");
      // Optionally, clear the form or redirect
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
    }, 3000);
     // Hide dropdown
  };



  const actions = [
    { name: "Modifier", className: "modifier" },
    { name: "Remove", className: "delete" },
    { name: "Candidature", className: "candidature" },
    { name: "Encadrants", className: "encadrant" },
    { name: "Rapport", className: "rapport" }
  ];


  const handleModifier = (id, e) => {
  e.preventDefault();
  alert("Modifier " + id);
};

const handleCandidature = (id, e) => {
  e.preventDefault();
  alert("Candidature " + id);
};

const handleRapport = (id, e) => {
  e.preventDefault();
  alert("Rapport " + id);
};

const handleEncadrants = (id, e) => {
  e.preventDefault();
  alert("Encadrant " + id);
};

const handleSupprimer = (id, e) => {
  e.preventDefault();
  alert("Supprimer " + id);
};


  return (
    <div className="EntrepriseDashboard_wrapper">
      <div className="EntrepiriseDashboard_container">
        <div className="EntrepiriseDashboard_sideNav">
          <nav >
              <div className="logo_actions_group">
                           
                            <img src={Logo1} alt="" className="jobconnectlogo" />
                            <img src={menu} alt="" className={`dropdown_menu_logo ${Showmenu ? "mobile" : ""} ${menuActive ? "Active" : ""}`} onClick={handleClickMenu}/>
                            <img src={menu_active} alt="" className={`menu_active ${menuActive ? "Active" : ""}`} />
                        </div>
            <ul className={`EntrepiriseDashboard_navLists ${IsMobile ? "mobile" : ""} ${menuActive ? "Active" : ""}`}>
              {/* On click of each nav item, change the active slider */}
              <li
                className="EntrepiriseDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_addStage")}
              >
                Ajouter Stage
              </li>
              <li
                className="EntrepiriseDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_Stages")}
              >
                Stages
              </li>
              <li
                className="EntrepiriseDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_profile")}
              >
                Profile
              </li>
              <li
                className="EntrepiriseDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_statistiques")}
              >
                statistique
              </li>
              <li  className="EntrepiriseDashboard_nav_list" onClick={handleLogout}>Logout</li>
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
      <input name="durre_stage" type="text" className="ED_stage_form_control" />
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
      <button type="submit">Submit</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
    </div>

  </form>
</div>

          </span>
          <span
            className={`EntrepiriseDashboard_contentAbout ED_CB_Stages ${
              ActiveSlider === "ED_CB_Stages" ? "Active" : ""
            }`}
          >
            Content 3: Stages


                  <div className="stage-section">
      {stages.map((stage) => (
        <form key={stage.offre_id} className="stage-form">
          <div>
            <label>Type de Stage:</label>
            <input type="text" value={stage.type_de_stage} readOnly />
          </div>
          <div>
            <label>Catégorie:</label>
            <input type="text" value={stage.stage_categorie} readOnly />
          </div>
          <div>
            <label>Titre:</label>
            <input type="text" value={stage.titre} readOnly />
          </div>
          <div>
            <label>Description:</label>
            <textarea value={stage.description} readOnly />
          </div>
          <div>
            <label>Compétences requises:</label>
            <textarea value={stage.competences_requises} readOnly />
          </div>
          <div>
            <label>Début:</label>
            <input type="date" value={stage.date_debut} readOnly />
          </div>
          <div>
            <label>Durée (semaines):</label>
            <input type="number" value={stage.duree_semaines} readOnly />
          </div>
          <div>
            <label>Nombre de places:</label>
            <input type="number" value={stage.nombre_places} readOnly />
          </div>
          <div>
            <label>Emplacement:</label>
            <input type="text" value={stage.emplacement} readOnly />
          </div>
          <div>
            <label>Statut:</label>
            <input type="text" value={stage.statut} readOnly />
          </div>
         {/* <div 
      className="dropdown-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={`stage_action_dropdown ${ActiveStageAction ? "ActiveStageAction" : ""}`}>
        Actions
      </button>

      <div className={`stage_actions ${ActiveStageAction ? "show" : "hidden"}`}>
        <button className="modifier">Modifier</button>
        <button className="delete">Remove</button>
        <button className="candidature">Candidature</button>
        <button className="encadrant">Encadrants</button>
        <button className="rapport">Rapport</button>
      </div>
    </div> */}

     <div
            className="dropdown-container"
            onMouseEnter={() => handleMouseEnter(stage.offre_id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`stage_action_dropdown ${
                activeStageId === stage.offre_id ? "ActiveStageAction" : ""
              }`}
            >
              Actions
            </button>

            <div
              className={`stage_actions ${
                activeStageId === stage.offre_id ? "show" : "hidden"
              }`}
            >
              {/* {actions.map((action, index) => (
                <button key={index} className={action.className}>
                  {action.name}
                </button>
              ))} */}
              {/* <button className="modifier" onClick={() => handleModifier(stage.offre_id)}>Modifier </button>
            <button className="delete" onClick={() => handleSupprimer(stage.offre_id)}>supprimer</button>
            <button className="candidature" onClick={() => handleCandidature(stage.offre_id)}>Candidature</button>
            <button className="encadrant" onClick={() => handleEncadrants(stage.offre_id)}>Encadrants</button>
            <button className="rapport" onClick={() => handleRapport(stage.offre_id)}>Rapport</button> */}
            <button className="modifier" onClick={(e) => handleModifier(stage.offre_id, e)}>Modifier</button>
            <button className="delete" onClick={(e) => handleSupprimer(stage.offre_id, e)}>Supprimer</button>
            <button className="candidature" onClick={(e) => handleCandidature(stage.offre_id, e)}>Candidature</button>
            <button className="encadrant" onClick={(e) => handleEncadrants(stage.offre_id, e)}>Encadrants</button>
            <button className="rapport" onClick={(e) => handleRapport(stage.offre_id, e)}>Rapport</button>

            </div>
          </div>
        </form>
        
      ))}
      
    </div>
          </span>
          <span
            className={`EntrepiriseDashboard_contentAbout ED_CB_profile ${
              ActiveSlider === "ED_CB_profile" ? "Active" : ""
            }`}
          >
            Content 4: Profile
             <div>
                {Fetchuser ? (
                  // <pre>{JSON.stringify(Fetchuser, null, 2)}</pre>
                    <form onSubmit={handleSubmit}>
      {/* User Info (read-only) */}
      <div>
        <strong>User ID:</strong> {Fetchuser?.user_id} <br />
        <strong>Email:</strong> {Fetchuser?.email} <br />
        <strong>Telephone:</strong> {Fetchuser?.telephone} <br />
        <strong>Role:</strong> {Fetchuser?.role} <br />
        <strong>Account Status:</strong> {Fetchuser?.account_status} <br />
        <strong>Created At:</strong> {Fetchuser?.created_at} <br />
        <strong>Updated At:</strong> {Fetchuser?.updated_at} <br />
        <strong>Username:</strong> {Fetchuser?.username} <br />
      </div>

      {/* Editable Entreprise Info */}
      <div>
        <label>Entreprise ID:</label>
        <input
          type="text"
          name="entreprise_id"
          value={formData.entreprise_id}
          readOnly
          placeholder={`${UserId}`}
        />
      </div>

      <div>
        <label>Nom Entreprise:</label>
        <input
          type="text"
          name="nom_entreprise"
          value={formData.nom_entreprise}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Adresse:</label>
        <input
          type="text"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
        />
      </div>

      {/* <div>
        <label>Logo Path:</label>
        <input
          type="text"
          name="logo_path"
          value={formData.logo_path}
          onChange={handleChange}
        />
      </div> */}

      <div>
        <label>Site Web:</label>
        <input
          type="text"
          name="site_web"
          value={formData.site_web}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
                ) : (
                  <p>Loading user data...</p>
                )}
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
