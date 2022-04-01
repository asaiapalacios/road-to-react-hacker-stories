import * as React from "react";

const list = [
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

// arrow function with a concise body (implicit return)
const App = () => (
  <div>
    <h1>My Hacker Stories</h1>

    <Search />

    <hr />

    {/* an instance of List component */}
    <List />
  </div>
);

const Search = () => {
  // This event handler function:
  // -receives the event object from user interaction (typed input);
  // -accesses through the object passed for the emitted value: event.target.value (the input field value)
  // -> the emitted value is logged to the console
  const handleChange = (event) => {
    return console.log(event.target.value);
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />
    </div>
  );
};

// arrow function with a concise body (implicit return)
const List = () => (
  <ul>
    {list.map((item) => (
      <li key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}: </a>
        </span>
        <span>{item.author}; </span>
        <span>{item.num_comments}, </span>
        <span>{item.points}</span>
      </li>
    ))}
  </ul>
);

export default App;
