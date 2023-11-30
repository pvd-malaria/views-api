FROM nginx:stable-alpine3.17-slim

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./poc.conf /etc/nginx/poc.conf

EXPOSE 80 443 9000 9009

CMD ["nginx", "-g", "daemon off;"]
