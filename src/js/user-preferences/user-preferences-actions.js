import * as userPreferencesActionTypes from './user-preferences-action-types'

export const typeScaleUpdate = (typeScale) => {
    type: TYPE_SCALE_UPDATE,
    payload: {
        typeScale
    }
}