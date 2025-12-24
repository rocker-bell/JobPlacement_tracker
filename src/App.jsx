import {Routes, Route} from "react-router-dom";
import LandingPage from "./Components/Landing_page";
import JobBoard from "./Components/JobBoard";
import GetStarted from "./Components/getStarted";
const App = () => {
  return (
    <>

      <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/JobBoard" element={<JobBoard/>} />
            <Route path="/GetStarted" element={<GetStarted/>}/>
      </Routes>

    </>
  )
}

export default App;