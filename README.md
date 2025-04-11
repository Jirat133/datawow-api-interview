## Project setup
Download Repository from GitHub Then
Please make sure you are Usin node version 22 LTS
```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

```

## Run tests

```bash
# unit tests
$ npm run test
```
This project will run at (http://localhost:3001)

Project Detail
In this project I use common HTTP request as it is a simple CRUD post comments
I use In-memory method, which mean no persistant data. So please don't close server while testing.
In project the in-memory post user and comment are store as an array of object in service.
Each time user signIn it will either login to existing username or create new user with new username
create, edit or delete post or comment will manipulate existing array of those data
I use increment id number to track the id of post and comment and apply logic where it will take the latest id and plus 1 to prevent duplicate id when post is deleted
For unit test I use simple jest.

