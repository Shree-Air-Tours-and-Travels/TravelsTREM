// components/Filters/Filters.jsx
import React, { useState, useEffect } from "react";
import "./filters.scss";
import useComponentData from "../../../hooks/useComponentData";

const FALLBACK_DEFAULTS = {
    search: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    minDays: "",
    maxDays: "",
    featured: "",
    rating: "",
    adults: 2,
    children: 0,
    infants: 0,
    arrivalDate: "",
    returnDate: ""
};

const Filters = ({ onChange }) => {
    const { loading, error, componentData } = useComponentData("/api/filters.json", { auto: true });

    const serverDefaults = (componentData && componentData.config && componentData.config.defaults) || FALLBACK_DEFAULTS;
    const serverOptions = (componentData && componentData.config && componentData.config.options) || {};

    const [values, setValues] = useState(serverDefaults);

    // sync local state when server defaults arrive (only if user hasn't interacted yet)
    useEffect(() => {
        setValues((prev) => {
            const isInitial = Object.keys(FALLBACK_DEFAULTS).every((k) => prev[k] === FALLBACK_DEFAULTS[k] || prev[k] === "" || prev[k] === undefined);
            if (isInitial) return { ...serverDefaults };
            return prev;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(serverDefaults)]);

    // emit debounced changes to parent
    useEffect(() => {
        const id = setTimeout(() => {
            if (typeof onChange === "function") onChange(values);
        }, 400);
        return () => clearTimeout(id);
    }, [values, onChange]);

    const onInput = (k) => (e) => {
        let val;
        if (e.target.type === "checkbox") val = e.target.checked;
        else if (e.target.type === "number") {
            // treat empty string as ""
            const raw = e.target.value;
            val = raw === "" ? "" : Number(raw);
        } else val = e.target.value;
        setValues((s) => ({ ...s, [k]: val }));
    };

    const reset = () => {
        setValues(serverDefaults || FALLBACK_DEFAULTS);
        if (typeof onChange === "function") onChange(serverDefaults || FALLBACK_DEFAULTS);
    };

    const maxGuests = serverOptions.maxGuests || { adults: 10, children: 10, infants: 4 };
    const dateRange = serverOptions.dateRange || {};

    const renderCities = () => {
        const cities = serverOptions.cities || [];
        return (
            <>
                <option value="">Any city</option>
                {cities.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </>
        );
    };

    const renderFeaturedOptions = () => {
        const opts = serverOptions.featured || [
            { label: "Any", value: "" },
            { label: "Featured", value: "true" },
            { label: "Not featured", value: "false" }
        ];
        return opts.map((o) => (
            <option key={String(o.value)} value={o.value}>
                {o.label}
            </option>
        ));
    };

    const renderRatingOptions = () => {
        const opts = serverOptions.ratings || [
            { label: "Any rating", value: "" },
            { label: "4+ stars", value: "4" },
            { label: "3+ stars", value: "3" },
            { label: "2+ stars", value: "2" }
        ];
        return opts.map((o) => (
            <option key={String(o.value)} value={o.value}>
                {o.label}
            </option>
        ));
    };

    return (
        <div className="filters" aria-live="polite">
            {error && <div className="filters__error">Failed to load filters</div>}

            <div className="filters__row">
                <input
                    className="filters__input"
                    type="number"
                    min="0"
                    placeholder="Min price"
                    value={values.minPrice === "" ? "" : values.minPrice}
                    onChange={onInput("minPrice")}
                />
                <input
                    className="filters__input"
                    type="number"
                    min="0"
                    placeholder="Max price"
                    value={values.maxPrice === "" ? "" : values.maxPrice}
                    onChange={onInput("maxPrice")}
                />

                <select className="filters__input" value={values.rating} onChange={onInput("rating")}>
                    {renderRatingOptions()}
                </select>

                <input
                    className="filters__input filters__search"
                    placeholder="Search title or description"
                    value={values.search}
                    onChange={onInput("search")}
                />
            </div>

            <div className="filters__row">
                <input
                    className="filters__input"
                    type="number"
                    min="0"
                    placeholder="Min days"
                    value={values.minDays === "" ? "" : values.minDays}
                    onChange={onInput("minDays")}
                />
                <input
                    className="filters__input"
                    type="number"
                    min="0"
                    placeholder="Max days"
                    value={values.maxDays === "" ? "" : values.maxDays}
                    onChange={onInput("maxDays")}
                />

                <select className="filters__input" value={values.featured} onChange={onInput("featured")}>
                    {renderFeaturedOptions()}
                </select>

                <select className="filters__input" value={values.city} onChange={onInput("city")}>
                    {renderCities()}
                </select>
            </div>

            <div className="filters__row">
                {/* Members (adults, children, infants) */}
                <label className="filters__label">
                    Adults
                    <input
                        className="filters__input"
                        type="number"
                        min="1"
                        max={maxGuests.adults}
                        value={values.adults === "" ? "" : values.adults}
                        onChange={onInput("adults")}
                    />
                </label>

                <label className="filters__label">
                    Children
                    <input
                        className="filters__input"
                        type="number"
                        min="0"
                        max={maxGuests.children}
                        value={values.children === "" ? "" : values.children}
                        onChange={onInput("children")}
                    />
                </label>

                <label className="filters__label">
                    Infants
                    <input
                        className="filters__input"
                        type="number"
                        min="0"
                        max={maxGuests.infants}
                        value={values.infants === "" ? "" : values.infants}
                        onChange={onInput("infants")}
                    />
                </label>

                {/* arrival/return date */}
                <label className="filters__label">
                    Arrival
                    <input
                        className="filters__input"
                        type="date"
                        min={dateRange.earliest || ""}
                        max={dateRange.latest || ""}
                        value={values.arrivalDate || ""}
                        onChange={onInput("arrivalDate")}
                    />
                </label>

                <label className="filters__label">
                    Return
                    <input
                        className="filters__input"
                        type="date"
                        min={values.arrivalDate || dateRange.earliest || ""}
                        max={dateRange.latest || ""}
                        value={values.returnDate || ""}
                        onChange={onInput("returnDate")}
                    />
                </label>

                <div className="filters__actions">
                    <button className="button" type="button" onClick={reset}>
                        Reset
                    </button>
                </div>
            </div>

            {loading && <div className="filters__loading">Loading filter options…</div>}
        </div>
    );
};

export default Filters;
