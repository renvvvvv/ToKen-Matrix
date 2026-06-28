# 前端构建阶段 - 仅用于演示，实际使用基础 nginx
FROM nginx:alpine

# 安装基础工具
RUN apk add --no-cache bash

# 复制前端文件到 nginx 默认目录
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY demos/ /usr/share/nginx/html/demos/

# 配置 nginx
RUN echo "server { \
    listen 3000; \
    server_name _; \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1d; \
        add_header Cache-Control 'public, immutable'; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
