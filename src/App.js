import * as React from "react";

function App() {
  // Introduce callback function handleSearch that...
  const handleSearch = (event) => {
    // calls back to the place it was introduced (Search component)
    console.log(event.target.value);
  };

  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  return (
    <div>
      <h1>My Hacker Stories</h1>
      {/* an instance of Search component */}
      {/* The callback function handleSearch is used elsewhere, passed to the Search component as a prop value */}
      <Search onChange={handleSearch} />

      <hr />

      {/* an instance of List component */}
      <List list={stories} />
    </div>
  );
}

function Search(props) {
  // Tell React that searchTerm is a state that changes over time; whenever it changes, React has to re-render its affected component(s)
  const [searchTerm, setSearchTerm] = React.useState("");
  // This event handler function:
  // -receives the event object from user interaction/event change triggered when user typed input value;
  // -accesses the object passed, specifically, targeting the emitted value: event.target.value (the input field value)
  // -> the emitted value is logged to the console
  const handleChange = (event) => {
    // Alter the current state searchTerm/set the updated state via the state updater function setSearchTerm
    setSearchTerm(event.target.value);
    // The Search component uses this callback handler, from its incoming props, to call it whenever a user types into the HTML input field
    // When the user types into the input field, it triggers an event object that gets passed back to the callback handler function in the App component
    props.onSearch(event);
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      {/* handleChange is a reference to the function */}
      <input id="search" type="text" onChange={handleChange} />
      {/* After the updated state is set in a component, the component renders again, meaning the component Search function runs again 
      The updated state searchTerm becomes the current state and is displayed in the component's JSX. */}
      <p>
        Searching for <strong>{searchTerm}</strong>.
      </p>
    </div>
  );
}

// Render list
function List(props) {
  return (
    <ul>
      {props.list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  );
}

// Pull our item into its own component
// Each item is focused on what the items inside of that list looks like
function Item(props) {
  return (
    <li>
      <span>
        <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>{props.item.author}</span>
      <span>{props.item.num_comments}</span>
      <span>{props.item.points}</span>
    </li>
  );
}

export default App;
