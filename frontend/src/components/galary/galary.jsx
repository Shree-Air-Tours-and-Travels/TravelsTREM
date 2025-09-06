import React, { useState } from "react";
import "../../styles/layout/galary.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Title from "../../stories/Title";
import SubTitle from "../../stories/Title";
import img1 from "../../assets/images/gallery-01.jpg";
import img2 from "../../assets/images/gallery-02.jpg";
import img3 from "../../assets/images/gallery-03.jpg";
import img4 from "../../assets/images/gallery-04.jpg";
import img5 from "../../assets/images/gallery-05.jpg";

const galleryData = {
  title: "Gallery",
  subtitle: "Capturing the essence of unforgettable journeys",
  images: [img1, img2, img3, img4, img5],
};

const Gallery = () => {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? galleryData.images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === galleryData.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="ui-gallery">
      <div className="ui-gallery__header">
        <Title text={galleryData.title} className="ui-gallery__title" />
        <SubTitle className="ui-gallery__subtitle">{galleryData.subtitle}</SubTitle>
      </div>
      <div className="ui-gallery__container">
        <button className="ui-gallery__arrow ui-gallery__arrow--left" onClick={prevSlide}>
          <FaChevronLeft />
        </button>
        <div className="ui-gallery__images">
          <img src={galleryData.images[(index + galleryData.images.length - 1) % galleryData.images.length]} alt="Gallery Left" className="ui-gallery__image ui-gallery__image--small" />
          <img src={galleryData.images[index]} alt="Gallery Center" className="ui-gallery__image ui-gallery__image--large" />
          <img src={galleryData.images[(index + 1) % galleryData.images.length]} alt="Gallery Right" className="ui-gallery__image ui-gallery__image--small" />
        </div>
        <button className="ui-gallery__arrow ui-gallery__arrow--right" onClick={nextSlide}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default Gallery;
