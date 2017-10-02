# maputnik-dev-server
An express.js server that allows for quickly loading mapboxGL styles from any project into the Maputnik Style Editor

## Overview
Writing mapboxGL styles by hand is a pain, and Maputnik makes it easy to experiment with different styles via a GUI.  However, manually loading sources and layers into Maputnik is cumbersome.  Since Maputnik takes a `style` query param, it's possible to pass in a complete mapboxGL style.  `maputnik-dev-server` provides a simple way to load the current style from a mapboxGL map in a development environment into Maputnik.

### Why not use maputnik-cli?  
Maputnik CLI wants a file on the local filesystem as an input.  If you're doing a lot of `addSource()` and `addLayer()` in your project and have your configs spread out, you may not have a consolidated style JSON to pass into maputnik-cli.  Our approach grabs the current style from an already loaded map, and doesn't concern itself with how the map was initialized.

## Workflow

The express server hosts the maputnik editor at `localhost:4000/maputnik`, as well as a simple API for receiving and serving a mapboxGL style JSON. The indended workflow is as follows:

1) In your development project, use `map.getStyle()` to get the current style JSON.
2) Add `id` and `metadata` properties to the style JSON to make them compatible with Maputnik. (You will need `metadata.maputnik:mapbox_access_token` if you are using mapbox-hosted sources and sprites.)
3) POST the style JSON to `http://localhost:4000/style`
4) Open a new browser tab with `http://localhost:4000/maputnik?style=http://localhost:4000/style#${zoom}/${lat}/${lng}`.  `maputnik-dev-server` will be serving the same style JSON that was just posted at `/style`, where the maputnik UI can pick it up.
5) Your style will be loaded into Maputnik!  Try out changes to individual layer styles, and copy and paste their JSON back into your project.

Steps 1-4 can be achieved with the click of a button with a few lines of code in your project.  This can be wired up to a button you can use during development, or even run in the javascript console if the `map` object is available.  It's up to you how to trigger the `POST` and new tab.

```
openMaputnik() {
  const style = map.getStyle();
  const zoom = map.getZoom();
  const { lng, lat } = map.getCenter();

  fetch('http://localhost:4000/style', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(style),
  })
    .then(() => {
      window.open(`http://localhost:4000/?style=http://localhost:4000/style#${zoom}/${lat}/${lng}`, '_blank');
    });
},
```  

It is also possible to send the current map JSON to `maputnik-dev-server` from the JavaScript console, as long as the `map` object is available globally.  See step 4 below.

## How to Use

1. Clone this repo & install dependencies
  ```
  git clone git@github.com:NYCPlanning/labs-maputnik-dev-server.git
  cd labs-maputnik-dev-server
  npm install
  ```

2. Download and Build Maputnik into `/public` (runs `scripts/build-maputnik.sh`)

  ```
  npm run build-maputnik
  ```

3. Start the server
  ```
  npm run start
  ```
  
 You can use Maputnik to style your layers, then copy and paste the layer config JSON back into your application.  The valid JSON throws off our linter, so we like using `[linter-eslint](https://atom.io/packages/linter-eslint)` to format everything once we paste the JSON into our code.

4. Paste the following command in to the JavaScript console
```
fetch('http://localhost:4000/style',{method:'POST',headers:{Accept:'application/json','Content-Type': 'application/json'},body: JSON.stringify(map.getStyle())}).then(()=>{window.open(`http://localhost:4000/?style=http://localhost:4000/style#${map.getZoom()}/${map.getCenter().lat}/${map.getCenter().lng}`,'_blank');});
```


## Routes

- `POST /style` - submit a style JSON that will be immediately available using `GET /style`
- `GET /style` - 'GET' the last style that was `POST`ed
