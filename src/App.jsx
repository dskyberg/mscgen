import React from 'react';
import withRoot from './style/withRoot'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import AppHeader from './components/AppHeader'
import AppDrawer from './components/AppDrawer';
import EditorTab from './components/EditorTab'
import PreviewTab from './components/PreviewTab'
import OpenFileDialog from './components/OpenFileDialog'
import SettingsDialog from './components/SettingsDialog'
import Message from './components/Message'
import { saveAs } from 'file-saver'

import msc_config from './store/MSC_Config'
import editorConfig, {editorDefault} from './store/EditorConfig'


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
    width: '100%',
    maxWidth: '100%',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  grid: {
    padding: theme.spacing(2),
    display: 'flex'
  },
  gridItem: {
    padding: theme.spacing(2),
    overflow: 'auto',
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
  
    this.state = {
      open: false,
      snackbarOpen: false,
      error: null,
      openFileDialogOpen: false,
      settingsDialogOpen: false,
      svg: null,
    }
  }

  setOpen(x) {
    this.setState({
      open: x
    })
  }

  handleSettingsClick = () => {
    this.setState({settingsDialogOpen: true})
  }
  handleSettingsClosed = () => {
    this.setState({settingsDialogOpen: false})
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

  saveEditorState = (newState) => {
    editorConfig.setEditor(newState)
    this.renderPreview()
  }

  handleEditorChange = newState => {
    this.saveEditorState(newState)
  }

  renderPreview = () => {
    const config = msc_config.config
    const script = editorConfig.editor
    
    require('mscgenjs').renderMsc(
      script,
      config,
      this.handleRenderMscResult
    );
  }

  componentDidMount() {
    this.renderPreview()
  }

  handleTabChange = (event, newValue) => {
    this.setState({
      activeTab: newValue
    })
  }

  saveEditorPane() {
    const payload = this.state.editorState
    const blob = new Blob([payload], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, `${Math.floor(Date.now() / 1000)}.xu`);
  }

  savePreviewPane() {
    const payload = this.state.svg
    const blob = new Blob([payload], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, `${Math.floor(Date.now() / 1000)}.svg`);
}
  

  handleDrawerItem = (event, item) => {
    if (item === 'reset') {
      localStorage.setItem('editor', editorDefault)
      this.setState({editorState: editorDefault})
    }
    else if (item === 'open') {
      this.setState({
        openFileDialogOpen: true
      })
    }
    else if (item === 'save') {
      this.saveEditorPane();
      this.savePreviewPane();
    }
    else {
      console.log('handleDrawerItem received unknow command', item)
    }
}


  handleSaveFileClose = value => {
    this.setState({
      openFileDialogOpen: false
    })

  };
  handleOpenFile = value => {
    this.setState({
      openFileDialogOpen: false
    })
    if(value !== null){
      document.getElementById('__svg').innerHTML = ''
      this.saveEditorState(value)
    }
  }

  render() {
    const {classes} = this.props
    const {open, snackbarOpen, snackbarMsg, error, openFileDialogOpen, editorState, settingsDialogOpen} = this.state
    let markers = []
    if (error !== null) {
      console.log('render:', error)
      markers = [{
        startRow: error.location.start.line - 1,
        startCol: error.location.start.column - 1,
        endRow: error.location.end.line - 1,
        endCol: error.location.end.column - 1,
        className: classes.errorMarker
      }]
    }

    return (
      <div className={ classes.root }>
        <AppHeader title="MSCGen" onDrawerClick={ this.handleDrawerOpen }  open={ open } onSettingsClick={this.handleSettingsClick}/>
        <AppDrawer open={ open } onClose={ this.handleDrawerClose } onClick={ this.handleDrawerItem } />
        <main className={ classes.content }>
          <Container  className={ classes.container }>
            <Grid container className={ classes.grid}>
              <Grid item xs={5} className={classes.gridItem}>
                <EditorTab onChange={ this.handleEditorChange } content={ editorState } markers={ markers } />
              </Grid>
              <Grid item xs={7} className={classes.gridItem}>
                <PreviewTab />
                </Grid>
            </Grid>
          </Container>
        </main>
        <OpenFileDialog open={ openFileDialogOpen } onClose={ this.handleOpenFile } />
        <SettingsDialog open={settingsDialogOpen} onClose={this.handleSettingsClosed}/>
        <Message open={ snackbarOpen } onClose={ this.handleSnackbarClose } message={ snackbarMsg } />
      </div>
    )
  };
}
export default withRoot(withStyles(styles)(App));

