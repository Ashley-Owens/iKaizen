import React, {Component} from 'react';
import {Card, Button, Form} from 'react-bootstrap';
import habits from '../../static/habits.js';
import emotions from '../../static/emotions.js';

class MakeEntry extends Component {

    constructor(){
        super();
        this.state = {
            habitName: '',
            emotionName: ''
        }
    }

    render(){
        return (
            <Form>
                <Form.Group>
                <Form.Control
                    name="habitName"
                    placeholder="Select Habit"
                    as="select"
                    onSelect={(event, newValue) => this.setState({habitName: newValue})}>
                        {habits.map(habit => {
                            return <option key={habit}>{habit.name}</option>
                        })}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                <Form.Control
                    name="emotionName"
                    placeholder="Select an Emotion"
                    as="select"
                    onSelect={(event, newValue) => this.setState({entryName: newValue})}>
                        {emotions.map(emotion => {
                            return <option key={emotion}>{emotion.name}</option>
                        })}
                    </Form.Control>
                </Form.Group>
                
            </Form>
        );
    }
}

export default MakeEntry;
