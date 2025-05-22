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

6. If you changed it to ~~0.2~~ during the rolling update excercise, change the version back to in `frontend/deployment.yaml` to `0.1` in all places.


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

   **It didn't work.**  Our cluster isn't running on `localhost`, it's running in the cloud.


Proxy to the Service
--------------------

1. Let's proxy into the service and verify it's running

   ```
   kubectl port-forward service/frontend 3000:3000
   ```

2. Open a browser to localhost:3000

This verifies the service in the cloud is working and forwarding traffic to the pods.

If it didn't work, return to chapter 10 and debug the failures.

3. Hit Cntrl-C to break out of the port-forward.


Ingress
-------

Ingress routes traffic through the Azure load balancer associated with the Azure Kubernetes Cluster into our services.  Unlike services of type `LoadBalancer`, an `Ingress` can route traffic to many services based on a unique subdomain or url path.

1. Make up a fun subdomain for your website that doesn't exist.

   I'll makeup `frontend.robrich.org`

2. Create a new file in the frontend folder named `ingress.yaml`.

3. Make up a ficticious domain name or use a personal or corporate domain name.  For today's example, we can use the `/etc/hosts` file to make any domain route the way we expect.

   I'll use `robrich.org` for my domain name.  You may choose `example.com` or `my-company.com` or any domain.

   In a production scenario, we'd need to update DNS to point an A record to the ingress's IP address.  Today, we'll avoid the DNS update by making a local-computer override instead.

4. Add this content:

   ```
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: frontend
     labels:
       name: frontend
   spec:
     ingressClassName: nginx
     rules:
     - host: frontend.YOUR_DOMAIN_HERE # <-- set your domain here or remove this line
       http:
         paths:
         - pathType: Prefix
           path: "/"
           # note this `backend` isn't our image name
           # but rather a keyword noting the k8s service behind the ingress
           backend:
             service:
               name: frontend
               port:
                 number: 3000
   ```

   Ensure you replace ~~`YOUR_DOMAIN_HERE`~~ with the domain you chose above.  It doesn't need to be a real domain.  We'll use `/etc/hosts` to make it work locally.

   This sets up DNS rules to get traffic from the internet on port 80 into the service named `frontend` on port `3000`.  One could also route https traffic, specifying a certificate stored as a Kubernetes secret, though this is beyond the scope of this course.

   The line `ingressClassName: nginx` tells Kubernetes to use the Nginx ingress controller.  If using different ingress technologies you may need different configuration.

5. Schedule this ingress:

   ```
   kubectl apply -f ingress.yaml
   ```

6. Get all:

   ```
   kubectl get all
   ```

   Ingress details are not in the list of "all" resources.  To show "everything and ingress", we'll need a new command:

   ```
   kubectl get all,ing
   ```

7. At this point, we'd head to CloudFlare, DNSimple, or your DNS provider and add a DNS entry for the new domain name to point to the Cluster's External IP we got at the end of Chapter 15.  We're going to skip that step and do it locally instead.

   - Get the public IP:

     ```
     kubectl get svc --namespace ingress-nginx
     ```

     Note the `EXTERNAL-IP` in the `ingress-nginx-controller` service

   - Open the hosts file:

     - Mac or Linux: sudo open `/etc/hosts`
     - Windows (including WSL2): Open Notepad as administrator then open `C:\Windows\System32\drivers\etc\hosts`

   - Modify the hosts file:

     add a line to route the External IP directly to your new hostname:

     ```
     123.45.67.8  frontend.YOUR_DOMAIN_HERE
     ```

     swap in the correct public IP and domain

8. Now let's try it out.  Browse to the URL you formed above: `http://frontend.YOUR_DOMAIN_HERE`, adding in your domain chosen above.

   **Note**: It's important we browse to `http` and not ~~https~~.  We haven't rigged up SSL support here.

   If you get a different error like a `404`, check if all the pods, services, and ingress are running.

9. Remove the line added to `/etc/hosts` and save the file.


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

   This tells Kubernetes to setup the tunnel from `localhost` to the service, and the service will round-robin across the pods.  This skips ingress.

2. Browse to http://localhost:3000/

3. Hit cntrl-c to stop the port forward

Did the service come up?  If so, the problem is with the cluster forwarding to ingress, ingress forwarding to the service, or DNS.  If not, the problem is with the link between the service and the deployment.

See https://kubernetes.github.io/ingress-nginx/deploy/#local-testing for tips on using curl to inject a hostname header to a specific IP and port-forwarding into the Nginx Ingress controller.
