import React from "react";
import "../../styles/pages/home.scss";

import mainImage from "../../assets/images/gallery-05.jpg";
import img1 from "../../assets/images/hero-img01.jpg";
import img2 from "../../assets/images/hero-img02.jpg";
import videoSrc from "../../assets/images/hero-video.mp4";
import ServiceList from "../../Services/serviceLst";
import TourPackages from "../../featured/tourPackages";
import Title from "../../stories/Title";
import SubTitle from "../../stories/Title";
import Button from "../../stories/Button";
import Experience from "../../Services/experience";
import Gallery from "../../components/galary/galary";
import Reviews from "../../Services/review";

import { upperFirst } from "lodash";

/** unused imports */
// import SearchBar from "../../components/searchBar/searchBar"; 

const Home = ({ user }) => {
    const header = {
        buttonText: `Welcome, ${user?.name ? upperFirst(user.name) : "Guest"}! Explore Now`,
        title: "Traveling opens the door to creating",
        highlight: "memories",
        description:
              "Discover the world with TravelsTREM. Curated adventures, stunning destinations, and memories that last a lifetime.",
        images: {
            main: mainImage,
            gallery: [img1, img2],
            video: videoSrc,
        },
    };

    return (
        <div className="ui-home">
            {/* Hero Section */}
            <section className="ui-home__main__hero">
                <div className="ui-home__main__hero__content">
                    <div className="ui-home__main__hero__cta">
                        <Button
                            className="ui-home__main__hero__cta__button"
                            text={header.buttonText}
                            variant="outline"
                            size="medium"
                            color="primary"
                            isCircular={false}
                            onClick={() => console.log("Button clicked!")}
                        />
                        <div className="ui-home__main__hero__cta__image">
                            <img src={header.images.main} alt="Travel Hero" />
                        </div>
                    </div>

                    <h1 className="ui-home__main__hero__title">
                        <Title text={header.title} />{" "}
                        <Title text={header.highlight} variant="secondary" />
                    </h1>

                    <SubTitle className="ui-home__main__hero__description" 
                         text={header.description} 
                         variant="tertiary"
                         size="small"
                    />
                </div>
            </section>

            {/* Gallery & Video Section */}
            {/* <section className="ui-home__main__gallery">
                {header.images.gallery.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Travel ${index + 1}`}
                        className="ui-home__main__gallery-img"
                    />
                ))}

                {header.images.video && (
                    <video className="ui-home__main__gallery-video" controls>
                        <source src={header.images.video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
            </section> */}

            {/* Explore Section */}
            <section className="ui-home__explore">
                {/* <SearchBar /> */}
                <ServiceList />
                <TourPackages />
                <Experience />
                <Gallery />
                <Reviews />
            </section>
        </div>
    );
};

export default Home;
