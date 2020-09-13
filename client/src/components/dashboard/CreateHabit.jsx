import React, {Component} from 'react';
import {Card, Button, Form, DropdownButton, Dropdown} from 'react-bootstrap';
import axios from 'axios';
import habits from '../../static/habits.js'

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
        /*axios.post('/api/users/my/habit', payload)
        .then() */
    }

    buttonChange = (e) => {
        this.setState({isBinary: e.target.value})
    }

    render() {
        return (

            <Form>
                <Form.Group controlId="habitName">
                    <Form.Control
                    name="habitName"
                    placeholder="Select Habit"
                    as="select"
                    onSelect={(event, newValue) => this.setState({name: newValue})}>
                        {habits.map(habit => {
                            return <option key={habit}>{habit.name}</option>
                        })}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="habitType">
                    <Form.Label>How would you like to track your habit?</Form.Label>
                    <Form.Check
                        type="radio"
                        label="Done/Not Done"
                        name="isBinary"
                        value="true"
                    />
                    <Form.Check
                        type="radio"
                        label="Percentage Complete"
                        name="isBinary"
                        value="false"
                    />  
                </Form.Group>
                <Button variant="info" name="submitHabit" onClick={this.postHabit}>Submit</Button>  
            </Form>
           
            // <form style={formStyle}>
            //     <p>
            //         <input type="text" name="name" placeholder="Habit name" value={this.state.title} 
            //         onChange={(event, newValue) => this.setState({name: newValue})}></input>
            //     </p>
            //     <p>
            //         <label>How would you like to track your habit?</label>
            //     </p>
            //     <p onchange={this.buttonChange}>
            //         <input type="radio" name="isBinary" is="isBinary" value="true"/>
            //         <label for="isBinary" style={{paddingLeft: "6px"}}>Done/Not Done</label>
            //     </p>
            //     <p onchange={this.buttonChange}>
            //         <input type="radio" name="isBinary" is="isNotBinary" value="false"/>
            //         <label for="isNotBinary" style={{paddingLeft: "6px"}}>Percentage Complete</label>
            //     </p>
            //     <Button variant="info" name="submitHabit" onClick={this.postHabit}>Submit</Button>
                
            // </form>
           
            /*
                    <DropdownButton id="dropdown-basic-button" title="Select Habit" onSelect={(e, newValue) => this.setState({name: newValue})}>
                        {habits.map(habit => {
                            return <Dropdown.Item key={habit}>{habit.name}</Dropdown.Item>
                        })}
                    </DropdownButton>
            */
        );
    }
}

// const formStyle = {
//     border: "1px solid grey",
//     padding: "10px",
//     margin: "10px",
//     width: "100%",
// }

export default CreateHabit;