THE WILD OASIS - with SQL Database

OVERVIEW:- This is an improvement on the web application by Julian Schedtmann at "https://github.com/jonasschmedtmann/ultimate-react-course/tree/5c38ad0e9f5067d4a486e8ee5d7bed36268fbbb8/17-the-wild-oasis/final-1-after-setup" with improvement on the security features. This web application is a data management system designed for a hospitality firm who are into renting out holiday cabins. It is designed to facilitate authentication of employees who manage client information on the system and authorize other users. The codebase is originally developed with React using the Vite Configuration. This application was designed with a Structured Query Language based database, SQL.js is a javascript database query languages to access a local database file. The main security focus is to ensure that the system is strong against Unauthorized access, Data Theft, Privilede Escalation and Denial-of-Service.

Features:- The functionalities in this version of the application are:

1. Login: An already existing account with email and password is authenticated and signed into the protected area of the application
2. Existing Users: An administrator views and manages other users in the system.
3. Create New User: An administrator creates another user, either another administrator, with elevated privileges or an unauthorised user with less privileges
4. Update Details: A user updates their Full Name or password.
5. Logout: A user is unauthenticated.

Security Objectives:- The following security improvements were added to the application

1. SQL Injection Prevention:- This was necessary as a SQL-based library was used as the database. This prevention was done by using parameterised queries and prepared statements for create, read, update and delete actions on the database.
2. Session Management:- This was implement to prevent unauthorized users from gaining access to the system. It was implemented by using the JSON Web token library to generate a token upon loign which expires after 1 hour. After which user is logged out.
3. Input Validation and Sanization:- This was implemented in order to validate user input to sanitize malicious scripts and ensure minimum password lengths are enforced.
4. Rate-Limiting:- This is to avoid Brute-Force attacks and Denial-of-Service. The express-rate-limit library was utilized to implement rate limiting on the login API endpoint by limiting the number of requests per time.

Project Structure:- The main directory in the repository is ./ultimate-react-course/17-the-wild-oasis\final-1-after-setup. This is the root directory where the index.html and src files are saved. The src folder contains the db, features, hooks, pages, services, styles, ui, and utils folders. The db folder contains the local database (database.sqlite), the API endpoint (server.js) and the Database managemment component (statement.js), whereas the services folder contains the authentication service component (apiAuth.js). The features folder contains the authentication folder which holds the authentication components (i.e. LoginForm.jsx, SignupForm.jsx, useLogin.js etc). The ui folder contains the essential interface components essential for building the application.

Setup and Installation Instructions:- The following steps must be taken to run this web application on local host:

1. Navigate to the root directory in the CLI and run 'npm install' to install the necessary dependecies.
2. In the same directory, run 'npm run dev' to run the web application on the local host.
3. Navigate to the db folder and run 'node server.js' to start the database server.

Usage Guidelines:- After starting the application for the first time, the login page will be the first page shown, then sign in with valid credentials. The functions accessible hereafter are:

1. Update user details - A user can change name and/or password using the 'person' icon at the top right of the dashboard.
2. Logout - A user can sign out of the dashboard using the 'logout' at the top right of the dashboard.
3. User - An admin can view, create and delete users in the system. This can be seen by clicking the 'USERS' section on the dashboard.

Security Improvements:- The following implementations were made to improve the security of the application:

1. Use of parameterized queries in create and update actions on the database.
2. Use of prepared statements in read and delete action on the database.
3. Hashing the password on account creation.
4. Rate-limiting to prevent brute-force and DOS attacks.
5. Input Validation.
6. Session management using stored tokens.
7. Proper and Safe error handling by not revealing to much information about an error

Testing Process:- The following tests were conducted by on the web application:

1. Functional Test: The few functional tests conducted on the tests conducted on the application include;

i. Password hashing - Add a new user via the insert user function with a plaintext password. Query the database directly to check the new user - Passed- Password is hashed.

ii. SQL Injection Protection - Inject a malicious input in the email parameter for the getUser function (user@admin.com’ OR 1=1; --). Check if any result is returned - Passed- No user returned due to the use of prepared statements.

iii. Token Expiry Validation Generate a token with a 1-minute expiry time during login. Refresh page after 1 minute. Passed- User was automatically logged out.

2. Static Application Security Test:
   For this test the Bearer CLI SAST tool was used, part of the result shows:

CRITICAL: Usage of hard-coded secret [CWE-798]
https://docs.bearer.com/reference/rules/javascript_express_hardcoded_secret
To ignore this finding, run: bearer ignore add 318997dae6db456c699afa83446a0cfa_0

File: SW_Project/17-the-wild-oasis/final-1-after-setup/src/db/server.js:81

81 const token = jwt.sign({ id: user.id, email: user.email }, jwtSecretKey, {
82 expiresIn: "1h",
83 });

CRITICAL: Leakage of hard-coded secret in JWT [CWE-798]
https://docs.bearer.com/reference/rules/javascript_lang_jwt_hardcoded_secret
To ignore this finding, run: bearer ignore add b7d378648498bc1ddb0a2a36cae7af73_0

File: SW_Project/17-the-wild-oasis/final-1-after-setup/src/db/server.js:81

81 const token = jwt.sign({ id: user.id, email: user.email }, jwtSecretKey, {
82 expiresIn: "1h",
83 });

HIGH: Leakage of sensitive data in JWT [CWE-312]
https://docs.bearer.com/reference/rules/javascript_lang_jwt
To ignore this finding, run: bearer ignore add 192979ec23037939ad11a3226d47ead4_0

File: SW_Project/17-the-wild-oasis/final-1-after-setup/src/db/server.js:81

81 const token = jwt.sign({ id: user.id, email: user.email }, jwtSecretKey, {
82 expiresIn: "1h",
83 });

HIGH: Unsanitized dynamic input in file path [CWE-73]
https://docs.bearer.com/reference/rules/javascript_lang_non_literal_fs_filename
To ignore this finding, run: bearer ignore add 63cafb1f999876db940e55ae8b1631dd_0  
File: SW_Project/17-the-wild-oasis/final-1-after-setup/src/db/statement.js:13

13 if (fs.existsSync(filepath)) {

Contributions and References:- The components essential in the making of this application are:

1. Original Repository: "https://github.com/jonasschmedtmann/ultimate-react-course/tree/5c38ad0e9f5067d4a486e8ee5d7bed36268fbbb8/17-the-wild-oasis/final-1-after-setup"
2. Nodejs
3. SQL.js: "https://sql.js.org/"
4. JSON Web Token: "https://www.npmjs.com/package/jsonwebtoken"
5. Bcrypt: "https://www.npmjs.com/package/bcrypt"
6. Express-Rate-Limit: "https://www.npmjs.com/package/express-rate-limit"
7. JWT Decode: "https://www.npmjs.com/package/jwt-decode"
