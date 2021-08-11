import { USER_ACTIONS } from "./types";

export const login = (payload) => {
    return {
        type: USER_ACTIONS.LOGIN_REQUEST,
        payload
    };
}

export const loginSuccess = (payload) => {
    return {
        type: USER_ACTIONS.LOGIN_SUCCESS,
        payload
    };
}

export const setUserProfile = (payload) => {
    return {
        type: USER_ACTIONS.SET_USER_PROFILE,
        payload
    };
}

export const logout = () => {
    return {
        type: USER_ACTIONS.LOGOUT_REQUEST
    };
}

export const logoutSuccess = () => {
    return {
        type: USER_ACTIONS.LOGOUT_SUCCESS
    };
}

export const register = (payload) => {
    return {
        type: USER_ACTIONS.REGISTER_REQUEST,
        payload
    };
}

export const registerSuccess = (payload) => {
    return {
        type: USER_ACTIONS.REGISTER_SUCCESS,
        payload
    };
}
