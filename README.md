# Nook
## :house: About ##
A centralized space to view CSO and Non-CSO organizations, explore events in DLSU, and easily apply for membership!

## :dancers: Authors ##
* Michaela Dizon
* Robin Reyes
* Kirsten Sison 

## :art: Design ##
Before coding this project, we had a design sprint on what the layout of Nook would be like. In this process, we did a bit of design research in drabbble for standard UIs for web apps similar to Nook. We tried to stick with a Bootstrap themed website as this was the CSS Framework we used. Our group used Figma to create a wireframe. 

Check out our design here: https://www.figma.com/file/6kQnYwzV4RmNTf1FnVLr7R/Nook?node-id=0%3A1

## :star2: Features ##
The current working features are:
* Viewing the list of organization in the /explore page, along with viewing the specific org by clicking on it.
* Viewing the list of events per organization.
* Viewing the list of officers per organization.
* Viewing the user profile which includes the organizations the user is part of and the events he/she has on their planner.
* Viewing the user requests.
* Viewing the organization membership requests.

## :computer: How to Run ##
The current submission connects to MongoDB Atlas as the database. Also, some of the app functionalities are missing at this stage, with most of the functionalities being reading from the database.

Some startup scripts in place to run the server:
1. Run `npm install` to download the required dependencies
2. Start the server by running `npm start`. 

To Use the App
1. Go to [http://localhost:3000/](http://localhost:3000/)
2.  Log in using either of the following credentials. 
| Email                          | Password | Notes                                  |
|--------------------------------|----------|----------------------------------------|
| robin_jerome_reyes@dlsu.edu.ph | abc      | User has pending requests. Admin user. |
| jerome_reyes@dlsu.edu.ph       | abc      |                                        |
|                                |          |                                        |

## :rocket: Dependencies ##
* BcryptJS
* BodyParser
* Express
* Handlebars
* Express Handlebars
* Express Session
* GridFS Stream
* Multer
* Multer GridFS Storage
* MomentJS
* Mongoose
* Passport
* Passport Local

## :heartbeat: Acknowledgements ##
* The awesome Unisse Chua for responding to our queries at 7 AM in the morning or at 1 AM late at night. What a legend. :massage::nail_care:
* StackOverflow
* Nescafé 3-in-1 :coffee: