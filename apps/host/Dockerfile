# Use the official Node.js 10 image.
# https://hub.docker.com/_/node
FROM node:12

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install TSC
RUN npm install typescript -g

# Install production dependencies. ## --only=production
RUN npm install 

# Copy local code to the container image.
COPY . .

# Build using tsc
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]

# Set the default region
# gcloud config set run/region us-central1

# Set default platfrom
# gcloud config set run/platform managed

# Set gcloud project
# gcloud config set project  badgewell-badgeconnect

# Deploy to docker image 
# gcloud builds submit --tag gcr.io/$PROJECT_ID/bw-bc-host-service 

# Deploy to production
# gcloud beta run deploy --image gcr.io/$PROJECT_ID/bw-bc-host-service