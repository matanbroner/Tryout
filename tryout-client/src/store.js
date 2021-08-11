import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import createRootReducer from "./reducers";
import rootSaga from "./sagas";

export const history = createBrowserHistory();

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      composeWithDevTools(
        applyMiddleware(
          // List middleware here
          routerMiddleware(history), // for dispatching history actions
          sagaMiddleware // for effect handling
        )
      )
    )
  );

  // Run the saga middleware to start the sagas
  sagaMiddleware.run(rootSaga);

  return store;
}
