Installing Docker Desktop
=========================

We're going to install Docker Desktop, and turn on Kubernetes mode.  If you can't get Docker Desktop running or are burdened by licensing issues you can use [Podman](Podman.md), [Minikube](Minikube.md), or [other runtimes](Other-runtimes.md) instead.  You'll need to customize the courseware in places to get these other tools to fit.  Note that Docker Desktop is far-and-away the easiest.


Install Docker Desktop for your OS
----------------------------------

### Linux

Follow the instructions on https://docs.docker.com/desktop/install/linux-install/ to install Docker Desktop and configure it for Linux.

1. Visit https://docs.docker.com/desktop/install/linux-install/ to ensure you have the necessary requirements.

2. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/) and install as you would any Linux app.

3. Download and install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).  Unlike Docker Desktop for Mac and Windows, Docker Desktop for Linux doesn't install kubectl for us.

Though you can use Docker Engine for the first few chapters, it doesn't provision a Kubernetes cluster, making later work harder.  You can use Docker Engine together with Minikube, k3s, Podman, or other runtime that will provision both a Docker build environment and a Kubernetes cluster.


### Mac

1. Visit https://docs.docker.com/docker-for-mac/install/#what-to-know-before-you-install to ensure you have the necessary requirements.

2. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/) and install as you would any Mac app.

   ![Mac Install](mac.png)


### Windows!

1. Virtualization enabled in the BIOS.

   In Windows, open the Task Manager, click on "more details" (if you're not there already), switch to the Performance tab, and click on CPU.

   [Task Manager](task-manager.png)

   Does it say `Virtualization: Enabled`?

   - If it says `Virtualization: Enabled`, this step is already done.
   - If it says `Virtualization: Disabled` you first need to enable virtualization in the BIOS.

   Every BIOS is different, so you'll need to search your manufacturer's site or your BIOS screens for the setting.  Here's an example BIOS screen; your computer's BIOS options will likely look very different.

   ![Windows Install](windows.gif)

2. Install Windows Subsystem for Linux version 2.  See also https://docs.microsoft.com/en-us/windows/wsl/install-win10  Note: these are instructions for Windows 10 and 11 Pro and Enterprise.  If you're using an earlier version of Windows or Windows Home, you can't use WSL2.

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

5. When prompted, carefully choose:

   - Pick "Linux containers mode"
   - Uncheck "Add Windows containers to this installation"

6. Gratuitously reboot.


### Docker in a VM

If you're not in a VM, you can skip this section.

- VMWare Workstation: Enable virtualization on the host, then on the guest turn on `Virtualize Intel VT-x/EPT or AMD-V/RVI`.

- Windows VM running inside Parallels on macOS: use the macOS version of Docker.  Nested virtualization is not enabled on Apple's Hypervisor.  See also https://kb.parallels.com/en/129497

- Windows ARM currently [doesn't support nested virtualization](https://kb.parallels.com/en/129497) so you can't use Windows ARM to run Docker Desktop.  See also https://kb.parallels.com/en/123975


Verify it Works
---------------

1. Ensure Docker Deskop is running:

   In the system tray (to the left of the clock, bottom-right corner on Windows, top-right corner on macOS), ensure you have the whale icon.  If the whale icon isn't there, you may need to start Docker Desktop.

2. Ensure you're in Linux containers:

   In the system tray (to the left of the clock), right-click on the whale icon, and ensure it says "Switch to Windows Containers".  If you find an option that says "Switch to Linux Containers", select this option.

   If you unchecked "Windows containers" as you installed Docker Desktop, you don't have this option, and you're already on Linux containers.

3. Ensure Docker works:

   From a command prompt / terminal, type:

   ```
   docker --version
   ```

   then type:

   ```
   docker run hello-world
   ```

   If you don't see an error message, it worked.

   If you see an error message about a broken pipe, you may need to start Docker Desktop and retry the command.


Enable Kubernetes Mode
----------------------

![Kubernetes mode](kubernetes-mode.png)

1. In the task tray (bottom-right corner on Windows, top-right corner on macOS), click on the whale icon.

2. Choose settings to open Docker Desktop settings.

3. Switch to the Kubernetes tab.

4. Enable Kubernetes mode

5. On the bottom-right, click `Apply and Restart`.

   The first time you do this, it'll take a good while to download all the containers and start the Kubernetes control plane.

6. You'll know Kubernetes mode is ready when you see `Kubernetes is running` on the bottom-left corner of Docker Desktop and in the menu from the whale icon.

### **Don't have the Kubernetes tab?**

- If you don't have the Kubernetes tab in your Docker settings, upgrade your version of Docker.

- If running Docker Desktop on Windows, ensure you're in Linux Containers mode. Right-click on the whale icon, "Switch to Linux Containers".  If it says "Switch to Windows Containers", you're already in the right place.  If you unchecked "Windows containers" as you installed Docker Desktop, you don't have this option, and you're already on Linux containers.


Verify kubectl works
--------------------

`kubectl` is the command-line tool for Kubernetes, and was installed by Docker when you enabled Kubernetes mode.

From a command prompt / terminal, type:

```
kubectl version
```

If this returns a result for both client and server, you succeeded!

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

**Note**: Running on Windows?  Ensure you're in Linux mode.  Right-click on the docker system tray icon, and choose "Switch to Linux Containers".  If it says "Switch to Windows containers", you don't need to do anything, you're already there.  If you unchecked "Windows containers" as you installed Docker Desktop, you don't have this option, and you're already on Linux containers.

1. `docker pull node:alpine`
2. `docker pull mcr.microsoft.com/dotnet/sdk:9.0-alpine`
3. `docker pull mcr.microsoft.com/dotnet/aspnet:9.0-alpine`

You're ready
------------

Now that everything is running smoothly, you're ready to begin learning.  Head to Chapter 1, and the geek in front of the room will start teaching.
