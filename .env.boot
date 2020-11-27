NODE_ENV = production

# just a flag
ENV = 'boot'


VUE_APP_PROJECT_NAME = 'lamp-web'
# 开发环境请求域名前缀， 该变量仅仅开发环境需要设置
VUE_APP_DEV_REQUEST_DOMAIN_PREFIX = 'http://42.202.130.216:10000'
# 请求域名前缀， 该变量仅仅生产环境需要设置
VUE_APP_PROD_REQUEST_DOMAIN_PREFIX = 'http://42.202.130.216:10000'
# 多租户模式
VUE_APP_IS_MULTI_TENANT_TYPE = SCHEMA
# 是否启用验证码
VUE_APP_IS_CAPTCHA = true
# 客户端秘钥
VUE_APP_CLIENT_ID=lamp_web
VUE_APP_CLIENT_SECRET=lamp_web_secret
VUE_APP_SVG = '@/icons/svg'
# base api
VUE_APP_BASE_API = '/api'

