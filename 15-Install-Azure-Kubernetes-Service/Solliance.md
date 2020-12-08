Installation
============

Through the magic of the Solliance platform, you already have the tools configured for you:

1. Azure Kubernetes Service (AKS) runs containers on a managed Kubernetes instance.

2. Azure Container Registry (ACR) is a private image registry, not that unlike Docker Hub.

Both of these are already running.


Switch Kubernetes Context
-------------------------

Right now we're using the Kubernetes cluster running locally on the Azure VM.  To run the next examples, we need to switch to the AKS cluster.

1. List all your contexts:

   In a terminal window, run this command:

   ```
   kubectl config get-contexts
   ```

   You can see that the current context in use is `docker-desktop` and you have a second cluster ready to administer.

2. To switch to the Azure Kubernetes cluster:

   ```
   kubectl config use-context YOUR_NAME
   ```

   `YOUR_NAME` is the name of the cluster that Solliance's training platform built.  Mine is named `robrich` so I typed `kubectl config use-context robrich`.

3. Now let's get all the resources currently running:

   ```
   kubectl get all
   ```

   You'll see that nothing is running in AKS yet.  Perfect.


**Note**: After this exercise, if you'd like to switch back to the local instance you could run

```
kubectl config use-context docker-desktop
```

Now run `kubectl get all` and see the content we created previously.
