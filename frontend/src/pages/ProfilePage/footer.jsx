import React from "react";
import "../../styles/components/footer.scss";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Logo from "../../assets/images/logo.png";
import Button from "../../stories/Button";

const Footer = () => {
  const footerContent = {
    contactDetails: {
      phone: "960********",
      email: "goyal******@gmail.com",
      address: "abc 12 13 ggn mohali",
    },
    discoverLinks: [
      { href: "/", label: "Home" },
      { href: "/tours", label: "Tours" },
    ],
    quickLinks: [
      { href: "/login", label: "Login/Register" },
      { href: "/about", label: "About" },
    ],
    socialLinks: [
      { href: "https://www.facebook.com", icon: <FaFacebookF /> },
      { href: "https://www.twitter.com", icon: <FaTwitter /> },
      { href: "https://www.instagram.com", icon: <FaInstagram /> },
      { href: "https://www.linkedin.com", icon: <FaLinkedinIn /> },
    ],
  };

  return (
    <footer className="ui-footer">
      <div className="ui-footer__container">
        <div className="ui-footer__logo-contact">
          <div className="ui-footer__logo">
            <img src={Logo} alt="TravelsTREM Logo" />
          </div>
          <div className="ui-footer__contact-details">
            <h3 className="ui-footer__title">Contact Us</h3>
            <p>Phone No.: {footerContent.contactDetails.phone}</p>
            <p>Email: {footerContent.contactDetails.email}</p>
            <p>Address: {footerContent.contactDetails.address}</p>
          </div>
        </div>
        <div className="ui-footer__query">
          <h3 className="ui-footer__title">Query?</h3>
          <form className="ui-footer__form">
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Phone" />
            <input type="text" placeholder="Location" />
            <textarea placeholder="Your Query"></textarea>
            <Button type="submit" text={'Submit'} />
          </form>
        </div>
        <div className="ui-footer__links">
          <div className="ui-footer__discover">
            <h3 className="ui-footer__title">Discover</h3>
            <ul>
              {footerContent.discoverLinks.map((link, index) => (
                <li key={index}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="ui-footer__quick-links">
            <h3 className="ui-footer__title">Quick Links</h3>
            <ul>
              {footerContent.quickLinks.map((link, index) => (
                <li key={index}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ui-footer__social">
          <h3 className="ui-footer__title">Follow Us</h3>
          <div className="ui-footer__icons">
            {footerContent.socialLinks.map((link, index) => (
              <a key={index} href={link.href} target="_blank" rel="noopener noreferrer">{link.icon}</a>
            ))}
          </div>
        </div>
       
      </div>
      <div className="ui-footer__copyright">
          <p>&copy; 2025 Akshat Goyal. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;