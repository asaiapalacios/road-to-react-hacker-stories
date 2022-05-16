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

// F)
// Return a promise with data once it resolves
// note: returned resolved object holds, after a 2 sec delay, the list of stories (aka initialStories)
const getAsyncStories = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { stories: initialStories } });
    }, 2000);
  });

// Conditional states can lead to impossible states & undesired behavior in the UI
// i.e., an error occurs for the asynchronous data
// -> change pseudo data-fetching function to simulate an error (our implementation of error handling)
// const getAsyncStories = () => {
//   new Promise((resolve, reject) => {
//     setTimeout(reject, 2000);
//   });
// };

// Road to React abbreviated version
// const getAsyncStories = () =>
//   new Promise((resolve, reject) => setTimeout(reject, 2000));

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

  // G)
  // Simulate fetching stories (initialStories) asynchronously:
  // a) call getAsyncStories() function
  // b) resolve the returned promise (result) as a side-effect (only runs once component renders for 1st time)
  React.useEffect(() => {
    // dispatch function receives a distinct type and a payload
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.data.stories,
        });
      })
      .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
  }, []);

  //   getAsyncStories()
  //     .then((result) => {
  //       dispatchStories({
  //         type: "SET_STORIES",
  //         payload: result.data.stories,
  //       });
  //       setIsLoading(false);
  //     })
  //     .catch(() => setIsError(true));
  // }, []);

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

  // I) Callback handler reference receives event object from <Search /> instance to update state
  const handleSearch = (e) => {
    // Access input field value to alter the current state searchTerm
    // -> set the updated state via the state updater function setSearchTerm
    setSearchTerm(e.target.value);
  };

  // *Note*: after the state is updated, the component renders again

  // Address the state NOW as object and NOT as array anymore
  // J) The filter function checks whether current searchTerm state is present in the story item's title
  const searchedStories = stories.data.filter((story) =>
    // Address the letter case so the filter function won't be too opinionated & render no list:
    // -> story's title not case sensitive + check to see if...
    // -> current state searchTerm characters (also not case sensitive) match w/item title of stories array
    // Point: if search characters typed match title characters, send to List component
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />
      {/* Conditionally render JSX: */}
      {/* Render error message when can't retrieve data from remote API (a simulation) */}
      {stories.isError && <p>Something went wrong. Yikes ...</p>}

      {/* K) Send post-filtered title match to List component */}
      {/* L) Receive back from List component & in list form: item match w/displayed key/values 
      (except for objectID -> not displayed but used as an identifier for item) */}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
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
