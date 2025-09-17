// components/Filters/Filters.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./filters.scss";
import useComponentData from "../../../hooks/useComponentData";
import FieldViewResolver from "./FieldViewResolver";
import { getOptionList, validateAll } from "./filtersUtils";
import Title from "../../../stories/Title";
import SubTitle from "../../../stories/SubTitle";
import Button from "../../../stories/Button";
import fetchData from "../../../utils/fetchData";

/**
 * Filters component:
 * - reads componentData from /filters.json using your hook
 * - renders rows from structure.layout.rows (or fields order)
 * - shows preloader skeleton while metadata loads
 * - expand/collapse toggle, sticky to top below menu
 * - on Apply -> validates with filtersUtils.validateAll and then triggers action
 */
const Filters = ({ onChange, onAction }) => {
    const { loading: loadingMeta, error: metaError, componentData } = useComponentData("/filters.json", { auto: true });

    const title = componentData?.title || "Filters";
    const description = componentData?.description || "";
    const structure = componentData?.structure || {};
    const fieldsArr = Array.isArray(structure.fields) ? structure.fields : [];
    const actions = Array.isArray(structure.actions) ? structure.actions : [];
    const layoutRows = (structure.layout && structure.layout.rows) || [];

    const serverDefaults = (componentData && componentData.config && componentData.config.defaults) || {};
    const serverOptions = (componentData && componentData.config && componentData.config.options) || {};

    const fieldsMap = useMemo(() => {
        const m = {};
        fieldsArr.forEach((f) => {
            if (f && f.name) m[f.name] = f;
        });
        return m;
    }, [fieldsArr]);

    // layout rows fallback
    const rowsToRender = layoutRows.length ? layoutRows : [fieldsArr.map((f) => f.name)];

    const [values, setValues] = useState(() => ({ ...(serverDefaults || {}) }));
    const [errors, setErrors] = useState({});
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    // UI state
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setValues((prev) => {
            const prevKeys = Object.keys(prev || {});
            const isInitial = prevKeys.length === 0 || prevKeys.every((k) => prev[k] === "" || prev[k] === undefined || prev[k] === null);
            if (isInitial) return { ...(serverDefaults || {}) };
            return prev;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(serverDefaults)]);

    // If there is no apply action in JSON, keep debounced onChange emitter
    const hasApplyAction = actions.some((a) => a && (a.name === "apply" || a.type === "apply"));
    useEffect(() => {
        if (hasApplyAction) return undefined;
        const id = setTimeout(() => {
            if (typeof onChange === "function") onChange(values);
        }, 400);
        return () => clearTimeout(id);
    }, [values, onChange, hasApplyAction]);

    // helpers
    const maxGuests = serverOptions.maxGuests || { adults: 10, children: 10, infants: 4 };
    const dateRange = serverOptions.dateRange || {};

    const onInput = (name, type) => (e) => {
        let val;
        if (type === "checkbox") val = !!e.target.checked;
        else if (type === "number") {
            const raw = e.target.value;
            val = raw === "" ? "" : Number(raw);
        } else val = e.target.value;
        setValues((s) => ({ ...s, [name]: val }));
        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[name];
            return copy;
        });
        setActionMessage(null);
    };

    // reset - prefer reset action from structure if present
    const resetAction = actions.find((a) => a && (a.name === "reset" || a.type === "reset"));
    const doReset = () => {
        const resetTo = { ...(serverDefaults || {}) };
        setValues(resetTo);
        setErrors({});
        setActionMessage(null);

        // if parent handles onAction
        if (typeof onAction === "function") {
            onAction(resetTo, resetAction || { name: "reset" });
            return;
        }

        // if reset action has endpoint -> call network (re-use handleActionClick)
        if (resetAction && resetAction.endpoint) {
            handleActionClick(resetAction, resetTo);
            return;
        }

        // otherwise if no apply action, call onChange so consumer gets reset
        if (!hasApplyAction && typeof onChange === "function") onChange(resetTo);
    };

    const triggerNetworkAction = async (payload, action) => {
        if (!action || !action.endpoint) return null;
        console.log("triggerNetworkAction -> endpoint:", action.endpoint, "method:", action.method || "POST");

        setActionLoading(true);
        setActionMessage(null);

        try {
            const method = (action.method || "POST").toUpperCase();
            const headers = { "Content-Type": "application/json" };

            const res = await fetchData("/filters.json/apply", {
                method,
                headers,
                body: payload,
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
                setActionMessage({ type: "error", text: msg });
                return { ok: false, data };
            } else {
                setActionMessage({ type: "success", text: action.successMessage || "Done" });
                return { ok: true, data };
            }
        } catch (err) {
            setActionMessage({ type: "error", text: err.message || "Network error" });
            return { ok: false, data: null };
        } finally {
            setActionLoading(false);
        }
    };


    // Validate then handle action click (Apply)
    const handleActionClick = async (action, overridePayload) => {
        setErrors({});
        setActionMessage(null);

        const payload = overridePayload || values;

        // 1) validate
        const { ok, errors: validationErrors } = validateAll(payload, fieldsMap, serverOptions);
        console.log(ok, "validation")
        if (!ok) {
            setErrors(validationErrors);
            // expand if collapsed to show errors
            setExpanded(true);
            return;
        }

        // 2) prefer parent onAction
        if (typeof onAction === "function") {
            try {
                setActionLoading(true);
                await onAction(payload, action);
                setActionMessage({ type: "success", text: action && action.successMessage ? action.successMessage : "Done" });
            } catch (err) {
                setActionMessage({ type: "error", text: err && err.message ? err.message : "Action failed" });
            } finally {
                setActionLoading(false);
            }
            return;
        }

        // 3) default built-in network if endpoint provided
        if (action && action.endpoint) {
            const resp = await triggerNetworkAction(payload, action);
            // if the API returns items (like { results, total }), propagate onChange to parent if it exists
            if (resp && resp.ok && typeof onChange === "function") {
                onChange(resp.data || payload);
            }
            return;
        }

        // 4) fallback: if no endpoint and no parent handler, call onChange once (useful)
        if (typeof onChange === "function") onChange(payload);
    };

    useEffect(() => {
        if (componentData && componentData.structure && componentData.structure.actions) {
            console.log("Filters actions from server:", componentData.structure.actions);
        }
    }, [componentData]);


    // preloader skeleton
    const Preloader = () => (
        <div className="filters-skeleton">
            <div className="skeleton-row">
                <div className="skeleton-box" />
                <div className="skeleton-box" />
                <div className="skeleton-box" />
                <div className="skeleton-box" />
            </div>
            <div className="skeleton-row">
                <div className="skeleton-box" />
                <div className="skeleton-box" />
                <div className="skeleton-box" />
                <div className="skeleton-box" />
            </div>
            <div className="skeleton-actions">
                <div className="skeleton-btn" />
                <div className="skeleton-btn" />
            </div>
        </div>
    );

    return (
        <div className={`filters-card ${expanded ? "expanded" : "collapsed"}`} role="region" aria-label={title}>
            <div className="filters-card__sticky">
                <div className="filters-card__header">
                    <div className="filters-card__header-left">
                        <Title text={title} size="medium" primaryClassname="ui-filter-title" />
                        {description && <SubTitle className="filters-card__desc" text={description} />}
                    </div>
                    <div className="filters-card__header-right">
                        <Button
                            text={expanded ? "Collapse" : "Expand"}
                            onClick={() => setExpanded((s) => !s)}
                            size="small"
                            aria-expanded={expanded}
                        />
                    </div>
                </div>

                {/* body collapsed check */}
                {expanded && (
                    <>
                        <div className="filters-card__body">
                            {loadingMeta && <Preloader />}

                            {metaError && <div className="filters__error">Failed to load filters</div>}

                            {!loadingMeta &&
                                rowsToRender.map((row, ri) => (
                                    <div className="filters-row" key={`row-${ri}`}>
                                        {row.map((fieldName) => (
                                            <div className="filters-col" key={fieldName}>
                                                <FieldViewResolver
                                                    name={fieldName}
                                                    field={fieldsMap[fieldName]}
                                                    value={values[fieldName]}
                                                    onInput={onInput}
                                                    getOptionList={(f) => getOptionList(f, serverOptions)}
                                                    maxGuests={maxGuests}
                                                    dateRange={dateRange}
                                                    error={errors[fieldName]}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                        </div>

                        <div className="filters-card__footer">
                            <div className="filters-actions">
                                {actions.map((act, i) => {
                                    const isApply = act && (act.name === "apply" || act.type === "apply");
                                    const btnClass = act.className || (isApply ? "button button--primary" : "button");
                                    return (
                                        <Button
                                            key={`act-${i}`}
                                            className={btnClass}
                                            type="button"
                                            text={isApply ? act.label || "Apply" : act.label || "Action"}
                                            disabled={actionLoading}
                                            onClick={() => {
                                                // if this action is reset, call doReset
                                                if (act && (act.name === "reset" || act.type === "reset")) {
                                                    doReset();
                                                    return;
                                                }
                                                handleActionClick(act);
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            <div className="filters-status">
                                {actionLoading && <span className="filters-status__loading">Processing…</span>}
                                {actionMessage && <span className={`filters-status__${actionMessage.type}`}>{actionMessage.text}</span>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};

export default Filters;
