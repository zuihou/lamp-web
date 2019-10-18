FROM nginx:1.14.2
MAINTAINER MrBird 852252810@qq.com

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /etc/nginx/html
