import * as React from "react";
import axios from "axios";

// F??
// Connect to a remote API to fetch the data directly from the API
// i.e. fetch tech stories for a certain query (a search term) -> on ..'.=react'
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query='";

// Create custom built-in hook to keep the component's state in sync w/the browser's local storage
const useStorageState = (key, initialState) => {
  // With useState, you tell React that value is a state that changes over time:
  // when state changes, React re-renders its affected component(s)

  // C)
  // *RETRIEVE* from browser's local storage most recent searchTerm. Page loads & displays it
  // -> set state to last stored search value in localStorage; else...
  // -> default to "React" as initial state upon component initialization
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  // Each time value state changes, run useEffect Hook to update local storage
  // (also runs initially when the component renders for the first time + when array values change (2nd arg))

  // B)
  // STORE searchTerm (value) into browser's local storage:
  // 1st Argument: run side-effect function (a callback) that stores searchTerm (value) to local storage
  // -> insert str identifier first (key), followed by what user typed in the input field (string searchTerm value)

  // 2nd Argument is a "dependency array of variables":
  // - when value state changes, the side effect function is called, or...
  // - when the component renders for the first time, side-effect function is also called
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  // D)
  // React convention: Return most recent search value and state updater function in an array form
  return [value, setValue];
};

// Manage the stories and its state transitions in a reducer function
// note: reducer receives 2 arguments, a state and an action, to return a new state

// Problem: if-else statements will eventually clutter when adding more state transitions in one reducer func)
// -> Refactor to a switch statement so all state transitions are more readable (a React best practice)

