import React from "react";
import developerPng from "./images/developer-png.png";

const Contact = () => {
  return (
    <div className="contactUs-main-container">
      <div className="contactUs-left-para">
        <h3>Let's get in touch</h3>
        <i class="fa fa-envelope"></i>
        <a class="mail-links" href=" sakshigowardipe@gmail.com">
          sakshigowardipe@gmail.com
        </a>

        <i class="fa fa-linkedin"></i>
        <a class="mail-links" href="https://www.linkedin.com/in/sakshigowardipe/">
          User Name: sakshigowardipe
        </a>

        <i class="fa fa-github"></i>
        <a class="mail-links" href="https://github.com/sakshigowardipe">
          sakshigowardipe
        </a>

        <i class="fa fa-instagram"></i>
        <a class="mail-links" href="https://www.instagram.com/sakshigowardipe/">
          sakshigowardipe
        </a>

        <i class="fa fa-phone"></i>
        <a class="mail-links" href="tel:+923019583959">
          +92 301 9583959
        </a>
      </div>
      <div className="contactUs-pic">
        <img src={developerPng} alt="Profile"/>
      </div>
    </div>
  );
};

export default Contact;
