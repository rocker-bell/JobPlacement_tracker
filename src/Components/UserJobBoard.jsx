// import { useState, useEffect } from "react";
// import "../Styles/UserJobBoard.css";


// const UserJobBoard = () => {

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
//             <div className="UserJobBoard_wrapper">
                
//                 <div className="UserJobBoard_container">
//                     <div className="UserJobBoard_sideNav">
//                         <nav>
//                             <ul className="UserJobBoard_navLists">
//                                 <li className="UserJobBoard_nav_list" onClick={SliderContentHandler}>ajouter stage</li>
//                                 <li className="UserJobBoard_nav_list" onClick={SliderContentHandler}>stages</li>
//                                 <li className="UserJobBoard_nav_list" onClick={SliderContentHandler}>profile</li>
//                                 <li className="UserJobBoard_nav_list" onClick={SliderContentHandler}>logout</li>
//                             </ul>
//                         </nav>

//                     </div>

//                     <div className="UserJobBoard_NavContentSlider"> 
                                
//                             <span className={`UserJobBoard_contentAbout ED_CB_default  {${ActiveSlider} ? "Active" : ""}`}>content1 default</span>
//                             <span className={`UserJobBoard_contentAbout ED_CB_addStage`}>content2</span>
//                             <span className={`UserJobBoard_contentAbout ED_CB_Stages`}>content3</span>
//                             <span className={`UserJobBoard_contentAbout ED_CB_profile`}>content4</span>
//                             <span className={`UserJobBoard_contentAbout ED_CB_statistiques`}>content5</span>
                    
//                     </div>

                    
//                 </div>

//                 <footer>
//                                 copyrights
//                 </footer>
                
//             </div>
//         </>
//     )
// }

// export default UserJobBoard;


import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "../Styles/UserJobBoard.css";
import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";
import Logo1 from "../assets/Logo1.svg"

const UserJobBoard = () => {
  // State for active slider and mobile screen size
  const [Fetchuser, setFetchuser] = useState(null);
  const [Query, setQuery] = useState({
  stage_search_querry: ""
});
const [submittedQuery, setSubmittedQuery] = useState("");
const [FetchedQuery, setFetchedQuery] = useState([]);

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

  



//  const handleSubmitStage = async (e) => {
//   e.preventDefault();

//   const form = e.target;
//   const typeStage = form.elements["type_stage"].value.trim();
//   const categorieStage = form.elements["categorie_stage"].value.trim();
//   const emplacement = form.elements["emplacement"].value.trim();
//   const nombrePlace = form.elements["nombre_place"].value.trim();
//   const debutStage = form.elements["debut_stage"].value.trim();
//   const dureeStage = form.elements["durre_stage"].value.trim();
//   const titreStage = form.elements["titre_stage"].value.trim();
//   const descriptionStage = form.elements["description_stage"].value.trim();
//   const competencesRequises = form.elements["competence_requise"].value.trim();

//   // Validate form fields
//   if (!typeStage || !categorieStage || !emplacement || !nombrePlace || !debutStage || !dureeStage || !titreStage || !descriptionStage || !competencesRequises) {
//     return alert("All fields are required!");
//   }

//   try {
//     const res = await fetch("http://localhost:8000/handle_stage.php", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         type_stage: typeStage,
//         categorie_stage: categorieStage,
//         emplacement: emplacement,
//         nombre_place: nombrePlace,
//         debut_stage: debutStage,
//         durre_stage: dureeStage,
//         titre_stage: titreStage,
//         description_stage: descriptionStage,
//         competence_requise: competencesRequises,
//         entreprise_id: "your_entreprise_id", // Pass entreprise_id (or fetch dynamically)
//       }),
//     });

//     const data = await res.json();
//     if (data.success) {
//       alert("Stage added successfully!");
//       // Optionally, clear the form or redirect
//     } else {
//       alert(data.message);
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Something went wrong. Please try again.");
//   }
// };


//   const handleCancel = () => {
//     setCancelAddStage(true)
//      setTimeout(() => setActiveSlider("ED_CB_default"), 500);

//      setTimeout(() => setCancelAddStage(false), 500)

//   }

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

    // async function FetchSearchedStage(submittedQuery) {
    //   try {
    //   const response = await fetch(`${BASE_URL}/fetchStagebyQuerry.php`, {
    //      method: "POST",
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded", // must match PHP POST
    //       },
    //       body: new URLSearchParams({ query: submittedQuery }), // send user_id
    //     });
        
    //      if (!response.ok) {
    //       console.error("HTTP error:", response.status);
    //       return;
    //     }
  
    //     const query = await response.json();
    //     if (query.success) {
    //       setFetchedQuery(query.query_data);
    //     } else {
    //       console.error("Error from API:", data.message);
    //     }

    //   }
    //   catch (err) {
    //       console.error("Fetch error:", err)
    //   }
      
    // }


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
  }



  return (
    <div className="UserJobBoard_wrapper">
      <div className="UserJobBoard_container">
        <div className="UserJobBoard_sideNav">
          <nav >
            <div className="logo_actions_group">
               
                <img src={Logo1} alt="" className="jobconnectlogo" />
                <img src={menu} alt="" className={`dropdown_menu_logo ${Showmenu ? "mobile" : ""} ${menuActive ? "Active" : ""}`} onClick={handleClickMenu}/>
                <img src={menu_active} alt="" className={`menu_active ${menuActive ? "Active" : ""}`} />
            </div>
            <ul className={`UserJobBoard_navLists ${IsMobile ? "mobile" : ""} ${menuActive ? "Active" : ""}`}>
              {/* On click of each nav item, change the active slider */}
              {/* <li className="UserJobBoard_nav_list">


                    <input type="text"  placeholder="search for stage here" className="stage_query_input" name="stage_search_querry" value={e.target.value} onChange={handleChange}/>
                   <Search size={35} color="#333" onClick={() => SliderContentHandler("ED_CB_addStage")} />
                    
                    
            </li> */}
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


              {/* </li> */}
              
              <li
                className="UserJobBoard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_Stages")}
              >
                Stages
              </li>
              <li
                className="UserJobBoard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_profile")}
              >
                Profile
              </li>
              {/* <li
                className="UserJobBoard_nav_list"
                onClick={() => SliderContentHandler("ED_CB_statistiques")}
              >
                statistique
              </li> */}
              <li  className="UserJobBoard_nav_list" onClick={handleLogout}>Logout</li>
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
         <span
  className={`UserJobBoard_contentAbout ED_CB_addStage ${
    ActiveSlider === "ED_CB_addStage" ? "Active" : ""
  }`}
>
  Content 2:  stage content :
  {/* {FetchedQuery.length > 0 ? (
  FetchedQuery.map((stage) => (
    <div key={stage.offre_id} className="stage_card">
      <h3>{stage.titre}</h3>
      <p>{stage.description}</p>
      <small>{stage.stage_categorie}</small>
    </div>
  ))
) : (
  <p>No results found</p>
)} */}

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


</span>

          <span
            className={`UserJobBoard_contentAbout ED_CB_Stages ${
              ActiveSlider === "ED_CB_Stages" ? "Active" : ""
            }`}
          >
            Content 3: Stages
          </span>
          <span
            className={`UserJobBoard_contentAbout ED_CB_profile ${
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
      <div className="Candidatprofile_btn_actions">
              <button className="modifier">modifier</button>
              <button className="delete">delete account</button>
      </div>
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
