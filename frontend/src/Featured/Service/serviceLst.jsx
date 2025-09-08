import React from "react";
import "./serviceList.scss";
import Title from "../../stories/Title";
import SubTitle from "../../stories/SubTitle";
// import Loader from "../../components/Loader/Loader";
import useComponentData from "../../hooks/useComponentData";
import ServiceCard from "../../components/cards/serviceCard";



const ServiceList = () => {
    const { loading, error, componentData } = useComponentData("/services");


    if (loading) return <ServicePreloader cards={3} />;
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

const ServicePreloader = ({ cards = 3}) => {
  // renders intro skeleton + `cards` number of card skeletons
  return (
    <section className="ui-service-preloader">
      <div className="ui-service-preloader__container">
        <div className="ui-service-preloader__intro">
          <div className="sp-line sp-title" />
          <div className="sp-line sp-desc" />
        </div>

        <div className="ui-service-preloader__cards">
          {Array.from({ length: cards }).map((_, i) => (
            <div className="sp-card" key={i}>
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
    </section>
  );
};

export default ServiceList;
