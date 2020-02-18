import React from 'react';
import { renderMsc } from 'mscgenjs';
import withRoot from './style/withRoot'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import AppHeader from './components/AppHeader'
import AppDrawer from './components/AppDrawer';
import EditorTab from './components/EditorTab'
import OpenFileDialog from './components/OpenFileDialog'
import Message from './components/Message'
import { saveAs } from 'file-saver'

import msc_config from './store/MSC_Config'


const styles = theme => ({
  root: {
    display: 'flex',
    overscrollBehaviorY: "none"
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    display: 'flex',
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    marginTop: 64,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  errorMarker: {
    position: 'absolute',
    background: 'rgba(100,200,100,0.5)',
    zIndex: 20
  }
});



class App extends React.Component {

  constructor(props) {
    super(props)
    let savedState = localStorage.getItem('editor')
    if (savedState === null)
      savedState = ""
      this.state = {
      open: true,
      activeTab: 0,
      editorState: savedState,
      editorTheme: "xcode",
      snackbarOpen: false,
      error: null,
      openFileDialogOpen: false,
      svg: null
    }
  }

  setOpen(x) {
    this.setState({
      open: x
    })
  }

  handleEditorChange = newState => {
    localStorage.setItem('editor', newState)
    this.setState({
      editorState: newState
    })
  }

  handleDrawerOpen = () => {
    this.setOpen(true);
  };
  handleDrawerClose = () => {
    this.setOpen(false);
  };
  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackbarOpen: false,
      activeTab: 0,
      snackbarMsg: ""
    });
  };

  handleRenderMscResult = (pError, pSuccess) => {
    if (Boolean(pError)) {
      console.log(pError);
      this.setState({
        snackbarMsg: pError.message,
        error: pError,
        snackbarOpen: true,
        svg: null
      })
      document.getElementById('__svg').innerHTML = ''

      return;
    } else if (Boolean(pSuccess)) {
      this.setState({
        error: null,
        svg: pSuccess
      })
      return;
    // the svg is in the pSuccess argument
    }
    console.log('Wat! Error nor success?');
    this.setState({
      snackbarMsg: "Diagram did not render properly",
      error: null,
      snackbarOpen: true
    })
  }


  handleTabChange = (event, newValue) => {
    this.setState({
      activeTab: newValue
    })
    if (newValue === 1) {
      const config = msc_config.getConfig()
      console.log(this.state.editorState)
      renderMsc(
        this.state.editorState,
        config,
        this.handleRenderMscResult
      );

    }
  }

  handleDrawerItem = (event, item) => {
    if (item === 'open') {
      this.setState({
        openFileDialogOpen: true
      })
    }
    if (item === 'save') {
      const {activeTab} = this.state
      if (activeTab === 0) { // Save the editor
        const payload = this.state.editorState
        const blob = new Blob([payload], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, `${Math.floor(Date.now() / 1000)}.xu`);
      } else if (activeTab === 1) { // Save the SVG
        const payload = this.state.svg
        const blob = new Blob([payload], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, `${Math.floor(Date.now() / 1000)}.svg`);

      }
    }
  }


  handleSaveFileClose = value => {
    console.log('handleSaveFileClose', value)
    this.setState({
      openFileDialogOpen: false
    })

  };
  handleOpenFile = value => {
    this.setState({
      editorState: value,
      openFileDialogOpen: false
    })
  }

  render() {
    const {classes} = this.props
    const {open, activeTab, snackbarOpen, snackbarMsg, error, openFileDialogOpen, editorState} = this.state
    let markers = null
    if (error !== null) {
      markers = [{
        startRow: error.location.start.line - 1,
        startCol: 1,
        endRow: error.location.end.line - 1,
        endCol: 100,
        className: classes.errorMarker
      }]
    }

    return (
      <div className={ classes.root }>
        <AppHeader title="MSCGen" onDrawerClick={ this.handleDrawerOpen } badgeContent={ 4 } open={ open } />
        <AppDrawer open={ open } onClose={ this.handleDrawerClose } onClick={ this.handleDrawerItem } />
        <main className={ classes.content }>
          <Container maxWidth="lg" className={ classes.container }>
            <AppBar position="static">
              <Tabs value={ activeTab } onChange={ this.handleTabChange }>
                <Tab label="Editor" />
                <Tab label="Preview" />
              </Tabs>
            </AppBar>
            < EditorTab pos={ 0 } active={ activeTab } onChange={ this.handleEditorChange } content={ editorState } markers={ markers } />
            <div id="__svg" hidden={ activeTab !== 1 }></div>
          </Container>
        </main>
        <OpenFileDialog open={ openFileDialogOpen } onClose={ this.handleOpenFile } />
        <Message open={ snackbarOpen } onClose={ this.handleSnackbarClose } message={ snackbarMsg } />
      </div>
    )
  };
}
export default withRoot(withStyles(styles)(App));
