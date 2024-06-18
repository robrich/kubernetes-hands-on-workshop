Docker Hub
==========

Docker hub is to Docker as GitHub is to source control.

Docker hub is the central repository or "store" for sharing images.

You can also use private repositories such as [AWS Container Registry](https://aws.amazon.com/ecr/) or [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/) to store images more privately.  If you're inside the corporate firewall, look to [Artifactory](https://www.jfrog.com/artifactory/) (paid) or [Nexus](https://www.sonatype.com/nexus-repository-oss) (free) for on-premise Docker repositories.


Using Docker Hub
----------------

We've been using `docker pull ...` throughout this course.  Each time we've done this, we've pulled content from docker hub.

Browse [https://hub.docker.com/](https://hub.docker.com/) to find other images to download.  With each image, you'll likely find a Dockerfile showing how that image was built.


Adding to Docker Hub
--------------------

(If you'd rather not expose your learning so publicly, you can skip this section.  We'll also use Azure Container Registry in the next module.)

1. Create an account on [https://hub.docker.com/](https://hub.docker.com/) or login to your account if you've already created one.

2. From the command-line, run

   ```
   docker login
   ```

3. Note the Docker system tray menu now shows your name and `Logout`.

4. Tag an image in the form `username/imagename:version`, so I would tag a node image as `robrich/backend:0.1`.  Note the registry details are in the image name.  Sadly, this makes it difficult to move images between container registries or cache a container registry.

   ```
   docker tag backend:0.1 username/backend:0.1
   ```

   Substitute your docker username for `username`.

5. `docker push username/imagename:version` will push new images to Docker hub.

   ```
   docker push username/backend:0.1
   ```

   Substitute the details of the image you tagged above.

6. Now that your image is on Docker hub, you could delete the image, and grab it again using:

   ```
   docker pull username/backend:0.1
   ```

   Substitute the details of the image you tagged above.  Because you already have it locally, it'll successfully do nothing.

7. Docker uses the tag `latest` when a version isn't specified, but this tag is no different than any other tag.  Let's tag the image as `latest` and push that one too.

   Substitute your docker username for `username` in both these commands:

   ```
   docker tag backend:0.1 username/backend
   docker push username/backend
   ```

8. Repeat steps 5, 6, and 7 for the `frontend:0.1` container.

9. Now that your image is on Docker hub, you could delete the image, and grab it again using:

   ```
   docker pull username/backend:0.1
   ```

   Substitute the details of the image you tagged above.  Because you already have it locally, it'll successfully do nothing.
