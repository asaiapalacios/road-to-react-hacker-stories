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

  // Tell React that searchTerm is a state that changes over time
  // Whenever state changes, React re-renders its affected component(s)
  const [searchTerm, setSearchTerm] = React.useState("React");

  // Callback handler receives event object from <Search /> after triggered event from typed HTML input field
  const handleSearch = (event) => {
    // Access input field value to alter the current state searchTerm
    // -> Set the updated state via the state updater function setSearchTerm
    setSearchTerm(event.target.value);
  };

  // *Note*: after the state is updated, the component renders again

  // The filter function checks whether the searchTerm is present in the story item's title
  const searchedStories = stories.filter((story) =>
    // Address the letter case so the filter function won't be too opinionated & render no list
    // -> lower case the story's title and the searchTerm to make them equal
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      {/* handleSearch is a reference to the callback function handleSearch() */}
      {/* this callback handler receives the event obj from Search component onChange property */}
      <Search search={searchTerm} onSearch={handleSearch} />

      <hr />

      {/* an instance of List component */}
      <List list={searchedStories} />
    </div>
  );
}

function Search({ search, onSearch }) {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      {/* Pass to handleSearch callback the event object after typed HTML input field triggers event */}
      <input id="search" type="text" value={search} onChange={onSearch} />
    </div>
  );
}

// Render list
function List({ list }) {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  );
}

// Pass each item to the Item component as props & specify what to display
function Item({ item }) {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </li>
  );
}

export default App;

// NOTES
// The browser will (2):
// 1) Create an event object when...
// -the user types a value in the input field; and
// -presses the Enter key or selects the Add button to submit.

// 2) Put details into...
// -the event object; then
// -pass it as an argument (event) to the handler (handleAddTodo).
