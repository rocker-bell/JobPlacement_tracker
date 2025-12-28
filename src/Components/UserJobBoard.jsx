import {useState, useEffect} from "react";




const UserJobBoard = () => {
    const [userid, setuserid] = useState(null);

    useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    setuserid(user_id)
}, [])
    return (
        <>
                    <h1>Stagiaire: {userid}</h1>   
        </>
    )
}

export default UserJobBoard;