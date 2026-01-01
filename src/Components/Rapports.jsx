import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
const Rapports = () => {
    const [stageId, setstageId] = useState(null)
    const {id} = useParams()
    useEffect(() => {
            setstageId(id)
    }, [id])
    return (
        <>  
            <div>
                <p>stage id = {stageId}</p>
            </div>
        </>
    )
}

export default Rapports;