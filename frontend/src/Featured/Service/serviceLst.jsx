import React, { useEffect, useState } from "react";
import "./serviceList.scss";
import { fetchData } from "../../utils/fetchData";
import Title from "../../stories/Title";
import SubTitle from "../../stories/SubTitle";
import ServiceCard from "../../components/Cards/serviceCard";

const ServiceList = () => {
    const [state, setState] = useState({
        loading: true,
        error: null,
        componentData: {
            title: "",
            description: "",
            data: [],
            structure: {},
            config: {},
        },
    });

    useEffect(() => {
        const getServices = async () => {
            setState((prev) => ({ ...prev, loading: true }));

            const response = await fetchData("/services");

            if (response.status === "success") {
                setState({
                    loading: false,
                    error: null,
                    componentData: response.componentData,
                });
            } else {
                setState({
                    loading: false,
                    error: response.message,
                    componentData: response.componentData,
                });
            }
        };

        getServices();
    }, []);

    const { loading, error, componentData } = state;

    if (loading) return <p>Loading services...</p>;
    if (error) return <p>{error}</p>;
    if (!componentData?.data?.length) return <p>No services available</p>;

    return (
        <section className="ui-service">
            <div className="ui-service__container">
                {/* Left Section: Title & Description */}
                <div className="ui-service__intro">
                    <Title
                        className="ui-service__intro-title"
                        text={componentData?.title}
                    />
                    <SubTitle
                        className="ui-service__intro-description"
                        text={componentData?.description}
                        variant="tertiary"
                        size="small"
                    />
                </div>

                {/* Right Section: Service Cards */}
                <div className="ui-service__cards">
                    {componentData?.data.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceList;
