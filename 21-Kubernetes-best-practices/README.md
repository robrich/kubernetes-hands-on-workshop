Kubernetes and Docker Best Practices
====================================

Here's things I've found that make Docker and Kubernetes most effective:

- Containers are a unit of scaling:  Separate the front-end web server from the back-end report processor from the database from the redis cache. When they're unique containers, they can scale independently.  For example: 1 database, 3 redis servers, 10 web servers, back-end only runs for an hour each night.

- 1 process per container:  If you need more than one process, use more than one container.

- 1 container per pod:  If you need more than one process, use more than one pod.  Sidecar containers are a thing.  When you learn about sidecars you'll know when you can break the 1-container-1-pod rule.

- Use a managed data store:  Using a database-as-a-service product both eliminates stateful containers and it's one less thing to manage.  For example, Azure SQL Database and Amazon RDS.

- Rebuild and deploy production images frequently:  A docker image is ephemeral and deterministic -- it doesn't change.  Your dependencies evolve over time.  Rebuild production images frequently to get OS patches and dependency updates.  Orchestration engines can pick up the `latest` label change automatically, rolling the the updated image into production with ease.

- [Store secrets carefully](https://robrich.org/slides/docker-secrets/#/):  Where you choose to store secrets depends a lot on what you trust and how much complexity and control you want around secrets.

- Kubernetes secrets are on every node.  See the [docs](https://kubernetes.io/docs/concepts/configuration/secret/#risks).

- Production config as environment vars:  In production, expose anything that changes as an environment variable so ops can quickly adjust runtime behavior.

- Avoid the Kubernetes Dashboard:  The master copy of the configuration should be in yaml files stored in source control.  Though you can modify in the dashboard, and export configuration, it's easy to get these out of sync, and accidentally remove changes on next rolling update.  If we assume source control is the source of truth, we don't have this issue.

  The Kubernetes Dashboard is the thing people usually hack.  Someone changed the K8s dashboard to be public, didn't turn on authentication, and suddenly their cluster is crypto-mining.

  If possible, don't even install the Kubernetes dashboard.

- Version control your yaml files:  Best is to version the yaml together with the application source.  If you need to deploy an old version of the app, you'll have the old version of the deploy script.

  If you opt instead to hide Kubernetes as an implementation detail, ensure your yaml files are still versioned and discoverable.  For example, tag the repository on each deployment or merge in a label with the git hash during deploy:  `cat file.yaml | sed /GIT_HASH/$GITHASH/ | apply -f -`

- Leverage cache layers:  In the docker file, first copy the app's manifest (`package.json`, `.csproj`, etc), then run the package installer (`npm install`, `pip install`, `nuget restore`, `gem install`, etc), then copy in the rest of the content.  The app's content probably changes frequently, but the package manifest doesn't.  With this approach, you're more likely to get a cache hit for the expensive package download during development and on the CI server.

- Use `.dockerignore`:  Using the exact same "one line per entry" and "wildcard glob" syntax as `.gitignore` and `.npmignore`, you can use `.dockerignore` to prune content from the `ADD . /path` and `COPY . /path` commands in your Dockerfile.

- Use Ingress over LoadBalancer when possible:  Ingress can route based on hostname or path, but can only route traffic from port 80 and 443 without a custom Ingress Controller.  Services of type LoadBalancer may create a unique LoadBalancer on your cloud per service.  This can get expensive.

- Deploy the service before the deployment:  Services create DNS entries and environment variables in the cluster.  If you schedule the deployment first, you may have a container start without the necessary environment variables or they may not be able to resolve the hostnames of dependent services.

- Deployments should reference versioned images:  K8s's default pull policy is `IfNotPresent` for versioned images, and `Always` for `latest` because `latest` isn't durable.  Instead document when you bumped the version of the content by also versioning the image and the deployment.

- Use a cloud-hosted Kubernetes service:  Azure, Amazon, and Google all have Kubernetes clusters available at the point of a button.  Many private clouds have this service too.  `kubeadm` is hard.  If you must manage your own cluster, you may think about Docker Swarm as an easier alternative.

- `kubectl get all` doesn't return every-every thing, it only returns things that won't lose data if they're deleted.  Include other things by running `kubectl get all,ing,sec` etc.  See https://github.com/kubernetes/community/blob/master/contributors/devel/kubectl-conventions.md#rules-for-extending-special-resource-alias---all

- Use role based access control (RBAC):  All 3 cloud providers support this "service account" or "app authentication" mechanism, and it's much more durable than usernames and passwords which need to be themselves secured carefully.  By contrast, service accounts have no password; they're managed solely by the cloud provider.

- Labels:  Gratuitously add labels to anything.  You can limit the query to `kubectl get all --selector=app=frontend`.

- Namespaces:  You can scope things by namespace, though you'll now need to add the `--namespace=` to any kubectl command.

- Namespaces aren't a security boundary, they're an organizational boundary.  By default, any pod can call any other pod running in the cluster.

- The `kubectl` cheat sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/


Other Best Practices
--------------------

- https://kubernetes.io/docs/concepts/configuration/overview/
- https://www.weave.works/blog/kubernetes-best-practices
- https://medium.com/google-cloud/kubernetes-best-practices-8d5cd03446e2
