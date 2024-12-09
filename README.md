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

