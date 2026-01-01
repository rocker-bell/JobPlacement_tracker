import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Candidatures = () => {
    const [stageId, setstageId] = useState(null)
    const {id} = useParams()
    useEffect(() => {
        setstageId(id)
    }, [id])
    return (
        <>  
                <p>stage id : {stageId}</p>
        </>
    )
}

export default Candidatures;