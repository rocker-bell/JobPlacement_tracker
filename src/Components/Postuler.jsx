// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const Postuler = () => {
//   const { id } = useParams();
//   const userId = localStorage.getItem("user_id");
//   const BASE_URL = "http://localhost:8000";

//   const [userinfo, setuserinfo] = useState(null);

//   useEffect(() => {
//     if (!userId) return;

//     const fetchUserInfo = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/fetch_profile.php`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ user_id: userId }),
//         });

//         const data = await res.json();
//         setuserinfo(data);
//       } catch (err) {
//         console.error("Failed to fetch user info:", err);
//       }
//     };

//     fetchUserInfo();
//   }, [userId]);

//   return (
//     <div className="Postuler_dashboard">
//       <p>Stage id : {id}, user id : {userId}</p>

//       <div className="user_info">
//         {userinfo ? (
//           <>
//             <p>Name: {userinfo.name}</p>
//             <p>Email: {userinfo.email}</p>
//             {/* Render other profile info */}
//           </>
//         ) : (
//           <p>Loading user info...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Postuler;

// working

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft} from "lucide-react";

// const Postuler = () => {
//   const navigate = useNavigate()
//   const { id } = useParams(); // stage_id
//   const userId = localStorage.getItem("user_id");
//   const BASE_URL = "http://localhost:8000";

//   const [userinfo, setuserinfo] = useState(null);
//   const [candidature, setCandidature] = useState(null);
//   const [motivation, setMotivation] = useState("");
//   const [cv, setCv] = useState(null);

//   useEffect(() => {
//     if (!userId) return;

//     const fetchUserInfo = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/fetch_profile.php`, {
//           method: "POST",
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           body: new URLSearchParams({ user_id: userId }),
//         });

//         const data = await res.json();
//         setuserinfo(data.user_data);
//         console.log(userinfo)
//       } catch (err) {
//         console.error("Failed to fetch user info:", err);
//       }
//     };

//     fetchUserInfo();
//   }, [userId]);


// //   ✅ Fetch candidature for this stage
//   useEffect(() => {
//     if (!userId || !id) return navigate('/GetStarted');

//     const fetchCandidature = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/fetch_candidature.php`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: new URLSearchParams({ user_id: userId, offre_id: id }),
//         });
//         const data = await res.json();
//         if (data.success) setCandidature(data.candidature);
//       } catch (err) {
//         console.error("Failed to fetch candidature:", err);
//       }
//     };

//     fetchCandidature();
//   }, [userId, id]);

//   // ✅ Submit new candidature
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!motivation || !cv) return alert("Fill all fields and upload CV");

//     const formData = new FormData();
//     formData.append("user_id", userId);
//     formData.append("offre_id", id);
//     formData.append("message_motivation", motivation);
//     formData.append("cv_file", cv);

//     try {
//       const res = await fetch(`${BASE_URL}/candidature.php`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert("Candidature submitted!");
//         setCandidature(data.candidature);
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit candidature");
//     }
//   };



//   return (
//     <div className="Postuler_dashboard">
//        < ArrowLeft
//     size={24}
//     onClick={() => navigate("/Jobboard_Stagiaire")}
//     className="nav-icon"
//   />
//       <h2>Stage ID: {id}</h2>
//       <h2>USER ID: {userId}</h2>

//       <div className="user_info">
//         {userinfo ? (
//           <div>
//             <p><strong>User ID:</strong> {userinfo.user_id}</p>
//             {/* <p><strong>UUID:</strong> {userinfo.uuid}</p> */}
//             <p><strong>Email:</strong> {userinfo.email}</p>
//             <p><strong>Telephone:</strong> {userinfo.telephone || "N/A"}</p>
//             <p><strong>Role:</strong> {userinfo.role}</p>
//             <p><strong>Account Status:</strong> {userinfo.account_status}</p>
//             <p><strong>Created At:</strong> {userinfo.created_at}</p>
//             <p><strong>Updated At:</strong> {userinfo.updated_at}</p>
//           </div>
//         ) : (
//           <p>Loading user info...</p>
//         )}
//       </div>


