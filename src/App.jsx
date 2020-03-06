/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import withRoot from './style/withRoot'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import AppHeader from './components/AppHeader'
import AppDrawer from './components/AppDrawer';
import EditorPane from './components/EditorPane'
import PreviewPane, { renderPreview } from './components/PreviewPane'
import OpenFileDialog from './components/OpenFileDialog'
import SettingsDialog from './components/SettingsDialog'
import Splitter from './components/Splitter'
import Message from './components/Message'

import mscConfig from './store/MSC_Config'
import editorConfig from './store/EditorConfig'
import getViewportSize from './util/getViewportSize'

const styles = theme => ({
  app_root: {
    height: getViewportSize(window).height,
    display: 'flex',
    overflow: 'hidden',
  },
  container: {
    height: getViewportSize(window).height - 64,
    maxHeight: getViewportSize(window).height - 64,
    position: 'absolute',
    top: 64,
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
    padding: 0,
  },
  splitPane: {
    marginLeft: 64,
    height: '100%',
  },
});

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      drawerOpen: false,
      snackbarOpen: false,
      openFileDialogOpen: false,
      settingsDialogOpen: false,
    }
  }

  handleSettingsClick = () => {
    this.setState({
      settingsDialogOpen: true
    })
  }

  handleSettingsClosed = () => {
    this.setState({
      settingsDialogOpen: false
    })
  }

  handleDrawerOpen = () => {
    this.setState({
      drawerOpen: true
    })
  };
  handleDrawerClose = () => {
    this.setState({
      drawerOpen: false
    })
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackbarOpen: false,
      snackbarMsg: ""
    });
  };

  handleRenderError = (pError) => {
    this.setState({
      snackbarMsg: pError.message,
      snackbarOpen: true,
    })
  }

  /**
   * Passed to AceEditor as onChange.
   */
  handleEditorChange = newState => {
    editorConfig.setValue(newState)
    renderPreview(this.handleRenderError)
  }

  /**
   * Drawer item handler
   * Each icon in the Drawer is handled
   */
  handleDrawerItem = (event, item) => {
    switch(item) {
      case 'reset':
        editorConfig.resetEditor();
        renderPreview(this.handleRenderError);
        break;
      case 'open':
        this.setState({
          openFileDialogOpen: true
        });
        break;
       case 'save':
        editorConfig.saveToFile();
        mscConfig.saveToFile();
        break;
       default:
        console.log('handleDrawerItem received unknow command', item)

    }
 }

  /**
   * Once the user selects a file from the dialog popup,
   * the file is loaded to the editor
   */
  handleOpenFile = value => {
    this.setState({
      openFileDialogOpen: false
    })
    if (value !== null) {
      renderPreview(this.handleRenderError)}
  }

  /**
   * When the Ace Editor instance is about to load,
   * get a pointer to it
   */
  handleOnBeforeLoad = (editor) => {
    editorConfig.setEditor(editor)
  }

  render() {
    const {classes} = this.props
    const {drawerOpen, snackbarOpen, snackbarMsg, openFileDialogOpen, settingsDialogOpen} = this.state
    const content = editorConfig.value
    const error = mscConfig.error

    return (
      <div className={ classes.app_root }>
        <AppHeader title="MSC Generator" onDrawerClick={ this.handleDrawerOpen } open={ drawerOpen } onSettingsClick={ this.handleSettingsClick } />
        <AppDrawer open={ drawerOpen } onClose={ this.handleDrawerClose } onClick={ this.handleDrawerItem } />
        <Container className={ classes.container }>
          <Splitter open={ drawerOpen }>
            <EditorPane onChange={ this.handleEditorChange } content={ content } error={ error } />
            <PreviewPane onError={ this.handleRenderError } />
          </Splitter>
        </Container>
        <OpenFileDialog open={ openFileDialogOpen } onClose={ this.handleOpenFile } />
        <SettingsDialog open={ settingsDialogOpen } onClose={ this.handleSettingsClosed } />
        <Message open={ snackbarOpen } onClose={ this.handleSnackbarClose } message={ snackbarMsg } />
      </div>
    )
  };
}
export default withRoot(withStyles(styles)(App));
