/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import clsx from 'clsx';
import withRoot from './style/withRoot'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './components/TabPanel'
import AppHeader from './components/AppHeader'
import AppDrawer from './components/AppDrawer';
import EditorPane from './components/EditorPane'
import PreviewPane, { renderPreview } from './components/PreviewPane'
import OpenFileDialog from './components/OpenFileDialog'
import SettingsDialog from './components/SettingsDialog'
import Splitter from './components/Splitter'
import Message from './components/Message'
import ConfirmationDialog from './components/ConfirmationDialog'
import SaveFileDialog from './components/SaveFileDialog'

import mscConfig from './store/MSC_Config'
import editorConfig from './store/EditorConfig'
import getViewportSize from './util/getViewportSize'
import {drawerWidth} from './components/AppDrawer'


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
    marginLeft: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: 'hidden',
  },
  splitPaneClose: {
    overflow: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(9),
    },
  }
});

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      drawerOpen: false,
      snackbarOpen: false,
      openFileDialogOpen: false,
      settingsDialogOpen: false,
      cdTitle: null,
      cdMessage: null,
      cdOpen: false,
      cdOnClose: null,
      sfdOpen:false,
      tab:0,
      mode: 'split',
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
   * Sets values for ConfirmationDialog when reset is clicked in the drawer
   */
  handleConfirmReset = (value) => {
    this.setState({cdOpen: false, cdTitle: null, cdMessage: null, cdOnClose: null})
    if(Boolean(value)) {
      editorConfig.resetEditor();
      renderPreview(this.handleRenderError);
    }
  }

  handleSaveFileDialog = (value) => {
    this.setState({sfdOpen:false})
    if(Boolean(value)) {
      editorConfig.saveToFile();
      mscConfig.saveToFile();
    }
  }

  /**
   * Drawer item handler
   * Each icon in the Drawer is handled
   */
  handleDrawerItem = (event, item) => {
    switch (item) {
      case 'reset':
        this.setState({
          cdOpen: true,
          cdTitle: 'Reset Editor',
          cdMessage: 'Clicking "OK" will result in all current work being lost',
          cdOnClose: this.handleConfirmReset
        })
        break;
      case 'open':
        this.setState({
          openFileDialogOpen: true
        });
        break;
      case 'save':
        this.setState({
          sfdOpen: true
        });
        break;
      case 'method':
        editorConfig.addText('method');
        break;
      case 'signal':
        editorConfig.addText('signal');
        break;
      case 'callback':
        editorConfig.addText('callback');
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
      renderPreview(this.handleRenderError)
    }
  }

  /**
   * When the Ace Editor instance is about to load,
   * get a pointer to it
   */
  handleOnLoad = (editor) => {
    editorConfig.setEditor(editor)
  }

  handleModeChanged = () => {
    const mode = this.state.mode
    this.setState({mode: mode === 'tabs' ? 'split' : 'tabs'})
  }
  /**
   * If using tabs, track when the tab changes
   */
  handleTabChange = (event, newValue) => {
    this.setState({tab: newValue});
  }

  render() {
    const {classes} = this.props
    const {drawerOpen, snackbarOpen, snackbarMsg, openFileDialogOpen, settingsDialogOpen} = this.state
    const content = editorConfig.value
    const error = mscConfig.error

    const doSplitWindow = () => {
      return (
        <Splitter open={ drawerOpen }>
          <DndProvider backend={Backend}>
            <EditorPane inSplitter={true} onChange={ this.handleEditorChange } onLoad={ this.handleOnLoad } content={ content } error={ error } />
          </DndProvider>
          <PreviewPane onError={ this.handleRenderError } />
        </Splitter>
      )
    }
    const doMultiWindow = () => {
      return (
        <React.Fragment>
          <DndProvider backend={Backend}>
            <EditorPane inSplitter={false} open={ drawerOpen } onChange={ this.handleEditorChange } onLoad={ this.handleOnLoad } content={ content } error={ error } />
          </DndProvider>
          <PreviewPane inPortal={true} onError={ this.handleRenderError } />
        </React.Fragment>
      )
    }

    const doTabs = () => {
      return (
        <div className={clsx(classes.splitPane, !drawerOpen && classes.splitPaneClose)}>
          <Tabs value={this.state.tab}onChange={this.handleTabChange} aria-label="mscgen tabbed view">
            <Tab label="Editor" />
            <Tab label="Preview"/>
          </Tabs>
          <TabPanel value={this.state.tab} index={0}>
            <DndProvider backend={Backend}>
              <EditorPane inSplitter={true} onChange={ this.handleEditorChange } onLoad={ this.handleOnLoad } content={ content } error={ error } />
            </DndProvider>
          </TabPanel>
          <TabPanel value={this.state.tab} index={1}>
            <PreviewPane onError={ this.handleRenderError } />
          </TabPanel>
        </div>
      )
    }

    return (
      <div className={ classes.app_root }>
        <AppHeader title="MSC Generator" onDrawerClick={ this.handleDrawerOpen } open={ drawerOpen } onSettingsClick={ this.handleSettingsClick } mode={this.state.mode} onModeClick={this.handleModeChanged}/>
        <AppDrawer open={ drawerOpen } onClose={ this.handleDrawerClose } onClick={ this.handleDrawerItem } />
        <Container className={ classes.container }>
          {this.state.mode === 'tabs' ? doTabs() : doSplitWindow()}
        </Container>
        <OpenFileDialog open={ openFileDialogOpen } onClose={ this.handleOpenFile } />
        <SettingsDialog open={ settingsDialogOpen } onClose={ this.handleSettingsClosed } />
        <Message open={ snackbarOpen } onClose={ this.handleSnackbarClose } message={ snackbarMsg } />
        <ConfirmationDialog
          open={this.state.cdOpen}
          title={this.state.cdTitle}
          message={this.state.cdMessage}
          onClose={this.state.cdOnClose}
          />
          <SaveFileDialog open={this.state.sfdOpen} onClose={this.handleSaveFileDialog} />
      </div>
    )
  };
}
export default withRoot(withStyles(styles)(App));
