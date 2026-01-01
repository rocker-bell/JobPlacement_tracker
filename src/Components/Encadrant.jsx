import {useState, useEffect, use} from "react";
import { useParams } from "react-router-dom";
import "../Styles/Encadrant_dasboard_ref_entreprise.css"
const Encadrant = () => {
    const [stageId, setstageId] = useState(null)
    const {id} = useParams()

    useEffect(() => {
            setstageId(id)
    }, [id])

    return (
        <>
        <div className="Encadrant_dasboard_ref_entreprise">
            <p className="stage_id_ref_entreprise">stage id is : {stageId}</p>
        </div>
        </>
    )
}

export default Encadrant;