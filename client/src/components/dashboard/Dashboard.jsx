import React, {Component} from 'react';
import axios from 'axios';
import NavBar from '../NavBar';

import CreateHabit from './CreateHabit';
import HabitList from './HabitList';

import EntryList from './EntryList';

import Footer from '../Footer';
import withRouteProtection from '../auth/withRouteProtection';

class Dashboard extends Component {
  state = {
    habits: [
      {
        name: "This is habit 1",
        progress: 50,
        date: "10/24/1999",
        isBinary: false,
        isAsrchived: false,
        id: 1,
      },
      {
        name: "This is habit 2",
        progress: 75,
        date: "10/24/2000",
        isBinary: true,
        isAsrchived: false,
        id: 2,
      },
      {
        name: "This is habit 3",
        progress: 100,
        date: "10/24/2001",
        isBinary: false,
        isAsrchived: true,
        id: 3,
      },
    ],
  };

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
                    date: '10/24/1999',
                    isBinary: false,
                    isArchived: false, 
                    id: 1
                },
                {
                    name: "This is habit 2",
                    progress: 75, 
                    date: '10/24/2000',
                    isBinary: true,
                    isArchived: false, 
                    id: 2
                },
                {
                    name: "This is habit 3",
                    progress: 100, 
                    date: '10/24/2001',
                    isBinary: false,
                    isArchived: true, 
                    id: 3
                },
            ],
            entries: [
                {
                    emotions: ["Sad", "Happy", "Excited", "Anxious"],
                    date: '10/24/1999',
                    habitsSelected: 1,
                    user: 1
                },
                {
                    emotions: ["Sad", "Excited", "Anxious"],
                    date: '10/24/2000',
                    habitsSelected: 2,
                    user: 2
                },
                {
                    emotions: ["Sad", "Happy", "Excited"],
                    date: '10/24/2001',
                    habitsSelected: 3,
                    user: 3
                }
            ],
            displayFormHabit: false
        };
    }

    delHabit = (id) => {
        //axios.delete('/api/users/' + id);
        this.setState({habits: [...this.state.habits.filter(habit => habit.id !== id)]});
    }

    delEntry = (user) => {
        //axios.delete('/api/users/' + id);
        this.setState({entries: [...this.state.entries.filter(entry => entry.user !== user)]});
    }

    _displayHabitForm = () => {
        this.setState({
            displayFormHabit: !this.state.displayFormHabit
        })
    }

    render() {
        return(
            <div>
                <NavBar />
                <button onClick={this._displayHabitForm}>Add a New Habit</button>
                { this.state.displayFormHabit && <CreateHabit />}
                <HabitList habits={this.state.habits} delHabit={this.delHabit}/>
                <hr></hr>

                <EntryList entries={this.state.entries} delEntry={this.delEntry}/>
                <Footer />
            </div>
        );
    }
}

export default withRouteProtection(Dashboard, { redirectTo: "/about" });
