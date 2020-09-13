import React, {Component} from 'react';
import EntryItem from './EntryItem';

class EntryList extends Component {

    render() {
        return this.props.entries.map((entry) => (
            <EntryItem key={entry.user} entry={entry} delEntry={this.props.delEntry}/>
        ));
    }
}

export default EntryList;