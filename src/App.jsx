import {Routes, Route} from "react-router-dom";
import LandingPage from "./Components/Landing_page";
import JobBoard from "./Components/JobBoard";
import GetStarted from "./Components/getStarted";
import Entreprise_dashboard from "./Components/EntrepriseDashboard.jsx";
const App = () => {
  return (
    <>

      <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/JobBoard" element={<JobBoard/>} />
            <Route path="/GetStarted" element={<GetStarted/>}/>
            <Route path="/entreprise_dashboard" element={<Entreprise_dashboard/>}/>
      </Routes>

    </>
  )
}

export default App;