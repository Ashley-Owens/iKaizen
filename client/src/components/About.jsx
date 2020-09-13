import React from "react";
import { Container } from "react-bootstrap";
import NavBar from "./NavBar";
import Footer from "./Footer";
import useElementHeight from "../hooks/useElementHeight";

function About() {
  const [navbarHeight, navbarRef] = useElementHeight();
  const containerStyle = { marginTop: navbarHeight };

  return (
    <div className="d-flex flex-column">
      <NavBar ref={navbarRef} />

      <div>
        <img
          style={containerStyle}
          className="img-fluid changing-leaves-cover"
          src="/img/changing_leaves.jpg"
        />
        <div className="text-center logo-container">
          <img
            className="logo"
            src={process.env.PUBLIC_URL + "/img/about_logo.png"}
            alt="logo"
          />
        </div>
      </div>

      <Container className="pt-5">
        <div className="flex-grow-1">
          <div className="home-content pt-1">
            <p className="about-text-header">What is kaizen?</p>
            <p className="about-text px-5">
              The definition of kaizen comes from two Japanese words: ‘kai’
              meaning change and ‘zen’ meaning good. Kaizen philosophy teaches
              that continuous and incremental changes to behavior add up over
              time, creating substantial growth and lasting change. Simply put,
              kaizen is the compounding interest of self-improvement, healthy
              lifestyles, and well being.{" "}
            </p>

            <p className="about-text-header pt-5">How does iKaizen work?</p>
            <p className="about-text px-5">
              iKiazen works by providing a platform for users to track their
              daily habits, goals, and moods over time. In an effort to
              understand why healthy habits are so easy one day, and out the
              window the next, we have brought human emotion into the kaizen
              equation. Even when experiencing temporary unpleasant moods, our
              graph features help you to view your overall growth and progress
              from a long-term perspective. Remember, small steps create big
              changes over time.{" "}
            </p>

            <p className="about-text-header pt-5">How is iKaizen different?</p>
            <p className="about-text px-5">
              While numerous mood trackers enable you to log activities, we have
              yet to find another app on the market that combines both mood and
              habit tracking. This is the heart of iKaizen's functionality. We
              hope that as you track your progress over time, you will find
              clarity about how your moods affect your daily well-being and
              growth. Kaizen teaches us that even 1% improvement counts!{" "}
            </p>

            <p className="about-text px-5">
              Furthermore, we found that the majority of trackers on the market
              have limited abilities to track the full spectrum of human
              emotions. Our mood tracker offers multiple selections from
              approximately 30 different emotions. This is keeping in line with
              the latest research from UC Berkeley, which identified 27 distinct
              categories of emotion. In this way, we honor our feelings in order
              to journey with them on the kaizen path.{" "}
            </p>
            <p className="px-5"></p>
            <p className="pt-5"></p>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default About;
