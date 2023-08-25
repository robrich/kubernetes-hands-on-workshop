Installing Docker Desktop
=========================

We're going to install Docker Desktop, and turn on Kubernetes mode.  If you can't get Docker Desktop running or are burdened by licensing issues, with slight variations, you can use [Podman](Podman.md), [Minikube](Minikube.md), or [other runtimes](Other-runtimes.md) instead.  Note that Docker Desktop is far-and-away the easiest.


Install Docker Desktop for your OS
----------------------------------

### Linux

1. Visit https://docs.docker.com/desktop/install/linux-install/ to ensure you have the requirements necessary.

2. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/) and install as you would any Linux app.

Follow the instructions on https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/ to install `kubectl`.


### Mac

1. Visit https://docs.docker.com/docker-for-mac/install/#what-to-know-before-you-install to ensure you have the requirements necessary.

2. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/) and install as you would any Mac app.

   ![Mac Install](mac.png)


### Windows

1. Turn on virtualization in the bios.  Every bios is different, so you'll need to search for the specifics.

   ![Windows Install](windows.gif)

2. Install Windows Subsystem for Linux version 2.  See also https://docs.microsoft.com/en-us/windows/wsl/install-win10

   Run these commands in an admin terminal:

   ```
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

   Install https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

   Run these commands in an admin terminal:

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

4. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) and install as you would any Windows app.

5. Carefully pick "Linux Containers mode" when prompted.

6. Gratuitous reboots.


### Docker in a VM

If you're installing Docker in a VMware Workstation VM, see [this post](https://communities.vmware.com/thread/498837) to get a VMware Workstation virtual machine to run Docker.  This assumes you've enabled virtualization on the host's bios so you can run VMware.

If you're installing Docker in a Windows VM running inside Parallels on your mac, see [this post](http://tattoocoder.com/configure-docker-for-windows-under-parallels/) to configure Parallels for nested virtualization.

If you're not in a VM, you can skip this section.


Verify it Works
---------------

1. Ensure you're in Linux containers:

   In the system tray (by the clock), right-click on the whale icon, and ensure it says "Switch to Windows Containers".  If you find an option that says "Switch to Linux Containers", select this option.

2. Ensure Docker works:

   From a command prompt / terminal, type:

   ```
   docker --version
   ```

   then type

   ```
   docker run hello-world
   ```

   If you don't see an error message, it worked.


Enable Kubernetes Mode
-----------------

1. In the Task tray (bottom-right on Windows, top-right on Mac), click on the whale icon, and choose settings.

2. Switch to the Kubernetes tab, enable Kubernetes, and click apply.  The first time you do this it'll take a good while to download all the containers and start the Kubernetes control plane.

   ![Kubernetes mode](kubernetes-mode.png)

### **Don't have the Kubernetes tab?**

- If you don't have the Kubernetes tab in your Docker settings, upgrade your version of Docker.

- If running Docker Desktop on Windows, ensure you're in Linux Containers mode. Right-click on the whale icon, "Switch to Linux Containers".  If it says "Switch to Windows Containers" you're in the right place.


Verify kubectl works
--------------------

`kubectl` is the command-line for Kubernetes, and was installed by Docker when you enabled Kubernetes mode.

From a command prompt / terminal, type:

```
kubectl version
```

If this returns a result for both client and server, you've succeeded!

```
kubectl config get-contexts
```

Ensure the selected context is "docker-desktop".  If it isn't, run this:

```
kubectl config use-context docker-desktop
```


Start downloading docker images
-------------------------------

Downloading docker images takes a while, so let's kick this off so we make sure they exist when we need them:

**Note**: Running on Windows?  Ensure you're in Linux mode.  Right-click on the docker system tray icon, and choose "Switch to Linux Containers".  If it says "Switch to Windows containers" you don't need to do anything, you're already there.

1. `docker pull node:alpine`
2. `docker pull mcr.microsoft.com/dotnet/sdk:7.0-alpine`
3. `docker pull mcr.microsoft.com/dotnet/aspnet:7.0-alpine`

If you get an error about throttled docker pull requests, change the commands to this:

1. ```
   docker pull robrich.azurecr.io/node:alpine
   docker tag robrich.azurecr.io/node:alpine node:alpine
   ```
2. ```
   docker pull robrich.azurecr.io/dotnet-sdk:7.0-alpine
   docker tag robrich.azurecr.io/dotnet-sdk:7.0-alpine mcr.microsoft.com/dotnet/sdk:7.0-alpine
   ```
3. ```
   docker pull robrich.azurecr.io/dotnet-aspnet:7.0-alpine
   docker tag robrich.azurecr.io/dotnet-aspnet:7.0-alpine mcr.microsoft.com/dotnet/aspnet:7.0-alpine
   ```

You're ready
------------

Now that everything is running smoothly, you're ready to begin learning.  Head to chapter 1, and the geek in front of the room will start teaching.

