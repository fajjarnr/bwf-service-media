FROM node:18.16.1-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# ENV PORT=8080 \
#     HOSTNAME=http://bwf-service-media:8080 \
#     DB_HOSTNAME=db-service-user \
#     DB_NAME=service-user \
#     DB_USERNAME=admin \
#     DB_PASSWORD=rahasia \
#     CLOUDINARY_CLOUD_NAME="" \
#     CLOUDINARY_API_KEY="" \
#     CLOUDINARY_API_SECRET="" 

EXPOSE 8080

CMD [ "npm", "run", "start" ]
