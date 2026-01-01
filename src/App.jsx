import {Routes, Route} from "react-router-dom";
import LandingPage from "./Components/Landing_page";
import JobBoard from "./Components/JobBoard";
import GetStarted from "./Components/getStarted";
import Entreprise_dashboard from "./Components/EntrepriseDashboard.jsx";
import UserJobBoard from "./Components/UserJobBoard.jsx";
import EncadrantDashboard from "./Components/EncadrantDashboard.jsx";
import Encadrant from "./Components/Encadrant.jsx";
import Candidatures from "./Components/Candidatures.jsx";

const App = () => {
  return (
    <>

      <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/JobBoard" element={<JobBoard/>} />
            <Route path="/GetStarted" element={<GetStarted/>}/>
            <Route path="/jobboard_Entreprise" element={<Entreprise_dashboard/>}/>
            <Route path="/Jobboard_Stagiaire" element={<UserJobBoard/>} />
            <Route path="/jobboard_Encadrant"  element={<EncadrantDashboard/>}/>
            <Route path="/Encadrant/:id" element={<Encadrant/>}/>
            <Route path="/Candidatures/:id" element={<Candidatures/>}/>
            
      </Routes>

    </>
  )
}

export default App;