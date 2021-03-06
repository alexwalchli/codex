import * as I from 'immutable'

export const NodeRecord = new I.Record({
  id: undefined,
  parentId: undefined,
  childIds: I.List([]),
  userPageId: undefined,
  content: '',
  notes: '',
  createdById: undefined,
  lastUpdatedById: null,
  collapsedBy: I.Map({}),
  taggedByIds: I.List([]),
  focused: false,
  notesFocused: false,
  deleted: false,
  selected: false,
  completed: false,
  menuVisible: false
})
