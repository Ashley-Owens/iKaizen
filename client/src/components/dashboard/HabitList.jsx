import React, {Component} from 'react';
import HabitItem from './HabitItem';

class HabitList extends Component {

    render() {
        return this.props.habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} delHabit={this.props.delHabit} editHabit={this.props.editHabit}/>
        ));
    }
}

export default HabitList;