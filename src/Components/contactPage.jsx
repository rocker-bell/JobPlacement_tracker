import { useState } from "react";
import { User, Mail, Phone, MessageSquare, Send } from "lucide-react";
import "../Styles/contactUs.css";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    subject: "",
  });
  const [Msg, setMsg] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   Object.entries(form).forEach(([key, value]) =>
  //     formData.append(key, value)
  //   );

  //   try {
  //     const response = await fetch(
  //       "http://localhost:8000/contact_request.php",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.success) {
  //       alert("Message sent successfully!");
  //       setForm({
  //         first_name: "",
  //         last_name: "",
  //         email: "",
  //         contact: "",
  //         subject: "",
  //       });
  //     } else {
  //       alert(data.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Server error, please try again.");
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8000/contact_request.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form), // send as JSON
    });

    const data = await response.json();

    if (data.success) {
      setMsg(
        <>
          <p className="contact-msg-style">You message was sent successfully</p>
        </>
      )
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        contact: "",
        subject: "",
      });
      setTimeout(() => {
          navigate("/")
      }, 3000)
    } else {

      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Server error, please try again.");
  }
};

  return (
    <div className="contact-container">
      {Msg}
      <h2 className="contact-title">Contact Us</h2>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-field">
          <User size={18} />
          <input
            type="text"
            name="first_name"
            placeholder="First name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contact-field">
          <User size={18} />
          <input
            type="text"
            name="last_name"
            placeholder="Last name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contact-field">
          <Mail size={18} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contact-field">
          <Phone size={18} />
          <input
            type="tel"
            name="contact"
            placeholder="Contact number"
            value={form.contact}
            onChange={handleChange}
          />
        </div>

        <div className="contact-field">
          <MessageSquare size={18} />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="contact-submit">
          <Send size={18} />
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
