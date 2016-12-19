# Flappy Plane
This project is a demonstration of how WebGL can be used to create a virtual
reality scene for web browsers on mobile phones.

## Installation
Our project uses [NPM](https://www.npmjs.com/) as a package manager, and [Gulp](http://gulpjs.com/) as a build tool, both
are required in order to run the app locally. In order to build our web app and
launch it, execute the following from the repository root:

~~~
$ npm install
$ gulp serve
~~~

*NOTE: We have also gone ahead and hosted a version [here](https://tomasreimers.github.io/webgl-vr-demo/).*

## Use
When you open the webpage in a webbrowser (`index.html`), there will be three buttons at the bottom right of the app.

1. ABOUT: Link to a page describing the project and some of the technical
details behind it.

2. FIX: Toggles ego motion on and off.

3. VR: Enables stereoscopic viewing for mobile VR viewing (**MUST HAVE PHONE LOCKED IN PORTRAIT MODE**).

Additionally, tapping the screen (or pressing the button on a Google VR headset,
will pause the animation).

## Code

Our code can be found in the `app/` directory. The most relevant Javascript files
are in `app/scripts/` and are:

 - `main.js`: Constructs a Scene and binds event handlers to it.
 - `scene.js`: The bulk of our animation code, adds objects to the scene graph,
               handles user interaction, and moves the cameras.
 - `animation_handler.js`: Responsible for moving forward the animation loop
 - `objects/*.js`: constructors for all the objects we put on the screen

## Authors
(C) Fall 2016
Tomas Reimers & Greg M Foster
