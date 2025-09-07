import React, { useEffect, useState } from "react";
import { upperFirst } from "lodash";
import Title from "../../stories/Title";
import SubTitle from "../../stories/SubTitle";
import Button from "../../stories/Button";
// import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import HighlightSpan from "../../stories/HighlightSpan";
import { fetchData } from "../../utils/fetchData"; // ✅ common util
import "./heroSection.style.scss";

const HeroSection = ({ user }) => {
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

    const navigate = useNavigate();

    useEffect(() => {
        const getHero = async () => {
            setState((prev) => ({ ...prev, loading: true }));

            const response = await fetchData("/hero");

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

        getHero();
    }, []);

    const { loading, error, componentData } = state;
    const { title, description, structure } = componentData;


    // <Loader />;
    if (loading) return <p> Loading Hero...</p>
    if (error) return <p>{error}</p>;
    if (!componentData) return null;

    // ✅ handle button click based on user state
    const handleHeroClick = () => {
        if (user) {
            navigate("/tours"); // logged in → tours page
        } else {
            navigate("/login"); // not logged in → login page
        }
    };

    return (
        <section className="ui-home__main__hero">
            <div className="ui-home__main__hero__content">
                <h1 className="ui-home__main__hero__title">
                    <Title text={title} color="white" />{" "}
                    <Title text={structure.highlight} variant="secondary" />
                </h1>
                <SubTitle
                    className="ui-home__main__hero__description"
                    text={description}
                    variant="tertiary"
                    size="small"
                    color="white"
                />
                <Button
                    text={
                        user?.name ? (
                            <>
                                Welcome,{" "}
                                <HighlightSpan variant="light">
                                    {upperFirst(user?.name)}
                                </HighlightSpan>
                                ! {structure?.buttonText}
                            </>
                        ) : (
                            structure?.buttonText
                        )
                    }
                    variant="outline"
                    size="medium"
                    color="white"
                    onClick={handleHeroClick}
                />
            </div>

            <div className="ui-home__main__hero__media">
                <img
                    src={structure.images?.main || "/hero-images/logo-main.png"}
                    alt="Hero Main"
                    className="ui-home__main__hero__image"
                />
            </div>
        </section>
    );
};

export default HeroSection;
