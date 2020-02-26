This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

Whether you want to play with the source, or just use the editor, you will need Node installed.  The code has been tested on v11.10.1.

To get started, clone this repo with `git clone https://github.com/dskyberg/mscgen.git`.

In the project directory,  run:
`npm i` or `npm install`

### Development mode: `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


### Production mode: `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!<br/>

Run the following command once you have successfully completed the build step

### `npm run serve`

After running the build script above you can serve the production content by running the serve script.
The content in ./build will be served on localhost:5000

## Things to know

### Reset
Click the reset icon on the drawer to clear the editor and load a default, starter
template to play with.  Note: any change you have made will be lost when you click reset.

### Save to File
Click the save icon in the drawer to save both the editor contents and the preview contents.<br/>
The editor will be saved as a `.xu` script file.<br/>
The preview wil be saved as a `.svg` file.

### Upload a script
Click the upload icon in the drawer to load a script file from your local machine.<br/>
Note: there is only rudimentary error checking on the file upload process.
The current editor contents will be lost.  So, save your work before you upload a doc.

### Saving State
The current editor contents, config settings, and splitter location are saved to localStorage.

### [Syntax Guide](https://mscgen.js.org/tutorial.html)
