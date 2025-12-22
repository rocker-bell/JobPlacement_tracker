// import React, { useState } from 'react';
// import { MapPin, Building2, MoreHorizontal, Bookmark, Ban, ExternalLink, Send } from 'lucide-react';

// // 1. DATA: The 3 examples extracted from your screenshot
// const jobData = [
//   {
//     id: 1,
//     title: "Stage PFE - Ingénieur Cloud Native Full Stack (Python / AWS / DevOps)",
//     company: "CapitaleTech",
//     location: "Rabat",
//     type: "Stage",
//     tags: ["nouveau", "Candidature simplifiée"],
//     posted: "Posted just now",
//     description: `
//       Description du poste :
//       Nous recherchons un(e) stagiaire PFE pour renforcer notre équipe technique sur la conception et le développement cloud.
      
//       Alors que l'offre précédente se concentrait sur l'interface utilisateur, ce rôle est axé sur la "salle des machines".
//       Vous serez responsable de construire des services backend robustes, évolutifs et sécurisés en Python, de définir l'infrastructure cloud sur AWS via du code (Terraform), et d'automatiser les processus de déploiement (CI/CD).
      
//       Compétences requises :
//       - Python (Flask/Django/FastAPI)
//       - AWS (EC2, Lambda, S3)
//       - Docker & Kubernetes
//     `
//   },
//   {
//     id: 2,
//     title: "Stage développement avec React et Python",
//     company: "ONEE branche Eau",
//     location: "Rabat",
//     type: "Stage",
//     tags: ["Candidature simplifiée"],
//     posted: "Posted 2 days ago",
//     description: `
//       Description du poste :
//       L'Office National de l'Électricité et de l'Eau Potable (Branche Eau) recherche un stagiaire passionné pour participer à la digitalisation de nos services internes.
      
//       Vos missions :
//       - Développement d'interfaces web dynamiques avec React.js.
//       - Création d'API RESTful avec Python.
//       - Participation aux réunions de spécification technique.
      
//       Profil recherché :
//       - Etudiant en dernière année d'école d'ingénieur ou master.
//       - Bonnes connaissances en JavaScript et Python.
//     `
//   },
//   {
//     id: 3,
//     title: "Stage PFE – Ingénieur Sharepoint / Data",
//     company: "ORANGE BUSINESS",
//     location: "Rabat",
//     type: "Intérim",
//     tags: [],
//     posted: "Posted 5 days ago",
//     description: `
//       Description du poste :
//       Orange Business Maroc recrute son futur stagiaire PFE pour travailler sur des solutions collaboratives et l'analyse de données.
      
//       Missions :
//       - Configuration et personnalisation de l'environnement SharePoint.
//       - Création de workflows d'automatisation (Power Automate).
//       - Analyse de données et création de tableaux de bord (Power BI).
      
//       Environnement technique :
//       - Microsoft 365, SharePoint, Power Platform.
//       - Notions de base de données (SQL).
//     `
//   }
// ];

// const JobBoard = () => {
//   // State to track which job is currently selected
//   const [selectedJob, setSelectedJob] = useState(jobData[0]);

//   return (
//     <div className="min-h-screen bg-[#f3f2f1] font-sans text-gray-800 p-4">
      
//       {/* Header / Search Bar Mockup */}
//       <div className="max-w-7xl mx-auto mb-6 flex gap-4">
//         <div className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-300 flex items-center text-gray-400">
//           Intitulé de poste, mots-clés...
//         </div>
//         <div className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-300 flex items-center justify-between">
//           <span className="text-black font-medium">Rabat</span>
//           <button className="bg-blue-700 text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-blue-800">
//             Lancer la recherche
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* LEFT COLUMN: Job List */}
//         <div className="space-y-3">
//           <h2 className="text-xl font-bold mb-2">Emplois recommandés</h2>
//           <p className="text-sm text-gray-500 mb-4">Emplois basés sur votre activité</p>
          
//           {jobData.map((job) => (
//             <div 
//               key={job.id}
//               onClick={() => setSelectedJob(job)}
//               className={`
//                 bg-white p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all relative
//                 ${selectedJob.id === job.id ? 'border-blue-600 border-2' : 'border-gray-200'}
//               `}
//             >
//               {/* Card Header */}
//               <div className="flex justify-between items-start">
//                 <div>
//                   {job.tags.includes('nouveau') && (
//                     <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded mb-2 inline-block">
//                       nouveau
//                     </span>
//                   )}
//                   <h3 className={`font-bold text-lg ${selectedJob.id === job.id ? 'text-blue-700' : 'text-gray-900'}`}>
//                     {job.title}
//                   </h3>
//                   <div className="text-sm text-gray-700 mt-1">{job.company}</div>
//                   <div className="text-sm text-gray-500">{job.location}</div>
//                 </div>
//                 <button className="text-gray-400 hover:text-gray-800"><MoreHorizontal size={20}/></button>
//               </div>