// For every state transition, return a *new state object* which contains all key/value pairs from...
// the current state object (via JS's spread operator) and the new overwriting properties
// e.g. keeps all the other state intact (data alias stories)
const storiesReducer = (state, action) => {
  // Add cases for state transitions
  // note: state structure changed from an array to a complex object
  switch (action.type) {
    // Set state accordingly when data gets fetched (isLoading: true)
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    // Set a list of stories as state for the asynchronously arriving data:
    // (payload updates the state just as it would if using a state updater func)
    case "STORIES_FETCH_SUCCESS":
      // -return a new state (the payload of the incoming action)
      // -note: we don't use the current state to compute the new state
      return {
        // all the key/value pairs from the current state object
        ...state,
        // the new overwriting properties (while keeping all the other state intact)
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    // Error sets loading boolean to false
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    // Remove a story from the list of stories:
    case "REMOVE_STORY":
      // -remove story from current state and return a new list of filtered stories as state
      return {
        // note: state is a complex object w/data, isLoading, and error states rather than...
        // just a list of stories.
        ...state,
        // -> now access data (alias for stories) through state.data
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    // Throw an error to remind yourself that the implementation isn't covered
    default:
      throw new Error();
  }
};

function App() {
  // A)
  // Call custom hook and pass 2 arguments; Receive returned array values for [searchterm, setSearchTerm]
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  // E)
  // Start w/an empty list of stories (an empty array) for the initial state
  // (we will eventually simulate fetching these stories asynchronously)

  // Goal: move from unreliable state transitions w/multiple useState hooks to predictable...
  // state transitions w/React's useReducer Hook.

  // Exchange useState for useReducer to manage domain-related states (stories, loading, & error states)
  // Note: a way to improve our chances of not dealing w/bugs by moving states that belong together into...
  // a single useReducer hook (multiple hooks -> single useReducer hook)
  // -> merge states that belong together into one useReducer hook for a unified state management

  // Note: a new hook receives a reducer function and an initial state as arguments plus...
  // returns an array with two items: 1) current state; and 2) state updater func (aka dispatch function)

  // note: instead of setting the state EXPLICITLY w/the state updater func from useState, the...
  // useReducer state updater func sets the state IMPLICITLY by dispatching an action for the reducer
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  // Use a memoized function instead of using the data fetching logic directly in the side-effect
  // -> a reusable function for the entire application
  const handleFetchStories = React.useCallback(async () => {
    // dispatch function receives a distinct type and a payload
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    // Fetch tech stories related to the initial query aka the searchTerm
    // -> use 3rd-party library axios for an explicit HTTP GET request
    // i.e., axios.get() is the same HTTP method we used by default w/the browsers native fetch API

    // When a user types a search word via the input field **AND** confirms search req by click of button...
    // the new stateful url is updated & used to fetch the data user requests from the remote API.

    // Include error handling with try/catch (helps avoid using callback functions for then/catch)
    // -if something goes wrong in the try block, code jumps into the catch block to handle the error
    try {
      // Use await keyword to pause execution of code after this line until promise resolves or rejection
      const result = await axios.get(url);
      // Below: no longer need to transfrom returned response to JSON b/c now using 3rd-party library axios
      // (1st receive a representation of the *entire* HTTP response, then transform to a JSON response body)
      // .then((response) => response.json())

      // Receive the response body to send as payload to our component's state reducer
      // -> axios wraps the result into a data object in JS for us (no need to convert to JSON anymore)
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
    // On every url change (a dependency array change), invoke handleFetchStories in the useEffect hook
    // -> this will activate the side-effect for fetching data
  }, [url]);

  // G)
  // Simulate fetching stories (initialStories) asynchronously:
  // a) call getAsyncStories() function
  // b) resolve the returned promise (result) as a side-effect (only runs once component renders for 1st time)

  React.useEffect(() => {
    // When searchTerm changes (server-side search occurs), invoke the memoized function of useCallback Hook
    // -> avoid getting stuck in an endless loop if fetched data logic remains in useEffect
    handleFetchStories();
  }, [handleFetchStories]);

  // Write an event handler which removes an item from the list
  const handleRemoveStory = (item) => {
    // const newStories = stories.filter(
    //   (story) => item.objectID !== story.objectID
    // );

    // Set state IMPLICITLY by dispatching an action for the reducer (via the state updater function):
    // the action comes w/a 1) type and an 2) optional payload.
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  // Rename handler of the input field (note: handler still sets the stateful searchTerm)
  // I) Callback handler reference receives event object from <Search /> instance to update state
  const handleSearchInput = (e) => {
    // Access input field value to alter the current state searchTerm (update input field's state)
    // -> set the updated state via the state updater function setSearchTerm
    setSearchTerm(e.target.value);
  };
  // Set the new stateful url (derived from the current searchTerm + static API endpoint as new state)
  // -> so when a user clicks button, a change in url state triggers the side-effect that fetches the data
  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  // *Note*: after the state is updated, the component renders again

  // Note: previous derived value (see below), searchedStories, can be removed, because we...
  // now receive the stories (data) filtered by search term from the API

  // J) The filter function checks whether current searchTerm state is present in the story item's title
  // Address the letter case so the filter function won't be too opinionated & render no list
  // Point: if search characters typed match title characters, send to List component
  // const searchedStories = stories.data.filter((story) =>
  //   story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      {/* H) Pass value state (searchTerm) and callback handler to Search component */}
      {/* handleSearch is a reference to the callback function handleSearch() */}
      {/* this callback handler receives the event obj from InputWithLabel component onChange property */}
      <InputWithLabel
        id="search"
        value={searchTerm}
        // Let developer decide wheter the input field should have an active autoFocus
        isFocused
        // Distinguish between the handler of the input field & the button (handleSearchSubmit)
        onInputChange={handleSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      {/* Create a button which confirms the search & will execute the data request eventually */}
      <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
        Submit
      </button>

      <hr />
      {/* Conditionally render JSX: */}
      {/* Render error message when can't retrieve data from remote API (a simulation) */}
      {stories.isError && <p>Something went wrong. Yikes...</p>}

      {/* K) Send post-filtered title match to List component */}
      {/* L) Receive back from List component & in list form: item match w/displayed key/values 
      (except for objectID -> not displayed but used as an identifier for item) */}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        // Pass only the regular stories already filtered from remote API to the List component
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
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
