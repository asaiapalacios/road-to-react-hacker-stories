import * as React from "react";

function App() {
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
      <Search />

      <hr />

      {/* an instance of List component */}
      <List list={stories} />
    </div>
  );
}

function Search() {
  // This event handler function:
  // -receives the event object from user interaction/event change triggered when user typed input value;
  // -accesses the object passed, specifically, targeting the emitted value: event.target.value (the input field value)
  // -> the emitted value is logged to the console
  const handleChange = (event) => {
    return console.log(event.target.value);
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      {/* handleChange is a reference to the function */}
      <input id="search" type="text" onChange={handleChange} />
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
