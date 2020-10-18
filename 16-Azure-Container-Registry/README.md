Azure Container Registry
========================

Like Docker Hub, Azure Container Registry lets us publish docker images.  Unlike Docker Hub, the images are private.


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
   docker tag backend:0.1 REGISTRY_NAME.azurecr.io/backend:0.1
   ```

   Substitute your registry name.

   Note the registry details are in the image name.  Sadly, this makes it difficult to move images between repositories or to locally cache external repositories.

4. `docker push registry.url/imagename:version` will push new images to Docker hub.

   ```
   docker push REGISTRY_NAME.azurecr.io/backend:0.1
   ```

   Substitute the details of the image you tagged above.

5. Docker uses the tag `latest` when a version isn't specified, but this tag is no different than any other tag.  Let's tag the image as `latest` and push that one too.

   Substitute your docker registry in both these commands:

   ```
   docker tag backend:0.1 REGISTRY_NAME.azurecr.io/backend
   docker push REGISTRY_NAME.azurecr.io/backend
   ```

6. Repeat steps 3, 4, and 5 for the `frontend:0.1` container.

7. Now that your image is in Azure, we can use it to run the container in Azure Kubernetes Service.
