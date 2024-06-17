Rolling Updates in Azure Kubernetes Service
===========================================

We've got the cluster running in Kubernetes.  We're accepting traffic.  The site is working great.  Now let's experience the rolling update procedure in Azure.

**Note:** Look to exercise 11: Rolling Update for clues to complete each task.

1. If you haven't already, change the code and rebuild the `frontend:0.2` image.

2. Tag the image to include the Azure Container Registry url, including the `latest` tag.

3. Push both the `frontend:0.2` and `frontend:latest` images to Azure Container Registry.

4. Modify `frontend/deployment.yaml` to update the image version in both places.

5. Use `kubectl` to apply the new `frontend/deployment.yaml` file into Azure.

6. Use `kubectl` to get all the things and see the new pods spin up and the old pods terminate.

7. Add a line to the `hosts` file to setup DNS locally.

8. Refresh the website and see the new content.

**Note:** Look to exercise 11: Rolling Update for clues to complete each task.
