// src/components/Gallery/Gallery.jsx
import React, { useEffect, useState, useRef } from "react";
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
    subtitle = "Capturing the essence of unforgettable journeys",
    autoPlay = false,
    autoPlayInterval = 4000,
    showIndicators = true,
}) => {
    const imgs = Array.isArray(images) && images.length ? images : defaultImages;
    const [index, setIndex] = useState(0);
    const autoPlayRef = useRef(null);
    const containerRef = useRef(null);

    // keep index valid whenever images change
    useEffect(() => {
        if (index >= imgs.length) setIndex(0);
        // reset to 0 when the images array identity changes (new tour)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imgs.length]);

    // reset index to 0 when the images prop changes (new gallery)
    useEffect(() => {
        setIndex(0);
    }, [images]);

    // autoplay logic
    useEffect(() => {
        if (!autoPlay) return;
        stopAutoPlay();
        autoPlayRef.current = setInterval(() => {
            setIndex((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));
        }, autoPlayInterval);

        return () => stopAutoPlay();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoPlay, autoPlayInterval, imgs.length]);

    const stopAutoPlay = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }
    };

    const prevSlide = () => {
        setIndex((prev) => (prev === 0 ? imgs.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setIndex((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));
    };

    // keyboard navigation: left / right arrows
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "ArrowRight") nextSlide();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [imgs.length]);

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
                <Title text={title} className="ui-gallery__title" />
                <SubTitle className="ui-gallery__subtitle">{subtitle}</SubTitle>
            </div>

            <div className="ui-gallery__container">
                <button
                    aria-label="Previous slide"
                    className="ui-gallery__arrow ui-gallery__arrow--left"
                    onClick={prevSlide}
                >
                    <FaChevronLeft />
                </button>

                <div className="ui-gallery__images" role="region" aria-roledescription="carousel" aria-label={title}>
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
                    onClick={nextSlide}
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* indicators */}
            {showIndicators && (
                <div className="ui-gallery__indicators">
                    {imgs.map((_, i) => (
                        <button
                            key={i}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`ui-gallery__dot ${i === index ? "ui-gallery__dot--active" : ""}`}
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>
            )}
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
