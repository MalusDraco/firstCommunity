# firstResponderApp

An App for connecting first responders to their communities to schedule/create events.

Created as a submission for [StanHacks III](https://stanhacks-iii.devpost.com/)

# Requirements

[MongoDB Community Edition](https://www.mongodb.com/try/download/community)

[NodeJS](https://nodejs.org/en)

[MongoDB NodeJS Driver](https://www.npmjs.com/package/mongodb)

[Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)

## Inspiration

Our inspiration was to connect our community with the first responders. We wanted the first responders to not only be more involved in community events but to also help inform the community on what to do in different situations.

## What it does

It allows you to choose if you are a community member or a first responder. In the community member portal it allows training from first responders. You can also put out requests to have first responders join community events. In the request user will input the Title, Name of organization, description, Image of flyer, location and hours available. In the first responder portal it will allow you to see requests made from the community. First responders can also put out their own request.

## How we built it

**Tech used:** HTML/CSS, JavaScript, Node.js, MongoDB, Google Maps API

First, we decided to build our program using MongoDB to store our data. This would allow the data to be dynamically added and saved between different users. We set roles for each team member, 1 designer, 1 front-end developer, and 2 back-end developers. The designer and front-end developer were in charge of making the website and partially connecting it to the backend. The two backend developers were in charge of creating a link to MongoDB and getting the Google Maps API to work in the code.

To access data from the backend, we used a restServer built on NodeJS to return a list of events or create a new event in a specific collection on MongoDB. For the Google Maps API, we had to figure out how to use the Google Maps API to display a map and how to integrate the Maps geocoder to convert an address to latitude and longitude.

The front-end was created using HTML, CSS, and JS attempting to adhere to the Retro theme. For dynamic element creation, we had to create a modal which is a template of an element we want to duplicate based on the data, and update the information based on data provided by the database.

## Challenges we ran into

Some challenges were not being able to hide the API key while having the map API. Another challenge was when we were trying to create our server and generating the server contact dynamic.

## Accomplishments that we're proud of

- Creating a remove server and connecting to our program
- Extracting data and generating HTML dynamically
- Integrating Maps API for location lookup
- Injecting API key into code
- Creating static HTML and regular CSS without using any frameworks.

## What we learned

- How to create a remote database server and connect to JavaScript
- How to integrate a map into a website using Google Maps API
- How to generate html using data from server database
- How to use GitHub to collaborate with others through branch merging

## What's next for First community

- Real time chat between first responders and community members
- Real time event reminders
- Scheduling system
- Separate user profiles
