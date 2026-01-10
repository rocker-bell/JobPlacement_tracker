// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const PasswordRecovery = () => {
//   const [active, setActive] = useState("email");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [msg, setMsg] = useState("");
//   const [verifyStatus, setVerifyStatus] = useState(false);
//   const naviagte = useNavigate()
//   // Handle the email submission
//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:3000/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();
//       console.log("server res : ", data)

//       if (data.success) {
//         setMsg("OTP sent to your email.");
//         setActive("otp");
//       } else {
//         setMsg(data.message || "Error sending OTP.");
//       }
//     } catch (err) {
//       setMsg("Error. Try again.");
//     }
//   };

//   // Handle OTP verification
//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:3000/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();
//       console.log("otp submit databa", data)

//       if (data.success) {
//         setVerifyStatus(true);
//         setMsg("OTP verified. You can now reset your password.");
//         setActive("password");
//       } else {
//         setMsg(data.message || "Invalid OTP.");
//       }
//     } catch (err) {
//       setMsg("Error. Try again.");
//     }
//   };

//   // Handle new password setup
//   const handleNewPasswordSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:3000/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, newPassword }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setMsg("Password successfully reset. You can now log in.");
//         setActive("email"); // Redirect to login screen after success
//       } else {
//         setMsg(data.message || "Error resetting password.");
//       }
//     } catch (err) {
//       setMsg("Error. Try again.");
//     }
//   };

//   const backtologin = () => {
//       navigate("/GetStarted", {
//     state: { active: "login" }
//   });
//   }

//   return (
//     <div className="password-recovery-container">
//       {active === "email" && (
//         <div className="email-form">
//           <h3>Enter your email to receive an OTP</h3>
//           {msg && <p>{msg}</p>}
//           <form onSubmit={handleEmailSubmit}>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <button type="submit">Send OTP</button>
//           </form>
//         </div>
//       )}

//       {active === "otp" && (
//         <div className="otp-form">
//           <h3>Enter OTP sent to your email</h3>
//           {msg && <p>{msg}</p>}
//           <form onSubmit={handleOtpSubmit}>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//             <button type="submit">Verify OTP</button>
//           </form>
//         </div>
//       )}

//       {active === "password" && verifyStatus && (
//         <div className="password-reset-form">
//           <h3>Reset Your Password</h3>
//           {msg && <p>{msg}</p>}
//           <form onSubmit={handleNewPasswordSubmit}>
//             <input
//               type="password"
//               placeholder="New Password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />
//             <button type="submit">Reset Password</button>
//           </form>
//         </div>
//       )}

//       <p>
//         <Link onClick={backtologin}>Back to Login</Link>
//       </p>
//     </div>
//   );
// };

// export default PasswordRecovery;



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/PasswordRecovery.css"

const PasswordRecovery = () => {
  const [active, setActive] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(false);
  const navigate = useNavigate();  // Fix typo here: 'naviagte' => 'navigate'

  // Handle the email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log("Email submit clicked"); 
    try {
      const res = await fetch("http://localhost:3000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("server res : ", data);

      if (data.success) {
        setMsg("OTP sent to your email.");
        setActive("otp");
      } else {
        setMsg(data.message || "Error sending OTP.");
      }
    } catch (err) {
      setMsg("Error. Try again.");
    }
  };

  // Handle OTP verification
  // const handleOtpSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch("http://localhost:3000/verify-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, otp }),
  //     });

  //     const data = await res.json();
  //     console.log("otp submit data", data);

  //     if (data.success) {
  //       setVerifyStatus(true);
  //       setMsg("OTP verified. You can now reset your password.");
  //       setActive("password");
  //     } else {
  //       setMsg(data.message || "Invalid OTP.");
  //     }
  //   } catch (err) {
  //     setMsg("Error. Try again.");
  //   }
  // };

// Ensure that the OTP is being passed correctly from the form to the request
const handleOtpSubmit = async (e) => {
  e.preventDefault();
  console.log(email, otp)
  try {
    const res = await fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),  // Ensure otp and email are correctly passed
    });

    const data = await res.json();
    console.log("OTP submit data", data); // Check response

    if (data.success) {
      setVerifyStatus(true);
      setMsg("OTP verified. You can now reset your password.");
      setActive("password");
    } else {
      setMsg(data.message || "Invalid OTP.");
    }
  } catch (err) {
    setMsg("Error. Try again.");
  }
};


//   const handleOtpSubmit = async (e) => {
//   e.preventDefault();

//   const otpData = {
//     email: emailInput, // The email the user entered
//     otp: otpInput      // The OTP the user entered
//   };

//   try {
//     const response = await fetch("http://localhost:3000/verify-otp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(otpData),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to verify OTP');
//     }

//     const data = await response.json();
//     if (data.success) {
//       // handle successful OTP verification
//     } else {
//       // handle error (e.g., wrong OTP)
//     }

//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     // Handle error
//   }
// };


  // Handle new password setup
  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMsg("Password successfully reset. You can now log in.");
        setActive("email"); // Redirect to login screen after success
        setTimeout(() => {
          navigate("/GetStarted", {
      state: { active: "login" },
    });
        }, 1000);
      } else {
        setMsg(data.message || "Error resetting password.");
      }
    } catch (err) {
      setMsg("Error. Try again.");
    }
  };

  // Redirect to the login page
  const backToLogin = () => {
    navigate("/GetStarted", {
      state: { active: "login" },
    });
  };

  return (
    <div className="password-recovery-container">
      {active === "email" && (
        <div className="reset-from email-form">
          <h3 className="reset-form-title">Enter your email to receive an OTP</h3>
          {msg && <p className="send-otp-msg">{msg}</p>}
          <form className="form-reset" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="reset-info-input"
            />
            <button type="submit" className="btn-send-receive-otp">Send OTP</button>
          </form>
        </div>
      )}

      {active === "otp" && (
        <div className="reset-form otp-form">
          <h3 className="reset-form-title">Enter OTP sent to your email</h3>
          {msg && <p className="send-otp-msg">{msg}</p>}
          <form  className="form-reset" onSubmit={handleOtpSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="reset-info-input"
            />
            <button type="submit" className="btn-send-receive-otp">Verify OTP</button>
          </form>
        </div>
      )}

      {active === "password" && verifyStatus && (
        <div className="reset-form password-reset-form">
          <h3 className="reset-form-title">Reset Your Password</h3>
          {msg && <p className="send-otp-msg">{msg}</p>}
          <form  className="form-reset" onSubmit={handleNewPasswordSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="reset-info-input"
            />
            <button type="submit" className="btn-send-receive-otp">Reset Password</button>
          </form>
        </div>
      )}

      <p>
  <button type="button" onClick={backToLogin} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
    Back to Login
  </button>
</p>

    </div>
  );
};

export default PasswordRecovery;
