import { UserPageRecord } from './userpage-record'

export const makeUserPage = (id, rootNodeId, createdById, title, isHomePage = false) => {
  return new UserPageRecord({
    id,
    rootNodeId,
    createdById,
    title,
    isHomePage
  })
}
