My First Container
==================

We're going to build our first container as a Linux workload.


Step 0: Clone this repository
-----------------------------

Head to https://github.com/robrich/kubernetes-hands-on-workshop, click on the green "Code" button, and choose to clone or download this repository content.  Save the files in any convenient folder on your machine.  Consider putting them in a path without spaces because using paths with spaces requires putting quotes around some commands.


Step 0: Switch to Linux containers
----------------------------------

1. Running on Windows?  Right-click on the docker system tray icon, and choose "Switch to Linux Containers".  If it says "Switch to Windows containers" you don't need to do anything, you're already there.


Step 1: Create the app
----------------------

1. Go to [nodejs.org](https://nodejs.org/en/about) and click on "About".

2. Copy the sample program.

3. Paste into a new file.

4. Save the file in this `start` folder, and name the file `server.js`.

5. Modify this line: `server.listen(port, hostname, () => {` to this: `server.listen(port, () => {` (e.g. remove `hostname,`.)


Step 2: Craft the Dockerfile
----------------------------

1. Create a new file in this `start` folder named `Dockerfile` -- note it has no file extension.

2. Write this line:

   ```
   FROM node:alpine
   ```

   This says "start with the [node](https://hub.docker.com/_/node/) base-image, and use the alpine flavor of it."  The alpine Linux distribution is known for being tiny.

   **Pro tip:** Rather than copying and pasting the text, type each step instead.  You'll become much more familiar with the new technology this way.

3. Add this line to set the current directory inside the image:

   ```
   WORKDIR /app
   ```

   This says "I want my image content to be in the `/app` directory."  It will create the directory if it doesn't exist.

   There's nothing magical about the `/app` directory.  You could call it `/foo/bar/baz` and this example would work just fine.

4. Next line:

   ```
   COPY . /app
   ```

   This says "Copy all the files in my current folder on my drive into the `/app` directory in the image."

4. Another line:

   ```
   EXPOSE 3000
   ```

   This says "I want the container's port 3000 to be accessible for inbound traffic from outside the container."

5. Write this:

   ```
   CMD ["node", "server"]
   ```

   This says "The command line to run when starting the container is `node server`. In other words, Start Node with the `server.js` file."

   Note that all the other lines get run as we build the image.  Only this line gets run as the container starts.

6. Save the Dockerfile.  Make sure it's `Dockerfile` without an extension, not ~~Dockerfile.txt~~.


Step 3: Build the Dockerfile into an image
------------------------------------------

1. From a terminal in the folder with the `Dockerfile` and `server.js` file, run this command from a command prompt:

   ```
   docker build --tag hellonode:0.1 .
   ```

   This says "Build the current directory's Dockerfile into an image, and tag the image with the name `hellonode` and the version `0.1`".

   NOTE: If you're building on Windows, you'll get a security warning. It's showing you that Windows Access Control Lists (ACLs) are different than Linux's Users & Groups. We're not setting file permissions here, so we're ok. It's safe to ignore this warning in this case.


2. After it finishes, run this to see the image it built:

   ```
   docker image list
   ```

   Your image is at the very top because this list is sorted by create date descending.


Step 4: Run the image as a container
------------------------------------

As you work through this section, if you find it doesn't work, look for debugging tips in section 5 below.

1. From a command prompt, run:

   ```
   docker run -p 3000:3000 -d hellonode:0.1
   ```

   This says "Run the image named `hellonode`, version `0.1` as a container, and NAT the host's port 3000 to port 3000 in the container.  `-d` says "run in daemon mode" or "run in the background."

2. Open a browser to [http://localhost:3000](http://localhost:3000).  Success!

3. To see the running containers, run

   ```
   docker container list
   ```

   Is it not running?  See step 5.

**Note: you didn't install node!**


Step 5: Debugging a failed container
------------------------------------

Did your container not start up correctly in Step 4?  Let's look for clues to what happened.

1. Run `docker container list --all`.  This will show both running and stopped containers.

2. Note the `CONTAINER ID` and/or the `NAMES` of the failed container.  We'll need it next.

3. Run `docker container logs ...`, replacing `...` with the first few characters of the `CONTAINER ID` or the `NAMES` you found above.  This shows the console output from the failed container.  Did this give you clues on how to fix it?

4. Remove the stopped container using Step 6 below, then return to Step 3 to rebuild the image and rerun the container.

5. Start the container using `docker run -p 3000:3000 hellonode:0.1` without the `-d` so the console output comes straight to your screen.

6. When you're ready, use CNTRL-C to break out of the console, and get back to the host's terminal.

Is port 3000 already in use on your machine?  Change the host port to another port like 3001 with this command `docker run -p 3001:3000 hellonode:0.1`, then browse to `localhost:3001`.  Notice that inside the container, the server is still listening on port 3000.


Step 6: Stop and Remove the container
-------------------------------------

1. Run `docker container list` to see running containers.  Note the `CONTAINER ID` and/or the `NAMES` of the running container.

2. Run `docker container stop ...` replacing `...` with the first few characters of the `CONTAINER ID` or the `NAMES` you found above.  This stops the container.

3. Run `docker container list` and note the container is now stopped.

4. Run `docker container list --all` to see all containers -- both stopped and started.

5. Run `docker container rm ...` replacing `...` with the first few characters of the `CONTAINER ID` or the `NAMES` you found above.  This removes the container.

   The read-write layer for this container is now gone.  Good thing we didn't save anything there.

6. Run `docker image list`.  The image is still there, only the container we created by running the image is gone.


Step 7: Change the code, rebuild, rerun
---------------------------------------

1. Modify `server.js` to change `Hello World` to say something else interesting.

2. Run a `docker build` command, changing the version label to `0.2`.

3. Run a `docker run` command to start the container.

4. Browse to [http://localhost:3000](http://localhost:3000) to see the changes.

5. Run a `docker container stop` command to stop the container.

6. Run a `docker container rm` command to remove the container.
