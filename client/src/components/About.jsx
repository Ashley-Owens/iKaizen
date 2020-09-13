import React from 'react';
import {Container, Image} from 'react-bootstrap';
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
              
              <p className="text-header px-5">What is kaizen?</p>
              <p className="about-text px-5">
                The definition of kaizen comes from two Japanese words: ‘kai’ meaning change and ‘zen’ meaning good. The kaizen philosophy teaches that continuous and incremental changes to behavior add up over time, creating substantial growth and lasting change. Simply put, kaizen is the compounding interest of self-improvement, healthy lifestyles, and well being. </p>

              <p className="text-header px-5">How does iKaizen work?</p>
              <p className="about-text px-5">
                The purpose of iKaizen is to bring kaizen principles easily accessible to help people participate in their own growth and healthy behaviors. We implement these principles through small daily goal setting, daily habit and mood tracking. Sometimes it can be difficult to focus on daily personal growth when experiencing unpleasant emotions such as fear or sadness relating to job loss, illness, a global pandemic, or the loss of a loved one. Hence, we have brought human emotion into the kaizen equation. Even when experiencing temporary unpleasant moods, our graph features help you to view your overall growth and progress from a long-term perspective. Small steps create big changes over time. </p>

              <p className="text-header px-5">How is iKaizen different?</p>
              <p className="about-text px-5">
              In our quest to evaluate how our emotions play out on a daily basis, we tried several mood tracker applications currently on the market. Unfortunately, after testing numerous apps, we found that the majority have limited functionality for tracking multiple and varied emotions. For example, many sites offer only a handful of options to rate your mood and some trackers only allow selection from a few emoticons. Other sites offer a ten point rating scale but neglect to identify which number correlates to which emotion. In the latest evidence-based research on emotion, researchers at UC Berkeley identified 27 distinct categories of emotion that often arise in tandem, instead of occurring solely in isolation. Thus, we chose to create an application capable of capturing the plethora of real human emotions. In this way, we honor our feelings in order to journey with them on the iKaizen path.  </p>
            </div>
          </div> 
        </Container>
        <Footer />
        </div>
    )
}

export default About;