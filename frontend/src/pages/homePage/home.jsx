import React from "react";
import "../../styles/pages/home.scss";
import mainImage from "../../assets/images/gallery-05.jpg"; // Update with actual image path
import img1 from "../../assets/images/hero-img01.jpg";
import img2 from "../../assets/images/hero-img02.jpg";
import videoSrc from "../../assets/images/hero-video.mp4";
import SearchBar from "../../components/SEO/searchBar";
import ServiceList from "../../Services/serviceLst";
import TourPackages from "../../Featured/tourPackages";
const header = {
  buttonText: "Know Before You Go",
  title: "Traveling opens the door to creating",
  highlight: "memories",
  description:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam ipsum nobis asperiores soluta voluptas quas voluptates. Molestiae tempora dignissimos, animi praesentium molestias porro expedita delectus. Soluta natus porro.",
  images: {
    main: mainImage,
    gallery: [img1, img2],
    video: videoSrc,
  },
};

const Home = () => {


  return (
      <div className="ui-home">
        {/* Header Section */}
        <div className="ui-home__main">
          {/* First Section */}
          <section className="ui-home__main__hero">
            <div className="ui-home__main__hero__content">
              <div className="ui-home__main__hero__cta">
                <button className="ui-home__main__hero__cta__button">
                  {header.buttonText}
                </button>
                <div className="ui-home__main__hero__cta__image">
                  <img src={header.images.main} alt="Tiny Travel Icon" />
                </div>
              </div>

              <h1 className="ui-home__main__hero__title">
                {header.title} <span>{header.highlight}</span>
              </h1>
              <p className="ui-home__main__hero__description">{header.description}</p>
            </div>
          </section>

          {/* Second Section */}
          <section className="ui-home__main__gallery">
            {header.images.gallery.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Travel ${index + 1}`}
                className="ui-home__main__gallery-img"
              />
            ))}
            <video className="ui-home__main__gallery-video" controls>
              <source src={header.images.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </section>
        </div>

        {/* { <!-- main Section -->} */}
      <section className="ui-home__explore">
        <SearchBar />
        <ServiceList />
        <TourPackages/>
      </section>
      </div>
  );
};

export default Home;