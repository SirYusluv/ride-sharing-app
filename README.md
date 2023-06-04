## Ride sharing app - (created for Atare Consultancy assessment)

#### There are 3 type of Users in the app.

- Admin: performs adminstrator task.
- Driver: Has a car and transport passenger from pick up to destination. A driver can transport multiple passenger at once (ride sharing) until car capacity is reached.
- Rider (choice of name. passenger actually): can request for a ride.

The db contains 4 schemas (users, rides, rideinfos, cars).

#### db collections relationship

- user and ride (one-to-many)
- user and rideinfo (one-to-many)
- user and car (one-to-one)
- ride and rideinfo (one-to-many)

### To run

1

```bash
# install dependencied
$ npm install
```

2
create a ".env.development" file in the root folder and input the value for MONGODB_URI and JWT_SECRET.
The JWT_SECRETE is used to sign JWT tokens

3

```bash
# Run the app by
# 1. (compile all typescript file)
$ npm run tsc

# 2. (run app)
$ npm run dev
```

4
Hooray!!! You are up

### Bonus

- You can install REST Client (VS Code) extension in order to be able to send request and get response from VS code (instead of postman).
- Sample queries have already been prepared in request.http (check user and auth module).
- You can run those queries at the click of a button in that same file if REST Client is installed.

### Basic assumptions for the app

- Email address can't be changed
- Users are paying with cash
- Users don't pay for cancelled ride

NB: Complete routes documentation is in request.http file in /user and /auth
