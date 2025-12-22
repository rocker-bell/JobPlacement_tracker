import {Routes, Route} from "react-router-dom";
import LandingPage from "./Components/Landing_page";
import JobBoard from "./Components/JobBoard";
const App = () => {
  return (
    <>

      <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/JobBoard" element={<JobBoard/>} />
      </Routes>

    </>
  )
}

export default App;