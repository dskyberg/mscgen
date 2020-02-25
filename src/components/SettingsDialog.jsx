import React from 'react';
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format';
import {observer} from 'mobx-react'
import {withStyles} from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch';

import editorConfig from '../store/EditorConfig'
import msc_config from '../store/MSC_Config'

const styles = theme => ({
    dialogContent: {
        display: 'flex'
    },
    formControl: {
        margin: theme.spacing(1)
    },
    selectFormControl: {
        margin: theme.spacing(1),
        minWidth: 120
    }
});

function NumberFormatCustom(props) {
    const {
        inputRef,
        onChange,
        ...other
    } = props;

    return (<NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
        onChange({
            target: {
                value: values.value
            }
        });
    }}
        thousandSeparator
        isNumericString/>);
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

const SettingsDialog = observer(class SettingsDialog extends React.Component {

    handleEditorSelect = name => event => {
        editorConfig.setConfig(name, event.target.value)

    }
    handleMSCGenSelect = name => event => {
        msc_config.setConfig(name, event.target.value)

    }

    handleEditorSwitch = name => event => {
        // this.setState({ ...this.state, [name]: event.target.checked });
        editorConfig.setConfig(name, event.target.checked)
    };

    handleMSCGenSwitch = name => event => {
        // this.setState({ ...this.state, [name]: event.target.checked });
        msc_config.setConfig(name, event.target.checked)
    };

    handleEditorNumber = name => event => {
        // this.setState({ ...this.state, [name]: event.target.checked });
        editorConfig.setConfig(name, parseInt(event.target.checked, 10))
    };

    handleMSCGenNumber = name => event => {
        // this.setState({ ...this.state, [name]: event.target.checked });
        msc_config.setConfig(name, parseInt(event.target.checked, 10))
    };

    render() {
        const {open, onClose, classes} = this.props

        return (
            <Dialog open={open} onClose={onClose} scroll="paper">
                <DialogTitle id="settings-dialog-title">Settings</DialogTitle>
                <DialogContent dividers={true}>
                    <div className={classes.dialogContent}>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel component="legend">Editor Settings</FormLabel>
                            <FormGroup>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        label="Font Size"
                                        value={editorConfig.fontSize}
                                        onChange={this.handleEditorSelect('fontSize')}
                                        id="editor-fontSize"
                                        InputProps={{
                                        inputComponent: NumberFormatCustom
                                    }}/>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        label="Tab"
                                        value={editorConfig.tabSize}
                                        onChange={this.handleEditorSelect('tabSize')}
                                        id="editor-tabSize"
                                        InputProps={{
                                        inputComponent: NumberFormatCustom
                                    }}/>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="editor-mode-label">Mode</InputLabel>
                                    <Select
                                        labelId="editor-mode-label"
                                        id="editor-mode"
                                        value={editorConfig.mode}
                                        onChange={this.handleEditorSelect('mode')}>
                                        <MenuItem value={'java'}>java</MenuItem>
                                        <MenuItem value={'javascript'}>javascript</MenuItem>
                                        <MenuItem value={'json'}>json</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="editor-theme-label">Theme</InputLabel>
                                    <Select
                                        labelId="editor-theme-label"
                                        id="editor-theme"
                                        value={editorConfig.theme}
                                        onChange={this.handleEditorSelect('theme')}>
                                        <MenuItem value={'ambiance'}>ambiance</MenuItem>
                                        <MenuItem value={'chaos'}>chaos</MenuItem>
                                        <MenuItem value={'chrome'}>chrome</MenuItem>
                                        <MenuItem value={'clouds'}>clouds</MenuItem>
                                        <MenuItem value={'clouds_midnight'}>clouds_midnight</MenuItem>
                                        <MenuItem value={'cobalt'}>cobalt</MenuItem>
                                        <MenuItem value={'crimson_editor'}>crimson_editor</MenuItem>
                                        <MenuItem value={'dawn'}>dawn</MenuItem>
                                        <MenuItem value={'dracula'}>dracula</MenuItem>
                                        <MenuItem value={'dreamweaver'}>dreamweaver</MenuItem>
                                        <MenuItem value={'eclipse'}>eclipse</MenuItem>
                                        <MenuItem value={'github'}>github</MenuItem>
                                        <MenuItem value={'gob'}>gob</MenuItem>
                                        <MenuItem value={'gruvbox'}>gruvbox</MenuItem>
                                        <MenuItem value={'idle_fingers'}>idle_fingers</MenuItem>
                                        <MenuItem value={'iplastic'}>iplastic</MenuItem>
                                        <MenuItem value={'katzenmilch'}>katzenmilch</MenuItem>
                                        <MenuItem value={'monokai'}>monokai</MenuItem>
                                        <MenuItem value={'xcode'}>xcode</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    label="Show print margin"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-showPrintMargin" checked = {
                                    editorConfig.showPrintMargin
                                }
                                onChange = {
                                    this.handleEditorSwitch('showPrintMargin')
                                }
                                value = "showPrintMargin" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Show gutter"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-showGutter" checked = {
                                    editorConfig.showGutter
                                }
                                onChange = {
                                    this.handleEditorSwitch('showGutter')
                                }
                                value = "showGutter" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Highlight active line"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-highlightaActiveLine" checked = {
                                    editorConfig.highlightActiveLine
                                }
                                onChange = {
                                    this.handleEditorSwitch('highlightActiveLine')
                                }
                                value = "highlightActiveLine" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Basic autocomplete"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-enableBasicAutocompletion" checked = {
                                    editorConfig.enableBasicAutocompletion
                                }
                                onChange = {
                                    this.handleEditorSwitch('enableBasicAutocompletion')
                                }
                                value = "enableBasicAutocompletion" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Live autocomplete"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-enableLiveAutocompletion" checked = {
                                    editorConfig.enableLiveAutocompletion
                                }
                                onChange = {
                                    this.handleEditorSwitch('enableLiveAutocompletion')
                                }
                                value = "enableLiveAutocompletion" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Enable snippets"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-enableSnippets" checked = {
                                    editorConfig.enableSnippets
                                }
                                onChange = {
                                    this.handleEditorSwitch('enableSnippets')
                                }
                                value = "enableSnippets" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Show line numbers"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-showLineNumbers" checked = {
                                    editorConfig.showLineNumbers
                                }
                                onChange = {
                                    this.handleEditorSwitch('showLineNumbers')
                                }
                                value = "showLineNumbers" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                            </FormGroup>
                        </FormControl>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel component="legend">Preview Settings</FormLabel>
                            <FormGroup>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="msc-inputType-label">Input type</InputLabel>
                                    <Select
                                        labelId="msc-inputType-label"
                                        id="msc-inputType"
                                        value={msc_config.inputType}
                                        onChange={this.handleMSCGenSelect('inputType')}>
                                        <MenuItem value={'mscgen'}>mscgen</MenuItem>
                                        <MenuItem value={'mscgenny'}>mscgenny</MenuItem>
                                        <MenuItem value={'xu'}>xu</MenuItem>
                                        <MenuItem value={'json'}>json</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="msc-additionalTemplate-label">Additional template</InputLabel>
                                    <Select
                                        labelId="msc-additionalTemplate-label"
                                        id="msc-additionalTemplate"
                                        value={msc_config.additionalTemplate}
                                        onChange={this.handleMSCGenSelect('additionalTemplate')}>
                                        <MenuItem value={'lazy'}>lazy</MenuItem>
                                        <MenuItem value={'classic'}>classic</MenuItem>
                                        <MenuItem value={'empty'}>empty</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="msc-regularArcTextVerticalAlignment-label">Text alignment</InputLabel>
                                    <Select
                                        labelId="msc-regularArcTextVerticalAlignment-label"
                                        id="msc-regularArcTextVerticalAlignment"
                                        value={msc_config.regularArcTextVerticalAlignment}
                                        onChange={this.handleMSCGenSelect('regularArcTextVerticalAlignment')}>
                                        <MenuItem value={'above'}>above</MenuItem>
                                        <MenuItem value={'middle'}>middle</MenuItem>
                                        <MenuItem value={'below'}>below</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    label="Mirror entities"
                                    labelPlacement="start"
                                    control={< Switch id = "msc-mirrorEntitiesOnBottom" checked = {
                                    msc_config.mirrorEntitiesOnBottom
                                }
                                onChange = {
                                    this.handleMSCGenSwitch('mirrorEntitiesOnBottom')
                                }
                                value = "mirrorEntitiesOnBottom" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Include source"
                                    labelPlacement="start"
                                    control={< Switch id = "msc-includeSource" checked = {
                                    msc_config.includeSource
                                }
                                onChange = {
                                    this.handleMSCGenSwitch('includeSource')
                                }
                                value = "includeSource" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>

                            </FormGroup>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
})
export default withStyles(styles)(SettingsDialog)