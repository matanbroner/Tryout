import { takeLatest, call, put } from "redux-saga/effects";
import { push } from "connected-react-router";

import API from "../../api";
import { REGISTER_API_URL, LOGIN_PAGE_URL } from "../../assets/url";
import { REGISTER_LOADING } from "../../assets/loading";
import { USER_ACTIONS } from "../../actions/types";
import { setUserProfile } from "../../actions/user";
import { setLoadingOn, setLoadingOff } from "../../actions/global";

function registerApi(payload) {
  return API.post(REGISTER_API_URL, null, payload);
}

export function* registerWatcher() {
  yield takeLatest(USER_ACTIONS.REGISTER_REQUEST, registerWorker);
}

function* registerWorker(action) {
  try {
    yield put(setLoadingOn(REGISTER_LOADING));

    const res = yield call(registerApi, action.payload);

    if (API.isSuccessResponse(res)) {
      yield put(setUserProfile(res.body.data));
      // TODO: set access token in local storage
      const { tokens } = res.body.data;
      API.setDefaultHeaders({
        Authorization: `Bearer ${tokens.access}`,
      });
      yield put(push(LOGIN_PAGE_URL));
    } else {
      throw res;
    }
  } catch (e) {
    // TODO: present failiure error
    console.error(e);
  } finally {
    yield put(setLoadingOff(REGISTER_LOADING));
  }
}
