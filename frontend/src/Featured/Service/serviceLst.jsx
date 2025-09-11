import React, { useState, useEffect, useRef } from "react";
import "./serviceList.scss";
import Title from "../../stories/Title";
import SubTitle from "../../stories/SubTitle";
import useComponentData from "../../hooks/useComponentData";
import ServiceCard from "../../components/Cards/serviceCard";
import { debounce, clamp, get, max } from "lodash";
/*
  ServiceList
  - responsive: desktop (3+ cards), tablet (2 visible), mobile (1 visible)
  - mobile: only 1 card visible; arrows to slide; simple translateX track
  - preloader included for all breakpoints
  - BEM naming + flexbox only
  - relies on typography.scss (user provided) for fonts/sizes
*/



const ServiceList = () => {
    const { loading, error, componentData } = useComponentData("/services.json", {
        headers: {},
        params: {
            services: "services.json",
        },
    });

    const [current, setCurrent] = useState(0);
    const trackRef = useRef(null);
    const [visibleCount, setVisibleCount] = useState(3);
    // update visibleCount based on viewport — match SCSS breakpoints (debounced)
    useEffect(() => {
        const calc = () => {
            const w = window.innerWidth;
            if (w <= 768) setVisibleCount(1);
            else if (w <= 1024) setVisibleCount(2);
            else setVisibleCount(3);
        };

        const debouncedCalc = debounce(calc, 120);
        calc(); // initial
        window.addEventListener("resize", debouncedCalc);

        return () => {
            window.removeEventListener("resize", debouncedCalc);
            debouncedCalc.cancel?.(); // cancel pending calls if any
        };
    }, []);

    // clamp current when data or visibleCount changes (uses lodash.get + clamp + max)
    useEffect(() => {
        const length = get(componentData, "data.length", 0);
        const maxIndex = max([0, length - visibleCount]);
        setCurrent((prev) => clamp(prev, 0, maxIndex));
    }, [componentData?.data?.length, visibleCount]);

    if (loading) return <ServicePreloader cards={3} />;
    if (error) return <p className="ui-service__error">{error}</p>;
    if (!componentData?.data?.length) return <p className="ui-service__empty">No services available</p>;

    const services = componentData.data;
    const maxIndex = Math.max(0, services.length - visibleCount);

    const prev = () => setCurrent((s) => Math.max(0, s - 2));
    const next = () => setCurrent((s) => Math.min(maxIndex, s + 1));
    const step = (100 / visibleCount).toFixed(2);
    return (
        <section className="ui-service">
            <div className="ui-service__container">
                {/* Intro */}
                <div className="ui-service__intro">
                    <Title className="ui-service__intro-title" text={componentData?.title} />
                    <SubTitle
                        className="ui-service__intro-description"
                        text={componentData?.description}
                        variant="tertiary"
                        size="small"
                    />
                </div>

                {/* Cards + controls */}
                <div className="ui-service__cards-wrap">
                    <button
                        className="ui-service__nav ui-service__nav--prev"
                        onClick={prev}
                        aria-label="Previous services"
                        disabled={current === 0}
                    >
                        ‹
                    </button>

                    <div className="ui-service__cards-viewport">
                        <div
                            className="ui-service__cards"
                            ref={trackRef}
                            style={{ transform: `translateX(-${current * step}%)` }}
                        >
                            {services.map((service) => (
                                <div
                                    className="ui-service__card-shell"
                                    key={service.id}
                                    style={{ flex: `0 0 ${100 / visibleCount}%` }}
                                >
                                    <ServiceCard service={service} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="ui-service__nav ui-service__nav--next"
                        onClick={next}
                        aria-label="Next services"
                        disabled={current >= maxIndex}
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
};

/* Preloader Component */
const ServicePreloader = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const cards = isMobile ? 1 : 3

    return (
        <section className="ui-service ui-service--preloader" aria-hidden>
            <div className="ui-service__container  ui-service__container--preloader">
                <div className="ui-service__intro ui-service__intro--preloader sp-card__body">
                    <div className="sp-line sp-card-sub" />
                    <div className="sp-line sp-card-title" />
                </div>

                <div className="ui-service__cards-wrap">
                    <div className="ui-service__cards-viewport ui-service__cards-viewport--preloader">
                        <div className="ui-service__cards ui-service__cards--skeleton">
                            {Array.from({ length: cards }).map((_, i) => (
                                <div className="sp-card" key={i} style={{ flex: `0 0 ${100 / cards}%` }}>
                                    <div className="sp-card__media" />
                                    <div className="sp-card__body">
                                        <div className="sp-line sp-card-title" />
                                        <div className="sp-line sp-card-sub" />
                                        <div className="sp-actions">
                                            <div className="sp-btn sp-btn-primary" />
                                            <div className="sp-btn sp-btn-outline" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceList;

