import React from 'react';
import {Container} from 'react-bootstrap';
import NavBar from './NavBar';
import Footer from './Footer';


function About () {
    return (
        <div className="d-flex flex-column">
        <NavBar/>
        <div><img className="img-fluid changing-leaves-cover" src="/img/changing_leaves.jpg" /></div>
        <div className="text-center logo-container">
            <img className="logo" src={process.env.PUBLIC_URL + '/img/about_logo.png'} alt="logo" />
            </div>

        <Container>
          <div className="flex-grow-1 home-content-container nav-padding">
            <div className="home-content pt-1">
              
              <p className="text-header">What is kaizen?</p>
              <p className="about-text px-5">
                The definition of kaizen comes from two Japanese words: ‘kai’ meaning change and ‘zen’ meaning good. Kaizen philosophy teaches that continuous and incremental changes to behavior add up over time, creating substantial growth and lasting change. Simply put, kaizen is the compounding interest of self-improvement, healthy lifestyles, and well being. </p>

              <p className="text-header pt-5">How does iKaizen work?</p>
              <p className="about-text px-5">
                iKiazen works by providing a platform for users to track their daily habits, goals, and moods over time. In an effort to understand why healthy habits are so easy one day, and out the window the next, we have brought human emotion into the kaizen equation. Even when experiencing temporary unpleasant moods, our graph features help you to view your overall growth and progress from a long-term perspective. Remember, small steps create big changes over time. </p>

                <p className="text-header pt-5">How is iKaizen different?</p>
                <p className="about-text px-5">
                In our quest to evaluate how our emotions effect our daily goals and habits, we tried several mood tracker apps currently on the market. Unfortunately, we found that the majority have very limited capabilities for tracking the full spectrum of human emotions. Our mood tracker offers multiple selections from over 30 different emotions. This is keeping in line with the latest research from UC Berkeley, which identified 27 distinct categories of emotion that often arise in tandem, instead of occurring solely in isolation. In this way, we honor our feelings in order to journey with them on the iKaizen path. </p>
                <p className="px-5"></p>
            
                <p className="about-text px-5"> The heart of iKaizen's functionality lies with our habit and goal tracker. Habits can be chosen from a preselected list or created individually. They can also be tracked as a complete/incomplete habit or as a completion percentage for longer term goals. Don't forget to watch your progress change over time with our graphs features! </p>
                <p className="pt-5"></p>
            </div>
          </div> 
        </Container>
        <Footer />
        </div>
    )
}

export default About;