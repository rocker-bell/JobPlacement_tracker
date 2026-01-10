import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../Styles/GetStarted.css";

const GetStarted = () => {
  const location = useLocation()
   const [verifyemailmsg, setverifyemailmsg] = useState(null);
   const [loginError, setloginError] = useState(null);
    const [active, setActive] = useState(
         location.state?.active || "login"
    );
    

    const navigate = useNavigate();

   








const handleActiveVerify = () => {
    setActive("verify")
}

const handleLogin = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    return alert("Please fill in all fields");
  }

  try {
    const res = await fetch("http://localhost:8000/handle_login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!data.success) {
      return alert(data.message);
    }

    const { account_status, role, user_id } = data.user_data;

    // 🔒 BLOCK LOGIN IF NOT VERIFIED
    if (account_status !== "Verified") {
      setverifyemailmsg(
  <>
    Your account is not verified. Please check your email and verify your account.
    <br />
    <Link  style={{ color: "#007bff" }} onClick={handleActiveVerify}>
      Resend verification email
    </Link>
  </>
);

      return;
    }

    // ✅ Save user id
    localStorage.setItem("user_id", user_id);

    // 🚀 Redirect by role
    switch (role) {
      case "Stagiaire":
        navigate("/Jobboard_Stagiaire");
        break;
      case "Entreprise":
        navigate("/jobboard_Entreprise");
        break;
      case "Encadrant":
        navigate("/jobboard_Encadrant");
        break;
      case "Admin":
        navigate("/jobboard_admin");
        break;
      default:
        alert("Unknown role");
    }

  } catch (err) {
    console.error(err);
    // alert("Login failed. Try again.");
    setloginError(
  <>
    Your login credentials are wrong, try again or{" "}
    <Link
      style={{ color: "red", cursor: "pointer" }}
      onClick={() => setActive("register")}
    >
      register if you don't have an account
    </Link>
  </>
);

setloginError(null)

  }
};


//        e.preventDefault();

//     const form = e.target;
//     const username = form.elements.registerUsername.value.trim();
//     const email = form.elements.registerEmail.value.trim();
//     const phonenumber = form.elements.registerPhoneNumber.value.trim();
//     const password = form.elements.registerPassword.value;
//     const role = form.elements.role.value;

//     // Validation check
//     if (!username || !email || !password || !phonenumber || !role) {
//       return alert('All fields are required!');
//     }

//     try {
//       const res = await fetch('http://localhost:3000/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, email, password, telephone: phonenumber, role })
//       });

//       const data = await res.json();

//       if (data.success) {
//         const msg = "Registration successfull, check your email to verify your account"
//         setverifyemailmsg(msg)
//         setTimeout(() => {
//                 setActive("login")
//         }, 3000);
        
//       } else {
//         alert(data.message || 'Unknown error during registration.');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Something went wrong during registration. Please try again.');
//     }
//   };

const handleRegister = async (e) => {
  e.preventDefault();
  setverifyemailmsg(null); // reset message

  const form = e.target;
  const username = form.elements.registerUsername.value.trim();
  const email = form.elements.registerEmail.value.trim();
  const phonenumber = form.elements.registerPhoneNumber.value.trim();
  const password = form.elements.registerPassword.value;
  const role = form.elements.role.value;

  if (!username || !email || !password || !phonenumber || !role) {
    setverifyemailmsg("All fields are required.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        telephone: phonenumber,
        role,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setverifyemailmsg(data.message || "Registration failed.");
      return;
    }

    // ✅ SUCCESS
    setverifyemailmsg(
      "Registration successful! Please check your email to verify your account."
    );

    // Switch to login after 3 seconds
    setTimeout(() => {
      setActive("login");
      setverifyemailmsg(null);
    }, 3000);

  } catch (err) {
    console.error(err);
    setverifyemailmsg("Server error. Please try again later.");
  }
};


const handleResendVerification = async (e) => {
  e.preventDefault();

  const email = document.getElementById("verifyEmail").value.trim();
  if (!email) return alert("Email is required");

  try {
    const res = await fetch("http://localhost:3000/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      setverifyemailmsg("Verification email sent. Please check your inbox.");
    } else {
      setverifyemailmsg(data.message || "Failed to resend email.");
    }
  } catch (err) {
    console.error(err);
    setverifyemailmsg("Server error. Try again later.");
  }
};


