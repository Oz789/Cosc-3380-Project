import React, { useState } from "react";
import axios from "axios";
import UserNavbar from "../../components/navBar";
import "./contact.css";

const ContactP = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending data to the server:", formData); // Debug: log form data
      const res = await axios.post("http://localhost:5001/submit-form", formData);
      setStatus(res.data.message);
      setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting form:", error); // Debug: log error
      if (error.response) {
        console.error("Error response:", error.response.data); // Log error response from server
        setStatus(error.response.data.error || "Error submitting form. Please try again.");
      } else {
        setStatus("Error submitting form. Please try again.");
      }
    }
  };

  return (
    <>
      <UserNavbar />

      <div className="bg-gray-100 min-h-screen flex flex-col items-center p-8">
        <h1 className="text-2xl font-semibold mb-8">Contact Us</h1>

        <div className="w-full max-w-5xl flex">
          
          {/* Right Side: Contact Form */}
          <div className="w-1/2 flex justify-end">
            <form onSubmit={handleSubmit} className="form-container w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Send A Message</h2>

              <input type="text" name="name" value={formData.name} onChange={handleChange} className="textbox w-full mb-4" placeholder="Name" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="textbox w-full mb-4" placeholder="Email" required />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="textbox w-full mb-4" placeholder="Phone" />
              <textarea name="message" value={formData.message} onChange={handleChange} className="textarea w-full mb-4" placeholder="Message" required></textarea>

              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Send</button>

              {status && <p className="mt-4 text-green-600">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactP;
