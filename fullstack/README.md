## Fullstack Developer Task

(yes I used chatGPT here due to time limits)

This simple web application displays exchange rates obtained from the Czech National Bank (CNB) API. The CNB provides exchange rate data in XML format, which is fetched from their official website.

Used API
The exchange rate data is obtained from the CNB API, which can be accessed through their official forum here. The actual source of the exchange rate data can be found here.

Features
Displays a table of exchange rates including country, currency, amount, code, and rate.
Provides information on when the rates were last updated.
Allows refreshing of exchange rates.

This project involved a significant amount of time spent on:

Understanding the CNB API and its documentation.
Parsing XML data to extract the required exchange rate information.
Setting up the React frontend and integrating Apollo Client for GraphQL queries.
Designing and styling the user interface using Material-UI components.
Implementing functionality to refresh exchange rates and display the last updated time.
Writing tests using React Testing Library to ensure the correctness of components and functionality.
Technologies Used
React.js
Apollo Client
Material-UI
TypeScript
GraphQL

If more time were available, the following tasks could be addressed to enhance the project:

Fix Linting Errors: Address any lingering linting errors, especially those that may be specific to the Windows development environment.

Remove .yarn from Commit: Exclude the .yarn directory from version control to avoid unnecessary commits of cached dependencies.

Move Source URL to Node.js Environment (NX): Implement a more robust configuration by moving the source URL for exchange rate data to a Node.js environment variable using tools like NX, enabling easier management and flexibility in deployment environments.

Cover the components with tests: component test to ensure that data is being shown and rendered correctly in the table, cover with tests the util.

Setup Shared GraphQL Schema: Implement a shared GraphQL schema to centralize type definitions and avoid writing boilerplate code for queries and mutations across different components. This would streamline development and ensure consistency in data handling.
