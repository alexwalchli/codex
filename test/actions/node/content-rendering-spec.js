import * as contentRenderingActions from '../../../src/js/actions/node/content-rendering'
import { expect } from 'chai'

describe('content-rendering', () => {
  describe('renderContent', () => {
    it('should render markdown inline and return rendered content', () => {
      const content = 'some markdown `content`'

      const result = contentRenderingActions.renderContent(content).payload

      expect(result).to.equal('some markdown <code>content</code>')
    })
  })
})
