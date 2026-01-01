import React, { useEffect, useState } from 'react';

import { 
  Building2, MoreHorizontal, Bookmark, Ban, Send, 
  Search, MapPin, MessageSquare, Bell, User, ArrowUp 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/JobBoard.css';


import submit from "../assets/submit.png";
import send from "../assets/send.png";

import menu from "../assets/menu.svg";
import menu_active from "../assets/menu_active.svg";

// import Logo1 from "../assets/Logo1";
import Logo1 from "../assets/Logo1.svg"; 




// --- DATA ---
// const jobData = [
//   {
//     id: 1,
//     title: "Stage PFE - Ingénieur Cloud Native Full Stack (Python / AWS / DevOps)",
//     company: "CapitaleTech",
//     location: "Rabat",
//     type: "Stage",
//     tags: ["nouveau", "Candidature simplifiée"],
//     posted: "Posted just now",
//     description: `Description du poste :
//       Nous recherchons un(e) stagiaire PFE pour renforcer notre équipe technique sur la conception et le développement cloud.
      
//       Alors que l'offre précédente se concentrait sur l'interface utilisateur, ce rôle est axé sur la "salle des machines".
//       Vous serez responsable de construire des services backend robustes, évolutifs et sécurisés en Python, de définir l'infrastructure cloud sur AWS via du code (Terraform), et d'automatiser les processus de déploiement (CI/CD).
      
//       Compétences requises :
//       - Python (Flask/Django/FastAPI)
//       - AWS (EC2, Lambda, S3)
//       - Docker & Kubernetes`
//   },
//   {
//     id: 2,
//     title: "Stage développement avec React et Python",
//     company: "ONEE branche Eau",
//     location: "Rabat",
//     type: "Stage",
//     tags: ["Candidature simplifiée"],
//     posted: "Posted 2 days ago",
//     description: `Description du poste :
//       L'Office National de l'Électricité et de l'Eau Potable (Branche Eau) recherche un stagiaire passionné pour participer à la digitalisation de nos services internes.
      
//       Vos missions :
//       - Développement d'interfaces web dynamiques avec React.js.
//       - Création d'API RESTful avec Python.
      
//       Profil recherché :
//       - Etudiant en dernière année d'école d'ingénieur ou master.`
//   },
//   {
//     id: 3,
//     title: "Stage PFE – Ingénieur Sharepoint / Data",
//     company: "ORANGE BUSINESS",
//     location: "Rabat",
//     type: "Intérim",
//     tags: [],
//     posted: "Posted 5 days ago",
//     description: `Description du poste :
//       Orange Business Maroc recrute son futur stagiaire PFE pour travailler sur des solutions collaboratives et l'analyse de données.
      
//       Missions :
//       - Configuration et personnalisation de l'environnement SharePoint.
//       - Création de workflows d'automatisation (Power Automate).`
//   }
// ];

const JobBoard = () => {
//   const [Searchquery, setSearchquery] = useState({
//     home_page_search_query: ""
    
// })
//   const [submittedQuery, setSubmitedquery] = useState({
//      home_page_search_query: ""
// })

//   const [searchQuery, setSearchQuery] = useState("");
// const [submittedQuery, setSubmittedQuery] = useState("");

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

  const handleGetstarted = () => {
    navigate("/GetStarted")
  }

  const handleContactus = () => {
    navigate("/contact")
}

//  const handleScroll = () => {
//             if (window.scrollY > 400) {
//                 setShowTopBtn(true);
//             } else {
//                 setShowTopBtn(false);
//             }
//         };

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

//      async function FetchSearchedStage(submittedQuery) {
//   try {
//     const response = await fetch(`${BASE_URL}/fetchStagebyQuerry.php`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         query: submittedQuery, // ✅ FIXED key
//       }),
//     });

//     if (!response.ok) {
//       console.error("HTTP error:", response.status);
//       return;
//     }

//     const data = await response.json();
//     console.log(data)

//     if (data.success) {
//       setFetchedStages(data.query_data); // ✅ FIXED key
//     } else {
//       console.error("API error:", data.message);
//     }
//   } catch (err) {
//     console.error("Fetch error:", err);
//   }
// }


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


//    useEffect(() => {
//   console.log("submitted query:", submittedQuery);
//   FetchSearchedStage(submittedQuery.query_data)
//   if (submittedQuery.query_data.length > 0) {
//   setSelectedJob(data.query_data[0]); // select first only once
// }
// }, [submittedQuery]);


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
  alert("apply click = " + id)
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
            <a href="#" className="nav-link">Avis sur les entreprises</a>
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-icon-group">
            <MessageSquare size={24} className="nav-icon" />
            <Bell size={24} className="nav-icon" />
            <User size={24} className="nav-icon" onClick={handleGetstarted}/>
          </div>
          <a href="#" className="nav-post-job">Entreprises / Publier une offre d'emploi</a>
        </div>
      </nav>

      <div className="max-width-wrapper">
        
        {/* --- 2. SEARCH BAR --- */}
        <div className="search-container">
          {/* <div className="search-wrapper">
            <div className="input-group divider">
              <Search size={20} className="input-icon" strokeWidth={2.5} />
              <input 
                type="text" 
                placeholder="Intitulé de poste, mots-clés..." 
                className="search-input"
              />
            </div>
            <div className="input-group">
              <MapPin size={20} className="input-icon" strokeWidth={2.5}  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} />
              
               <input
              className="search-input"
              value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              /> 
            </div>
            
           <button className="btn-search-main" onClick={() => setSubmittedQuery(searchQuery)}>
  Lancer la recherche
</button>

          </div> */}


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
          
          {/* Left Column (List) */}
          {/* <div className="feed-header">
            <h2>Emplois recommandés</h2>
            <p className="feed-subtitle">Emplois basés sur votre activité sur Indeed</p>
            
            {jobData.map((job) => (
              <div 
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`job-card ${selectedJob.id === job.id ? 'active' : ''}`}
              >
                <div className="card-top">
                  <div>
                    {job.tags.includes('nouveau') && (
                      <span className="tag-new">nouveau</span>
                    )}
                    <h3 className="job-title">{job.title}</h3>
                    <div className="company-name">{job.company}</div>
                    <div className="job-location">{job.location}</div>
                  </div>
                  <button style={{background:'transparent', border:'none', cursor:'pointer'}}>
                     <MoreHorizontal size={24} color="#2d2d2d"/>
                  </button>
                </div>

                <div className="job-badges">
                  <span className="badge-gray">
                    <Building2 size={12}/> {job.type}
                  </span>
                  {job.tags.includes('Candidature simplifiée') && (
                    <span className="text-apply">
                       <Send size={12} fill="#2557a7" strokeWidth={0} />
                       <span style={{color:'#6f6f6f'}}>Candidature simplifiée</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div> */}
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


          {/* Right Column (Detail) */}
          {/* <div className="detail-panel">
            <div className="detail-header">
              <h2 className="detail-title">{selectedJob.title}</h2>
              <div className="detail-company-link">
                <a href="#">{selectedJob.company}</a> • {selectedJob.location}
              </div>
              
              <div className="action-buttons">
                <button className="btn-apply">Postuler maintenant</button>
                <button className="btn-icon"><Bookmark size={24}/></button>
                <button className="btn-icon"><Ban size={24}/></button>
              </div>
            </div>

            <div className="detail-content">
              <h3 className="section-title">Détails de l'emploi</h3>
              <div style={{ marginBottom: '20px' }}>
                <span className="badge-gray">
                  <Building2 size={14}/> {selectedJob.type}
                </span>
              </div>

              <h3 className="section-title">Full job description</h3>
              <div className="job-description-text">
                {selectedJob.description}
              </div>
            </div>
          </div> */}
          {/* {selectedJob && (
  <div className="detail-panel">
    <h2>{selectedJob.titre}</h2>

    <p>
      {selectedJob.entreprise_id} • {selectedJob.emplacement}
    </p>

    <p>{selectedJob.description}</p>
  </div>
)} */}

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
                        <p>Copyright © 2024 PrimeStack. All Rights Reserved.</p>
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