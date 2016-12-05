import * as I from 'immutable'

export const NodeRecord = new I.Record({
  id: undefined,
  parentId: undefined,
  childIds: I.List(),
  content: '',
  notes: '',
  createdById: undefined,
  lastUpdatedById: undefined,
  collapsedBy: I.Map(),
  taggedByIds: I.List(),
  focused: false,
  notesFocused: false,
  deleted: false,
  selected: false,
  completed: false
})
