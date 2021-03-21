# New Beginnings - Participant

## About

This project is a participant registry microservice to add, update, remove and retrieve personal information about
participants in the New Beginnings study.

## Design

### Data model

We assume every piece of the information is important. So they are all mandatory fields.

#### refNo *(string)*

The participant reference number.

It is uniquely indexed for fast searching.

#### name *(string)*

The participant name.

We save the full name for convenience purposes. If structured data is important for specific purposes like data
analysis, we will probably split this field to first name, middle name, last name, etc.

#### dateOfBirth *(string)*

The participant date of birth.

It is saved in the format of *YYYY-MM-DD*. We choose to save it as string instead of a date / time object because
the time portion of a date of birth is probably irrelevant. A date / time object might also complicate things like
timezone difference which is usually not considered for date of birth.

A timestamp can also be used in this case. It has the advantage of taking up less space, but is not human-readable,
thus inconvenient for situations like debugging.

#### phone *(string)*

The participant phone number.

Here we assume the phone number is a UK one, although we don't enforce user including country and region code in the
string. If international participation and structured data are important, we can add other fields for phone country
and region code.

We also assume the system only takes one phone number for each participant.

#### address *(string)*

The participant address.

We save the full address for convenience purposes. If later the system requires features such as postcode lookup,
it would probably be better if we split the address into line 1, line 2, postcode, town, country etc.

We also assume the system only takes one address for each participant.

### Database

As persistence is not required after the service shuts down, data will now be gone after shutdown. The current design
is actually an in-memory MongoDB, so later if persistence is required (where production systems usually do), we can
simply change the in-memory MongoDB to an individually running one without the need to change the existing code but
just the connection string.

### Error handling

The errors are properly handled and reported by HTTP status code. Details are included in the response body error
objects.

More checking can be included later. For example, the system now only checks if a participant phone number is provided
in the participant creation process. We can include other checks like length check in the future.

### Future improvement

Some decisions are made for the simplicity of the current design of the system. For example:

- Simultaneous data changes are not handled in a highly concurrent environment
- Data are stored in-memory, thus limited by the size of the server memory
- Security measures are not implemented against attacks like XSS


## Building and running the application

First, clone the repository using Git.

```shell
git clone https://github.com/adriantang-job/participant.git
```

Then, navigate to the project root directory. You can run the web application in 2 ways: NPM and Docker.

### NPM

1. Install the dependencies of the project.
   ```shell
   npm install
   ```
1. Run the application.
   ```shell
   npm start   
   ```

The application is exposed at port `3000`. You can reach the landing page of the application at `http://localhost:3000`.

### Docker

1. Build the docker image. You can tag the image for future reference (here we use newbeginnings/participant).
   ```shell
   docker build -t newbeginnings/participant .
   ```
1. Create a new container and run the image.
   ```shell
   docker run -p 3000:3000 --rm -it newbeginnings/participant
   ```
   
The application exposes port `3000`. The above command maps the localhost (or precisely 0.0.0.0) port `3000` to the
container port `3000`. Thus, you can reach the landing page of the application at `http://localhost:3000`. 


## API

The application supports a HTTP REST API. The endpoints are under `/api`, so if you are running the application at
`http://localhost:3000`, the participant creation API can be reached at `http://localhost:3000/api/v1/participants`.

For now JSON is supported for request and response bodies.

### Create a new participant

A new participant can be created by the following:

```
POST /api/v1/participants
```

Parameters of the request body:

`refNo` (string, required): The participant reference number

`name` (string, required): The participant name

`dateOfBirth` (string, required): The participant date of birth. Format must follow *YYYY-MM-DD*

`phone` (string, required): The participant phone number

`address` (string, required): The participant address

HTTP status code `201` signifies a success in creating a participant. The body of the response is the newly created
participant object.

### Get a participant

Information about a participant can be retrieved by the following:

```
GET /api/v1/participants/<participant_refNo>
```

Replace <participant_refNo> by an existing participant reference number.

HTTP status code `200` signifies a success in getting a participant. The body of the response is the participant object
retrieved by the specified participant reference number.

### Update a participant

An existing participant can be updated by the following:

```
PATCH /api/v1/participants/<participant_refNo>
```

Replace <participant_refNo> by an existing participant reference number.

Every parameter in the request body is optional. Include the parameter and the new value will update the respective
field in the existing participant object.

Parameters of the request body:

`refNo` (string): The participant reference number

`name` (string): The participant name

`dateOfBirth` (string): The participant date of birth. Format must follow *YYYY-MM-DD*

`phone` (string): The participant phone number

`address` (string): The participant address

HTTP status code `200` signifies a success in updating the participant. The body of the response is the updated
participant object.

### Remove a participant

An existing participant can be updated by the following:

```
DELETE /api/v1/participants/<participant_refNo>
```

Replace <participant_refNo> by an existing participant reference number.

HTTP status code `204` signifies a success in removing the participant.


## Test

Assuming the application is built and run, some tests are provided to be run.

If NPM is used to run the application, simply navigate to the project root folder and run:
```shell
npm test
```

If Docker is used to run the application, find out the running container ID and replace the ID in the following command
and run it:
```shell
docker exec -it d7e54ec736f0 sh -c "cd /app && npm install --save-dev jest supertest && npm test"
```
In this case we have `d7e54ec736f0` as the container ID. You can find out the container ID by:
```shell
docker container ls
```