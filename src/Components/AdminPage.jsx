import { useState, useEffect } from "react";
import "../Styles/AdminPage.css"
const AdminDashboard = () => {

      const [ActiveSlider, setActiveSlider] = useState("ED_CB_default"); 
      const [IsMobile, setIsMobile] = useState(window.innerWidth < 768);
     const SliderContentHandler = (sliderName) => {
    setActiveSlider(sliderName);
  };
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
      return (
        <>
            <div className="AdminJobBoard-wrapper">
                 <div className="AdminDashboard_sideNav">
                          <nav >
                              <div className="logo_actions_group">
                                           
                                            <img src={Logo1} alt="" className="jobconnectlogo" onClick={hanldeJobConnect} />
                                            <img src={menu} alt="" className={`dropdown_menu_logo ${Showmenu ? "mobile" : ""} ${menuActive ? "Active" : ""}`} onClick={handleClickMenu}/>
                                            <img src={menu_active} alt="" className={`menu_active ${menuActive ? "Active" : ""}`} />
                                        </div>
                            <ul className={`AdminDashboard_navLists ${IsMobile ? "mobile" : ""} ${menuActive ? "Active" : ""}`}>
                              {/* On click of each nav item, change the active slider */}
                               <li className="AdminDashboard_nav_list">
                              <MessageSquare size={24} className="EntrepriseDashboard_nav_icons" />
                            
                            </li>
                            <li className="AdminDashboard_nav_list"><Bell size={24} className="EntrepriseDashboard_nav_icons" /></li>
                              <li
                                className="AdminDashboard_nav_list"
                                onClick={() => SliderContentHandler("ED_CB_addStage")}
                              >
                                <img src={Ajouter} alt=""  className="EntrepriseDashboard_nav_icons" />
                              </li>
                              <li
                                className="AdminDashboard_nav_list"
                                onClick={() => SliderContentHandler("ED_CB_Stages")}
                              >
                                <img className="EntrepriseDashboard_nav_icons" src="https://img.icons8.com/wired/64/lawyer.png" alt="lawyer"/>
                              </li>
                              <li
                                className="AdminDashboard_nav_list"
                                onClick={() => SliderContentHandler("ED_CB_profile")}
                              >
                                {/* <img src={Profile} alt="" className="EntrepriseDashboard_nav_icons"/> */}
                                <img  src="https://img.icons8.com/3d-fluency/94/resume.png" className="EntrepriseDashboard_nav_icons" alt="resume"/>
                              </li>
                              <li
                                className="AdminDashboard_nav_list"
                                onClick={() => SliderContentHandler("ED_CB_statistiques")}
                              >
                                statistique
                              </li>
                              <li  className="AdminDashboard_nav_list" onClick={handleLogout}>
                                <img src={Logout} alt="" className="EntrepriseDashboard_nav_icons" />
                                
                                </li>
                            </ul>
                          </nav>
                </div>

                   <div className="AdminDashboard_NavContentSlider">
          {/* Dynamically toggle content based on the active slider */}
          <span
            className={`AdminDashboard_contentAbout ED_CB_default ${
              ActiveSlider === "ED_CB_default" ? "Active" : ""
            }`}
          > 

          </span>
           </div>
            </div>
        </>
    )
}

export default AdminDashboard;