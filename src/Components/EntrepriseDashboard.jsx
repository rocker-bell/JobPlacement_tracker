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

const Entreprise_dashboard = () => {
  // State for active slider and mobile screen size
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
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    setShowmenu(false)
  }, []);

  // Function to handle the slider change
  const SliderContentHandler = (sliderName) => {
    setActiveSlider(sliderName);
  };

  const handleLogout = () => {
    navigate("/JobBoard")
  }

  const handleSubmitStage = (e) => {
    e.preventDefault()
    
  }

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




  return (
    <div className="EntrepriseDashboard_wrapper">
      <div className="EntrepiriseDashboard_container">
        <div className="EntrepiriseDashboard_sideNav">
          <nav >
            <img src={menu} alt="" className={`dropdown_menu_logo ${Showmenu ? "mobile" : ""} ${menuActive ? "Active" : ""}`} onClick={handleClickMenu}/>
            <img src={menu_active} alt="" className={`menu_active ${menuActive ? "Active" : ""}`} />
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
                            <form  method="POST" className="ED_stage_form" onSubmit={handleSubmitStage}>  
                                            <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">stage title</label>
                                                <input type="text" className="ED_stage_form_control" />
                                            </div>
                                             <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">stage description</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                              <div className="ED_stage_form_formGroupe">
                                                <label htmlFor="" className="ED_stage_form_label">stage requirements</label>
                                                <textarea type="text" className="ED_stage_form_control" > </textarea>
                                            </div>
                                                <div className="ED_stage_form_btn_group">
                                                     <button type="submit">submit</button>
                                                     <button type="cancel" onClick={handleCancel}>cancel</button>
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
          </span>
          <span
            className={`EntrepiriseDashboard_contentAbout ED_CB_profile ${
              ActiveSlider === "ED_CB_profile" ? "Active" : ""
            }`}
          >
            Content 4: Profile
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
