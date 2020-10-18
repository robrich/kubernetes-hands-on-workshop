Rolling Update
==============

Let's imagine we need to update the front-end site with zero down-time.

A new requirement has come in.  Instead of "Votes", they want the site to say "Likes".


Step 1: Modify the code
------------------------

1. In the code for exercise 04-A-bigger-site, open the file `frontend/views/index.hbs` in a text editor.

2. Change the word "Votes" to "Likes".

3. Save the file.


Step 2: Build the new image
---------------------------

1. Open a terminal into exercise 4's frontend folder.

2. Run this build command:

   ```
   docker build --tag frontend:0.2 .
   ```

   This makes the new image version 0.2


Step 3: Update the deployment
-----------------------------

1. In the code for exercise 10-A-bigger-site, open the file `frontend/deployment.yaml` in a text editor.

2. Change both references in frontend's deployment.yaml from ~~`0.1`~~ to `0.2`.


Step 4: DevOps Pipeline
-----------------------

Here's where you'd commit these changes to source control, push them to the server, let the build server create the new images, and push them to your container registry of choice.  Let's assume that worked, and continue on.


Step 5: Schedule the new content
--------------------------------

1. Open a terminal into exercise 10's frontend folder.

2. Run this command:

   ```
   kubectl apply -f deployment.yaml
   ```

   `kubectl apply` is either a create or an update depending on if the content already exists.

3. Run this:

   ```
   kubectl get all
   ```

   If you're really fast, you can see a new pod getting created, then the old pod terminating, then another new pod getting created, then the last old pod terminating.

4. Refresh the frontend website.  Nope, it never went down.

5. `describe` some of the pods, deployments, and services and see what changed.


Step 6: Rollback
----------------

Aaah!  Someone wasn't ready.  "Roll it back!"

1. From a terminal, run:

   ```
   kubectl rollout undo deployment/frontend-deployment
   ```

2. Use `kubectl get all` to watch the rolling deployment put the old image version back into fresh pods.

   Can we get the old pods back?  Nope.  They're ephemeral -- they really got deleted.

3. Refresh the front-end website.  It now says "Votes" again.

Note:  If we undid again, we'd put 0.2 back.  Undo a third time and we'll be on 0.1.


Step 7: Re-deploy
-----------------

So we're now ready.  Let's re-deploy version `0.2`.

1. Run:

   ```
   kubectl apply -f deployment.yaml
   ```

2. Use `kubectl get all` to watch the rolling deployment create fresh pods with version `0.2`.

3. Refresh the front-end website and see the new content.
