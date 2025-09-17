// src/pages/tours/TourDetails.jsx
import React, { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useComponentData from "../../hooks/useComponentData";
import "../../styles/pages/tourDetails.scss";
import Gallery from "../../components/galary/galary";
import ContactAgentModal from "../../modals/ContactAgentModal.jsx";
import get from "lodash/get";
import isArray from "lodash/isArray";
import { fetchData } from "../../utils/fetchData";
import SummaryCard from "../../components/Cards/summaryCard/summaryCards.jsx";
import HighlightsCard from "../../components/Cards/highlightCard/HighlightsCard.jsx";
import ItineraryCard from "../../components/Cards/internityCard/ItineraryCard.jsx";
import Button from "../../stories/Button.jsx";
import Icon from "../../icons/Icon.jsx";
import Title from "../../stories/Title.jsx";
import SubTitle from "../../stories/SubTitle.jsx";

/**
 * TourDetails page — role aware (admin/agent/user)
 *
 * Notes:
 * - componentData.handler should come from server and be one of: 'admin' | 'agent' | 'user'
 * - componentData.actions.roleActions is expected in JSON (each action has allowedRoles/endpoint/method)
 * - simple prompt-based create/update flows are provided for quick testing
 */

const TourDetailsPreloader = () => (
    <>
        <section className="ui-tour-details__preloader" aria-hidden="true">
            <div className="td-pre__gallery"><div className="hp-media" /></div>
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
            <div className="td-pre__gallery"><div className="hp-media" /></div>
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
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const [busy, setBusy] = useState(false); // for disabling buttons during fetch

    const endpoint = id ? `/tours.json/${id}` : slug ? `/tours/slug/${slug}` : "/tours.json";
    const { loading, error, componentData } = useComponentData(endpoint, { auto: Boolean(endpoint) });

    const structure = get(componentData, "structure", {})
    const secondaryActions = get(structure, "actions", {})

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

    // Determine role: prefer server-provided handler (defence in depth)
    const role = get(componentData, "handler") || "user";
    const roleActions = get(componentData, "actions.roleActions") || get(componentData, "componentData.actions.roleActions") || {};

    const canPerform = (actionKey) => {
        const a = roleActions[actionKey];
        if (!a) return false;
        const allowed = a.allowedRoles || [];
        return allowed.includes(role);
    };

    // helper to call backend endpoints (uses your fetchData util)
    const callAction = async ({ actionKey, payload = {}, idParam = null }) => {
        const action = roleActions[actionKey];
        if (!action) {
            console.warn("Action not defined:", actionKey);
            return;
        }

        // build endpoint: replace :id if needed
        let endpointUrl = action.endpoint || (actionKey === "create" ? "/tours" : "/tours/:id");
        if (idParam) {
            endpointUrl = endpointUrl.replace(":id", idParam);
        } else if (endpointUrl.includes(":id") && tour?._id) {
            endpointUrl = endpointUrl.replace(":id", tour._id);
        }

        const method = (action.method || "POST").toUpperCase();

        try {
            setBusy(true);
            let res;
            if (method === "GET") {
                res = await fetchData(endpointUrl);
            } else {
                res = await fetchData(endpointUrl, { method, body: payload });
            }
            setBusy(false);

            if (res?.status === "success") {
                // After mutate, reload page data to reflect change.
                // Simple approach: navigate to same route which triggers useComponentData auto reload,
                // or you can call a refresh function from useComponentData if available.
                // We'll re-navigate to this route to force re-fetch.
                navigate(location.pathname, { replace: true, state: {} });
            } else {
                // show a friendly error (you can replace with toast)
                alert(res?.message || "Action failed");
            }
        } catch (err) {
            setBusy(false);
            console.error(err);
            alert(err?.message || "Action failed due to network error.");
        }
    };

    // Create - quick prompt-based (for dev). Replace with a modal form later.
    const handleCreate = async () => {
        const title = window.prompt("Create new tour\nEnter title:");
        if (!title) return;
        const priceStr = window.prompt("Enter price (USD):", "0");
        const price = Number(priceStr || 0);
        const body = {
            title,
            desc: title,
            price,
            city: "Unknown",
            address: { line1: "", city: "", state: "", zip: "", country: "" },
            photos: [],
            period: { days: 1, nights: 0 },
            maxGroupSize: 1,
        };
        await callAction({ actionKey: "create", payload: body });
    };

    // Update - prompt-based edit of title for quick test
    const handleUpdate = async () => {
        if (!tour) return;
        const updatedTitle = window.prompt("Edit tour title:", tour.title || "");
        if (updatedTitle == null) return; // cancelled
        const body = { ...tour, title: updatedTitle };
        // remove fields we don't want to accidentally send (like __v)
        delete body.__v;
        await callAction({ actionKey: "update", payload: body, idParam: tour._id });
    };

    const handleDelete = async () => {
        if (!tour) return;
        const ok = window.confirm(`Delete tour "${tour.title}"? This cannot be undone.`);
        if (!ok) return;
        await callAction({ actionKey: "delete", idParam: tour._id });
    };

    const handleShare = () => {
        // Use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: tour.title,
                text: tour.desc || tour.description,
                url: window.location.href,
            }).catch((e) => console.warn("Share failed", e));
        } else {
            // fallback: copy to clipboard
            navigator.clipboard?.writeText(window.location.href)
                .then(() => alert("Tour link copied to clipboard"))
                .catch(() => alert("Copy failed — share the URL manually"));
        }
    };

    const handleSaveWishlist = async () => {
        // placeholder: calls /wishlist endpoint if present. You can adapt.
        try {
            setBusy(true);
            const payload = { tourId: tour._id };
            const res = await fetchData("/wishlist", { method: "POST", body: payload });
            setBusy(false);
            if (res?.status === "success") alert("Saved to wishlist");
            else alert(res?.message || "Failed to save");
        } catch (e) {
            setBusy(false);
            console.error(e);
            alert("Failed to save to wishlist");
        }
    };

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


    console.log(componentData, "TourDetails")
    const pageDescription = get(tour, "_page.description", tour?.description);


    if (loading) return <TourDetailsPreloader />;
    if (error) return <div className="ui-error">{typeof error === "string" ? error : "Failed to load tour"}</div>;
    if (!tour) return <div className="ui-error">Tour not found</div>;

    return (
        <div className="ui-tour-details">
            <div className="ui-tour-details__container">

                {/* public actions */}
                <div className="ui-tour-details__page-actions">
                    <div className="page-actions__left">
                        <Icon name="backArrow" />
                        <Button
                            text={get(componentData, "actions.back.label", "")}
                            variant="text"
                            size="small"
                            color="primary"
                            onClick={() => navigate(get(componentData, "actions.back.url", "/tours"))}
                        />
                    </div>

                    <div className="page-actions__right">
                        {/* <div className="page-actions__right-save">
                            <Icon name="wishlist" />
                            <Button
                                text={get(secondaryActions, "save.label", "")}
                                variant="text"
                                onClick={handleSaveWishlist}
                                size="small"

                            />
                        </div> */}
                        <div className="page-actions__right-share" style={{ display: "flex", gap: "2px" }}>
                            <Icon name="share" />
                            <Button
                                text={get(secondaryActions, "share.label", "")}
                                variant="text"
                                onClick={handleShare}
                                size="small"
                            />
                        </div>


                        {/* role-based actions — only show when role allows */}
                        {canPerform("create") && <Button text={"Create Tour"} className="btn btn--primary" onClick={handleCreate} disabled={busy} />}
                        {canPerform("update") && <Button text={"Update Tour"} className="btn btn--primary" onClick={handleUpdate} disabled={busy} />}
                        {canPerform("delete") && <Button text={"Delete Tour"} className="btn btn--primary" onClick={handleDelete} disabled={busy} />}
                    </div>
                </div>

                <div className="ui-tour-details__hero">
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
                    <SummaryCard
                        tour={tour}
                        onReserve={(t) => { /* booking flow */ }}
                        onContact={handleContactClick}
                        goBack={(url) => navigate(url)}
                    />
                </div>

                <div className="ui-tour-details__main">
                    <div className="ui-tour-details__cards">
                        <div className="ui-tour-details__cards__item">
                            <HighlightsCard tour={tour} />
                            <div className="ui-tour-details__cards__description">
                                <div className="ui-tour-details__cards__description--header">
                                    <Title text={"Descrption"} color={"white"} size="small" primaryClassname="ui-tour-details__cards__description--title" />
                                </div>
                                <SubTitle text={pageDescription} color={"primary"} />
                            </div>
                        </div>

                        <div className="ui-tour-details__cards__item">
                            <ItineraryCard tour={tour} />
                        </div>
                    </div>
                </div>

                {modalOpen && (
                    <ContactAgentModal
                        open={modalOpen}
                        tourId={tour._id}
                        onClose={() => setModalOpen(false)}
                        formData={formData}
                    />
                )}
            </div>
        </div>
    );
};

export default TourDetails;
