# Step 1: Build the Angular app
FROM node:19-alpine AS angular

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# Step 2: Set up NGINX to serve the Angular app
FROM nginx:alpine

# Remove default NGINX configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom NGINX configuration for Angular
COPY nginx.conf /etc/nginx/conf.d/

# Copy the built Angular app to the NGINX web directory
COPY --from=angular /app/dist/tree-scape.frontend/browser /usr/share/nginx/html

# Expose the port NGINX will use
EXPOSE 80
