import React, {Component} from 'react';
import Radium from 'radium'; //allows me to use the :hover style

class EntryItem extends Component {
    render() {
        const {emotions, user} = this.props.entry;
        return (
            <div style={[entryStyle]}>
                <p>
                    
                    {emotions}
                    <button style={buttonStyle} onClick={this.props.delEntry.bind(this, user)}>Delete</button>
                </p>
            </div>
        )
    }
}

EntryItem = Radium(EntryItem);

var entryStyle = {
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


export default EntryItem;