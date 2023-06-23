# Welcome to the HubSpot Example Frigg Application

We're working on the Frigg framework documentation to better explain the framework, our philosophy around developing
integrations, and our architecture.

This Example App is intended to show all of the different features Frigg can enable for a HubSpot Application.
In time, we'll add more features and example code.

For now, we're just showing how to get started.

## Initialization

- Pull down this repo
- CD into hubspot-crm if you're not already there
- `npm install` which uses workspaces to rationalize packages shared between frontend and backend code
- Add a `dev.json` config file by copying `test.json` to the /backend/config/ directory. This will be the file that the backend (run by 
`serverless offline`) will read from to load up process.ENV.
- Create a MongoDB instance either locally or on MongoDB Atlas. This will be your data store for development. 
- Add the connection string to the `MONGO_URI` config variable.
- Head to HubSpot
- Sign up for a developer account here
- Create a new App
- Navigate to basic details and Authentication
- Add a redirect URI of http://localhost/3000/redirect/hubspot
- Set up basic scopes/permissions for CRM reads (at the least) (this example repo is grabbing Deal details to display)
- Copy your credentials to the dev.json config file
- Create a test HubSpot Account if you do not already have one.

## Running the Application

- EITHER
  - Run `npm start` from the /hubspot-crm directory root
- OR
  - cd into /backend and run `npm run backend-start` 
  - cd into /frontend and run `npm run frontend-start`
- If you have not already, select the "Create Demo User"
- Log in as the Demo User
- You will see the Dashboard with HubSpot and Salesforce as available connections
- Click "Connect" for HubSpot
- You should be redirected to HubSpot and prompted to select an account to authorize
- Complete the authorization flow
- Upon redirect, you should now see a connected HubSpot card
- Select "Example" from the dropdown menu of the HubSpot card
- You should be redirected to an example page that retrieves data from your HubSpot account.

## Explaining the Application

