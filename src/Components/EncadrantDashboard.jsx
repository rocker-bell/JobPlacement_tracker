import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/EncadrantDashboard.css";
import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";
import Logo1 from "../assets/Logo1.svg";
import Logout from "../assets/Logout.svg";
import { User, MessageSquare, Bell } from "lucide-react";
import StatChart from "./StatChart";
const EncadrantDashboard = () => {
  const location = useLocation()
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
  const [notifications, setNotifications] = useState([]);
  const [UserId, setUserId] = useState(null);
  const [ActiveSlider, setActiveSlider] = useState( location.state?.activeSlider || "ED_CB_default"); // Set default slider
  const [IsMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [CancelAddStage, setCancelAddStage] = useState(false)
  const [menuActive, setmenuActive] = useState(false);
    const [IsEditing, setIsEditing] = useState(false);
  const [Showmenu, setShowmenu] = useState(false);
  const [Affectation, setAffectation] = useState(null);
  const [OffreId, setOffreId] = useState(null);
  const [Candidatures, setCandidatures] = useState([]);
  const [expandedAffectation, setExpandedAffectation] = useState(null);
  const [selectedAffectation, setSelectedAffectation] = useState(null);
 const toggleEdit = () => setIsEditing((prev) => !prev);

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


  //  async function FetchEncadrantfunction(user_id) {
  // console.log("user id = " + user_id)
  //     try {
  //       const response = await fetch(`${BASE_URL}/Encadrantfetch.php`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded", // must match PHP POST
  //         },
  //         body: new URLSearchParams({ user_id: user_id }), // send user_id
  //       });
  
  //       if (!response.ok) {
  //         console.error("HTTP error:", response.status);
  //         return;
  //       }
  
  //       const data = await response.json();
  //       console.log(data)
  //       if (data.success) {
  //         setFetchEncadrant(data.user_data);
  //       } else {
  //         console.error("Error from API:", data.message);
  //       }
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //     }
  //   }


//     async function updateEncadrantdata(id) {
//   try {
//     const formData = new FormData();
//     formData.append("encadrant_id", id);
//     formData.append("nom", FetchEncadrant.nom);
//     formData.append("prenom", FetchEncadrant.prenom);
//     formData.append("agence_id", FetchEncadrant.agence_id);
//     formData.append("nom_d_agence", FetchEncadrant.nom_d_agence);
//     formData.append("departement", FetchEncadrant.departement);

   
//     if (photoFile) formData.append("photo_file", photoFile);


//     const response = await fetch(`${BASE_URL}/Encadrant_update.php`, {
//       method: "POST",
//       body: formData, // no need for headers, fetch sets multipart automatically
//     });

//     const data = await response.json();
//     console.log("response :", data)
//     if (data.success) {
//       alert("encadrant updated successfully!");
//     } else {
//       alert("Failed to update encadrant: " + data.message);
//     }
//   } catch (err) {
//     console.error("Fetch error:", err);
//   }
// }



async function updateEncadrantdata(id) {
  try {
    const formData = new FormData();

    formData.append("encadrant_id", id);
    formData.append("nom", Fetchuser.nom ?? "");
    formData.append("prenom", Fetchuser.prenom ?? "");
    formData.append("agence_id", Fetchuser.agence_id ?? "");
    formData.append("nom_d_agence", Fetchuser.nom_d_agence ?? "");
    formData.append("departement", Fetchuser.departement ?? "");

    if (photoFile) {
      formData.append("photo_file", photoFile);
    }

    const response = await fetch(`${BASE_URL}/EncadrantsUpdate.php`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("UPDATE RESPONSE:", data);

    if (data.success) {
      alert("Encadrant updated successfully!");
      setIsEditing(false);
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

  const handleLogout = async () => {
  const user_id = localStorage.getItem("user_id");
  // const connection_id = localStorage.getItem("connection_id"); // store this on login

  if (user_id) {
    try {
      await fetch("http://localhost:8000/handle_logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id})
      });
      con
    } catch (err) {
      console.error("Failed to register disconnect:", err);
    }
  }

  localStorage.removeItem("user_id");
  // localStorage.removeItem("connection_id");
  navigate("/");
};




  const handleCancel = () => {
    setCancelAddStage(true)
     setTimeout(() => setActiveSlider("ED_CB_default"), 500);

     setTimeout(() => setCancelAddStage(false), 500)

  }

  // async function fetchNotification() {
  //   const response = await fetch(`${BASE_URL}/AfficherNotification.php`, {
  //     method: 'POST',
  //     headers:{'Content-type' : 'application/json'},
  //     body:JSON.stringify({
  //       user_id:
  //       date:
  //     })


  //   })

  //   const res = response.json()
  //   if (res.success) {
  //       setNotifications(res.notification)
  //   }

  //   else {

  //   }
  // }

  
    //  async function FetchuserData(userId) {
    //   try {
    //     const response = await fetch(`${BASE_URL}/fetch_profile.php`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded", // must match PHP POST
    //       },
    //       body: new URLSearchParams({ user_id: userId }), // send user_id
    //     });
  
    //     if (!response.ok) {
    //       console.error("HTTP error:", response.status);
    //       return;
    //     }
  
    //     const data = await response.json();
    //     if (data.success) {
    //       setFetchuser(data.user_data);
    //     } else {
    //       console.error("Error from API:", data.message);
    //     }
    //   } catch (err) {
    //     console.error("Fetch error:", err);
    //   }
    // }


//     async function fetchNotification(lastFetchedDate = null) {
//   try {
//     const response = await fetch(`${BASE_URL}/AfficherNotification.php`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         user_id: localStorage.getItem("user_id"),
//         date: lastFetchedDate // send last fetched timestamp, or null for all
//       })
//     });

//     const res = await response.json();
//     console.log(res)

//     if (res.success) {
//       setNotifications(res.notifications); // assuming backend returns "notifications"
//     } else {
//       console.warn("No notifications or error:", res.message);
//     }
//   } catch (err) {
//     console.error("Error fetching notifications:", err);
//   }
// }



 const [lastFetched, setLastFetched] = useState(null); // keep track of last fetch time
const [hasNewNotification, setHasNewNotification] = useState(false);

  // Function to fetch notifications
  async function fetchNotification() {
    try {
      const response = await fetch(`${BASE_URL}/AfficherNotification.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          date: lastFetched, // fetch only new notifications
        })
      });

      const res = await response.json();
      console.log("response :", res)
      // if (res.success && res.notifications.length > 0) {
      //   // Update state with new notifications
      //   setNotifications(prev => [...res.notifications, ...prev]);
      //   // Update last fetched timestamp
      //   const latestTime = res.notifications[0].created_at; 
      //   setLastFetched(latestTime);
      // }
      if (res.success && res.notifications.length > 0) {
  setNotifications(prev => {
    const existingIds = new Set(prev.map(n => n.notification_id));

    const newOnes = res.notifications.filter(
      n => !existingIds.has(n.notification_id)
    );

    return [...newOnes, ...prev];

    if (newOnes.length > 0) {
  setHasNewNotification(true);
  setTimeout(() => setHasNewNotification(false), 600);
}

  });

  setLastFetched(res.notifications[0].created_at);
}

    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }

// async function fetchNotification() {
//   try {
//     const response = await fetch(`${BASE_URL}/AfficherNotification.php`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         user_id: localStorage.getItem("user_id"),
//         date: lastFetched,
//       })
//     });

//     const res = await response.json();
//     console.log("response :", res);

//     if (res.success && res.notifications.length > 0) {
//       let newOnes = [];

//       setNotifications(prev => {
//         const existingIds = new Set(prev.map(n => n.notification_id));

//         newOnes = res.notifications.filter(
//           n => !existingIds.has(n.notification_id)
//         );

//         return [...newOnes, ...prev];
//       });

//       // 🔔 trigger bell animation ONLY if new notifications arrived
//       if (newOnes.length > 0) {
//         setHasNewNotification(true);
//         setTimeout(() => setHasNewNotification(false), 4000);
//       }

//       // update timestamp
//       setLastFetched(res.notifications[0].created_at);
//     }

//   } catch (err) {
//     console.error("Error fetching notifications:", err);
//   }
// }


  
 async function fetchEncadrantProfile(user_id) {
 

  if (!user_id) {
    console.error("User ID not found in localStorage");
    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/fetchEncadrantProfile.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id: user_id })
      }
    );

    const result = await response.json();
    console.log("fetched user", result)

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch profile");
    }

    // ✅ Your data is inside result.data
    setFetchuser(result.user);

  } catch (error) {
    console.error("Fetch error:", error);
  }
}


    useEffect(() => {
      const user_id = localStorage.getItem("user_id");
      setUserId(user_id);
      // setenterpriseId(user_id)
      
    
      // fetchCandidatures(OffreId)
  
      if (user_id) {
         fetchEncadrantProfile(user_id) // actually call the function
        fetchAffectation(user_id)
        // FetchEncadrantfunction(user_id);
      }
    }, []);


     useEffect(() => {
    fetchNotification(); // initial fetch

    const interval = setInterval(() => {
      fetchNotification(); // poll every 10 seconds
    }, 10000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []); // empty dependency → run once on mount

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


  const modifierPassword = () => {
    navigate('/AccountRecovery')
  }


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
              <li className="EncadrantDashboard_nav_list">
              <MessageSquare size={24} className="EncadrantDashboard_nav_icons" />
            
            </li>
            {/* <li className="EncadrantDashboard_nav_list" onClick={() => SliderContentHandler("ED_CB_notifications")}>
              <Bell size={24} className="EncadrantDashboard_nav_icons" />
               

              </li> */}

              {/* <li
  className="EncadrantDashboard_nav_list"
  onClick={() => SliderContentHandler("ED_CB_notifications")}
>
  <div className="bell-wrapper">
    <Bell size={24} className="EncadrantDashboard_nav_icons" />

    {notifications.length > 0 && (
      <span className="bell-badge">
        {notifications.length}
      </span>
    )}
  </div>
</li> */}

<li
  className="EncadrantDashboard_nav_list"
  onClick={() => {
    SliderContentHandler("ED_CB_notifications");
    setHasNewNotification(false); // stop shake when opened
  }}
>
  <div className={`bell-wrapper ${hasNewNotification ? "new" : ""}`}>
    <Bell size={24} className="EncadrantDashboard_nav_icons" />

    {notifications.length > 0 && (
      <span className="bell-badge">
        {notifications.length}
      </span>
    )}
  </div>
</li>



{/* <div className={`bell-wrapper ${hasNewNotification ? "new" : ""}`}>
  <Bell size={24} className="EncadrantDashboard_nav_icons" />
  {notifications.length > 0 && (
    <span className="bell-badge">{notifications.length}</span>
  )}
</div> */}

              
              <li
                className="EncadrantDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_Stages")}
              >
                <img  src="https://img.icons8.com/external-outline-juicy-fish/60/external-work-corruption-outline-outline-juicy-fish.png" alt="external-work-corruption-outline-outline-juicy-fish"  className="UserDashboard_nav_icons"/>
              </li>
              <li
                className="EncadrantDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_profile")}
              >
                {/* Profile */}
                <img  src="https://img.icons8.com/3d-fluency/94/resume.png" className="UserDashboard_nav_icons" alt="resume"/>
              </li>
              {/* <li
                className="EncadrantDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_statistiques")}
              >
                statistique
              </li> */}
              <li  className="EncadrantDashboard_nav_list" onClick={handleLogout}>
                                <img  src={Logout} className="UserDashboard_nav_icons" alt="resume"/>

              </li>
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
            Content 1: welcome to your dashboard encadrant


                 <div className="general_statistique">
      <StatChart
        title="Total Affectations"
        value={dashboardStats.total_affectations}
        color="#4CAF50"
      />

      <StatChart
        title="Pending Evaluations"
        value={dashboardStats.pending_evaluations}
        color="#FF9800"
      />

      <StatChart
        title="Accepted Applicants"
        value={dashboardStats.accepted_applicants}
        color="#2196F3"
      />

      <StatChart
        title="Refused Applicants"
        value={dashboardStats.refused_applicants}
        color="#F44336"
      />

      <StatChart
        title="Pending Applicants"
        value={dashboardStats.pending_applicants}
        color="#9C27B0"
      />
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
            className={`EncadrantDashboard_contentAbout ED_CB_notifications ${
              ActiveSlider === "ED_CB_notifications" ? "Active" : ""
            }`}
          >
              content notification

             


<div className="notifications-panel">
  <h4 className="notifications-title">Notifications</h4>

  {notifications.length === 0 && (
    <p className="no-notifications">No notifications</p>
  )}

  {notifications.map((notif) => (
    <div key={notif.notification_id} className="notification-card">
      <p className="notification-text">
        {notif.notification_content}
      </p>
      <span className="notification-time">
        {new Date(notif.created_at).toLocaleString()}
      </span>
    </div>
  ))}
</div>




          </span>
          <span
            className={`EncadrantDashboard_contentAbout ED_CB_Stages ${
              ActiveSlider === "ED_CB_Stages" ? "Active" : ""
            }`}
          >
            Content 3: affectation

             


{Affectation && Affectation.length > 0 ? (
  Affectation.map(affect => (
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
  ))
) : (
  <p>Il n’y a pas d’affectation pour le moment.</p>
)}

         

{Candidatures && Candidatures.length > 0 ? (
  <table className="table table-bordered">
    <thead >
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
      


          </span>
         

        

          <span
            className={`EncadrantDashboard_contentAbout ED_CB_profile ${
              ActiveSlider === "ED_CB_profile" ? "Active" : ""
            }`}
          >
            Content 4: Profile
            


          <div className="profile_container">
  {Fetchuser && (
    <div className="profile_card">

      {/* Photo */}
      <div className="profile_form_group">
        <label className="profile_form_label">Photo:</label>

        {Fetchuser.photo_path && !IsEditing && (
          <img
            src={`${BASE_URL}/${Fetchuser.photo_path}`}
            alt="Encadrant"
                     className="photo-class"
          />
        )}

        {IsEditing && (
          <input
            type="file"
            accept="image/*"
            className="profile_form_control"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
        )}
      </div>

      {/* User ID */}
      {/* <div className="profile_form_group">
        <label className="profile_form_label">User ID:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.user_id}
          readOnly
        />
      </div> */}

      {/* Encadrant ID */}
      <div className="profile_form_group">
        <label className="profile_form_label">Encadrant ID:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.encadrant_id}
          readOnly
        />
      </div>

      {/* Email */}
      <div className="profile_form_group">
        <label className="profile_form_label">Email:</label>
        <input
          type="email"
          className="profile_form_control"
          value={Fetchuser.email || ""}
          readOnly={!IsEditing}
          onChange={(e) =>
            setFetchuser(prev => ({ ...prev, email: e.target.value }))
          }
        />
      </div>

      {/* Username */}
      <div className="profile_form_group">
        <label className="profile_form_label">Username:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.username || ""}
          readOnly={!IsEditing}
          onChange={(e) =>
            setFetchuser(prev => ({ ...prev, username: e.target.value }))
          }
        />
      </div>

      {/* Telephone */}
      <div className="profile_form_group">
        <label className="profile_form_label">Telephone:</label>
        <input
          type="tel"
          className="profile_form_control"
          value={Fetchuser.telephone || ""}
          readOnly={!IsEditing}
          onChange={(e) =>
            setFetchuser(prev => ({ ...prev, telephone: e.target.value }))
          }
        />
      </div>

      {/* Role */}
      <div className="profile_form_group">
        <label className="profile_form_label">Role:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.role}
          readOnly
        />
      </div>

      {/* Account Status */}
      <div className="profile_form_group">
        <label className="profile_form_label">Account Status:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.account_status}
          readOnly
        />
      </div>

      {/* Nom */}
      <div className="profile_form_group">
        <label className="profile_form_label">Nom:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.nom || ""}
          readOnly={!IsEditing}
          onChange={(e) =>
            setFetchuser(prev => ({ ...prev, nom: e.target.value }))
          }
        />
      </div>

      {/* Prenom */}
      <div className="profile_form_group">
        <label className="profile_form_label">Prénom:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.prenom || ""}
          readOnly={!IsEditing}
          onChange={(e) =>
            setFetchuser(prev => ({ ...prev, prenom: e.target.value }))
          }
        />
      </div>

      {/* Agence ID */}
      <div className="profile_form_group">
        <label className="profile_form_label">Agence ID:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.agence_id || ""}
          readOnly={!IsEditing}
          onChange={(e) =>
            setFetchuser(prev => ({ ...prev, agence_id: e.target.value }))
          }
        />
      </div>

      {/* Nom d'agence */}
      <div className="profile_form_group">
        <label className="profile_form_label">Nom de l'agence:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.nom_d_agence || ""}
          readOnly={!IsEditing}
          onChange={(e) =>
            setFetchuser(prev => ({ ...prev, nom_d_agence: e.target.value }))
          }
        />
      </div>

      {/* Département */}
      <div className="profile_form_group">
        <label className="profile_form_label">Département:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.departement || ""}
          readOnly={!IsEditing}
          onChange={(e) =>
            setFetchuser(prev => ({ ...prev, departement: e.target.value }))
          }
        />
      </div>

      {/* Status */}
      <div className="profile_form_group">
        <label className="profile_form_label">Status Encadrant:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.status_d_encadrant || ""}
          readOnly
        />
      </div>

      {/* Date */}
      <div className="profile_form_group">
        <label className="profile_form_label">Date:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.date || ""}
          readOnly
        />
      </div>

      {/* Created At */}
      <div className="profile_form_group">
        <label className="profile_form_label">Created At:</label>
        <input
          type="text"
          className="profile_form_control"
          value={Fetchuser.created_at}
          readOnly
        />
      </div>
           <div className="Candidatprofile_btn_actions">
            <button
              className="profile_actions_btn"
              onClick={toggleEdit}
            >
              {IsEditing ? "Cancel Edit" : "Edit Profile"}
            </button>

            {IsEditing && (
              <button

                className="profile_actions_btn"
                onClick={() => updateEncadrantdata(Fetchuser.encadrant_id)}
              >
                Save Changes
              </button>
            )}
          </div>
    </div>
  )}
          <img
  width="25"
  height="25"
  src="https://img.icons8.com/color/48/minus.png"
  alt="remove"
  onClick={handleDelete}
  className="remove_account_btn"
  title="Remove account"
/>

</div>


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

      <footer></footer>
    </div>
  );
};

export default EncadrantDashboard;