//         <div className="candidature_info">
//         {candidature ? (
//           <div>
//             <h3>Your Candidature</h3>
//             <p><strong>Status:</strong> {candidature.statut}</p>
//             <p><strong>Message Motivation:</strong> {candidature.message_motivation}</p>
//             <p><strong>CV:</strong> {candidature.cv_path}</p>
//           </div>
//         ) : (
//           <div>
//             <h3>Submit Your Candidature</h3>
//             <form onSubmit={handleSubmit}>
//               <div>
//                 <label>Message Motivation:</label>
//                 <textarea
//                   value={motivation}
//                   onChange={(e) => setMotivation(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Upload CV:</label>
//                 <input
//                   type="file"
//                   accept=".pdf,.doc,.docx"
//                   onChange={(e) => setCv(e.target.files[0])}
//                 />
//               </div>
//               <button type="submit">Submit Candidature</button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Postuler;


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Postuler = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // stage_id
  const userId = localStorage.getItem("user_id");
  const BASE_URL = "http://localhost:8000";

  const [userinfo, setuserinfo] = useState(null);
  const [candidature, setCandidature] = useState(null);
  const [motivation, setMotivation] = useState("");
  const [cv, setCv] = useState(null);

  useEffect(() => {
    if (!userId) return;
    
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${BASE_URL}/fetch_profile.php`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ user_id: userId }),
        });

        const data = await res.json();
        setuserinfo(data.user_data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserInfo();
  }, [userId]);

  // ✅ Fetch candidature for this stage
  useEffect(() => {
    if (!userId || !id) {
      navigate("/GetStarted");
      return;
    }

    const fetchCandidature = async () => {
      try {
        const res = await fetch(`${BASE_URL}/fetch_candidature.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            user_id: userId,
            offre_id: id,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setCandidature(data.candidature);
        }
      } catch (err) {
        console.error("Failed to fetch candidature:", err);
      }
    };

    fetchCandidature();
  }, [userId, id, navigate]);

  // ✅ Submit new candidature
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivation || !cv) {
      alert("Fill all fields and upload CV");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("offre_id", id);
    formData.append("message_motivation", motivation);
    formData.append("cv_file", cv);

    try {
      const res = await fetch(`${BASE_URL}/candidature.php`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Candidature submitted!");
        setCandidature(data.candidature);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit candidature");
    }
  };

  return (
    <div className="Postuler_dashboard">
      <ArrowLeft
        size={24}
        onClick={() => navigate("/Jobboard_Stagiaire")}
        className="nav-icon"
      />

      <h2>Stage ID: {id}</h2>
      <h2>USER ID: {userId}</h2>

      <div className="user_info">
        {userinfo ? (
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">User ID:</label>
              <span className="form-control">{userinfo.user_id}</span>
            </div>

            <div className="form-group">
              <label className="form-label">Email:</label>
              <span className="form-control">{userinfo.email}</span>
            </div>

            <div className="form-group">
              <label className="form-label">Telephone:</label>
              <span className="form-control">
                {userinfo.telephone || "N/A"}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Role:</label>
              <span className="form-control">{userinfo.role}</span>
            </div>

            <div className="form-group">
              <label className="form-label">Account Status:</label>
              <span className="form-control">
                {userinfo.account_status}
              </span>
            </div>
          </div>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>

      <div className="candidature_info">
        {candidature ? (
          <div className="form-column">
            <h3>Your Candidature</h3>

            <div className="form-group">
              <label className="form-label">Status:</label>
              <span className="form-control">{candidature.statut}</span>
            </div>

            <div className="form-group">
              <label className="form-label">Message Motivation:</label>
              <span className="form-control">
                {candidature.message_motivation}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">CV:</label>
              <span className="form-control">{candidature.cv_path}</span>
            </div>
          </div>
        ) : (
          <div>
            <h3>Submit Your Candidature</h3>

            <form className="form-column" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Message Motivation:</label>
                <textarea
                  className="form-control"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload CV:</label>
                <input
                  className="form-control"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCv(e.target.files[0])}
                />
              </div>

              <button type="submit">Submit Candidature</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Postuler;



// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const Postuler = () => {
//   const { id: id } = useParams(); // offre_id
//   const userId = localStorage.getItem("user_id");
//   const BASE_URL = "http://localhost:8000";

//   const [userinfo, setUserinfo] = useState(null);
//   const [candidature, setCandidature] = useState(null);
//   const [motivation, setMotivation] = useState("");
//   const [cv, setCv] = useState(null);

//   // ✅ Fetch user info
//   useEffect(() => {
//     if (!userId) return;

//     const fetchUserInfo = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/fetch_profile.php`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: new URLSearchParams({ user_id: userId }),
//         });
//         const data = await res.json();
//         setUserinfo(data.user_data);
//       } catch (err) {
//         console.error("Failed to fetch user info:", err);
//       }
//     };

//     fetchUserInfo();
//   }, [userId]);

//   // ✅ Fetch candidature for this stage
//   useEffect(() => {
//     if (!userId || !id) return;

//     const fetchCandidature = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/fetch_candidature.php`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: new URLSearchParams({ user_id: userId, offre_id: id }),
//         });
//         const data = await res.json();
//         if (data.success) setCandidature(data.candidature);
//       } catch (err) {
//         console.error("Failed to fetch candidature:", err);
//       }
//     };

//     fetchCandidature();
//   }, [userId, id]);

//   // ✅ Submit new candidature
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!motivation || !cv) return alert("Fill all fields and upload CV");

//     const formData = new FormData();
//     formData.append("user_id", userId);
//     formData.append("offre_id", id);
//     formData.append("message_motivation", motivation);
//     formData.append("cv_file", cv);

//     try {
//       const res = await fetch(`${BASE_URL}/candidature.php`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert("Candidature submitted!");
//         setCandidature(data.candidature);
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit candidature");
//     }
//   };

//   return (
//     <div className="Postuler_dashboard">
//       <h2>Stage ID: {id}</h2>
//       <h2>User ID: {userId}</h2>

//       <div className="user_info">
//         {userinfo ? (
//           <div>
//             <p><strong>Email:</strong> {userinfo.email}</p>
//             <p><strong>Telephone:</strong> {userinfo.telephone || "N/A"}</p>
//             <p><strong>Role:</strong> {userinfo.role}</p>
//             <p><strong>Status:</strong> {userinfo.account_status}</p>
//           </div>
//         ) : (
//           <p>Loading user info...</p>
//         )}
//       </div>

//       <div className="candidature_info">
//         {candidature ? (
//           <div>
//             <h3>Your Candidature</h3>
//             <p><strong>Status:</strong> {candidature.statut}</p>
//             <p><strong>Message Motivation:</strong> {candidature.message_motivation}</p>
//             <p><strong>CV:</strong> {candidature.cv_path}</p>
//           </div>
//         ) : (
//           <div>
//             <h3>Submit Your Candidature</h3>
//             <form onSubmit={handleSubmit}>
//               <div>
//                 <label>Message Motivation:</label>
//                 <textarea
//                   value={motivation}
//                   onChange={(e) => setMotivation(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Upload CV:</label>
//                 <input
//                   type="file"
//                   accept=".pdf,.doc,.docx"
//                   onChange={(e) => setCv(e.target.files[0])}
//                 />
//               </div>
//               <button type="submit">Submit Candidature</button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Postuler;
