import {useState, useEffect} from "react";




const EncadrantDashboard = () => {
    const [userid, setuserid] = useState(null);

    useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    setuserid(user_id)
}, [])
    return (
        <>
                    <h1>Encadrant : {userid} </h1>   
        </>
    )
}

export default EncadrantDashboard;