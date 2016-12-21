import * as I from 'immutable'
import { UserPageRecord } from './userpage-record'

export const userPageSnapshotUnwrapper = (userPageSnapshot) => {
  let userPageData = userPageSnapshot.val()
  return new UserPageRecord(userPageData)
}
