import React, {Component} from 'react';
import axios from 'axios';

class EditHabit extends Component {

    constructor(props) {
        super();
        this.state = {
            name: "",
            isBinary: true
        };
    }

    editHabit = (id) => {
        console.log(id);
        const payload={
            "name": this.state.name,
            "isBinary": this.state.isBinary
        }
        /*axios.post('/api/users/habit/' + id, payload)
        .then()*/
    }

    render() {
        return (
            <form style={formStyle}>
                <p>
                    <input type="text" name="name" placeholder="Habit name" value={this.state.title} 
                    onChange={(event, newValue) => this.setState({name: newValue})}></input>
                </p>
                <p>
                    <label>How do you want your habit tracked?</label>
                </p>
                <p onchange={this.buttonChange}>
                    <input type="radio" name="isBinary" is="isBinary" value="true"/>
                    <label for="isBinary" style={{paddingLeft: "6px"}}>Yes/No</label>
                </p>
                <p onchange={this.buttonChange}>
                    <input type="radio" name="isBinary" is="isNotBinary" value="false"/>
                    <label for="isNotBinary" style={{paddingLeft: "6px"}}>Percentage Complete</label>
                </p>
                
                <button name="submitHabit" onClick={this.editHabit.bind(this, this.props.id)}>Update</button>
            </form>
        )
    }
}

const formStyle = {
    border: "1px solid grey",
    padding: "10px",
    margin: "10px",
    width: "100%",
}

export default EditHabit;