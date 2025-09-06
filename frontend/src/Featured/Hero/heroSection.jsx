import React, { useEffect, useState } from "react";
import { upperFirst } from "lodash";
import Title from "../../stories/Title";
import SubTitle from "../../stories/SubTitle";
import Button from "../../stories/Button";
import Loader from "../../components/Loader/Loader";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "./heroSection.style.scss";

const HeroSection = ({ user }) => {
    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ✅ initialize navigate

    useEffect(() => {
        const fetchHero = async () => {
            try {
                setLoading(true);
                const res = await api.get("/hero");
                console.log(res?.data, "Hero data fetched");
                setHero(res?.data?.data);
            } catch (err) {
                console.log("Error fetching hero:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHero();
    }, []);

    // ✅ handle loading and no data states
    if (loading) return <Loader />;
    if (!hero) return null;

    // ✅ handle button click based on user state
    const handleHeroClick = () => {
        if (user) {
            navigate("/tours"); // ✅ logged in → tours page
        } else {
            navigate("/login"); // ✅ not logged in → login page
        }
    };

    return (
        <section className="ui-home__main__hero" >
            <div className="ui-home__main__hero__content">
                <h1 className="ui-home__main__hero__title">
                    <Title text={hero.title} color="#fff" />{" "}
                    <Title text={hero.highlight} variant="secondary"  />
                </h1>
                <SubTitle
                    className="ui-home__main__hero__description"
                    text={hero.description}
                    variant="tertiary"
                    size="small"
                    color="#fff" 
                />
                <Button
                    text={
                        user?.name
                            ? `Welcome, ${upperFirst(user?.name)}! ${hero?.buttonText}`
                            : hero?.buttonText
                    }
                    variant="outline"
                    size="medium"
                    color="white"
                    onClick={handleHeroClick} // ✅ use handler
                />
            </div>
            <div className="ui-home__main__hero__media">
                <img
                    src={hero.images?.main || "/hero-images/logo-main.png"}
                    alt="Hero Main"
                    className="ui-home__main__hero__image"
                />
            </div>
        </section>
    );
};

export default HeroSection;