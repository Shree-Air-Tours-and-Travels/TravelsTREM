// src/pages/tours/TourDetails.jsx
import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import useComponentData from "../../hooks/useComponentData";
import "../../styles/pages/tourDetails.scss"; // ensure this file exists
import Gallery from "../../components/galary/galary";
import InfoCard from "../../components/cards/Info/infoCard"
import ContactAgentModal from "../../modals/ContactAgentModal.jsx";
import { fetchData } from "../../utils/fetchData.js";
import { SummaryCard } from "../../components/cards/Summary/summaryCards.jsx";

const TourDetails = () => {
    const { id } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);

    // when contact button clicked, fetch form data and open modal
    const handleContactClick = async (selectedTour) => {
        try {
            const res = await fetchData(`/form.json?form=contact-agent&tourId=${selectedTour._id}`);
            if (res?.status === "success") {
                console.log(res.componentData, "form data");
                setFormData(res.componentData);
                setModalOpen(true);
            }
        } catch (err) { console.error(err); }
    };

    // transform: turn componentData into a single tour object
    const transform = useCallback((componentData) => {
        const candidate =
            componentData && Array.isArray(componentData.data) && componentData.data.length
                ? componentData.data[0]
                : componentData;

        if (!candidate) return null;

        if ((!candidate.photos || candidate.photos.length === 0) && candidate.photo) {
            candidate.photos = [candidate.photo];
        }

        return candidate;
    }, []);

    // endpoint includes id (string), that's fine
    const endpoint = `/tours/${id}`;

    const { loading, error, componentData: tour } = useComponentData(endpoint, {
        auto: true,
        transform,
    });

    if (loading) return <div className="ui-loader">Loading tour...</div>;
    if (error) return <div className="ui-error">{typeof error === "string" ? error : "Failed to load tour"}</div>;
    if (!tour) return <div className="ui-error">Tour not found</div>;

    return (
        <div className="ui-tour-details">
            {/* SECTION 1: Photos */}
            <Gallery
                images={tour.photos}
                title={tour.title}
                color={"white"}
                subtitle={tour.city ? `Explore ${tour.city}` : "Explore the destination"}
                autoPlay={false}
                showIndicators={true}
            />

            <div className="ui-tour-details__main">
                {/* SECTION 2: Info */}
                <section className="ui-tour-details__main__info">
                    <div className="ui-tour-details__main__info--info-left">
                        <InfoCard tour={tour} />
                    </div>
                    <div className="ui-tour-details__main__info--info-right">
                        <SummaryCard
                            tour={tour}
                            onBook={(t) => {/* handle book/whatsapp - t is the tour */ }}
                            onContact={handleContactClick} // gets tour from card
                        />
                        {modalOpen && <ContactAgentModal
                            open={modalOpen}
                            tourId={tour._id}
                            onClose={() => setModalOpen(false)} formData={formData} />}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default TourDetails;
