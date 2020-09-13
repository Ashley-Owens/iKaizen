import React, {Component} from 'react';
import axios from 'axios';

class CreateHabit extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            isBinary: true
        };
    }

    postHabit = () => {
        const payload={
            "name": this.state.name,
            "isBinary": this.state.isBinary
        }
        axios.post('/api/users/my/habit', payload)
        .then()
    }

    buttonChange = (e) => {
        this.setState({isBinary: e.target.value})
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
                
                <button name="submitHabit" onClick={this.postHabit}>Submit</button>
            </form>
        );
    }
}

const formStyle = {
    border: "1px solid grey",
    padding: "10px",
    margin: "10px",
    width: "100%",
}

export default CreateHabit;