// src/pages/tours/TourDetails.jsx
import React, { useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import useComponentData from "../../hooks/useComponentData";
import "../../styles/pages/tourDetails.scss";
import Gallery from "../../components/galary/galary";
import ContactAgentModal from "../../modals/ContactAgentModal.jsx";
import get from "lodash/get";
import isArray from "lodash/isArray";
import { fetchData } from "../../utils/fetchData";
import SummaryCard from "../../components/Cards/summaryCard/summaryCards.jsx";

/**
 * TourDetails page
 * - responsive layout (mobile/tablet/desktop)
 * - no mutations to incoming data
 * - uses preloader when loading
 */

const TourDetailsPreloader = () => (
    <>
        <section className="ui-tour-details__preloader" aria-hidden="true">
            <div className="td-pre__gallery">
                <div className="hp-media" />
            </div>

            <div className="td-pre__content">
                <div className="hp-line hp-line--title" />
                <div className="hp-line hp-line--highlight" />
                <div className="hp-line hp-line--desc" />
                <div className="td-pre__actions">
                    <div className="hp-btn hp-btn--primary" />
                    <div className="hp-btn hp-btn--outline" />
                </div>

                <div className="td-pre__summary">
                    <div className="sp-card__media" />
                    <div className="sp-card-title" />
                    <div className="sp-card-sub" />
                </div>
            </div>
        </section>
        <section className="ui-tour-details__preloader" aria-hidden="true">
            <div className="td-pre__gallery">
                <div className="hp-media" />
            </div>

            <div className="td-pre__content">
                <div className="hp-line hp-line--title" />
                <div className="hp-line hp-line--highlight" />
                <div className="hp-line hp-line--desc" />
                <div className="td-pre__actions">
                    <div className="hp-btn hp-btn--primary" />
                    <div className="hp-btn hp-btn--outline" />
                </div>

                <div className="td-pre__summary">
                    <div className="sp-card__media" />
                    <div className="sp-card-title" />
                    <div className="sp-card-sub" />
                </div>
            </div>
        </section>
    </>

);

const TourDetails = () => {
    const { id, slug } = useParams();
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);

    const endpoint = id ? `/tours.json/${id}` : slug ? `/tours/slug/${slug}` : "/tours.json";
    const { loading, error, componentData } = useComponentData(endpoint, { auto: Boolean(endpoint) });

    // derive tour with useMemo – hook always called
    const tour = useMemo(() => {
        const stateTourFromNav = location.state?.tour;
        if (stateTourFromNav) {
            const _page = stateTourFromNav._page || {
                title: get(componentData, "config.header.title")
                    || get(componentData, "state.data.title")
                    || get(componentData, "componentData.state.data.title"),
                description: get(componentData, "state.data.description")
                    || get(componentData, "componentData.state.data.description")
                    || get(componentData, "description"),
                structure: get(componentData, "structure") || get(componentData, "componentData.structure"),
                config: get(componentData, "config") || get(componentData, "componentData.config"),
                actions: get(componentData, "actions") || get(componentData, "componentData.actions"),
            };
            return { ...stateTourFromNav, _page };
        }

        if (!componentData) return null;

        const stateData = get(componentData, "state.data")
            || get(componentData, "componentData.state.data")
            || get(componentData, "componentData.data")
            || get(componentData, "data");

        let candidate = null;
        if (isArray(stateData?.tours) && stateData.tours.length) {
            candidate = stateData.tours[0];
        } else if (isArray(stateData) && stateData.length) {
            candidate = stateData[0];
        } else if (typeof stateData === "object" && stateData && !isArray(stateData)) {
            candidate = stateData.tours && isArray(stateData.tours) && stateData.tours.length
                ? stateData.tours[0]
                : stateData;
        }

        if (!candidate) return null;

        const _page = {
            title: get(componentData, "config.header.title")
                || get(componentData, "state.data.title")
                || get(componentData, "componentData.state.data.title")
                || candidate.title,
            description: get(componentData, "state.data.description")
                || get(componentData, "componentData.state.data.description")
                || candidate.desc || candidate.description,
            structure: get(componentData, "structure") || get(componentData, "componentData.structure"),
            config: get(componentData, "config") || get(componentData, "componentData.config"),
            actions: get(componentData, "actions") || get(componentData, "componentData.actions"),
            rawComponentData: componentData,
        };

        return { ...candidate, _page };
    }, [componentData, location.state]);

    const photos = useMemo(() => {
        if (Array.isArray(tour?.photos) && tour.photos.length) return tour.photos;
        if (tour?.photo) return [tour.photo];
        return [];
    }, [tour]);


    const handleContactClick = async (selectedTour) => {
        try {
            const res = await fetchData(`/form.json?form=contact-agent&tourId=${selectedTour._id}`);
            if (res?.status === "success") {
                setFormData(res.componentData);
                setModalOpen(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <TourDetailsPreloader />;
    if (error) return <div className="ui-error">{typeof error === "string" ? error : "Failed to load tour"}</div>;
    if (!tour) return <div className="ui-error">Tour not found</div>;

    return (
        <div className="ui-tour-details">
            <div className="ui-tour-details__container">
                <Gallery
                    images={photos}
                    title={get(tour, "_page.title", tour.title)}
                    color={"white"}
                    subtitle={tour.city ? `Explore ${tour.city}` : "Explore the destination"}
                    autoPlay={false}
                    showIndicators={true}
                    autoPlayInterval={1000}
                    showThumbnails={true}
                    aspectRatio="56.25%"
                    showControls={false}
                />


                <div className="ui-tour-details__main">
                    <section className="ui-tour-details__main__info">
                        <div className="ui-tour-details__main__info--info-left">
                            <SummaryCard
                                tour={tour}
                                onBook={(t) => { /* booking flow */ }}
                                onContact={handleContactClick}
                            />
                        </div>
                    </section>
                </div>

                {modalOpen && (
                    <>
                        
                        <ContactAgentModal
                            open={modalOpen}
                            tourId={tour._id}
                            onClose={() => setModalOpen(false)}
                            formData={formData}
                        />
                    </>

                )}
            </div>
        </div>
    );
};


export default TourDetails;
