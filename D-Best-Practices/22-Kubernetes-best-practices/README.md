Kubernetes and Docker Best Practices
====================================

Here's things I've found that make Docker and Kubernetes most effective:


Security
--------

- **[Store secrets carefully](https://robrich.org/slides/docker-secrets/#/)**:  Where you choose to store secrets depends a lot on what you trust and how much complexity and control you want around secrets.

- **Kubernetes secrets are on every node**.  See the [docs](https://kubernetes.io/docs/concepts/configuration/secret/#risks).

- Use **RBAC** (role based access control):  All 3 cloud providers support this "service account" or "app authentication" mechanism, and it's much more durable than usernames and passwords which need to be themselves secured carefully.  By contrast, service accounts have no password; they're managed solely by the cloud provider.

- **Rebuild and deploy production images frequently**:  A docker image is ephemeral and deterministic — it doesn't change.  Your dependencies evolve over time.  Rebuild production images frequently to get OS patches and dependency updates.

- **Don't build corporate base images**:  Don't create a corporate base image with all the agents installed, either forked or built from standard images.  It'll be difficult to keep this corporate image up-to-date as the upstream image changes.  You've not increased your security posture, you've exposed yourself.  Instead use the standard images directly from Docker Hub.

- **Namespaces aren't a security boundary**, they're an organizational boundary.  By default, any pod can call any other pod running in the cluster.  If you need multi-tenant or a mix of secure / insecure workloads, use a service mesh like Istio.

- Avoid the **Kubernetes Dashboard**:  The primary copy of the configuration should be in yaml files stored in source control.  Though you can modify in the dashboard, and export configuration, it's easy to get these out of sync, and accidentally remove changes on next rolling update.  If we assume source control is the source of truth, we don't have this issue.

  The Kubernetes Dashboard is the thing people usually hack.  Someone changed the K8s dashboard to be public, didn't turn on authentication, and suddenly their cluster is crypto-mining.

  If possible, don't even install the Kubernetes dashboard.

- **No build tools or source** code in production images:  Use multi-stage builds for compiled languages to ensure the source and the build tools are not available to attackers.  This also makes the production image significantly smaller.  For example, hosting a React or Vue app as static files?  Host it in an Nginx container.  You no longer need a Node runtime for these static files.


Scaling
-------

- **Containers are a unit of scaling**:  Separate the front-end web server from the back-end report processor from the database from the redis cache. When they're unique containers, they can scale independently.  For example: 1 database, 3 redis servers, 10 web servers, back-end only runs for an hour each night.

- **1 process per container**:  If you need more than one process, use more than one container.

- **1 container per pod**:  If you need more than one process, use more than one pod.  When you learn about sidecar containers you'll know when you can break the 1-container-1-pod rule.

- **Use a managed data store**:  Use database-as-a-service both to eliminates stateful containers and it's one less thing you need to manage.  For example, Azure SQL Database and Amazon RDS.

- Use a **cloud-hosted Kubernetes** cluster:  Azure, Amazon, and Google all have Kubernetes clusters available at the click of a button.  Many private clouds have this service too.  `kubeadm` is hard.  If you must manage your own cluster, you may consider Docker Swarm as an easier alternative.


Source
------

- **Version control your yaml files**:  Best is to version the yaml together with the application source.  If you need to deploy an old version of the app, you'll have the old version of the deploy script right there too.

  If you opt instead to hide Kubernetes as an implementation detail, ensure your yaml files are still versioned and discoverable.  For example, tag the repository on each deployment or merge in a label with the git hash during deploy:  `cat file.yaml | sed /GIT_HASH/$GITHASH/ | apply -f -`

- **Use `.dockerignore`**:  Using nearly the exact same "one line per entry" and "wildcard glob" syntax as `.gitignore` and `.npmignore`, you can use `.dockerignore` to prune content from the `ADD . /path` and `COPY . /path` commands in your Dockerfile.

  The only difference between `.gitignore` and `.dockerignore` is `.dockerignore` assumes it's in the root.  Begin the line with `**/...` to ignore files in any directory.

  Once in the `.dockerignore` it won't copy even if you explicitly copy it.

- Leverage **cached layers**:  In the docker file, first copy the app's manifest (`package.json`, `.csproj`, `requirements.txt`, etc), then run the package installer (`npm install`, `pip install`, `nuget restore`, `gem install`, etc), then copy in the rest of the content.  The app's content probably changes frequently, but the package manifest doesn't.  With this approach, you're more likely to get a cache hit for the expensive package download during development and on the CI server.

- **Environment vars**:  Expose anything that changes as an environment variable so ops can quickly adjust runtime behavior, and developers can sleep through it.


Architecture
------------

- Use **Ingress over LoadBalancer** services when possible:  Ingress can route based on hostname or path, but can only route traffic HTTP from port 80 and 443 without a custom Ingress Controller.  Services of type LoadBalancer may create a unique LoadBalancer on your cloud per service.  This can get expensive.

- **Labels**:  Gratuitously add labels to anything.  You can limit the query to `kubectl get all --selector=app=frontend`.

- **Namespaces**:  You can scope things by namespace, though you'll now need to add the `--namespace=` to any kubectl command.

- Use the **smallest base image** that includes all the tools you need:  Every additional library or tool in the base image increases the size.  This makes it slower to copy to new nodes in the cluster, and slower to transfer to and from a container registry.  More tools makes a larger attack surface, and makes it more difficult to secure.

- **Use SemVer**:  Choose carefully between these two methodologies for updates:

  - On the one hand:  If you don't check in package.json and you use semver style dependencies in both the Dockerfile and your source, rebuilding will install the latest patched version.  This is a great way to automatically get secure simply by rebuilding.

  - On the other hand:  If you use semver dependencies, rebuilding won't give you a deterministic build.  Instead, hard-code specific dependency versions to ensure repeatability.  When there's a library update, a developer opts into it specifically.


DevOps
------

- **Deploy the service before the deployment**:  Services create DNS entries and environment variables in the cluster.  If you schedule the deployment first, you may have a container start without the necessary environment variables or they may not be able to resolve the hostnames of dependent services.

- **Deployments should reference versioned images**:  K8s's default pull policy is `IfNotPresent` for versioned images, and `Always` for `latest` because `latest` isn't deterministic.  If you use `latest`, it's possible for some pods to be the old version and some pods to be the new version depending on when they restart.  Avoid this sharp edge; document when you bumped the version of the content by also versioning the image and the deployment.


kubectl
-------

- **`kubectl get all` doesn't return every-every thing**:  `get all` only returns things that won't lose data if they're deleted.  Include other things by running `kubectl get all,ing,sec` etc.  See https://github.com/kubernetes/community/blob/master/contributors/devel/kubectl-conventions.md#rules-for-extending-special-resource-alias---all

- **default Namespace**:  You can set the default namespace to something other than default: `kubectl config set-context --current --namespace=NAMESPACE`

- The `kubectl` **cheat sheet**: https://kubernetes.io/docs/reference/kubectl/cheatsheet/


Other Best Practices
--------------------

- https://kubernetes.io/docs/concepts/configuration/overview/
- https://www.weave.works/blog/kubernetes-best-practices
- https://medium.com/google-cloud/kubernetes-best-practices-8d5cd03446e2
