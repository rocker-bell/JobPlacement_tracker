// import React from "react";
// import "../Styles/AboutUS.css"; // Optional: external CSS for styling
// // import TeamMember1 from "../assets/team1.jpg"; 
// // import TeamMember2 from "../assets/team2.jpg";

// const AboutUs = () => {
//   return (
//     <div className="about-us-container">
//       {/* Hero / Intro Section */}
//       <section className="about-hero">
//         <h1>À propos de StageTracker</h1>
//         <p>
//           StageTracker est votre partenaire de confiance pour gérer et suivre les stages, les candidatures et les recrutements de manière efficace et transparente.
//         </p>
//       </section>

//       {/* Our Mission */}
//       <section className="about-mission">
//         <h2>Notre Mission</h2>
//         <p>
//           Nous voulons simplifier le processus de recrutement et offrir aux étudiants et aux entreprises une plateforme centralisée pour suivre, gérer et analyser toutes les candidatures et stages.
//         </p>
//       </section>

//       {/* Key Features */}
//       <section className="about-features">
//         <h2>Ce que nous offrons</h2>
//         <div className="features-grid">
//           <div className="feature-card">
//             <h3>Suivi des Candidatures</h3>
//             <p>Visualisez toutes vos candidatures et stages en un seul endroit.</p>
//           </div>
//           <div className="feature-card">
//             <h3>Notifications en Temps Réel</h3>
//             <p>Recevez des alertes pour les nouvelles offres et mises à jour de votre profil.</p>
//           </div>
//           <div className="feature-card">
//             <h3>Analyse & Statistiques</h3>
//             <p>Obtenez des rapports détaillés sur vos stages et candidats.</p>
//           </div>
//           <div className="feature-card">
//             <h3>Interface Intuitive</h3>
//             <p>Une plateforme facile à utiliser pour les étudiants et les recruteurs.</p>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="about-team">
//         <h2>Notre Équipe</h2>
//         <div className="team-grid">
//           <div className="team-member">
//             {/* <img src={TeamMember1} alt="Team Member" /> */}
//             <h3>Marie Dupont</h3>
//             <p>CEO & Fondatrice</p>
//           </div>
//           <div className="team-member">
//             {/* <img src={TeamMember2} alt="Team Member" /> */}
//             <h3>Alexandre Leroy</h3>
//             <p>CTO & Responsable Technique</p>
//           </div>
//           {/* Add more team members as needed */}
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="about-cta">
//         <h2>Prêt à simplifier vos stages et recrutements ?</h2>
//         <button className="btn-primary">Commencer Maintenant</button>
//       </section>
//     </div>
//   );
// };

// export default AboutUs;


import React from "react";
import "../Styles/AboutUS.css"; // Optional: external CSS for styling
// import TeamMember1 from "../assets/team1.jpg"; 
// import TeamMember2 from "../assets/team2.jpg";
import { useNavigate } from "react-router-dom";



const AboutUs = () => {
  const navigate = useNavigate()
  const handleStart = () => {
  navigate("/GetStarted", {
    state: {
     
      state: "register"
    }
  });
};
  return (
    <div className="about-us-container">
      {/* Hero / Intro Section */}
      <section className="about-hero">
        <h1>À propos de StageTracker</h1>
        <p>
          StageTracker est une plateforme professionnelle dédiée à la gestion, au suivi
          et à l’optimisation des stages, des candidatures et des processus de recrutement.
          Nous accompagnons les étudiants et les entreprises vers une collaboration plus
          efficace et transparente.
        </p>
      </section>

      {/* Our Mission */}
      <section className="about-mission">
        <h2>Notre Mission</h2>
        <p>
          Notre mission est de simplifier et de moderniser le processus de recrutement en
          proposant une solution centralisée, fiable et intuitive, permettant aux étudiants
          de suivre leurs candidatures et aux entreprises de gérer leurs talents avec efficacité.
        </p>
      </section>

      {/* Key Features */}
      <section className="about-features">
        <h2>Nos Fonctionnalités Clés</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Suivi des Candidatures</h3>
            <p>
              Centralisez et suivez l’ensemble de vos candidatures et stages depuis
              une interface unique.
            </p>
          </div>
          <div className="feature-card">
            <h3>Notifications en Temps Réel</h3>
            <p>
              Restez informé grâce à des notifications instantanées sur les nouvelles
              opportunités et les mises à jour importantes.
            </p>
          </div>
          <div className="feature-card">
            <h3>Analyses et Statistiques</h3>
            <p>
              Accédez à des tableaux de bord et rapports détaillés pour analyser les
              performances et les tendances.
            </p>
          </div>
          <div className="feature-card">
            <h3>Interface Intuitive</h3>
            <p>
              Une expérience utilisateur claire et ergonomique, adaptée aussi bien
              aux étudiants qu’aux recruteurs.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="about-team">
        <h2>Notre Équipe</h2>
        <div className="team-grid">
          <div className="team-member">
            
            <h3>Marie Dupont</h3>
            <p>Fondatrice & Directrice Générale (CEO)</p>
          </div>
          <div className="team-member">
           
            <h3>Alexandre Leroy</h3>
            <p>Directeur Technique (CTO)</p>
          </div>
          
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="about-cta">
        <h2>Optimisez dès aujourd’hui la gestion de vos stages et recrutements</h2>
        <button className="btn-primary" onClick={handleStart}>Commencer dès maintenant</button>
      </section>
    </div>
  );
};

export default AboutUs;
