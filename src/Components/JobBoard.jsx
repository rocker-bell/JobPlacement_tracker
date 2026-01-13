import React, { useEffect, useState } from 'react';

import { 
  Building2, MoreHorizontal, Bookmark, Ban, Send, 
  Search, MapPin, MessageSquare, Bell, User, ArrowUp, Save, Star 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/JobBoard.css';


import submit from "../assets/submit.png";
import send from "../assets/send.png";

import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";

// import Logo1 from "../assets/Logo1";
import Logo1 from "../assets/Logo1.svg"; 





const JobBoard = () => {


const [jobQuery, setJobQuery] = useState("");
const [selectedJob, setSelectedJob] = useState(null);
const [locationQuery, setLocationQuery] = useState("");
const [Msg, setMsg] = useState("")
const [submittedQuery, setSubmittedQuery] = useState({
  job: "",
  location: "",
});
const [email, setEmail] = useState("");

  const [FetchedStages, setFetchedStages] = useState([])
  // const [selectedJob, setSelectedJob] = useState(jobData[0]);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const navigate = useNavigate()


  const BASE_URL = "http://localhost:8000"

  // const handleGetstarted = () => {
  //   navigate("/GetStarted", {setActive(login)})
  // }

  const handleGetstarted = () => {
  navigate("/GetStarted", {
    state: { active: "register" }
  });
};


  const handleContactus = () => {
    navigate("/ContactUs")
}


// const handleSubscribe = async (email) => {
//   try {
//     const res = await fetch("http://localhost:8000/subscribe.php", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Subscribed successfully!");
//     } else {
//       alert(data.message);
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Server error, please try again");
//   }
// };

const handleSubscribe = async (email) => {
    if (!email) {
      setMsg("Please enter your email");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/subscribe_handle.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setMsg("Subscribed successfully!");
        setEmail(""); // clear input
      } else {
        setMsg(data.message);
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error, please try again");
    }
  };

 const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleChange = (e) => {
      const {name, value} = e.target;
      setSearchquery((prev) => ({...prev, [name]: value}))

    }


    const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768); // <=768px is mobile
  };

  handleResize(); // check on mount
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);




// async function FetchSearchedStage(submittedQuery) {
//   try {
//     const response = await fetch(`${BASE_URL}/FetchStagesByJObboardQuery.php`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         job: submittedQuery.job,
//         location: submittedQuery.location,
//       }),
//     });

//     if (!response.ok) {
//       console.error("HTTP error:", response.status);
//       return;
//     }

//     const data = await response.json();
//     console.log(data);

//     if (data.success) {
//       setFetchedStages(data.query_data);
//  if (data.query_data.length > 0) {
//     setSelectedJob(data.query_data);
//   } } else {
//       console.error("API error:", data.message);
//     }
//   } catch (err) {
//     console.error("Fetch error:", err);
//   }
// }

// async function FetchSearchedStage(submittedQuery) {
//   try {
//     const response = await fetch(`${BASE_URL}/FetchStagesByJObboardQuery.php`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         job: submittedQuery.job,
//         location: submittedQuery.location,
//       }),
//     });

//     if (!response.ok) {
//       console.error("HTTP error:", response.status);
//       return;
//     }

//     const data = await response.json();
//     console.log(data);

//     if (data.success) {
//       setFetchedStages(data.query_data);

//       // ✅ Select the first job automatically
//       if (data.query_data.length > 0) {
//         setSelectedJob(data.query_data[0]);
//       } else {
//         setSelectedJob(null);
//       }

//     } else {
//       console.error("API error:", data.message);
//     }
//   } catch (err) {
//     console.error("Fetch error:", err);
//   }
// }

// async function FetchSearchedStage(submittedQuery, isMobile = false) {
//   try {
//     const response = await fetch(`${BASE_URL}/FetchStagesByJObboardQuery.php`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         job: submittedQuery.job,
//         location: submittedQuery.location,
//       }),
//     });

//     if (!response.ok) {
//       console.error("HTTP error:", response.status);
//       return;
//     }

