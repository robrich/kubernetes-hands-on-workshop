Azure Container Registry
========================

Like Docker Hub, Azure Container Registry lets us publish docker images.  Unlike Docker Hub, the images are private.


Optional: Build Docker images for the Target Platform
-----------------------------------------------------

If you're running on an ARM64 machine (e.g. M1 Mac) and you provisioned an AMD64 cluster or vice versa, you'll need to rebuild the images specific for the target architecture.

1. From the command line, run commands similar to

   ```
   cd /folder/with/Dockerfile/in/it
   docker build -t REGISTRY_NAME.azurecr.io/backend:v0.1 --platform=linux/amd64 .
   ```

   See https://docs.docker.com/build/building/multi-platform/#building-multi-platform-images

If this is particularly slow on your machine, you can build your content in the cloud instead:

1. From the command line, run commands similar to

   ```
   cd /folder/with/Dockerfile/in/it
   az acr build --registry REGISTRY_NAME --image backend:v0.1 .
   ```

   See https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-quick-task

   If you build in the container registry, you don't need to push the images to the registry — they're already there.  Skip the next section.


Pushing images to Azure Container Registry
------------------------------------------

1. Grab the Admin username and password from the Azure Container Registry you created in the previous exercise.

2. From the command-line, run

   ```
   docker login REGISTRY_NAME.azurecr.io
   ```

   Substitute `REGISTRY_NAME` with the name of your Azure Container Registry.

3. Tag an image in the form `registryname.azurecr.io/imagename:version`, so I would tag a node image as `robrich.azurecr.io/backend:0.1`.

   ```
   docker tag backend:0.1 your_registry_name.azurecr.io/backend:0.1
   ```

   Substitute your registry name.

   Note the registry details are in the image name.  Sadly, this makes it difficult to move images between repositories or to locally cache external repositories.

4. Push the image to Azure Container Registry:

   ```
   docker push your_registry_name.azurecr.io/backend:0.1
   ```

   Substitute the details of the image you tagged above.

   Note how similar this is to Docker Hub.  The only difference is the registry url.

5. Docker uses the tag `latest` when a version isn't specified, but this tag is no different than any other tag.  Let's tag the image as `latest` and push that one too.

   Substitute your docker registry in both these commands:

   ```
   docker tag backend:0.1 REGISTRY_NAME.azurecr.io/backend
   docker push REGISTRY_NAME.azurecr.io/backend
   ```

6. Repeat steps 3, 4, and 5 for the `frontend:0.1` container.

7. Now that your image is in Azure, we can use it to run the container in Azure Kubernetes Service.
