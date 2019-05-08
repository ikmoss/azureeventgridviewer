import React, { PureComponent } from 'react'
import ReactJson from 'react-json-view'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import AzEventCard from './AzEventCard';
import OopsCard from './OopsCard';

class JsonDataSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {jsonDataList: [], isSplit:true};
    }
    
    jsonDataListChanged = (jsonDataList) => {
        this.setState({jsonDataList});
    }

    toggleSplitView = () => {
        const {isSplit} = this.state;
        this.setState({isSplit: !isSplit});
    }
    render() {
        if (this.state.jsonDataList.length > 0) {
            return (
                <Paper>
                <FormGroup>
                    <FormControlLabel 
                        control={
                            <Switch
                            checked={this.state.isSplit}
                            onChange={this.toggleSplitView}
                            value="checkedB"
                            color="primary"
                          />
                        }
                        label="Split View"
                    />
                </FormGroup>
                <Grid container spacing={24} style={{width:'100%'}}>
                
                {this.state.jsonDataList.map(item => {
                    return (
                        <Grid item xs={this.state.isSplit? 6:12} key={`jsondata${item.id}`}>
                        <Paper>
                        <AzEventCard topic={item.topic} type={item.eventType} subject={item.subject} id={item.id} removeSelection={this.props.removeSelection}/>
                        <ReactJson src={item.data} collapsed={2} />
                        </Paper>
                        </Grid>
                    );
                })}
                </Grid>
                </Paper>
            );
        }
        else {
            return (
                <OopsCard title="No items to display" message="Highlight items in Event Log table first and change back to JSON viewer tab."/> 
            );
        }
    }
}

export default JsonDataSection;