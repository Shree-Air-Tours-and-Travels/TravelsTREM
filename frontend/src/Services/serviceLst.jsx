import React from "react";
import "../styles/layout/serviceList.scss";
import weatherImg from "../assets/images/weather.png"; 
import guideImg from "../assets/images/guide.png";
import customizeImg from "../assets/images/user.png";
import ServiceCard from "../components/Cards/serviceCard";

const serviceData = {
  title: "Our Services",
  description: "Explore our top-notch travel services designed to make your journey smooth and unforgettable.",
  services: [
    {
      id: "weather",
      label: "Calculate Weather",
      description: "Get real-time weather updates for your destination.",
      image: weatherImg,
    },
    {
      id: "guide",
      label: "Best Tour Guide",
      description: "Connect with the best local tour guides for an amazing experience.",
      image: guideImg,
    },
    {
      id: "customization",
      label: "Customization",
      description: "Tailor your travel experience to your preferences.",
      image: customizeImg,
    },
  ],
};

const ServiceList = () => {
  return (
    <section className="ui-service">
      <div className="ui-service__container">
        {/* Left Section: Title & Description */}
        <div className="ui-service__intro">
          <h2 className="ui-service__intro-title">{serviceData.title}</h2>
          <p className="ui-service__intro-description">{serviceData.description}</p>
        </div>

        {/* Right Section: Service Cards */}
        <div className="ui-service__cards">
          {serviceData.services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
