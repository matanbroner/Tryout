import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import createSagaMiddleware from 'redux-saga'
import createRootReducer from "./reducers";

export const history = createBrowserHistory();

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        sagaMiddleware // for effect handling
      )
    )
  );

  return store;
}
