import React from "react";
import "../styles/layout/serviceList.scss";
import flightsHotelsImg from "../assets/service-images/flights-hotel.png";
import travelPackagesImg from "../assets/service-images/guide.png";
import visaPassportImg from "../assets/service-images/visa.png";
import ServiceCard from "../components/Cards/serviceCard";
import corporatePackagesImg from "../assets/service-images/corporate.png";
import cabServicesImg from "../assets/service-images/cab.png";
import Title from "../stories/Title";


const serviceData = {
    title: "Our Services",
    description: "We offer a complete range of travel solutions to make your journey hassle-free and memorable.",
    services: [
        {
            id: "flights-hotels",
            label: "Flights & Hotels",
            description: "Book the best deals on domestic and international flights and comfortable hotel stays worldwide.",
            image: flightsHotelsImg, // Replace with the correct image variable
        },
        {
            id: "travel-packages",
            label: "Travel Packages",
            description: "Explore our curated domestic and international travel packages for every kind of traveler.",
            image: travelPackagesImg, // Replace with the correct image variable
        },
        {
            id: "visa-passport",
            label: "Visa & Passport Assistance",
            description: "Get expert assistance for your visa applications and passport-related services.",
            image: visaPassportImg, // Replace with the correct image variable
        },
        {
            id: "corporate-packages",
            label: "Corporate Packages",
            description:
                "Tailored corporate travel solutions including flights, hotels, and event arrangements for your business needs.",
            image: corporatePackagesImg, // ✅ Add correct image variable
        },
        {
            id: "cab-services",
            label: "Cab Services",
            description:
                "Convenient and affordable cab services for airport transfers, sightseeing, and outstation travel.",
            image: cabServicesImg, // ✅ Add correct image variable
        },
    ],
};

const ServiceList = () => {
    return (
        <section className="ui-service">
            <div className="ui-service__container">
                {/* Left Section: Title & Description */}
                <div className="ui-service__intro">
                    <Title className="ui-service__intro-title" text={serviceData.title} />
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
