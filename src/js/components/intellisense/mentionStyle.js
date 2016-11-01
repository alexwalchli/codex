export default (props = {}) => ({
  control: {
    backgroundColor: 'transparent',
    fontWeight: 'normal'
  },

  input: {
    margin: 0
  },

  '&singleLine': {
    control: {
      display: 'inline-block',
      width: '100%'
    },

    highlighter: {
      lineHeight: '36px',
      fontSize: '20px',
      // backgroundColor:'#d4eaf8',
      borderRadius: '6px',
      border: 'none'
    },

    input: {
      border: 'none',
      outline: 'none'
    }
  },

  suggestions: {
    backgroundColor: '#d4eaf8',
    color: '#000',
    item: {
      padding: '5px 15px',

      '&focused': {
        backgroundColor: '#DF786B'
      }
    }
  }
})
