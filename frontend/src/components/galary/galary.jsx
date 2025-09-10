// src/components/Gallery/Gallery.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "./galary.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Title from "../../stories/Title";
import SubTitle from "../../stories/Title"; // keep as you had it (if SubTitle differs, import accordingly)
import img1 from "../../assets/images/gallery-01.jpg";
import img2 from "../../assets/images/gallery-02.jpg";
import img3 from "../../assets/images/gallery-03.jpg";
import img4 from "../../assets/images/gallery-04.jpg";
import img5 from "../../assets/images/gallery-05.jpg";

const defaultImages = [img1, img2, img3, img4, img5];

const Gallery = ({
  images = defaultImages,
  title = "Gallery",
  color = "#000", // fixed default (was `color = {color}` which caused used-before-defined)
  subtitle = "Capturing the essence of unforgettable journeys",
  autoPlay = false,
  autoPlayInterval = 4000,
}) => {
  const imgs = Array.isArray(images) && images.length ? images : defaultImages;
  const [index, setIndex] = useState(0);
  const autoPlayRef = useRef(null);
  const containerRef = useRef(null);

  // helper to stop autoplay (defined before any effect that uses it)
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // stable slide controls (useCallback so effects can depend on them safely)
  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev === 0 ? imgs.length - 1 : prev - 1));
  }, [imgs.length]);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));
  }, [imgs.length]);

  // keep index valid whenever images length changes
  useEffect(() => {
    if (index >= imgs.length) setIndex(0);
  }, [imgs.length, index]);

  // reset index to 0 when the images prop changes (new gallery)
  useEffect(() => {
    setIndex(0);
  }, [images]);

  // autoplay logic — depends on nextSlide which is stable
  useEffect(() => {
    if (!autoPlay) return undefined;

    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => stopAutoPlay();
  }, [autoPlay, autoPlayInterval, nextSlide, stopAutoPlay]);

  // keyboard navigation: left / right arrows (depends on stable callbacks)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevSlide, nextSlide]);

  if (!imgs || imgs.length === 0) return null;

  return (
    <section
      className="ui-gallery"
      ref={containerRef}
      onMouseEnter={() => (autoPlay ? stopAutoPlay() : null)}
      onMouseLeave={() => {
        if (autoPlay) {
          stopAutoPlay();
          autoPlayRef.current = setInterval(() => {
            setIndex((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));
          }, autoPlayInterval);
        }
      }}
    >
      <div className="ui-gallery__header">
        <Title text={title} className="ui-gallery__title" color={color} />
        <SubTitle className="ui-gallery__subtitle" color={color}>
          {subtitle}
        </SubTitle>
      </div>

      <div className="ui-gallery__container">
        <button
          aria-label="Previous slide"
          className="ui-gallery__arrow ui-gallery__arrow--left"
          style={{ color: color }}
          onClick={prevSlide}
        >
          <FaChevronLeft />
        </button>

        <div
          className="ui-gallery__images"
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
        >
          {/* left small */}
          <div className="ui-gallery__image-wrap ui-gallery__image-wrap--left">
            <img
              src={imgs[(index + imgs.length - 1) % imgs.length]}
              alt={`Slide ${((index + imgs.length - 1) % imgs.length) + 1}`}
              className="ui-gallery__image ui-gallery__image--small"
              loading="lazy"
            />
          </div>

          {/* center large */}
          <div className="ui-gallery__image-wrap ui-gallery__image-wrap--center">
            <img
              src={imgs[index]}
              alt={`Slide ${index + 1}`}
              className="ui-gallery__image ui-gallery__image--large"
              loading="eager"
            />
          </div>

          {/* right small */}
          <div className="ui-gallery__image-wrap ui-gallery__image-wrap--right">
            <img
              src={imgs[(index + 1) % imgs.length]}
              alt={`Slide ${((index + 1) % imgs.length) + 1}`}
              className="ui-gallery__image ui-gallery__image--small"
              loading="lazy"
            />
          </div>
        </div>

        <button
          aria-label="Next slide"
          className="ui-gallery__arrow ui-gallery__arrow--right"
          style={{ color: color }}
          onClick={nextSlide}
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

Gallery.propTypes = {
  images: PropTypes.array,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  autoPlay: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
  showIndicators: PropTypes.bool,
};

export default Gallery;
