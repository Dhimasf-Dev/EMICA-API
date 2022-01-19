FROM node:16.13
MAINTAINER Andre.Maulana@xapiens.id
RUN mkdir -p /opt/apigateway
COPY . /opt/apigateway/
WORKDIR /opt/apigateway
#RUN npm install -g npm@8.3.0
RUN npm install jsonwebtoken
RUN npm install shape-json
RUN npm install odoo-xmlrpc
RUN npm install geolib
RUN npm install pg
RUN npm install -g forever
RUN npm install express
#VOLUME ["/opt/apigateway/config"]
#EXPOSE 3000
CMD ["node","app.js"]
