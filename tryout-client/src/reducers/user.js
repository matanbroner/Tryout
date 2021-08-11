import { omit } from "lodash";

import { USER_ACTIONS } from "../actions/types";

const userInitialState = {
  profile: {},
  tokens: {
    access: "",
    refresh: "",
  },
};

export default function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_USER_PROFILE: {
      const { tokens } = action.payload;
      const profile = omit(action.payload, "tokens");
      return {
        ...state,
        profile,
        tokens,
      };
    }
    default:
      return state;
  }
}
