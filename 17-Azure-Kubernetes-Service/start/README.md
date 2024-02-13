Azure Kubernetes Service
========================

Let's schedule the `frontend` and `backend` Kubernetes content in Azure.  We'll mirror the deployment we did in Step 10 into a remote Kubernetes cluster, adding Ingress.


Modify the yaml files
---------------------

We've tagged the image with the registry name and pushed it to Azure Container Registry, so we need to update the deployment files to note the new image name.

1. Copy the `frontend` and `backend` folders from exercise 10: A bigger site into this folder.

   **Pro tip:** Don't copy and paste the files, rather re-type them to get more experience with this content.

2. Open the `backend/deployment.yaml` file in a text editor.

3. Update the `image: backend:0.1` line to point to the registry:

   ```
           image: REGISTRY_NAME.azurecr.io/backend:0.1
   ```

4. Save this file.

5. Change the image name in the `frontend/deployment.yaml` file too.

6. Change the version in `frontend/deployment.yaml` to `0.1` in both places.


Schedule all the things
-----------------------

1. Open a terminal in the **backend** folder, and run this command:

   ```
   kubectl apply -f service.yaml
   ```

   Note: we'll be using Kubernetes's DNS service to discover the backend service, so the backend service must be created before we schedule the frontend deployment for the DNS entries to exist.

2. Schedule the backend deployment:

   ```
   kubectl apply -f deployment.yaml
   ```

3. `cd` into the **frontend** folder, and run these commands:

   ```
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   ```

4. Check on all the things:

   ```
   kubectl get all
   ```

   Are all the pods, services, and deployments running?

   If you got an image pull failure, double-check the URL of the image, and double-check that Azure Kubernetes Service has permission to Azure Container Registry in the IAM tab of the Azure Container Registry.


Access the Services
-------------------

1. Let's access the service using our `NodePort` trick we used locally:

   ```
   kubectl get all
   ```

   Note the `NodePort` (30,000 range) for the `frontend-service`

   Browse to `http://localhost:THE_PORT` substituting the `NodePort` above.

   It didn't work.  Our cluster isn't running on `localhost`, it's running in the cloud.

2. Let's access the service using Azure's url.

   Run this command to get the Azure Kubernetes url:

   ```
   kubectl cluster-info
   ```

   Browse to `https://CLUSTER_URL.azmk8s.io:31891` and to `https://CLUSTER_URL.azmk8s.io/api/v1/namespaces/kube-system/services/frontend-service/proxy`

   **Still didn't work.**


Ingress
-------

Ingress routes traffic through the Azure load balancer associated with the Azure Kubernetes Cluster into our services.  Unlike services of type `LoadBalancer`, an `Ingress` can route traffic to many services based on a unique subdomain or url path.

1. Let's locate the domain Azure assigned to the cluster.

   From the terminal, run this command, substituting your cluster name:

   ```
   az aks show --resource-group kubernetes --name YOUR_CLUSTER_NAME --query addonProfiles.httpApplicationRouting.config.HTTPApplicationRoutingZoneName -o table
   ```

   Note the URL for the cluster.

2. Create a new file in the frontend folder named `ingress.yaml`.

3. Add this content:

   ```
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: frontend
     labels:
       name: frontend
   spec:
     ingressClassName: webapprouting.kubernetes.azure.com
     rules:
     - host: frontend.YOUR_HTTP_ROUTING_DOMAIN
       http:
         paths:
         - pathType: Prefix
           path: "/"
           backend:
             service:
               name: fontend
               port:
                 number: 3000
   ```

   This sets up DNS rules to get traffic from the internet on port 80 into the service named `frontend` on port `3000`.  One could also route https traffic, specifying a certificate stored as a Kubernetes secret, though this is beyond the scope of this course.

   The line `ingressClassName: webapprouting.kubernetes.azure.com` tells Kubernetes to use Azure's Http Application Routing ingress controller.  If using different ingress technologies you may need different configuration.  See https://learn.microsoft.com/en-us/azure/aks/app-routing and https://github.com/kubernetes/ingress-nginx/blob/master/docs/user-guide/nginx-configuration/annotations.md

4. Schedule this ingress:

   ```
   kubectl apply -f ingress.yaml
   ```

5. Get all:

   ```
   kubectl get all
   ```

   Ingress details are not in the list of "all" resources.  To show "everything and ingress", we'll need a new command:

   ```
   kubectl get all,ing
   ```

6. It may take a bit for the DNS to propagate so the `frontend` subdomain exists.

   Check the logs to see how Kubernetes updated DNS by running this command:

   ```
   kubectl get pods --namespace kube-system
   kubectl logs --namespace kube-system pod/addon-http-application-routing-external-dns-YOUR_IDS_HERE
   ```

   Note that unlike the things we've built in the `default` namespace, the dns pod is in the `kube-system` namespace.

   We can look at all namespaces with this command:

   ```
   kubectl get all --all-namespaces
   ```

7. If you're tired of waiting for DNS, you can hot-wire your local DNS.

   - Get the public IP:

     ```
     kubectl get svc --namespace kube-system
     ```

     Note the public IP in the LoadBalancer service

   - Open up `/etc/hosts` on Mac or Linux or `C:\Windows\System32\drivers\etc\hosts` on Windows

     add a line to route the public IP directly to the hostname:

     ```
     123.45.67.8  frontend.YOUR_HTTP_ROUTING_DOMAIN
     ```

     swap in the correct public IP and domain

8. Now let's try it out.  Browse to the URL you formed above: `http://frontend.YOUR_HTTP_ROUTING_DOMAIN_HERE`, adding in your domain from the Azure portal.

   If you get an error like `ERR_NAME_NOT_RESOLVED`, wait a few minutes and try again.  DNS changes can take a while to propagate to all the DNS servers involved.

   If you get a different error like a `404`, check if all the pods, services, and ingress are running.

Troubleshooting Services
------------------------

For some reason, it doesn't work.  Is the issue with the Ingress?  With the frontend service?  With the backend deployment?  What happened?  Let's skip over earlier components and make sure later components are working.

### Connect to the pod

1. `kubectl get all,ing`, locate the name of the pod you'd like to connect to.  In this example I'll choose a frontend pod.

2. `kubectl port-forward pod/frontend-YOUR_POD_NAME 3000:3000`

    This tells Kubernetes to setup a tunnel from `localhost` to the pod directly, skipping the service and ingress.

3. Browse to http://localhost:3000/

4. Hit cntrl-c to stop the port-forward

Did the pod come up?  If so, the problem is with the service or the ingress.  If not, the problem is with the pod or the deployment.

### Connect to the service

1. `kubectl port-forward service/frontend 3000:3000`

   This tells Kubernetes to setup the tunnel from `localhost` to the service, and the service will round-robin across the pods.

2. Browse to http://localhost:3000/

3. Hit cntrl-c to stop the port forward

Did the service come up?  If so, the problem is with the ingress or DNS.  If not, the problem is with the link between the service and the deployment.
