import * as React from "react";

// Everything in curly braces in JSX can be used for Javascript. Examples below (2):

// 1. JavaScript object displays in the App component
// const welcome = {
//   greeting: "Hi",
//   title: "React",
// };

// 2. JavaScript function, when executed, displays in the App component
function getTitle(title) {
  return title;
}

function App() {
  return (
    <div>
      <h1>
        {/* {welcome.greeting} {welcome.title} */}
        Hola {getTitle("React")}
      </h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