const handleActiveRecovery = () => {
    setActive("recovery")
}


    return (
        <div className="GETstarted_wrapper">
            <div className="switch-login-register">
                {/* 2. Use onClick directly to update state */}
                <button 
                    className={`login-switch switch-btn ${active === "login" ? "active" : ""}`}
                    onClick={() => setActive("login")}
                >
                    login
                </button>
                <button 
                    className={`register-switch switch-btn ${active === "register" ? "active" : ""}`}
                    onClick={() => setActive("register")}
                >
                    register
                </button>
            </div>

            <div className="GETstarted_userAccess_container">
                
                {/* 3. Conditionally render the Login Container */}
                {active === "login" && (
                    <div className="login_container">
                        {loginError && (
  <p style={{ color: "red", marginBottom: "10px" }}>
    {loginError}
  </p>
)}
                        {verifyemailmsg && (
  <p style={{ color: "red", marginBottom: "10px" }}>
    {verifyemailmsg}
  </p>
)}

                        <form action="" className="access_login_form">
                            <div className="form-group-access">
                                <label htmlFor="username" className="form-label-access">Username or Email</label>
                                <input type="text" id="username" className="form-control-access" />
                            </div>

                            <div className="form-group-access">
                                <label htmlFor="password" className="form-label-access">Password</label>
                                <input type="password" id="password" className="form-control-access" />
                            </div>

                            <button type="button" className="btn-login-access" onClick={handleLogin}>Login</button>
                        </form>
                                        <p className="role-choice-NB">
                                            <Link to="/AccountRecovery" className="roles-about-link">
                                                frogot your password ? recover here !
                                            </Link>
                                        </p>
                    </div>
                )}

               


                {active === "register" && (
    <div className="register_container">
        {verifyemailmsg && (
  <p
    style={{
      color: verifyemailmsg.includes("successful") ? "green" : "red",
      marginBottom: "10px",
      textAlign: "center",
    }}
  >
    {verifyemailmsg}
  </p>
)}

        <form onSubmit={handleRegister} className="access_register_form">

            <div className="form-group-access">
                <label htmlFor="registerUsername" className="form-label-access">Username</label>
                <input
                    type="text"
                    id="registerUsername"
                    name="registerUsername"
                    className="form-control-access"
                    required
                />
            </div>

            <div className="form-group-access">
                <label htmlFor="registerEmail" className="form-label-access">Email</label>
                <input
                    type="email"
                    id="registerEmail"
                    name="registerEmail"
                    className="form-control-access"
                    required
                />
            </div>

            <div className="form-group-access">
                <label htmlFor="registerPhoneNumber" className="form-label-access">Phone number</label>
                <input
                    type="tel"
                    id="registerPhoneNumber"
                    name="registerPhoneNumber"
                    className="form-control-access"
                    required
                />
            </div>

            <div className="form-group-access">
                <label htmlFor="registerPassword" className="form-label-access">Password</label>
                <input
                    type="password"
                    id="registerPassword"
                    name="registerPassword"
                    className="form-control-access"
                    required
                />
            </div>

            <div className="form-group-access">
                <label htmlFor="role" className="form-label-access">Select Role</label>
               

                <select
    name="role"
    id="role"
    className="role-choice-options"
    required
>
    <option value="">Choose a role</option>
    <option value="Stagiaire">Stagiaire</option>
    <option value="Entreprise">Entreprise</option>
    <option value="Encadrant">Encadrant</option>
</select>

            </div>

            <p className="role-choice-NB">
                <Link to="About-roles" className="roles-about-link">
                    Confused? Get more info here!
                </Link>
            </p>

            <div className="form-group-access">
                <button type="submit" className="btn-register-access">Register</button>
            </div>

        </form>
    </div>
)}



                    {active === "verify" && (
  <div className="login_container">
    {verifyemailmsg && (
      <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
        {verifyemailmsg}
      </p>
    )}

    <form className="access_login_form" onSubmit={handleResendVerification}>
      <div className="form-group-access">
        <label htmlFor="verifyEmail" className="form-label-access">
          Email address
        </label>
        <input
          type="email"
          id="verifyEmail"
          className="form-control-access"
          required
        />
      </div>

      <button type="submit" className="btn-login-access">
        Resend verification email
      </button>
    </form>

    <p className="role-choice-NB">
      <button
        onClick={() => setActive("login")}
        style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
      >
        Back to login
      </button>
    </p>
  </div>
)}


            </div>
        </div>
    );
}

export default GetStarted;