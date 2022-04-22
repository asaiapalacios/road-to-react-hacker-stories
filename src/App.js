import * as React from "react";

// Tell React that searchTerm is a state that changes over time
// Whenever state changes, React re-renders its affected component(s)

// Create custom built-in hook to keep the component's state in sync w/the browser's local storage
function useStorageState(key, initialState) {
  // 2) RETRIEVE in browser's local storage recent search when browser loads/restarts:
  // -> set initial state to stored search value in localStorage; else...
  // -> default to "React" as initial state upon component initialization
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  // Each time the searchTerm changes, run useEffect Hook to update local storage
  React.useEffect(() => {
    // 1) STORE searchTerm into browser's local storage:
    // 1st Argument: a callback function that runs the side-effect
    // -> insert str identifier first (key), followed by what user typed in the input field (string value searchTerm)
    // 2nd Argument is a "dependency array of variables":
    // - every time the searchTerm changes, the function for the side effect is called
    // - it's also called initially when the component renders for the first time
    localStorage.setItem(key, value);
  }, [value, key]);

  // React convention: returned values are returned as an array
  return [value, setValue];
}

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

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  // Callback handler receives event object from <Search /> after triggered event from typed HTML input field
  const handleSearch = (event) => {
    // Access input field value to alter the current state searchTerm
    // -> set the updated state via the state updater function setSearchTerm
    setSearchTerm(event.target.value);
  };

  // *Note*: after the state is updated, the component renders again

  // The filter function checks whether the searchTerm is present in the story item's title
  const searchedStories = stories.filter((story) =>
    // Address the letter case so the filter function won't be too opinionated & render no list:
    // -> story's title not case sensitive + check to see if...
    // -> current state searchTerm characters (also not case sensitive) match with item title of the array
    // point: if search characters typed match title characters, send to List component
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      {/* handleSearch is a reference to the callback function handleSearch() */}
      {/* this callback handler receives the event obj from Search component onChange property */}
      <Search search={searchTerm} onSearch={handleSearch} />

      <hr />

      {/* Send post-filtered title match to List component */}
      {/* Receives back item match displaying key/values in list form 
      (objectID not displayed but used as identifier for item) */}
      <List list={searchedStories} />
    </div>
  );
}

// Remember the most recent search & pass this data back
// (so app can display it in the browser once it loads up, restarts/upon component initialization}
function Search({ search, onSearch }) {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      {/* Pass to handleSearch callback the event object after typed HTML input field 
      (access to event value) */}
      <input id="search" type="text" value={search} onChange={onSearch} />
    </div>
  );
}

// Render list of post-filtered title match
function List({ list }) {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  );
}

// Pass each match item to the Item component as props & specify what to display
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
// -pass it as an argument (event) to the handler
