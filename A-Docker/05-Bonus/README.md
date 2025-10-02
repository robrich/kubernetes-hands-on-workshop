Bonus
=====

Finished the Docker excercises really fast? Here's some advanced scenarios you could solve while we catch up.

1. Be an attacker and exec into the containers and steal configuration secrets.

2. Build a [docker-compose.yml](https://docs.docker.com/compose/compose-file/) file to:
- startup the backend
- startup the frontend once backend is running
- configure frontend and backend environment variables
- startup a [Postgres](https://hub.docker.com/_/postgres) database
- startup [Adminer](https://hub.docker.com/_/adminer), the Postgres sql admin
- Challenge: modify the `backend` app to connect to Postgres

3. Add a [health check](https://github.com/rodrigobdz/docker-compose-healthchecks) to docker-compose.yml that notices when frontend is unhealthy and [restarts](https://github.com/compose-spec/compose-spec/blob/master/deploy.md#restart_policy) it. Then exec into the frontend container and kill the Node.js process.

4. Add [Docker Compose watch](https://docs.docker.com/compose/file-watch/) to rebuild either the frontend or backend image if code changes.

5. Move the Postgres data directories to volumes.

6. Create an Nginx reverse proxy for frontend that accepts [https](https://nginx.org/en/docs/http/configuring_https_servers.html).