//               {/* Tags/Badges */}
//               <div className="mt-3 flex flex-wrap gap-2">
//                 <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded flex items-center">
//                   <Building2 size={12} className="mr-1"/> {job.type}
//                 </span>
//                 {job.tags.includes('Candidature simplifiée') && (
//                   <span className="text-blue-600 text-xs flex items-center font-semibold">
//                     <Send size={12} className="mr-1 fill-blue-600"/> Candidature simplifiée
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* RIGHT COLUMN: Detail View (Sticky) */}
//         <div className="hidden md:block">
//           <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-4 max-h-[90vh] overflow-y-auto">
            
//             {/* Detail Header */}
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
//               <div className="text-sm text-gray-600 mb-4">
//                 <a href="#" className="underline text-gray-700 hover:text-blue-700">{selectedJob.company}</a> • {selectedJob.location}
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors">
//                   Postuler maintenant
//                 </button>
//                 <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"><Bookmark size={20}/></button>
//                 <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"><Ban size={20}/></button>
//               </div>
//             </div>

//             {/* Scrollable Content */}
//             <div className="p-6">
//               <h3 className="text-lg font-bold mb-3">Détails de l'emploi</h3>
//               <div className="mb-6">
//                 <span className="inline-block bg-gray-100 rounded px-2 py-1 text-sm font-semibold text-gray-700">
//                   <Building2 size={14} className="inline mr-1"/> {selectedJob.type}
//                 </span>
//               </div>

//               <h3 className="text-lg font-bold mb-3">Full job description</h3>
//               <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
//                 {selectedJob.description}
//               </div>
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default JobBoard;


// import React, { useState } from 'react';
// import { Building2, MoreHorizontal, Bookmark, Ban, Send } from 'lucide-react';
// import '../Styles/JobBoard.css'; // Make sure to import the CSS file

// // ... (Keep the exact same const jobData = [...] array from the previous answer) ...
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
//       Nous recherchons un(e) stagiaire PFE pour renforcer notre équipe technique...
//       (See previous code for full text)`
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
//       L'Office National de l'Électricité et de l'Eau Potable...`
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
//       Orange Business Maroc recrute son futur stagiaire PFE...`
//   }
// ];

// const JobBoard = () => {
//   const [selectedJob, setSelectedJob] = useState(jobData[0]);

//   return (
//     <div className="job-board-container">
      
//       {/* Header */}
//       <div className="max-width-wrapper search-header">
//         <div className="search-input-box">
//           Intitulé de poste, mots-clés...
//         </div>
//         <div className="location-input-box">
//           <span className="location-text">Rabat</span>
//           <button className="btn-search">Lancer la recherche</button>
//         </div>
//       </div>

//       <div className="max-width-wrapper main-grid">
        
//         {/* Left Column */}
//         <div className="feed-header">
//           <h2>Emplois recommandés</h2>
//           <p className="feed-subtitle">Emplois basés sur votre activité</p>
          
//           {jobData.map((job) => (
//             <div 
//               key={job.id}
//               onClick={() => setSelectedJob(job)}
//               className={`job-card ${selectedJob.id === job.id ? 'active' : ''}`}
//             >
//               <div className="card-top">
//                 <div>
//                   {job.tags.includes('nouveau') && (
//                     <span className="tag-new">nouveau</span>
//                   )}
//                   <h3 className="job-title">{job.title}</h3>
//                   <div className="company-name">{job.company}</div>
//                   <div className="job-location">{job.location}</div>
//                 </div>
//                 <MoreHorizontal size={20} color="#6f6f6f"/>
//               </div>

//               <div className="job-badges">
//                 <span className="badge-gray">
//                   <Building2 size={12}/> {job.type}
//                 </span>
//                 {job.tags.includes('Candidature simplifiée') && (
//                   <span className="text-apply">
//                     <Send size={12} fill="#2557a7"/> Candidature simplifiée
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Right Column */}
//         <div className="detail-panel">
//           <div className="detail-header">
//             <h2 className="detail-title">{selectedJob.title}</h2>
//             <div className="detail-company-link">
//               <a href="#">{selectedJob.company}</a> • {selectedJob.location}
//             </div>
            
