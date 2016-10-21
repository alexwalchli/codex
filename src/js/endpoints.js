const Endpoints = {
  reddit: {
    responseMapper: function (json) {
      return json.data.children.map(post => {
        return {
          dataSource: 'reddit',
          title: post.data.title,
          points: post.data.score,
          author: post.data.author,
          created_utc: post.data.created_at,
          numberOfComments: post.data.num_comments
        }
      })
    },
    url: function (subreddit) {
      return `http://www.reddit.com/r/${subreddit}.json`
    }
  },
  hackernews: {
    responseMapper: function (json) {
      return json.hits.map(post => {
        return {
          dataSource: 'hackernews',
          title: post.title,
          points: post.points,
          author: post.author,
          created_at: post.created_at,
          numberOfComments: post.num_comments
        }
      })
    },
    url: function (subreddit) {
      return 'http://hn.algolia.com/api/v1/search?tags=front_page'
    }
  }
}

export default Endpoints
