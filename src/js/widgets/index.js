export const embededCode = {
  parseAndRender: (nodeContent) => {
    // TODO: just loop occurances of ``` and replace every other with <span> and every other with </span>

    const matches = nodeContent.match(/```.*```/)
    nodeContent = nodeContent.replace(new RegExp('```', 'g'), '')
    if (matches) {
      const code = matches.pop().split('```').filter(s => s.trim())
      code.forEach(c => {
        nodeContent = nodeContent.replace(c, `<span class="embeded-code">${c}</span>`)
      })
    }

    return nodeContent
  }
}
