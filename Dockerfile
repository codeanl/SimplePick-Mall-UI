# Dockerfile

# 使用 Node.js 作为基础镜像
FROM node:16 as build-stage

# 设置工作目录
WORKDIR /app

# 安装项目依赖
COPY package*.json ./
RUN npm install

# 拷贝项目文件
COPY . .

# 构建 Vue.js 应用
RUN npm run build

# 使用 Nginx 作为运行环境
FROM nginx:latest as production-stage

# 拷贝构建后的文件到 Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 拷贝自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80



# 运行 Nginx
CMD ["nginx", "-g", "daemon off;"]