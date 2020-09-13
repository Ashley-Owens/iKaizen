import React, { Component } from "react";
import axios from "axios";
import NavBar from "../NavBar";
import withRouteProtection from "../auth/withRouteProtection";


import CreateHabit from './CreateHabit';
import AddHabit from './AddHabit';
import HabitList from './HabitList';

import EntryList from "./EntryList";

import Footer from "../Footer";

import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Button, Row, Col} from 'react-bootstrap';
import '../../App.css';

class Dashboard extends Component {
    constructor() {
        super();
        /*
        axios.get('/api/users/my/habits')
        .then(res => this.setState({habits: res.data}));

        axios.get('/api/users/my/entries')
        .then(res => this.setState({entries: res.data}));
        */
    this.state = {
      habits: [
        {
          name: "This is habit 1",
          progress: 50,
          date: "10/24/1999",
          isBinary: false,
          isArchived: false,
          id: 1,
        },
        {
          name: "This is habit 2",
          progress: 75,
          date: "10/24/2000",
          isBinary: true,
          isArchived: false,
          id: 2,
        },
        {
          name: "This is habit 3",
          progress: 100,
          date: "10/24/2001",
          isBinary: false,
          isArchived: true,
          id: 3,
        },
      ],
      entries: [
        {
          emotions: ["Sad", "Happy", "Excited", "Anxious"],
          date: "10/24/1999",
          habitsSelected: 1,
          user: 1,
        },
        {
          emotions: ["Sad", "Excited", "Anxious"],
          date: "10/24/2000",
          habitsSelected: 2,
          user: 2,
        },
        {
          emotions: ["Sad", "Happy", "Excited"],
          date: "10/24/2001",
          habitsSelected: 3,
          user: 3,
        },
      ],
      displayFormHabit: false,
    };
  }

  delHabit = (id) => {
    //axios.delete('/api/users/' + id);
    this.setState({
      habits: [...this.state.habits.filter((habit) => habit.id !== id)],
    });
  };

  delEntry = (user) => {
    //axios.delete('/api/users/' + id);
    this.setState({
      entries: [...this.state.entries.filter((entry) => entry.user !== user)],
    });
  };

  _displayHabitForm = () => {
    this.setState({
      displayFormHabit: !this.state.displayFormHabit,
    });
  };

    render() {
        return(
            <div className="pt-5 nav-padding">
                <NavBar />
                <div>

                <div className="bg-light card-header">Enter A New Habit</div>
                    <Row>
                        <Col>
                        <Card>
                        <Card.Body>
                            <Card.Title>Create your own</Card.Title>
                            <Card.Text>
                            Add to your list of tracked habits by creating your own.
                            </Card.Text>
                            <AddHabit />
                        </Card.Body>
                        </Card>
                        </Col>
                        <Col>
                        <Card>
                        <Card.Body>
                            <Card.Title>Choose A Habit</Card.Title>
                            <Card.Text>
                            Add to your list of tracked habits by choosing from a list.
                            </Card.Text>
                            <CreateHabit />
                        </Card.Body>
                    </Card>
                        </Col>
                    </Row>
                </div>
                    <Card>
                        <Card.Header>Current Habits</Card.Header>
                        <Card.Body>
                            <Card.Title>Current User Habits</Card.Title>
                            <Card.Text>
                            </Card.Text>
                            <HabitList habits={this.state.habits} delHabit={this.delHabit}/>
                        </Card.Body>
                        </Card>
 


                        {/* <button onClick={this._displayHabitForm}>Add a New Habit</button>
                        { this.state.displayFormHabit && <CreateHabit />}
                        <HabitList habits={this.state.habits} delHabit={this.delHabit}/>
                        <hr></hr>

                        <EntryList entries={this.state.entries} delEntry={this.delEntry}/>
                    </div> */}
                    
                <Footer />
            </div>
        );
    }
}

export default /*withRouteProtection(*/Dashboard/*, { redirectTo: "/about" });*/
