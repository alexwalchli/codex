
export const allSuggestions = (state) => {
  let tags = state.tags.map(t => ({
    id: t.id,
    type: 'TAG',
    label: t.label,
    trigger: '#',
    filterText: t.id,
    insertText: null,
    highlight: false
  }))

  let intellisenseSuggestions = {
    '#': tags,
    '/': [
      {
        type: 'COMMAND',
        action: 'COMPLETE_NODE',
        label: 'Complete',
        trigger: '/',
        filterText: 'Complete',
        insertText: null,
        highlight: false
      },
      {
        type: 'COMMAND',
        action: 'COMPLETE_ALL_NODES',
        label: 'Complete all under',
        trigger: '/',
        filterText: 'Complete all',
        insertText: null,
        highlight: false
      },
      {
        type: 'COMMAND',
        action: 'DELETE_NODE',
        label: 'Delete',
        trigger: '/',
        filterText: 'Delete',
        insertText: null,
        highlight: false
      },
      {
        type: 'COMMAND',
        action: 'COLLAPSE',
        label: 'Collapse',
        trigger: '/',
        filterText: 'Collapse',
        insertText: null,
        highlight: false
      },
      {
        type: 'COMMAND',
        action: 'COLLAPSE_ALL',
        label: 'Collapse all under',
        trigger: '/',
        filterText: 'Collapse all',
        insertText: null,
        highlight: false
      }
    ]
  }

  return intellisenseSuggestions
}
