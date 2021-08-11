import {
  all
} from 'redux-saga/effects';

import userSagas from "./users"

// Create the root saga
export default function* rootSaga() {
  yield all([
    ...userSagas
  ]);
}
