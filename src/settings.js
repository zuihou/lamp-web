module.exports = {
  title: 'zuihou-ui',
  onlinePreview: 'http://tangyh.top:8012/onlinePreview?url=',
  druid: {
    authority: {
      "development": 'http://127.0.0.1:8764/druid',
      "production": 'http://tangyh.top:8764/druid',
    },
    file: {
      "development": 'http://127.0.0.1:8765/druid',
      "production": 'http://tangyh.top:8765/druid',
    },
    msgs: {
      "development": 'http://127.0.0.1:8768/druid',
      "production": 'http://tangyh.top:8768/druid',
    }
  }
}