//             <div className="action-buttons">
//               <button className="btn-apply">Postuler maintenant</button>
//               <button className="btn-icon"><Bookmark size={20}/></button>
//               <button className="btn-icon"><Ban size={20}/></button>
//             </div>
//           </div>

//           <div className="detail-content">
//             <h3 className="section-title">Détails de l'emploi</h3>
//             <div style={{ marginBottom: '20px' }}>
//               <span className="badge-gray">
//                 <Building2 size={14}/> {selectedJob.type}
//               </span>
//             </div>

//             <h3 className="section-title">Full job description</h3>
//             <div className="job-description-text">
//               {selectedJob.description}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default JobBoard;


import React, { useState } from 'react';
import { 
  Building2, MoreHorizontal, Bookmark, Ban, Send, 
  Search, MapPin, MessageSquare, Bell, User 
} from 'lucide-react';
import '../Styles/JobBoard.css';

// --- DATA ---
const jobData = [
  {
    id: 1,
    title: "Stage PFE - Ingénieur Cloud Native Full Stack (Python / AWS / DevOps)",
    company: "CapitaleTech",
    location: "Rabat",
    type: "Stage",
    tags: ["nouveau", "Candidature simplifiée"],
    posted: "Posted just now",
    description: `Description du poste :
      Nous recherchons un(e) stagiaire PFE pour renforcer notre équipe technique sur la conception et le développement cloud.
      
      Alors que l'offre précédente se concentrait sur l'interface utilisateur, ce rôle est axé sur la "salle des machines".
      Vous serez responsable de construire des services backend robustes, évolutifs et sécurisés en Python, de définir l'infrastructure cloud sur AWS via du code (Terraform), et d'automatiser les processus de déploiement (CI/CD).
      
      Compétences requises :
      - Python (Flask/Django/FastAPI)
      - AWS (EC2, Lambda, S3)
      - Docker & Kubernetes`
  },
  {
    id: 2,
    title: "Stage développement avec React et Python",
    company: "ONEE branche Eau",
    location: "Rabat",
    type: "Stage",
    tags: ["Candidature simplifiée"],
    posted: "Posted 2 days ago",
    description: `Description du poste :
      L'Office National de l'Électricité et de l'Eau Potable (Branche Eau) recherche un stagiaire passionné pour participer à la digitalisation de nos services internes.
      
      Vos missions :
      - Développement d'interfaces web dynamiques avec React.js.
      - Création d'API RESTful avec Python.
      
      Profil recherché :
      - Etudiant en dernière année d'école d'ingénieur ou master.`
  },
  {
    id: 3,
    title: "Stage PFE – Ingénieur Sharepoint / Data",
    company: "ORANGE BUSINESS",
    location: "Rabat",
    type: "Intérim",
    tags: [],
    posted: "Posted 5 days ago",
    description: `Description du poste :
      Orange Business Maroc recrute son futur stagiaire PFE pour travailler sur des solutions collaboratives et l'analyse de données.
      
      Missions :
      - Configuration et personnalisation de l'environnement SharePoint.
      - Création de workflows d'automatisation (Power Automate).`
  }
];

const JobBoard = () => {
  const [selectedJob, setSelectedJob] = useState(jobData[0]);

  return (
    <div className="job-board-container">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="navbar">
        <div className="nav-left">
          {/* Logo (Text representation) */}
          <a href="#" className="nav-logo">indeed</a>
          <div className="nav-links">
            <a href="#" className="nav-link active">Page d'accueil</a>
            <a href="#" className="nav-link">Avis sur les entreprises</a>
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-icon-group">
            <MessageSquare size={24} className="nav-icon" />
            <Bell size={24} className="nav-icon" />
            <User size={24} className="nav-icon" />
          </div>
          <a href="#" className="nav-post-job">Entreprises / Publier une offre d'emploi</a>
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
                placeholder="Intitulé de poste, mots-clés..." 
                className="search-input"
              />
            </div>
            <div className="input-group">
              <MapPin size={20} className="input-icon" strokeWidth={2.5} />
              <input 
                type="text" 
                defaultValue="Rabat" 
                className="search-input"
              />
            </div>
            <button className="btn-search-main">Lancer la recherche</button>
          </div>
        </div>


        {/* --- 3. MAIN GRID --- */}
        <div className="main-grid">
          
          {/* Left Column (List) */}
          <div className="feed-header">
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
          </div>

          {/* Right Column (Detail) */}
          <div className="detail-panel">
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobBoard;