Bonus tasks
===========

Docker Hub
----------

We've pushed the images both to Azure Container Registry and to Docker Hub.  Note that the only difference in image names is locally the image is `frontend:0.1`, on Docker Hub, it's `USERNAME/frontend:0.1` and on Azure Container Registry the image is named `REGISTRY.azcr.io/frontend:0.1`.

Your task: modify the deployment to pull the images from Docker Hub instead of from the private registry.


HTTPS
-----

Follow the tutorial at https://github.com/kubernetes/contrib/tree/master/ingress/controllers/nginx/examples/tls to add https to ingress.yaml


Auto Scaling
------------

Here are some tutorials on autoscaling Kubernetes

- https://kubernetes.io/blog/2016/07/autoscaling-in-kubernetes/
- https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/
- https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/


Helm
----

Helm allow us to template the yaml files to avoid the redundancy.

Tutorials on Helm:

- https://www.katacoda.com/courses/kubernetes/helm-package-manager
