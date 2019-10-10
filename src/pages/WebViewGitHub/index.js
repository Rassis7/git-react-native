import React, {Component} from 'react';

import {WebView} from 'react-native-webview';

export default class WebViewGitHub extends Component {
  render() {
    const {navigation} = this.props;
    const uri = navigation.getParam('uri');

    return <WebView source={{uri}} />;
  }
}
