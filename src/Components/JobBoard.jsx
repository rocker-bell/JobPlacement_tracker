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
const [submittedQuery, setSubmittedQuery] = useState({
  job: "",
  location: "",
});
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
    navigate("/contact")
}


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




async function FetchSearchedStage(submittedQuery) {
  try {
    const response = await fetch(`${BASE_URL}/FetchStagesByJObboardQuery.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        job: submittedQuery.job,
        location: submittedQuery.location,
      }),
    });

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return;
    }

    const data = await response.json();
    console.log(data);

    if (data.success) {
      setFetchedStages(data.query_data);
 if (data.query_data.length > 0) {
    setSelectedJob(data.query_data);
  } } else {
      console.error("API error:", data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
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
}));

const handleapply = (id) => {
  // alert("apply click = " + id)
  navigate(`/Postuler/${id}`)
}

const handleBookmark = () => {
  const user_id = localStorage.getItem("user_id");
  if(user_id) {
     alert("Bookmark job for user")

  }
  alert("Bookmark")
}

const handleStar = () => {
    const user_id = localStorage.getItem("user_id");
  if(user_id) {
     alert("star job for user")

  }
  alert('star')
}






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
          <div className="nav-icon-group">
            
            <User size={24} className="nav-icon" onClick={handleGetstarted}/>
          </div>
          <li  className="nav-post-job" onClick={handleGetstarted}>Entreprises / Publier une offre d'emploi</li>
        </div>
      </nav>

      <div className="max-width-wrapper">
        
        {/* --- 2. SEARCH BAR --- */}
        <div className="search-container">
          


          <div className="search-wrapper">

  {/* Job title input */}
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

  {/* Location input (replaces MapPin) */}
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
    FetchSearchedStage(query); // ✅ THIS WAS MISSING
  }}
  >
    Lancer la recherche
  </button>

</div>

        </div>


        {/* --- 3. MAIN GRID --- */}
        <div className="main-grid">
          
       
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
    {/* Header */}
    <div className="detail-header">
      <h2 className="detail-title">{selectedJob.titre}</h2>
      
      <div className="detail-company-link">
        <a href="#">{selectedJob.entreprise_id}</a> • {selectedJob.emplacement}
      </div>

      <div className="action-buttons">
        <button className="btn-apply" onClick={() => handleapply(selectedJob.offre_id)}>Postuler maintenant</button>
        <button className="btn-icon">
          <Bookmark size={24} />
        </button>
        <button className="btn-icon">
          <Ban size={24} />
        </button>

      </div>
    </div>

    {/* Content */}
    <div className="detail-content">
      {/* Job type badge */}
      <h3 className="section-title">Détails du stage</h3>
      <div style={{ marginBottom: '20px' }}>
        <span className="badge-gray">
          <Building2 size={14} /> {selectedJob.type_de_stage}
        </span>
      </div>

      {/* Full description */}
      <h3 className="section-title">Description complète</h3>
      <div className="job-description-text">
        {selectedJob.description}
      </div>
      <button className='selected_job_actions_group'>
               <Bookmark size={20} color="blue" strokeWidth={1.5}  onClick={handleBookmark} />
        <Star size={20} className="text-yellow-500" onClick={handleStar} />

      </button>
    </div>
  </div>
)}



        </div>
      </div>

      <footer className="footer">
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
                                Where innovation meets reliable service.
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
                                <Link className="footer-list-links-about" to="/about_us">About us</Link>
                                <Link className="footer-list-links-about" to="/Package_services">services</Link>
                                <Link className="footer-list-links-about" to="/resume">resume</Link>
                               
                                <Link  className="footer-list-links-about" to="/more_projects">Projects</Link>
                                
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
                            <form className="subscribe">
                                <input type="email" placeholder="Your email" className="subscribe-input" />
                                <img src={submit} className="subscribe-btn" title="subscribe!"/>
                            </form>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>Copyright © 2024 JOBCONNECT. All Rights Reserved.</p>
                        <p>User Terms & Conditions | Privacy Policy</p>
                    </div>
                </footer>

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