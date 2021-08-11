import { GLOBAL_ACTIONS } from "./types";

export const setLoadingOn = (payload) => {
    return {
        type: GLOBAL_ACTIONS.LOADING_START,
        payload
    };
}

export const setLoadingOff = (payload) => {
    return {
        type: GLOBAL_ACTIONS.LOADING_END,
        payload
    };
}