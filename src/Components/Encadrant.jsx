import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import "../Styles/Encadrant_dasboard_ref_entreprise.css";
import Logo1 from "../assets/Logo1.svg";
import "../Styles/Encadrant.css";

const Encadrant = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [stageId, setStageId] = useState(null);
  const [Query, setQuery] = useState({
    encadrant_search_querry: "",
  });
  const [submitQuerry, setSubmitQuerry] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setStageId(id);
  }, [id]);

  return (
    <div className="Encadrant_dasboard_ref_entreprise">
      <p className="stage_id_ref_entreprise">
        stage id is : {stageId}
      </p>

      <nav className="encadrant_nav">
        <img src={Logo1} alt="" className="Encadrant_nav_logo" />

        <ArrowLeft
          size={24}
          onClick={() => navigate("/jobboard_Entreprise")}
          className="nav-icon"
        />

        <ul className="encadrant_navLists">
          <li className="encadrant_nav_list">
            <input
              type="text"
              placeholder="search for encadrant here"
              className="encadrant_query_input"
              name="encadrant_search_querry"
              value={Query.encadrant_search_querry}
              onChange={handleChange}
            />

            <Search
              size={28}
              color="#333"
              onClick={() =>
                setSubmitQuerry(Query.encadrant_search_querry)
              }
              style={{ cursor: "pointer" }}
            />
          </li>
        </ul>
      </nav>

      <div className="main_encadrant_container">
        <p><strong>Live query:</strong> {Query.encadrant_search_querry}</p>
        <p><strong>Submitted query:</strong> {submitQuerry}</p>
      </div>
    </div>
  );
};

export default Encadrant;
