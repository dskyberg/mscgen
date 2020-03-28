/**
* Copyright (c) 2020 David Skyberg and Swankymutt.com
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* App.jsx
*/
import React from 'react';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import {observer} from 'mobx-react'
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
import PreviewPane from './components/PreviewPane'
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

/**
 * Delivered to the class component (App) via the Material-UI
 * withStyles HOC. Since App is the top level component, it is also
 * wrapped with the withRoot HOC, to set the theme.
 * @param {} theme
 */
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

/**
 * App listens to (observes) changes in the EditorConfig and MSC_Config stores and renders
 * on changes
 */
@observer
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

  /**
   * Event handlers and callbacks
   */
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

  // Clear the current snackbar error message
  handleSnackbarClose = (event, reason) => {
    this.setState({
      snackbarOpen: false,
      snackbarMsg: ""
    });
  };

  // Callback for PreviewPane onError.  Gets passed eventually to MSC_Config.render
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
  }

  /**
   * Sets values for ConfirmationDialog when reset is clicked in the drawer
   */
  handleConfirmReset = (value) => {
    this.setState({cdOpen: false, cdTitle: null, cdMessage: null, cdOnClose: null})
    if(Boolean(value)) {
      editorConfig.resetEditor();
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
  }

  /**
   * When the Ace Editor instance is about to load,
   * get a pointer to it.  Then we can do things like add
   * snippets.
   */
  handleOnLoad = (editor) => {
    editorConfig.setEditor(editor)
  }

  /**
   * Be able to switch between tabbed and split pane views. Defaults to split pane.
   */
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
          <PreviewPane onError={ this.handleRenderError } content={content} config={mscConfig.config}/>
        </Splitter>
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
            <PreviewPane onError={ this.handleRenderError } content={content} config={mscConfig.config} />
          </TabPanel>
        </div>
      )
    }

    return (
      <div className={ classes.app_root }>
        <AppHeader title="MSC Generator" name={editorConfig.name} onDrawerClick={ this.handleDrawerOpen } open={ drawerOpen } onSettingsClick={ this.handleSettingsClick } mode={this.state.mode} onModeClick={this.handleModeChanged}/>
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
