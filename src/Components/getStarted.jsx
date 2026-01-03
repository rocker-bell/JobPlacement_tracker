import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../Styles/GetStarted.css";

const GetStarted = () => {
  const location = useLocation()
    const [active, setActive] = useState(
         location.state?.active || "login"
    );
    

    const navigate = useNavigate();

   


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
    console.log(data);

    if (!data.success) {
      return alert(data.message); // Show the error message if login failed
    }

    const user_id = data.user_data.user_id; // Get user_id from user_data
    console.log(user_id);
    localStorage.setItem("user_id", user_id);
    console.log(data.user_data);

    // Redirect based on role inside user_data
    switch (data.user_data.role) {
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
    alert("Login failed. Try again.");
  }
};





const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.elements.registerUsername.value.trim();
    const email = form.elements.registerEmail.value.trim();
    const phonenumber = form.elements.registerPhoneNumber.value.trim();
    const password = form.elements.registerPassword.value;
    const role = form.elements.role.value;

    if (!username || !email || !phonenumber || !password || !role) {
        return alert("All fields are required!");
    }

    try {
        const res = await fetch("http://localhost:8000/handle_register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, role, registerPhoneNumber: phonenumber })
        });

        // Check if response is successful (status code 200-299)
        if (!res.ok) {
            throw new Error("Server error: " + res.status);
        }

        // Parse JSON response
        const data = await res.json();

        if (data.success) {
            alert("Registration successful! Please log in.");
            setActive("login"); // switch to login tab
        } else {
            alert(data.message || "Unknown error during registration.");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong during registration. Please try again.");
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

               


                {active === "register" && (
    <div className="register_container">
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
                {/* <select
                    name="role"
                    id="role"
                    className="role-choice-options"
                    required
                >
                    <option value="">Choose a role</option>
                    <option value="stagiaire">Stagiaire</option>
                    <option value="Entreprise">Entreprise</option>
                    <option value="encadrant">Encadrant</option>
                </select> */}

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

            </div>
        </div>
    );
}

export default GetStarted;