import React from "react";
import UsernavBar from "../../components/navBar";
import "./aboutP.css";

const AboutP = () => {
  return (
    <>
      <UsernavBar />
      <div className="about-animated-banner">
  <h1 className="animated-about-title">ABOUT US</h1>
  <div className="underline-slide"></div>
</div>
      <div className="about-container">

        <div className="about-flex">
          {/* Left Section */}
          <div className="about-left">
            <div className="section-row">
              <div className="location-block">
                <h2>Adult Ophthalmology</h2>
                <p>6400 Fannin Street<br />18th Floor<br />Houston, Texas 77030</p>
                <p>Office: (713) 486-9400<br />Fax: (713) 486-9592</p>
              </div>

              <div className="location-block">
                <h2>Pediatric Ophthalmology</h2>
                <p>6400 Fannin Street, Suite 1980<br />19th Floor<br />Houston, Texas 77030</p>
                <p>Office: (713) 486-9400<br />Fax: (713) 486-9593</p>
              </div>
            </div>

            <div className="bottom-row">
              <div className="hours-block">
                <h2>Clinic Hours</h2>
                <p>8 a.m.–5 p.m., Monday–Friday</p>
                <p>Physician on call 24 hours a day, 7 days a week</p>
              </div>

              <div className="specialists-block">
                <h2>Meet Our Specialists</h2>
                <ul>
                  <li><strong>Dr. Oz</strong> - Specialist</li>
                  <li><strong>Dr. Mason</strong> - Optometrist</li>
                  <li><strong>Dr. David</strong> - Retinal Surgeon</li>
                  <li><strong>Dr. Matthew</strong> - Ophthalmologist</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section - Map */}
          <div className="about-right">
            <iframe
              title="Clinic Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3474.777467869965!2d-95.39773908491582!3d29.707915382001396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c0e5f0b3f6f9%3A0x9e3a1f0bbebc64ae!2s6400%20Fannin%20St%2C%20Houston%2C%20TX%2077030%2C%20USA!5e0!3m2!1sen!2sus!4v1614957424960!5m2!1sen!2sus"
              className="map-iframe"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutP;