import { INIT_AUTH, SIGN_IN_SUCCESS, SIGN_OUT_SUCCESS } from '../actions/auth';


export const AuthState = {
  authenticated: false,
  id: null
};


export function auth(state = {}, {payload, type}) {
    switch (type) {
        case INIT_AUTH:
        case SIGN_IN_SUCCESS:
            return  Object.assign(state, {
                authenticated: !!payload,
                id: payload ? payload.uid : null,
                displayName: payload ? payload.displayName : null
            });

        case SIGN_OUT_SUCCESS:
            return {
                authenticated: false,
                id: null
            };
        default:
            return state;
    }
}