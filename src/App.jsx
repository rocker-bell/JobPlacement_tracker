import {Routes, Route} from "react-router-dom";
// import LandingPage from "./Components/Landing_page";
import JobBoard from "./Components/JobBoard";
import GetStarted from "./Components/getStarted";
import Entreprise_dashboard from "./Components/EntrepriseDashboard.jsx";
import UserJobBoard from "./Components/UserJobBoard.jsx";
import EncadrantDashboard from "./Components/EncadrantDashboard.jsx";
import Encadrant from "./Components/Encadrant.jsx";
import Candidatures from "./Components/Candidatures.jsx";
import Rapports from "./Components/Rapports.jsx";
import Postuler from "./Components/Postuler.jsx";
import Rapport_encadrant from "./Components/Rapport_encadrant.jsx";
import PasswordRecovery from "./Components/PasswordRecovery.jsx";
import AdminDashboard from "./Components/AdminPage.jsx";
import ContactUs from "./Components/contactPage.jsx";
const App = () => {
  return (
    <>

      <Routes>
            {/* <Route path="/" element={<LandingPage/>} /> */}
            <Route path="/" element={<JobBoard/>} />
            <Route path="/GetStarted" element={<GetStarted/>}/>
            <Route path="/jobboard_Entreprise" element={<Entreprise_dashboard/>}/>
            <Route path="/Jobboard_Stagiaire" element={<UserJobBoard/>} />
            <Route path="/jobboard_Encadrant"  element={<EncadrantDashboard/>}/>
            <Route path="/Encadrant/:id" element={<Encadrant/>}/>
            <Route path="/Candidatures/:id" element={<Candidatures/>}/>
             <Route path="/Rapports/:id" element={<Rapports/>}/>
              {/* <Route path="/empty" element={<Entreprise_dashboard />} /> */}
              <Route path="/Postuler/:id" element={<Postuler/>} />
              <Route path="/EncadrantRapport/:id"  element={<Rapport_encadrant/>}/>
              <Route path="/AccountRecovery"  element={<PasswordRecovery/>} />
              <Route path="/jobboard_admin"  element={<AdminDashboard/>} />
              <Route path="/ContactUs" element={<ContactUs/>} />
      </Routes>

    </>
  )
}

export default App;