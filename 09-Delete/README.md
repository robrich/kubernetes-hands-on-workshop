Delete HelloNode
================

We had a blast creating the `hellonode` service, deployment, and pod.  Let's remove them all and get ready to deploy the bigger site.

Deleting
--------

1. Open a command prompt and navigate to the directory with `service.yaml`

2. Run:

   ```
   kubectl delete -f service.yaml
   ```

3. If necessary change directory to where you've saved `deployment.yaml`.

4. Run this:

   ```
   kubectl delete -f deployment.yaml
   ```

5. Verify everything is deleted

   ```
   kubectl get all
   ```

   If you hurry, you may see the pods getting terminated.  If so, re-run the command until everything is gone.

6. You should see the `kubernetes` service, but that's all.  See anything else?  Delete those as well.

You could also delete each thing by name, e.g. `kubectl delete hellonode-service`.

**Note:** Do **not** delete the `service/kubernetes` service.  This is the API we're sending `kubectl` commands to.  If this service is gone, the cluster is broken.  If you've done this, go to the task tray, open the Docker settings, choose Reset, and click `Reset Kubernetes Cluster`.
