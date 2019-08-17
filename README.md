# 3aDay Server

Server API interface for storing and delivering "Three Good Things" data.

## Links

* [App Demo](https://threeaday-app.carmarsden.now.sh)
* [App Documentation](https://github.com/carmarsden/threeaday-app)

## Technology

### Built with:
* Node.js
    * Express server framework
    * Jsonwebtoken and bcrypt.js for authentication
    * Morgan and Winston for logging 
* PostgreSQL database
    * Knex.js for query building
    * Postgrator for versioning
* Testing on Mocha framework using Chai and Supertest

## API Documentation

All endpoints require application/json body for post requests, and return JSON.

### Create Account:

`POST /api/users`

* Post `{ user_name, password }` object to create a new user entry in threeaday_users table
    * Note: user_name cannot already exist
    * Note: password must be 8 - 72 character and must contain at least one lowercase letter, uppercase letter, number, and special character
* Successful post request will return JSON object containing `user_name, id, date_created, date_modified`


### Login: 

`POST /api/auth/login`

* Post `{ user_name, password }` object to log in to the application
* Successful post request will return JWT containing user_id payload

### Public Entries:

`GET /api/entries`

* Get some quantity of public entries (where `public = true`)
    * Optional query parameter: `quantity`, must be an integer. If provided request will return up to that quantity of entries. Default 10 if not specified.
* Successful get request will return array of JSON objects containing `id, content, user_id, date_modified,` and all available emotion tags, sorted descending by date

### Private Entries:

`GET /api/entries/byuser`

* Protected endpoint: header must include `Authorization` bearing a valid JWT
* Get all entries for the requesting user
    * `user_id` derived from JWT
* Successful get request will return array of JSON objects containing `id, content, user_id, date_modified,` and all available emotion tags, sorted descending by date


### Add Entry:

`POST /api/entries`

* Protected endpoint: header must include `Authorization` bearing a valid JWT
* Post an array of JSON object(s)
    * Each object must minimally contain `content` value
    * Each object may also contain `public, date_modified,` and all emotion tag values
    * User_id derived from JWT
    * Default values applied to public, date modified, and emotion tags if not supplied
* Successful post request will return JSON array of posted objects