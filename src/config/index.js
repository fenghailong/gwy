const mock = false

const debug = true

const page = {
  pageIndex: 1,
  pageCount: 10
}

const configUrls = {
  prod: '',
  dev: 'http://47.99.214.1:8080/',
  mock: 'http://rap2api.taobao.org/app/mock/252284/'
}

const configUrl = mock ? configUrls.mock : ( debug ? configUrls.dev : configUrls.prod )

const config = {
  configUrl,
  mock,
  debug,
  page
}

export {
  configUrl,
  mock,
  debug,
  page,
  config
}
