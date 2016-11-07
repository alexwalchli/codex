import * as renderContent from '../../../src/js/node/helpers/render-content'
import { expect } from 'chai'

describe('content-rendering', () => {
  describe('renderContent', () => {
    it('should render markdown inline and return rendered content', () => {
      const content = 'some markdown `content`'

      const result = renderContent(content).payload

      expect(result).to.equal('some markdown <code>content</code>')
    })
  })
})
