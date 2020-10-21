A bigger site
=============

Build a more real-world microservices app.  I've provided a backend .net core site, and a frontend node site.

Here's your challenge: build both `Dockerfile`s necessary to run these two sites.

Here's a network diagram of the application we'll build:

![A Bigger Site Architecture](architecture.png)

From our browser, we can connect to both http://localhost:3000/ and http://localhost:5000/ to get to the frontend and backend respectively.  The Docker "router" proxies the requests from the WAN (localhost) side to the LAN (172.17.0.x) side.

When communicating between containers, we can't use this proxy though.  To communicate from the frontend container to the backend container, we'll need to use LAN names or IPs to communicate between the containers.


Backend
-------

1. Open up `backend/Dockerfile`

2. Modify the file to build the .net app.  I've listed the shell commands you'll need to run.  Turn these into Dockerfile [`RUN`](https://docs.docker.com/engine/reference/builder/#run) and `CMD` commands.

3. `docker build ...` the back-end image, tagging the image as `backend:0.1`.  Look to exercise 3 for clues if necessary.

4. Run this to both start the container and name the container:

   ```
   docker run -d -p 5000:5000 --name backend backend:0.1
   ```

   This says run image `backend:0.1` as container named `backend`, direct host traffic on port 5000 to the container's port 5000, and run detached or in daemon mode.

5. Look at the container list and ensure it's running.

6. The backend doesn't have any web pages, so if we browse to it, we'll get an HTTP 404.


Frontend
--------

1. Open `frontend/routes/index.js`.  Note the line that says `const BACKEND = 'http://backend:5000';`  The front-end assumes it can browse to `http://backend:5000/...` to get to the backend.  GOod thing we started the backend container with `--name backen` so this works.

   Note: we can't just browse from the front-end container to the backend container inside the Docker network via `http://localhost:5000/` because that's not the address of the backend container inside the Docker network.  From outside the Docker network, Docker is NATing the traffic from localhost.  But inside the network, we don't have this luxury.

2. Open `frontend/Dockerfile`

3. Modify the file to build the node app.  I've listed the shell commands you'll need to run.  Turn these into Dockerfile [`RUN`](https://docs.docker.com/engine/reference/builder/#run) and `CMD` commands.

4. Build the front-end image, tagging it as `frontend:0.1`.

5. Run this:

   ```
   docker run -d -p 3000:3000 --link backend frontend:0.1
   ```

   This starts the front-end container, NATing traffic from port 3000 to port 3000 in the container, and sets up a DNS route to the backend container.  Now `http://backend:5000/...` will resolve correctly.

6. Look at the container list and ensure both containers are now running.


Test it out
-----------

1. Visit [http://localhost:3000/](http://localhost:3000/) to cast your vote.

2. Look at the docker logs for each container.


Shut down the containers
------------------------

1. From a terminal:

   ```
   docker container list --all
   ```

2. A quick way to remove all stopped containers:

   ```
   docker container prune -f
   ```

   This doesn't stop any containers, but it removes ones that have stopped previously.

3. Run `docker container list --all` again to see what's left.

4. For each remaining container: `docker container rm -f ...` substituting the container name or id for `...`.  This both stops and removes the container in one command.

5. `docker container list --all` to ensure it's empty.
