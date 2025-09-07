import React from "react";
import HeroSection from "../../featured/Hero/heroSection";
// import Experience from "../../featured/experience";
// import Gallery from "../../components/galary/galary";
// import Reviews from "../../featured/review";
import "../../styles/pages/home.scss";
import ServiceList from "../../featured/Service/serviceLst";
import TourPackages from "../../featured/TourPackages/tourPackages";

const Home = ({ user }) => {
    return (
        <div className="ui-home">
            {/* Hero Section */}
            <HeroSection user={user} />

            {/* Explore Section */}
            <section className="ui-home__explore">
                <ServiceList />
                <TourPackages />
                {/* <Experience />
                <Gallery />
                <Reviews /> */}
            </section>
        </div>
    );
};

export default Home;
