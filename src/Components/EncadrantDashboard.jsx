import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/EncadrantDashboard.css";
import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";
import Logo1 from "../assets/Logo1.svg"

const EncadrantDashboard = () => {
  // State for active slider and mobile screen size
  const [Fetchuser, setFetchuser] = useState(null);
  const [UserId, setUserId] = useState(null);
  const [ActiveSlider, setActiveSlider] = useState("ED_CB_default"); // Set default slider
  const [IsMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [CancelAddStage, setCancelAddStage] = useState(false)
  const [menuActive, setmenuActive] = useState(false);

  const [Showmenu, setShowmenu] = useState(false);
  const navigate = useNavigate()

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
    navigate("/JobBoard")
  }

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

  // Validate form fields
  if (!typeStage || !categorieStage || !emplacement || !nombrePlace || !debutStage || !dureeStage || !titreStage || !descriptionStage || !competencesRequises) {
    return alert("All fields are required!");
  }

  try {
    const res = await fetch("http://localhost:8000/handle_stage.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        type_stage: typeStage,
        categorie_stage: categorieStage,
        emplacement: emplacement,
        nombre_place: nombrePlace,
        debut_stage: debutStage,
        durre_stage: dureeStage,
        titre_stage: titreStage,
        description_stage: descriptionStage,
        competence_requise: competencesRequises,
        entreprise_id: "your_entreprise_id", // Pass entreprise_id (or fetch dynamically)
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
              <li
                className="EncadrantDashboard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_addStage")}
              >
                Ajouter Stage
              </li>
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
          <span
            className={`EncadrantDashboard_contentAbout ED_CB_addStage ${
              ActiveSlider === "ED_CB_addStage" ? "Active" : ""
            }`}
          >
            Content 2: chercher stage

                    {/* <div className={`ED_stage_form_wrapper ${CancelAddStage ? "cancel" : ""}`}>
                            <form  method="POST" className="ED_stage_form" onSubmit={handleSubmitStage}>
                                             <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">type de stage</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                             <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">categorie</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                             <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">emplacement</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                             <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">nombre place demande</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                             <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">debut de stagee</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                             <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">duree du stage</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                            <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">stage title</label>
                                                <input type="text" className="ED_stage_form_control" />
                                            </div>
                                             <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">stage description</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                              <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">competences requises</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                          
                                                <div className="ED_stage_form_btn_group">
                                                     <button type="submit">submit</button>
                                                     <button type="cancel" onClick={handleCancel}>cancel</button>
                                                </div>
                                           
                            </form>
                    </div> */}

          </span>
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
  <div>
    <strong>User ID:</strong> {Fetchuser.user_id} <br />
    <strong>Email:</strong> {Fetchuser.email} <br />
    <strong>Telephone:</strong> {Fetchuser.telephone} <br />
    <strong>Role:</strong> {Fetchuser.role} <br />
    <strong>Account Status:</strong> {Fetchuser.account_status} <br />
    <strong>Created At:</strong> {Fetchuser.created_at} <br />
    <strong>Updated At:</strong> {Fetchuser.updated_at} <br />
    <strong>Username:</strong> {Fetchuser.username} <br />
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