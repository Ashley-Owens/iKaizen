import React, {Component} from 'react';
import Radium from 'radium'; //allows me to use the :hover style

class HabitItem extends Component {


    render() {
        return (
            <div>
                <p style={[habitStyle]}>
                    {this.props.habit.name}
                    <button style={buttonStyle}>Delete</button>
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

const buttonStyle = {
    backgroundColor: '#A00000',
    padding: '4px',
    border: '1px solid #808080',
    borderRadius: '10%',
    float: 'right',
    cursor: 'pointer'
}


export default HabitItem;