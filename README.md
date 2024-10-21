## Description

The Quiz Game service is a service that provides the ability to users to create, manage and play quizzes.

## Features

- User Authentication: Sign up and log in to create or participate in quizzes.
- Quiz Creation: Users can create quizzes with multiple question types (multiple choice).
- Quiz Management: Manages the quiz attempts and progress.
- Score: Track scores of users and displays the historical scores of users for all quizzes.

## Getting Started

1. Clone the repository.
```bash 
git clone https://github.com/Ishali02/quiz-game.git
 ```
2. Navigate to project directory 
```bash 
cd quiz-game
 ```
3. You can run the service using docker-compose file. Before running docker-compose file, the `DB_HOST` env variable needs to be updated to the ip address of the machine the docker is hosted on. The variable needs to be updated in both `.env.local` and `.env.test` file to successfully connect the service to database. 
 Run the following commands.
```bash
# get ip address on windows
$ ipconfig

# get ip address on linux
$ ifconfig

# run the service after DB_HOST variable is updated
$ docker compose up --build
```
The service should be up and running. 
Access the service in your browser on ``` http://localhost:8080/quiz-game/```. The swagger documentation is accessible on ```http://localhost:8080/quiz-game/api-docs```


## Run tests

```bash
# get the container id of the service
$ docker ps

$ docker exec -it <container-id> /bin/sh

$ npm run test:e2e
```

## Technologies Used

- Backend - Nodejs, Nest
- Database - Postgres
- Authentication: JSON Web Tokens (JWT)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
