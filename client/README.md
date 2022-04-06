# Client

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### Deployment

The client is packed in a container and deployed together with the backend using docker-compose.

#### Docker

```bash
# build container
$ docker build . -t samuelbohl/sbbbikereservationplanner-client

# run container
$ docker run -p 80:3000 -d samuelbohl/sbbbikereservationplanner-client
```
