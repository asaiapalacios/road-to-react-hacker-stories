import * as React from "react";

const initialStories = [
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

// Create custom built-in hook to keep the component's state in sync w/the browser's local storage
function useStorageState(key, initialState) {
  // With useState, you tell React that value is a state that changes over time:
  // when state changes, React re-renders its affected component(s)

  // *RETRIEVE* in browser's local storage recent search when browser loads/restarts:
  // -> set state to last stored search value in localStorage; else...
  // -> default to "React" as initial state upon component initialization
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  // Each time value state changes, run useEffect Hook to update local storage
  // (also called initially when the component renders for the first time)
  React.useEffect(() => {
    // B) STORE searchTerm into browser's local storage:
    // 1st Argument: a callback function that runs the side-effect
    // -> insert str identifier first (key), followed by what user typed in the input field (string value searchTerm)
    // 2nd Argument is a "dependency array of variables":
    // - when value state changes, the function for the side effect is called, or...
    // - when the component renders for the first time, function is also called initially
    localStorage.setItem(key, value);
  }, [value, key]);

  // React convention: returned values are returned, this time, as an array
  return [value, setValue];
}

function App() {
  // A) Call custom hook and pass 2 arguments; receive returned array values for [searchterm, setSearchTerm]
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  // Make list initialStories stateful by using it as initial state stories
  const [stories, setStories] = React.useState(initialStories);

  // Write an event handler which removes an item from the list
  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );
    setStories(newStories);
  };

  // E) Callback handler reference receives event object from <Search /> instance to update state
  const handleSearch = (e) => {
    // Access input field value to alter the current state searchTerm
    // -> set the updated state via the state updater function setSearchTerm
    setSearchTerm(e.target.value);
  };

  // *Note*: after the state is updated, the component renders again

  // F) The filter function checks whether current searchTerm state is present in the story item's title
  const searchedStories = stories.filter((story) =>
    // Address the letter case so the filter function won't be too opinionated & render no list:
    // -> story's title not case sensitive + check to see if...
    // -> current state searchTerm characters (also not case sensitive) match w/item title of stories array
    // Point: if search characters typed match title characters, send to List component
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      {/* C) Pass value state (searchTerm) and callback handler to Search component */}
      {/* handleSearch is a reference to the callback function handleSearch() */}
      {/* this callback handler receives the event obj from Search component onChange property */}
      <InputWithLabel
        id="search"
        value={searchTerm}
        // Let developer decide wheter the input field should have an active autoFocus
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {/* G) Send post-filtered title match to List component */}
      {/* J) Receive back from List component & in list form: item match w/displayed key/values 
      (except for objectID -> not displayed but used as an identifier for item) */}
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
}

// D) Pass searchTerm as initial state or last state in localStorage (input value displayed), but once...
// user types input value, new updated state is shown (from e. object passed to Search instance, which then...
// calls callback handler to run setter state update that re-renders component and displays current state).
function InputWithLabel({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) {
  const inputRef = React.useRef();

  // Perform focus on input element when component renders or dependencies change
  React.useEffect(() => {
    // Execute element's focus as a side-effect if:
    // -isFocused is set and
    // -the current property is existent
    if (isFocused && inputRef.current) {
      // Note: current property gives access to the input element to make changes to it (focus)
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        // ref object, inputRef, is passed to element's JSX-ref attribute
        // -> the input element's instance gets assigned to...
        //  the changeable *current* property (has access to the input element)
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
}

// H) Render list of post-filtered title match
function List({ list, onRemoveItem }) {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
}

// I) Pass each match item to the Item component as props & specify what to display
function Item({ item, onRemoveItem }) {
  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  );
}

export default App;

// Side NOTES to keep in mind
// The browser will (2):
// 1) Create an event object when...
// -the user types a value in the input field; and
// -presses the Enter key or selects the Add button to submit.

// 2) Put details into...
// -the event object; then
// -pass it as an argument (event) to the handler
