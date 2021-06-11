Multi-stage Build
=================

In Node, we deploy our source.  In .NET Core, we build first, and deploy built artifacts.  A multi-stage build allows us to deploy smaller images because we're not deploying build tools or source code.


Step 1: Build the Dockerfile
----------------------------

1. Create a new file named `Dockerfile` inside the `src` directory. If you haven't yet cloned this repository, you'll need the content from https://github.com/robrich/kubernetes-hands-on-workshop/tree/master/03-Multi-stage-build/start/src folder (the `src` directory next to this README.md file).

2. Add the line

   ```
   FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine
   ```

   This says "start with the [.net build tools](https://hub.docker.com/_/microsoft-dotnet-core-sdk/) base image, and use the alpine flavor of it."  The alpine linux distribution is known for being really tiny.

3. Add the line:

   ```
   WORKDIR /src
   ```

   This says "I want my process in the container to start from the `/src` directory."  It will create the directory if it doesn't exist.

4. Next line:

   ```
   COPY MultiStage.csproj .
   ```

   This says "copy the dependencies manifest file from my machine to the current directory in the image."  In Node, this is the project.json file.  In Python this is the requirements.txt file.

5. Add this line:

   ```
   RUN dotnet restore MultiStage.csproj
   ```

   This downloads libraries from the NuGet package repository.

   We copy only the project's manifest file first, then restore dependencies so we can benefit from Docker's layer caching.  When we change our app's source code and rebuild the image, we don't need to re-download the libraries if the source manifest didn't change.

6. Next section:

   ```
   COPY . .
   ```

   This copies all the rest of the content from the directory where we'll run the build command on our machine into the current directory in the image.

7. Open the `.dockerignore` text file inside the `src` directory.  The syntax is identical to a `.gitignore` file.  This file tells the `COPY` command which things it should not copy.

   If you don't have a `.dockerignore` file, it'll use the `.gitignore` file instead.  If it doesn't find either, it'll copy everything.

   In this case, we've chosen to not copy in all the user-specific files, configuration files for various editors, and other files we don't need.

8. Back in the `Dockerfile` let's add these two lines:

   ```
   RUN dotnet build MultiStage.csproj -c Release
   RUN dotnet publish MultiStage.csproj -c Release -o /app
   ```

   These commands tell .NET Core to build the application, and to publish the application to the `/app` directory, creating it if it doesn't exist.

9. Add this line:

   ```
   WORKDIR /app
   ```

   We've seen this line a few times before.  Roughly it says "mkdir -p /app && cd /app"

10. Add these lines:

   ```
   ENV ASPNETCORE_URLS http://+:5000
   EXPOSE 5000
   ```

   These lines tell .NET and Docker respectively what ports to use for the web server.  We saw a similar `EXPOSE` line in the Node app's Dockerfile.

11. Add this line:

    ```
    CMD ["dotnet", "MultiStage.dll"]
    ```

    This is the command it'll run when the container starts up.  All the other lines are run at build time.  This starts the web server.

12. Save the Dockerfile.  Make sure it's `Dockerfile` without an extension, not ~~Dockerfile.txt~~.


Step 2: Build the Dockerfile into an image
------------------------------------------

1. Start a command prompt in the `src` folder, (the folder with the `Dockerfile` in it) and then run this:

   ```
   docker build --tag hellodotnet:0.1 .
   ```

   This says "Build the current directory's Dockerfile into an image, and tag the image with the name `hellodotnet` and the version `0.1`".

2. After it finishes, run this to see the image it built:

   ```
   docker image list
   ```

   Your image is at the very top because this list is sorted by create date descending.


Step 3: Run the image as a container
------------------------------------

As you work through this section, if you find it doesn't work, look for debugging tips in section 4 below.

1. From a command prompt, run

   ```
   docker run -p 5000:5000 -d hellodotnet:0.1
   ```

   This says "Run the image named `hellodotnet`, version `0.1` as a container, and NAT the host's port 5000 to port 5000 in the container.  `-d` says "run in daemon mode" or "run in the background".

