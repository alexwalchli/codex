import * as contentFormattingActions from '../../../src/js/actions/node/content-formatting'
import { expect } from 'chai'

describe('content-formatting', () => {
  describe('renderMarkdown', () => {
    it('should render markdown inline and return rendered content', () => {
      const content = 'some markdown `content`'

      const result = contentFormattingActions.renderMarkdown(content).payload

      expect(result).to.equal('some markdown <code>content</code>')
    })
  })
})