//     const data = await response.json();
//     console.log(data);

//     if (data.success) {
//       setFetchedStages(data.query_data);

//       if (!isMobile) {
//         // Only select the first job automatically on desktop
//         if (data.query_data.length > 0) {
//           setSelectedJob(data.query_data[0]);
//         } else {
//           setSelectedJob(null);
//         }
//       }

//     } else {
//       console.error("API error:", data.message);
//     }
//   } catch (err) {
//     console.error("Fetch error:", err);
//   }
// }



const handleSearch = async () => {
  const query = { job: jobQuery, location: locationQuery };
  setSubmittedQuery(query);

  const isMobile = window.innerWidth <= 768;

  // Fetch stages
  const fetchedData = await FetchSearchedStage(query);

  // On mobile, redirect to StageDetails with the fetched data
  if (isMobile && fetchedData) {
    navigate("/StageDetails", { state: { stages: fetchedData, query } });
  }
};

// Updated FetchSearchedStage to return data
async function FetchSearchedStage(submittedQuery) {
  try {
    const response = await fetch(`${BASE_URL}/FetchStagesByJObboardQuery.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(submittedQuery),
    });

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return null;
    }

    const data = await response.json();
    if (data.success) {
      setFetchedStages(data.query_data);

      // Only select first job on desktop
      if (window.innerWidth > 768 && data.query_data.length > 0) {
        setSelectedJob(data.query_data[0]);
      }

      return data.query_data;
    } else {
      console.error("API error:", data.message);
      return null;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}




const jobData = FetchedStages.map((stage) => ({
  id: stage.id,
  title: stage.titre,
  company: stage.entreprise_id,
  location: stage.emplacement,
  type: stage.type_de_stage,
  stage_categories: stage.stage_categorie,
  posted: stage.created_at,
  description: stage.description,
  competences_requises: stage.competences_requises
}));

const handleapply = (id) => {
  // alert("apply click = " + id)
  navigate(`/Postuler/${id}`)
}

// const handleBookmark = () => {
//   const user_id = localStorage.getItem("user_id");
//   if(user_id) {
//      alert("Bookmark job for user")

//   }
//   if(!user_id) {
//     setMsg("you have to login to book mark this job")
//     setTimeout(() => {
//       navigate("/")
//     }, 3000);
//   }
// }

// const handleStar = () => {
//     const user_id = localStorage.getItem("user_id");
//   if(user_id) {
//      alert("star  job for user")

//   }
//   if(!user_id) {

//     setMsg("You have to login to review this ")

//   }
  
// }






  return (
    <div className="job-board-container">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="navbar">
        <div className="nav-left">
          {/* Logo (Text representation) */}
         
          <img src={Logo1} alt="" className='jobconnectlogo'/>

           <img src={menu} alt="" className='menu-logo'/>
          <img src={menu_active} alt="" className='menu-logo'/>
          <div className="nav-links">
            <a href="#" className="nav-link active">Page d'accueil</a>
            {/* <a href="#" className="nav-link">Avis sur les entreprises</a> */}
          </div>
        </div>

        <div className="nav-right">
          
            
            <User size={24} className="nav-icon" onClick={handleGetstarted}/>
          
          <li  className="nav-post-job" onClick={handleGetstarted}>Entreprises / Publier une offre d'emploi</li>
        </div>
      </nav>

      <div className="max-width-wrapper">
        
        {/* --- 2. SEARCH BAR --- */}
        <div className="search-container">
          


          <div className="search-wrapper">


  <div className="input-group divider">
    <Search size={20} className="input-icon" strokeWidth={2.5} />
    <input
      type="text"
      className="search-input"
      placeholder="Intitulé de poste, mots-clés..."
      value={jobQuery}
      onChange={(e) => setJobQuery(e.target.value)}
    />
  </div>

 
  <div className="input-group">
    <input
      type="text"
      className="search-input"
      placeholder="Ville, région..."
      value={locationQuery}
      onChange={(e) => setLocationQuery(e.target.value)}
    />
  </div>

  <button
    className="btn-search-main"
onClick={() => {
    const query = {
      job: jobQuery,
      location: locationQuery,
    };

    setSubmittedQuery(query);
    FetchSearchedStage(query); 
  }}
  >
    Lancer la recherche
  </button>

</div>

{/* <div className="search-wrapper">


  <div className="input-group divider">
    <Search size={20} className="input-icon" strokeWidth={2.5} />
    <input
      type="text"
      className="search-input"
      placeholder="Intitulé de poste, mots-clés..."
      value={jobQuery}
      onChange={(e) => setJobQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const query = { job: jobQuery, location: locationQuery };
          setSubmittedQuery(query);

          const isMobile = window.innerWidth <= 768;
          FetchSearchedStage(query);

          if (isMobile) {
            navigate("/StageDetails", { state: { query } });
          }
        }
      }}
    />
  </div>

 
  <div className="input-group">
    <input
      type="text"
      className="search-input"
      placeholder="Ville, région..."
      value={locationQuery}
      onChange={(e) => setLocationQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const query = { job: jobQuery, location: locationQuery };
          setSubmittedQuery(query);

          const isMobile = window.innerWidth <= 768;
          FetchSearchedStage(query);

          if (isMobile) {
            navigate("/StageDetails", { state: { query } });
          }
        }
      }}
    />
  </div>

  <button
    className="btn-search-main"
    onClick={() => {
      const query = { job: jobQuery, location: locationQuery };
      setSubmittedQuery(query);
      
      const isMobile = window.innerWidth <= 768;
      FetchSearchedStage(query);

      if (isMobile) {
        navigate("/StageDetails", { state: { query } });
      }
    }}
  >
    Lancer la recherche
  </button>

</div> */}

{/* <div className="search-wrapper">
  
  <div className="input-group divider">
    <Search size={20} className="input-icon" strokeWidth={2.5} />
    <input
      type="text"
      className="search-input"
      placeholder="Intitulé de poste, mots-clés..."
      value={jobQuery}
      onChange={(e) => setJobQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSearch();
        }
      }}
    />
  </div>

 
  <div className="input-group">
    <input
      type="text"
      className="search-input"
      placeholder="Ville, région..."
      value={locationQuery}
      onChange={(e) => setLocationQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSearch();
        }
      }}
    />
  </div>

  <button className="btn-search-main" onClick={handleSearch}>
    Lancer la recherche
  </button>
</div> */}



        </div>


        {/* --- 3. MAIN GRID --- */}
        <div className={`main-grid ${FetchedStages.length === 0 ? "no-stages" : ""}`}>
          
       
          <div className="feed-header">
  <h2>Emplois recommandés</h2>
  <p className="feed-subtitle">
    Emplois basés sur votre activité
  </p>

  {FetchedStages.length === 0 && (
    <p style={{ color: "#6f6f6f" }}>
      Aucun stage trouvé
    </p>
  )}

  {FetchedStages.map((job) => (
    <div
      key={job.id}
      onClick={() => setSelectedJob(job)}
      className={`job-card ${
        selectedJob?.id === job.id ? "active" : ""
      }`}
    >
      <div className="card-top">
        <div>
          <h3 className="job-title">{job.titre}</h3>
          <div className="company-name">{job.entreprise_id}</div>
          <div className="job-location">{job.emplacement}</div>
        </div>

        <button
          style={{ background: "transparent", border: "none" }}
        >
          <MoreHorizontal size={24} />
        </button>
      </div>

      <div className="job-badges">
        <span className="badge-gray">
          <Building2 size={12} /> {job.type_de_stage}
        </span>
      </div>
    </div>
  ))}
</div>


      

              {selectedJob && (
  <div className="detail-panel">
   
    <div className="detail-header">
      <h2 className="detail-title">{selectedJob.titre}</h2>
      
      <div className="detail-company-link">
        <a href="#">{selectedJob.entreprise_id}</a> • {selectedJob.emplacement}
      </div>

      <div className="action-buttons">
        <button className="btn-apply" onClick={() => handleapply(selectedJob.offre_id)}>Postuler maintenant</button>
        {/* <button className="job-bookmark-star-actions">
      <Bookmark size={20} color="blue" strokeWidth={1.5} onClick={() => handleBookmark(selectedJob.offre_id)} />
      
    </button> */}
            {/* <button className="job-bookmark-star-actions">
                  <Star size={20} color='blue' className="text-yellow-500" onClick={() => handleStar(selectedJob.offre_id)} />
            </button> */}
      </div>
    </div>

   
    <div className="detail-content">
      
      <h3 className="section-title">Détails du stage</h3>
      <div style={{ marginBottom: '20px' }}>
        <span className="badge-gray">
          <Building2 size={14} /> {selectedJob.type_de_stage}
        </span>
      </div>

      
      <h3 className="section-title">Description complète</h3>
      <div className="job-description-text">
        {selectedJob.description}
      </div>
       <h3 className="section-title">Competence requises</h3>
      <div className="job-description-text">
        {selectedJob.competences_requises}
      </div>
     
    </div>
  </div>
)}



        </div>
      </div>

      <span className="footer">
                    <div className="footer-top">
                        <h1 className="footer-title">Let's Connect</h1>
                        <img src={send} className="footer-connect-img" onClick={handleContactus}/>
                    </div>

                    <div className="footer-content">
                        <div className="footer-col">
                             <img src={Logo1} alt="" onClick={scrollToTop} className='jobconnectlogo'/>
                            <p className="footer-text">
                                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Consequuntur cupiditate ipsum nulla. */}
                                the most trusted recrutement service in the market.
                            </p>
                            {/* <ul className="social-list">
                                <li>Facebook</li>
                                <li>Youtube</li>
                                <li>Twitter</li>
                                <li>Whatsapp</li>
                                <li>Instagram</li>
                            </ul> */}
                        </div>
                        <div className="footer-col">
                            <h2 className="footer-heading">Navigation</h2>
                            <ul className="footer-list">
                                <Link className="footer-list-links-about" onClick={scrollToTop}>Home</Link>
                                <Link className="footer-list-links-about" to="/About">About us</Link>
                                {/* <Link className="footer-list-links-about" to="/Package_services">services</Link> */}
                                <Link className="footer-list-links-about" to="/ContactUs">contactus</Link>
                               
                                {/* <Link  className="footer-list-links-about" to="/more_projects">Projects</Link> */}
                                
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h2 className="footer-heading">Contact</h2>
                            <ul className="footer-list">
                                <li>+212714230427</li>
                                <li>anasstantane.inbox@gmail.com</li>
                                {/* <li>fazwiuiux.com</li> */}
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h2 className="footer-heading">Stay Updated</h2>
                            {/* <form className="subscribe">
                                <input type="email" placeholder="Your email" className="subscribe-input" />
                                <img width="48" height="48" className='send-icon' src="https://img.icons8.com/fluency/48/sent.png" alt="sent" onClick={handleSubscribe}/>
                            </form> */}
                            <form
        className="subscribe"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubscribe(email);
        }}
      >
        <input
          type="email"
          placeholder="Your email"
          className="subscribe-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <img
          width="48"
          height="48"
          className="send-icon"
          src="https://img.icons8.com/fluency/48/sent.png"
          alt="send"
          onClick={() => handleSubscribe(email)}
          style={{ cursor: "pointer" }}
        />
      </form>

      {/* show messages */}
      {Msg && <p className="subscribe-msg">{Msg}</p>}
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>Copyright © 2024 JOBCONNECT. All Rights Reserved.</p>
                        <p>User Terms & Conditions | Privacy Policy</p>
                    </div>
      </span>

                {/* Scroll To Top Button */}
                <button 
                    className={`scroll-top-btn ${showTopBtn ? "show" : ""}`} 
                    onClick={scrollToTop}
                >
                    <ArrowUp size={24} color="white" strokeWidth={3} />
                </button>

    </div>
  );
};

export default JobBoard;