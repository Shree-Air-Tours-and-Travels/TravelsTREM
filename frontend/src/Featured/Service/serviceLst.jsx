import React from "react";
import "./serviceList.scss";
import Title from "../../stories/Title";
import SubTitle from "../../stories/SubTitle";
import Loader from "../../components/Loader/Loader";
import useComponentData from "../../hooks/useComponentData";
import ServiceCard from "../../components/cards/serviceCard";


const ServiceList = () => {
    const { loading, error, componentData } = useComponentData("/services");


    if (loading) return <Loader />;
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