2. Open a browser to [http://localhost:5000](http://localhost:5000).  Success!

   Is it not running?  See step 4.

3. To see running containers, run:

   ```
   docker container list
   ```

**Note: you didn't install .NET Core either!**


Step 4: Debugging a failed container
------------------------------------

Did your container not start up correctly in Step 4?  Let's look for clues to what happened.

1. Run `docker container list --all`.  This will show both running and stopped containers.

2. Note the `CONTAINER ID` and/or the `NAMES` of the failed container.  We'll need it next.

3. Run `docker container logs ...`, replacing `...` with the first few characters of the `CONTAINER ID` or the `NAMES` you found above.  This shows the console output from the failed container.  Did this give you clues on how to fix it?

4. Remove the stopped container using Step 5 below, then return to Step 2 to rebuild the image, and rerun the container.

5. Start the container using `docker run -p 5000:5000 hellodotnet:0.1` without the `-d` so the console output comes straight to your screen.

6. When you're ready, use CNTRL-C to break out of the console, and get back to the host's terminal.

Is port 5000 already in use on your machine?  Change the host port to another port like 5001 with this command `docker run -p 5001:5000 hellodotnet:0.1`, then browse to `localhost:5001`.  Notice that inside the container, the server is still listening on port 5000.


Step 5: Stop and Remove the container
-------------------------------------

1. Run `docker container list --all` to see both running and stopped containers.  Note the `CONTAINER ID` and/or the `NAMES` of the container.

2. Run `docker container rm -f ...` replacing `...` with the first few characters of the `CONTAINER ID` or the `NAMES` you found above.  This both stops and removes the container in one shot.

   The read-write layer for this container is now gone.  Good thing we didn't save anything there.

3. Run `docker image list`.  The image is still there, only the container we created by running the image is gone.


Step 6: Modify the Dockerfile to be multi-stage
-----------------------------------------------

What is a multi-stage build?  We're going to build two images: one is like the build server, the other is like the production server. The first stage will take in our source code and output the built dlls, the second will host the built dlls as a web server.

1. Open the `Dockerfile` you created above.

2. Add this line after the `RUN dotnet publish ...` line and before the `WORKDIR /app` line:

   ```
   FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine
   ```

   We've started a new section -- a second build stage.  We'll build a second image.  This base image is the .NET Core runtime -- it doesn't include the build tools, so it's much smaller.

3. Add this line after the `WORKDIR /app` and before the `ENV ASPNETCORE_...` line:

   ```
   COPY --from=build /app .
   ```

   This line is different from the other copy lines we've written.  This doesn't copy from our computer, it copies from the image stage named `build`.  But `build` doesn't exist yet.

4. At the top of the file, change the `FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine` to this:

   ```
   FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine AS build
   ```

   We've now named the top section, so the `COPY --from=build ...` knows where to get the content.

6. If you're feeling adventurous you could name the other section too, but it isn't necessary.

7. Save the Dockerfile.


Step 7: Build the new multi-stage image
---------------------------------------

1. From the command prompt in the `src` folder that contains the `Dockerfile`, run this:

   ```
   docker build --tag hellodotnet:0.2 .
   ```

   This builds the Dockerfile into an image, and tags the image with a descriptive name and version.

2. After it finishes, inspect the list of images you've built:

   ```
   docker image list
   ```


Step 8: Run the new image as a container
----------------------------------------

1. Run the image as a container, NATing port 5000 from the host into the container:

   ```
   docker run -p 5000:5000 -d hellodotnet:0.2
   ```

2. Open a browser to [http://localhost:5000](http://localhost:5000).  Success!

3. Get the running containers:

   ```
   docker container list
   ```

   Is it not running?  See step 4 above.


Step 9: Stop and Remove the container
-------------------------------------

1. Like you did in step 5, get docker's container list, find your container, and both stop and remove it.


Step 10: Examine the images
---------------------------

Our goal with this multi-stage build is to get a smaller image.  Let's see if we succeeded.

1. From a command prompt, get the list of images:

   ```
   docker image list
   ```

2. On the far right (it may have wrapped to the next line) look at the image size for `hellodotnet:0.1` and `hellodotnet:0.2`.

3. Note that version `0.2` is significantly smaller than `0.1`.

Docker built two images in this multi-stage build example.  One named `<none>` has the build tools and is larger, one is named `hellodotnet:0.2` and is smaller.  We did this so we don't need to deploy the build tools to the production server, and so we built the .net app in a very consistent environment.


Step 11: Prune unnamed images
-----------------------------

1. From the command prompt, get the list of docker images.

2. See the image that shows `<none>` and `<none>`?  This is the `build` stage from our Dockerfile.  Docker cached it so the next build will be faster.

3. Run from a command prompt:

   ```
   docker image prune -f
   ```

   This removes all the images with `<none>` on it, but it doesn't remove any images with tag names and versions, and it doesn't remove any images that started running or stopped containers.

4. Get the list of images, and verify the `<none>` image is gone.

   Is it still there?  Run `docker container list --all` and see if there's a running container.


Bonus Step: Docker-compose
--------------------------

`docker-compose` is the precursor to Docker Swarm, the production orchestrator by Docker.  We're not going to use Docker Swarm.  We're going to use Kubernetes instead.  So we won't spend a lot of time on `docker-compose` in this course.

`docker-compose` is really handy as it contains a simple structure for both the `docker build ...` command arguments and the `docker run ...` arguments.

I've provided a sample `docker-compose.yml` file for us to play with.

1. In the folder with the `docker-compose.yml` file in it, open a command prompt.

2. Run this:

   ```
   docker-compose up -d
   ```

   This will both build the image and run the container.  Like the `docker run` command, leave off the `-d` to show console output from the container.

3. Open a browser to [http://localhost:5000/](http://localhost:5000/) to see the running site.

4. To stop docker-compose run this:

   ```
   docker-compose down
   ```

   If you instead choose to stop the container with `docker stop ...`, Docker-compose will notice the stack is incomplete and start a new container.
