import React, {Component} from 'react';
import Radium from 'radium'; //allows me to use the :hover style
import EditHabit from './EditHabit';

class HabitItem extends Component {
    state = {
        displayEditHabits: false,
        id: 0
    }

    _displayHabitEdit = (id) => {
        console.log(this.state.displayEditHabits);
        this.setState({
            displayEditHabits: !this.state.displayEditHabits,
            id: id
        })
    }

    render() {
        const {name, id} = this.props.habit;
        return (
            <div style={[habitStyle]}>
                <p>
                    {name}
                    <span style={buttonGroup}>
                        <button style={editButtonStyle} onClick={this._displayHabitEdit.bind(this, id)}>Edit</button> 
                        <button style={deleteButtonStyle} onClick={this.props.delHabit.bind(this, id)}>Delete</button>
                    </span>
                    <div>
                        { this.state.displayEditHabits && <EditHabit />}
                    </div>
                </p>
            </div>
        )
    }
}

HabitItem = Radium(HabitItem);
var habitStyle = {
    backgroundColor: '#F5F5F5',
    padding: '10px',
    border: '1px dotted #BEBEBE',
    margin: '0px',
    width: '100%',
    ':hover': {
        backgroundColor: '#DCDCDC'
    }
}

const deleteButtonStyle = {
    backgroundColor: '#A00000',
    padding: '4px',
    border: '1px solid #808080',
    borderRadius: '15%',
    cursor: 'pointer'
}

const editButtonStyle = {
    backgroundColor: '#0099FF',
    padding: '4px',
    border: '1px solid #808080',
    borderRadius: '15%',
    cursor: 'pointer',
    marginRight: '4px'
}

const buttonGroup = {
    float: 'right',
    margin: '3px'
}


export default HabitItem;