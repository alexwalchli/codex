import * as userPreferencesActions from './user-preferences-actions'

export const updateTypeScale = (typeScale) => (dispatch, getState) => {
  dispatch(userPreferencesActions.typeScaleUpdate(typeScale))
}
