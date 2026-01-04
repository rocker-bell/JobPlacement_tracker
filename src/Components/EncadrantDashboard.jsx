import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/EncadrantDashboard.css";
import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";
import Logo1 from "../assets/Logo1.svg"

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
  const navigate = useNavigate()


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




  const handleCancel = () => {
    setCancelAddStage(true)
     setTimeout(() => setActiveSlider("ED_CB_default"), 500);

     setTimeout(() => setCancelAddStage(false), 500)

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
  
    useEffect(() => {
      const user_id = localStorage.getItem("user_id");
      setUserId(user_id);
      // setenterpriseId(user_id)
      FetchEncadrantfunction(user_id);
  
      if (user_id) {
        FetchuserData(user_id); // actually call the function
        
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







  return (
    <div className="EncadrantDashboard_wrapper">
      <div className="EncadrantDashboard_container">
        <div className="EncadrantDashboard_sideNav">
          <nav >
            <div className="logo_actions_group">
                <img src={Logo1} alt="" className="jobconnectlogo" />
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
                Stages
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
            Content 3: Stages
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
  className="delete profile_actions_btn"
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