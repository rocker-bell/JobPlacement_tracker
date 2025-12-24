import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/GetStarted.css";

const GetStarted = () => {
    // Unused state removed for clarity, add back if needed
    // const [fromPage, setFromPage] = useState();

    // 1. Set a default value (e.g., "login") so one form is visible on load
    const [active, setActive] = useState("login");

    const navigate = useNavigate();

    // Note: useEffect is not needed for simple tab switching



    const handleLogin = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) return alert("Please fill in all fields");

  try {
    const res = await fetch("http://localhost:8000/handle_login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!data.success) return alert(data.message);

    // Redirect based on role
    switch (data.role) {
      case "reader":
        navigate("/Reader_Dashboard");
        break;
      case "writer":
        navigate("/Writer_Dashboard");
        break;
      case "Admin":
        navigate("/admin-dashboard");
        break;
      default:
        alert("Unknown role");
    }
  } catch (err) {
    console.error(err);
    alert("Login failed. Try again.");
  }
};



//     const handleRegister = async (e) => {
//   e.preventDefault();

//   const username = document.getElementById("registerUsername").value;
//   const email = document.getElementById("registerEmail").value;
//   const password = document.getElementById("registerPassword").value;
//   const role = document.querySelector(".role-choice-options").value;

//   if (!username || !email || !password || !role)
//     return alert("All fields including role are required");

//   try {
//     const res = await fetch("http://localhost:5000/handle_register.php", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, email, password, role }),
//     });

//     const data = await res.json();

//     if (!data.success) return alert(data.message);

//     alert("Registration successful! You can now login.");
//     setActive("login"); // switch to login tab
//   } catch (err) {
//     console.error(err);
//     alert("Registration failed. Try again.");
//   }
// };


const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.elements.registerUsername.value.trim();
    const email = form.elements.registerEmail.value.trim();
    const password = form.elements.registerPassword.value;
    const role = form.elements.role.value;

    if (!username || !email || !password || !role) {
        return alert("All fields are required!");
    }

    try {
        const res = await fetch("http://localhost:8000/handle_register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, role })
        });

        const data = await res.json();
        if (data.success) {
            alert("Registration successful! Please log in.");
            setActive("login"); // switch to login tab
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong during registration.");
    }
};


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
                    </div>
                )}

                {/* 4. Conditionally render the Register Container */}
                {active === "register" && (
                    <div className="register_container">
                        <form onSubmit={handleRegister} className="access_register_form">

                            <div className="form-group-access">
                                <label htmlFor="registerUsername" className="form-label-access">Username</label>
                                <input type="text" id="registerUsername" name="registerUsername" className="form-control-access" />
                            </div>

                            <div className="form-group-access">
                                <label htmlFor="registerEmail" className="form-label-access">Email</label>
                                <input type="email" id="registerEmail" name="registerEmail" className="form-control-access" />

                            </div>

                            <div className="form-group-access">
                                <label htmlFor="registerPassword" className="form-label-access">Password</label>
<input type="password" id="registerPassword" name="registerPassword" className="form-control-access" />
                            </div>
                           <select name="role" id="role" className="role-choice-options">
    <option value="">choose a role</option>
    <option value="reader">client</option>
    <option value="writer">recruiter</option>
</select>
                            <p className="role-choice-NB">

                                
                                <Link to="About-roles" className="roles-about-link">
                                    confused ? get more infos here !
                                </Link>
                                
                            </p>

                            <button type="submit" className="btn-register-access" >Register</button>

                           
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GetStarted;