import React, {useEffect, useState} from 'react'
import { Grid2 } from '@mui/material';
import axios from 'axios'
import "./replyManager.css"
import UsernavBar from "./navBar";


const ReplyManager = (props) => {


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
        const res = await axios.post("http://localhost:5001/api/submit-form", formData);
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

    console.log(props.mes.email)
    return(
        <div>
        <UsernavBar />

        <div className="container">
            <div className="wrapper">
                <div className="reply">
                
                <div className="w-1/2 flex justify-end">
            <form onSubmit={handleSubmit} className="form-container w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Send A Message</h2>

              <input type="text" name="name" value={formData.name} onChange={handleChange} className="textbox w-full mb-4" placeholder="Name" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="textbox w-full mb-4" placeholder="Email" required />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="textbox w-full mb-4" placeholder="Phone" />
              <textarea name="message" value={formData.message} onChange={handleChange} className="textarea w-full mb-4" placeholder="Message" required></textarea>

              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded blued">Send</button>

              {status && <p className="mt-4 text-green-600">{status}</p>}
            </form>
          </div>

                </div>

                <div className="msg">
                <h5 className="heading"> <b>From: </b>{props.mes.email} </h5>
                <h5 className="subheading"> <b> By: </b>{props.mes.name},{props.mes.id}</h5>
                <hr className="solid"/>
                <h5 >  {props.mes.message}</h5>
                {/* <p style={{ color: "#aaa", fontStyle: "italic" }}> {props.mes.email}</p> */}
                </div>
            </div>

        </div>
        </div>



    );

};

export default ReplyManager;