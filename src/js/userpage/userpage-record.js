import * as I from 'immutable'

export const UserPageRecord = new I.Record({
  id: undefined,
  createdById: undefined,
  isHome: false,
  rootNodeId: undefined,
  title: ''
})
