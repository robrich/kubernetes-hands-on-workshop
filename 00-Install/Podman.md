Installing Podman Desktop and Kind Kubernetes Cluster
=====================================================

[Docker Desktop](README.md) is definitely the easiest tool to learn. But if you have concerns with licensing Docker Desktop, you can use alternate systems.  With minor adjustments, this course will work with **Podman**.

[Podman](https://podman.io/) is *almost* a drop-in replacement for Docker.  Let's get Podman setup.


Podman Prerequisites
--------------------

### Linux and Mac

Podman setup is very simple.  Skip the Windows-only section and start installing Podman and Podman Desktop.

### Windows-only

Podman integrates into WSL 2.  Before we install Podman, we need to first setup WSL, enable v. 2, and install Ubuntu.


1. Turn on virtualization in the BIOS.

   Inside your booted Windows machine, open the Task Manager, switch to the Details tab, and switch to the Performance tab. Does it say `Virtualization: Enabled`? If so, this step is already done. If it says `Virtualization: Disabled` you first need to enable virtualization in the BIOS.

   Every BIOS is different, so you'll need to search for the specifics as you boot up your machine.

   ![Windows Install](windows.gif)

2. Install Windows Subsystem for Linux version 2.  See also https://docs.microsoft.com/en-us/windows/wsl/install-win10

   Run these commands in an elevated, administrator terminal:

   ```
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

   Install https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

   Run these commands in an elevated, administrator terminal:

   ```
   wsl --set-default-version 2
   wsl install Ubuntu
   ```

3. Is your WSL distribution version 2?

   Check your version:

   ```
   wsl --list --verbose
   ```

   If it's not version 2:

   ```
   wsl --set-version Ubuntu 2
   ```

   Replace Ubuntu with your Linux package name.


Installing Podman and Podman Desktop
------------------------------------

1. Download Podman CLI from https://github.com/containers/podman/releases and install it.

2. Download Podman Desktop from https://podman-desktop.io/downloads and install it.

3. Download kubectl from https://kubernetes.io/docs/tasks/tools/#kubectl and put it in your `PATH`.  In Windows, the easiest way may be to move kubectl.exe to the `C:\Program Files\RedHat\Podman` directory.

4. Reboot your machine to update your PATH with the new Podman directory.


Installing Podman Extensions
----------------------------

1. Open Podman Desktop

2. In the very bottom-left corner, click "Compose" and follow the prompts to install this plugin.

3. On the the bottom-left, click "Kind" and follow the prompts to install this plugin, but don't start a kind cluster.

4. Click the Dashboard icon in the very top-left corner to switch to the dashboard.

5. In the main screen, change the drop-down from "Initialize" to "Initialize and Start"  Then click it to build and start the Podman container runtime environment.

6. Open a terminal in any directory and run this:

   ```
   podman machine set --rootful
   ```

   To run a Kind cluster inside Podman requires rootful priviledges -- e.g. it uses ports less than 1024.

7. As noted in the terminal messge, restart the Podman cluster:

   a. Open Podman Desktop.

   b. Click the Settings (gear) icon on the bottom-left.

   c. Switch to the Resources tab.

   d. In the section marked Podman Desktop, click the restart button (arrow).


Installing docker shim
----------------------

This course (and most tutorials) use `docker` instead of `podman` as the command to build and run containers.  We'll create a shim so when you run `docker` it actually runs `podman` behind the scenes.  Note that your machine will now have a "docker" command available, but it won't have Docker Desktop installed.

### Linux and Mac

1. Open a terminal.

2. Locate `podman`:

   ```
   which podman
   ```

   This returns the path to the podman app

3. `cd` to that directory

4. Become root:

   ```
   sudo su
   ```

   and log in

5. Create a symlink:

   ```
   ln -s podman docker
   ```

   This means that when you type `docker` it will forward to `podman`.

### Windows

1. Open Windows Explorer

2. Open the Podman install directory: `C:\Program Files\RedHat\Podman`

3. Copy `podman.exe` and paste into the same directory

4. Rename the new ~~`podman Copy.exe`~~ to `docker.exe`


Creating Kind Kubernetes Cluster
--------------------------------

We're specifically not using the button inside Podman Desktop because we want more ports forwarded from the host machine into the Kubernetes cluster.

1. If you haven't already done so, clone this repository to your local machine.

2. Open a terminal in this `00-Install` directory and run the following:

   ```
   kind create cluster --name=kind-cluster-control-plane --config=kind.yaml
   ```

   If you get an error creating the cluster, double-check that `kind.yaml` exists in the current folder, that you've installed the Kind plugin to Podman, and that no Kind cluster currently exists in Podman's Settings -> Resources window.

3. Open Podman Desktop, and in the bottom-left corner, choose `kind-cluster-control-plane` as your current context.


Verify it Works
---------------

1. Ensure the fake docker command works:

   Open a terminal in any directory and type:

   ```
   docker --version
   ```

   then type

   ```
   docker run hello-world
   ```

   If you don't see an error message, it worked.

2. Ensure kubectl works

   Open a terminal in any directory and type:

   ```
   kubectl version
   kubectl cluster-info
   kubectl get all
   ```

   If you don't see an error message, it worked.

3. Ensure docker-compose works:

   Open a terminal in any directory and type:

   ```
   docker-compose --help
   ```

   If you don't see an error message, it worked.


Adjusting the Courseware
------------------------

When you tag an image, Docker uses the exact name you specify.  By comparison, Podman changes the tag to prefix `localhost/`.  See https://github.com/containers/podman/issues/16428 and https://github.com/containers/buildah/issues/1034  Throughout this course, you'll need to change every image name reference to add the `localhost/` prefix.  This includes docker-compose.yaml files and Kubernetes pod and deployment yaml files.

Podman doesn't include a built-in Kubernetes runtime.  Rather it uses Kind, a cluster inside a container.  Therefore, to run an image in Kubernetes, you first need to copy it from the Podman cluster to the Kind Kubernetes cluster.  If you don't do this each time you'll get an `ImagePullBackOff` error.


Start downloading docker images
-------------------------------

Once all the tools are installed, you're good to start pulling images.  In the main README, go to the section marked ["Start downloading images"](README.md#start-downloading-docker-images) and run the `docker pull ...` commands.
