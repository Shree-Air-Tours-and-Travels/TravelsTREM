// src/pages/Tours/ToursPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./tours.scss";
import Filters from "./Filters/Filters";
import TourCard from "./Cards/TourCardSecondary";
import useComponentData from "../../hooks/useComponentData";
import { useNavigate } from "react-router-dom";
import Title from "../../stories/Title";
import SubTitle from "../../stories/SubTitle";

const PAGE_SIZE = 6;

const SmallInlineLoader = ({ message = "Updating results..." }) => (
    <div className="tours-page__inline-loader" role="status" aria-live="polite">
        <div className="tours-page__inline-loader__dot" aria-hidden />
        <div className="tours-page__inline-loader__text">{message}</div>
    </div>
);

export const TourPreloader = ({ count = 4, showIntro = true }) => {
    // We still generate 'count' cards but CSS controls columns visible per breakpoint
    const cards = Array.from({ length: count });
    return (
        <section className="ui-tour ui-tour--loading" aria-busy="true" aria-label="Loading tours">
            <div className="ui-tour__header">
                {showIntro && (
                    <div className="ui-tour-preloader__intro" aria-hidden="true">
                        <div className="sp-line sp-title" />
                        <div className="sp-line sp-desc" />
                    </div>
                )}
            </div>

            <div className="ui-tour-preloader__packages">
                {cards.map((_, i) => (
                    <div key={i} className="sp-card" role="status" aria-hidden="true">
                        <div className="sp-card__media" />
                        <div className="sp-card__body">
                            <div className="sp-card-title" />
                            <div className="sp-card-sub" />
                            <div className="sp-actions">
                                <div className=" sp-btn-primary" />
                                <div className=" sp-btn-outline" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="ui-tour__more">
                <div className="sp-btn-primary" style={{ width: 160 }} />
            </div>
        </section>
    );
};

const extractTours = (componentData) => {
    if (!componentData) return [];
    const stateData = componentData?.state?.data;
    if (stateData && Array.isArray(stateData.tours)) return stateData.tours;
    if (Array.isArray(componentData?.data)) return componentData.data;
    if (Array.isArray(componentData?.tours)) return componentData.tours;
    if (Array.isArray(componentData?.data?.tours)) return componentData.data.tours;
    return [];
};

const ToursPage = () => {
    const navigate = useNavigate();
    const { loading, error, componentData, refetch } = useComponentData("/tours.json", { auto: true });
    const [filters, setFilters] = useState({});
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const loaderRef = useRef(null);
    const allTours = useMemo(() => extractTours(componentData), [componentData]);
    const displayed = useMemo(() => allTours.slice(0, visibleCount), [allTours, visibleCount]);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [componentData]);

    // infinite scroll observer
    useEffect(() => {
        if (!loaderRef.current) return;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleCount((prev) => Math.min(allTours.length, prev + PAGE_SIZE));
                    }
                });
            },
            { root: null, rootMargin: "240px", threshold: 0.1 }
        );
        obs.observe(loaderRef.current);
        return () => obs.disconnect();
    }, [allTours.length]);

    // debounced refetch on filters change
    useEffect(() => {
        const id = setTimeout(() => {
            const qs = new URLSearchParams(
                Object.entries(filters).reduce((acc, [k, v]) => {
                    if (v === "" || v === null || v === undefined) return acc;
                    acc[k] = v;
                    return acc;
                }, {})
            ).toString();
            const endpoint = qs ? `/tours.json?${qs}` : `/tours.json`;
            if (typeof refetch === "function") refetch(endpoint);
        }, 350);
        return () => clearTimeout(id);
    }, [filters, refetch]);

    const onFilterChange = (vals) => setFilters(vals);
    const onView = (id) => navigate(`/tours/${id}`);

    return (
        <main className="tours-page">
            <div className="tours-page__inner">
                <header className="tours-page__header">
                    <div className="tours-page__header__left">
                        <Title text={"Our Popular Tour Packages"} variant="light" />
                        <SubTitle
                            text={"Explore curated tours across stunning destinations"}
                            variant="light"
                            size="small"
                        />
                    </div>

                    <div className="tours-page__header__right">
                        <Filters onChange={onFilterChange} values={filters} />
                    </div>
                </header>

                <section className="tours-page__content">
                    {loading && displayed.length === 0 && <TourPreloader />}

                    {loading && displayed.length > 0 && <SmallInlineLoader message="Updating results..." />}

                    {error && (
                        <div className="tours-page__message tours-page__message--error" role="alert">
                            Error: {error}
                        </div>
                    )}

                    {!loading && !error && displayed.length === 0 && (
                        <div className="tours-page__message">No tours found.</div>
                    )}

                    <div className="tours-page__list" aria-live="polite">
                        {displayed.map((t) => (
                            <div className="tours-page__card" key={t._id || t.id}>
                                <TourCard tour={t} onView={onView} />
                            </div>
                        ))}
                    </div>

                    <div ref={loaderRef} className="tours-page__sentinel" aria-hidden />
                </section>
            </div>
        </main>
    );
};

export default ToursPage;
