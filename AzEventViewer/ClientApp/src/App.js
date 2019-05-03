import React, { Component } from 'react';
import AzTabs from './components/azeventviewer/AzTabs';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
     <AzTabs />
    ); 
  }
}
