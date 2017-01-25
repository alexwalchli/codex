import * as userPreferencesActions from './user-preferences-actions'

export const updateTypeScale = (typeScale) => (getState, dispatch) => {
  dispatch(userPreferencesActions.typeScaleUpdate(typeScale))
}
