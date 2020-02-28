import React from 'react';
import withRoot from './style/withRoot'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import AppHeader from './components/AppHeader'
import AppDrawer from './components/AppDrawer';
import EditorTab from './components/EditorTab'
import PreviewTab from './components/PreviewTab'
import OpenFileDialog from './components/OpenFileDialog'
import SettingsDialog from './components/SettingsDialog'
import Splitter from './components/Splitter'
import Message from './components/Message'
import { saveAs } from 'file-saver'

import msc_config from './store/MSC_Config'
import editorConfig from './store/EditorConfig'


const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    display: 'flex',
    flexGrow: 1,
  },
  container: {
    marginTop: 64,
    width: '100%',
    maxWidth: '100%',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: 0,
    paddingRight: 0,
  },
  grid: {
    display: 'flex'
  },
  gridItem: {
  },
  splitPane: {
    marginLeft: 64,
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

  componentDidMount() {
    this.renderPreview()
  }

  handleSettingsClick = () => {
    this.setState({settingsDialogOpen: true})
  }
  handleSettingsClosed = () => {
    this.setState({settingsDialogOpen: false})
    this.renderPreview()
  }

  handleDrawerOpen = () => {
    this.setState({drawerOpen: true})
  };
  handleDrawerClose = () => {
    this.setState({drawerOpen: false})
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

  handleRenderMscResult = (pError, pSuccess) => {
    if (Boolean(pError)) {
      msc_config.setSvg(null)
      msc_config.setError(pError)

      this.setState({
        snackbarMsg: pError.message,
        snackbarOpen: true,
      })
      return;
    }
    if (Boolean(pSuccess)) {
      msc_config.setError(null)
      msc_config.setSvg(pSuccess)
      return;
    // the svg is in the pSuccess argument
    }
    console.log('Wat! Error nor success?');
    this.setState({
      snackbarMsg: "Diagram did not render properly",
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
    document.getElementById('__svg').innerHTML = ''
    require('mscgenjs').renderMsc(
      script,
      config,
      this.handleRenderMscResult
    );
  }

  saveEditorToFile() {
    const payload = editorConfig.editor
    const blob = new Blob([payload], {
      type: "text/plain;charset=utf-8"
    });
    // Save the blob to a local file
    saveAs(blob, `${Math.floor(Date.now() / 1000)}.xu`);
  }

  savePreviewToFile() {
    const payload = msc_config.svg
    const blob = new Blob([payload], {
      type: "text/plain;charset=utf-8"
    });
    // Save the blob to a local file
    saveAs(blob, `${Math.floor(Date.now() / 1000)}.svg`);
}


  handleDrawerItem = (event, item) => {
    if (item === 'reset') {
      editorConfig.resetEditor()
      this.renderPreview()
    }
    else if (item === 'open') {
      this.setState({
        openFileDialogOpen: true
      })
    }
    else if (item === 'save') {
      this.saveEditorToFile();
      this.savePreviewToFile();
    }
    else {
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
    if(value !== null){
      this.saveEditorState(value)
    }
  }

  render() {
    const {classes} = this.props
    const {drawerOpen, snackbarOpen, snackbarMsg, openFileDialogOpen, settingsDialogOpen} = this.state
    const content = editorConfig.editor
    const error = msc_config.error

    return (
      <div className={ classes.root }>
        <AppHeader title="MSCGen" onDrawerClick={ this.handleDrawerOpen }  open={ drawerOpen } onSettingsClick={this.handleSettingsClick}/>
        <AppDrawer open={ drawerOpen } onClose={ this.handleDrawerClose } onClick={ this.handleDrawerItem } />
        <main className={ classes.content }>
          <Container  className={ classes.container }>
          <Splitter open={drawerOpen }>
              <EditorTab onChange={ this.handleEditorChange } content={ content } error={ error } />
              <PreviewTab error={error}/>
            </Splitter>
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
