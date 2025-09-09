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
import SummaryCard from "../../components/cards/Summary/summaryCards.jsx";

const TourDetails = () => {
    const { id, slug } = useParams();
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);

    // endpoint to fetch — controller provides new shape at /tours or /tours/:id
    const endpoint = id ? `/tours.json/${id}` : slug ? `/tours/slug/${slug}` : "/tours.json";
    const { loading, error, componentData } = useComponentData(endpoint, { auto: Boolean(endpoint) });


    // try to get the primary tour object from multiple possible shapes
    const tour = useMemo(() => {
        // prefer navigation state first (fast)
        const stateTourFromNav = location.state?.tour;
        if (stateTourFromNav) {
            // ensure page meta under _page if available
            const _page = stateTourFromNav._page || {
                title: get(componentData, "config.header.title") || get(componentData, "state.data.title") || get(componentData, "componentData.state.data.title"),
                description: get(componentData, "state.data.description") || get(componentData, "componentData.state.data.description") || get(componentData, "description"),
                structure: get(componentData, "structure") || get(componentData, "componentData.structure"),
                config: get(componentData, "config") || get(componentData, "componentData.config"),
                actions: get(componentData, "actions") || get(componentData, "componentData.actions"),
            };
            return { ...stateTourFromNav, _page };
        }

        if (!componentData) return null;

        // new schema: componentData.state.data.tours (array) or state.data itself
        const stateData = get(componentData, "state.data") || get(componentData, "componentData.state.data") || get(componentData, "componentData.data") || get(componentData, "data");

        let candidate = null;
        if (!stateData) {
            candidate = null;
        } else if (isArray(stateData.tours) && stateData.tours.length) {
            candidate = stateData.tours[0];
        } else if (isArray(stateData)) {
            candidate = stateData[0];
        } else if (typeof stateData === "object" && Object.keys(stateData).length && !isArray(stateData)) {
            // stateData might be the tour object itself (when API returns single tour)
            candidate = stateData.tours && isArray(stateData.tours) && stateData.tours.length ? stateData.tours[0] : stateData;
        }

        if (!candidate) return null;

        const _page = {
            title: get(componentData, "config.header.title") || get(componentData, "state.data.title") || get(componentData, "componentData.state.data.title") || candidate.title,
            description: get(componentData, "state.data.description") || get(componentData, "componentData.state.data.description") || candidate.desc || candidate.description,
            structure: get(componentData, "structure") || get(componentData, "componentData.structure"),
            config: get(componentData, "config") || get(componentData, "componentData.config"),
            actions: get(componentData, "actions") || get(componentData, "componentData.actions"),
            rawComponentData: componentData,
        };

        return { ...candidate, _page };
    }, [componentData, location.state]);

    // Contact button -> fetch form and open modal
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

    if (loading) return <div className="ui-loader">Loading tour...</div>;
    if (error) return <div className="ui-error">{typeof error === "string" ? error : "Failed to load tour"}</div>;
    if (!tour) return <div className="ui-error">Tour not found</div>;

    // ensure photos fallback
    if ((!tour.photos || tour.photos.length === 0) && tour.photo) {
        tour.photos = [tour.photo];
    }

    return (
        <div className="ui-tour-details">
            <Gallery
                images={tour.photos || []}
                title={get(tour, "_page.title", tour.title)}
                color={"white"}
                subtitle={tour.city ? `Explore ${tour.city}` : "Explore the destination"}
                autoPlay={false}
                showIndicators={true}
            />

            <div className="ui-tour-details__main">
                <section className="ui-tour-details__main__info">
                    <div className="ui-tour-details__main__info--info-left">
                        {/* InfoCard removed — using only SummaryCard */}
                        <SummaryCard tour={tour} onBook={(t) => { /* booking flow */ }} onContact={handleContactClick} />
                    </div>
                </section>
            </div>

            {modalOpen && (
                <ContactAgentModal open={modalOpen} tourId={tour._id} onClose={() => setModalOpen(false)} formData={formData} />
            )}
        </div>
    );
};

export default TourDetails;
