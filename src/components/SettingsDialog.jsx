/*
    Copyright (c) 2020 by David Skyberg
*/
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
import mscConfig from '../store/MSC_Config'

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

@withStyles(styles)
@observer
class SettingsDialog extends React.Component {

    

    handleChange = (config, name, elType) => event => {
        const t = event.target
        switch(elType) {
            case 'switch': config.setConfig(name, t.checked); break;
            case 'number': config.setConfig(name, parseInt(t.value, 10)); break;
            default: config.setConfig(name, t.value); break;
        }
    }


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
                                        onChange={this.handleChange(editorConfig,'fontSize', 'number')}
                                        id="editor-fontSize"
                                        InputProps={{
                                        inputComponent: NumberFormatCustom
                                    }}/>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        label="Tab Size"
                                        value={editorConfig.tabSize}
                                        onChange={this.handleChange(editorConfig, 'tabSize', 'number')}
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
                                        onChange={this.handleChange(editorConfig,'mode','select')}>
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
                                        onChange={this.handleChange(editorConfig,'theme','select')}>
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
                                    this.handleChange(editorConfig,'showPrintMargin','switch')
                                }
                                value = "showPrintMargin" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Show gutter"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-showGutter" checked = {
                                    editorConfig.showGutter
                                }
                                onChange = {
                                    this.handleChange(editorConfig,'showGutter','switch')
                                }
                                value = "showGutter" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Highlight active line"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-highlightaActiveLine" checked = {
                                    editorConfig.highlightActiveLine
                                }
                                onChange = {
                                    this.handleChange(editorConfig,'highlightActiveLine','switch')
                                }
                                value = "highlightActiveLine" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Basic autocomplete"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-enableBasicAutocompletion" checked = {
                                    editorConfig.enableBasicAutocompletion
                                }
                                onChange = {
                                    this.handleChange(editorConfig,'enableBasicAutocompletion','switch')
                                }
                                value = "enableBasicAutocompletion" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Live autocomplete"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-enableLiveAutocompletion" checked = {
                                    editorConfig.enableLiveAutocompletion
                                }
                                onChange = {
                                    this.handleChange(editorConfig,'enableLiveAutocompletion','switch')
                                }
                                value = "enableLiveAutocompletion" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Enable snippets"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-enableSnippets" checked = {
                                    editorConfig.enableSnippets
                                }
                                onChange = {
                                    this.handleChange(editorConfig,'enableSnippets','switch')
                                }
                                value = "enableSnippets" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>
                                <FormControlLabel
                                    label="Show line numbers"
                                    labelPlacement="start"
                                    control={< Switch id = "editor-showLineNumbers" checked = {
                                    editorConfig.showLineNumbers
                                }
                                onChange = {
                                    this.handleChange(editorConfig,'showLineNumbers','switch')
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
                                        value={mscConfig.inputType}
                                        onChange={this.handleChange(mscConfig,'inputType','select')}>
                                        <MenuItem value={'mscgen'}>mscgen</MenuItem>
                                        <MenuItem value={'msgenny'}>msgenny</MenuItem>
                                        <MenuItem value={'xu'}>xu</MenuItem>
                                        <MenuItem value={'json'}>json</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="msc-additionalTemplate-label">Additional template</InputLabel>
                                    <Select
                                        labelId="msc-additionalTemplate-label"
                                        id="msc-additionalTemplate"
                                        value={mscConfig.additionalTemplate}
                                        onChange={this.handleChange(mscConfig,'additionalTemplate','select')}>
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
                                        value={mscConfig.regularArcTextVerticalAlignment}
                                        onChange={this.handleChange(mscConfig,'regularArcTextVerticalAlignment','select')}>
                                        <MenuItem value={'above'}>above</MenuItem>
                                        <MenuItem value={'middle'}>middle</MenuItem>
                                        <MenuItem value={'below'}>below</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControlLabel
                                    label="Mirror entities"
                                    labelPlacement="start"
                                    control={< Switch id = "msc-mirrorEntitiesOnBottom" checked = {
                                    mscConfig.mirrorEntitiesOnBottom
                                }
                                onChange = {
                                    this.handleChange(mscConfig, 'mirrorEntitiesOnBottom', 'switch')
                                }
                                value = "mirrorEntitiesOnBottom" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>

                                <FormControlLabel
                                    label="Auto Render"
                                    labelPlacement="start"
                                    control={< Switch id = "msc-autoRender" checked = {
                                    mscConfig.autoRender
                                }
                                onChange = {
                                    this.handleChange(mscConfig, 'autoRender', 'switch')
                                }
                                value = "autoRender" inputProps = {{ 'aria-label': 'secondary checkbox' }}/>}/>

                                <FormControlLabel
                                    label="Include source"
                                    labelPlacement="start"
                                    control={< Switch id = "msc-includeSource" checked = {
                                    mscConfig.includeSource
                                }
                                onChange = {
                                    this.handleChange(mscConfig,'includeSource','switch')
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
}
export default SettingsDialog
