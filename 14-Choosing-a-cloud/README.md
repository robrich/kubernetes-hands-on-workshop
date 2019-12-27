Choosing a Cloud
================

There are 3 main cloud providers:

- [Microsoft Azure](https://azure.com)
- [Google Cloud](https://cloud.google.com/)
- [Amazon Web Services](https://aws.amazon.com/)

There are also many private clouds from companies like CloudFoundry, IBM, Adobe, VMware, Rackspace, Red Hat, Oracle, etc, etc.

The big 3 cloud providers all provide:

- Free trials (credit card required to make sure you're a human)
- Free tier products for lower-bandwidth needs
- Pricing calculators to help you estimate your spend

In general, all cloud providers provide the basic services:

- VMs
- File Storage
- Databases
- Container orchestration
- Website hosting for various platforms
- Turnkey experiences for various online properties (e.g. WordPress)

In general, they all follow each others' pricing strategies to ensure their products are competitive.  The result is cloud prices are usually the same across clouds.

So why would you choose one cloud provider over another?

- Brand preference or avoidance
- You're already using their other services
- Specialty features like AI, video encoding, or mobile device integration
- Familiarity or recommendations

So which cloud should you choose?  I recommend you walk into the IT department, say "Azure" and "AWS", and some eager soul will explain to you the benefits of their favorite cloud for about an hour.  I completely agree -- that's the correct cloud for you.

... but since we need an opinion in this course, I choose Azure.  As of this writing, Azure has the ["Industry's best Kubernetes experience"](https://azure.microsoft.com/en-us/blog/kubernetes-on-azure/).  Spinning up a cluster is drop-dead easy.  Publishing containers is easy.  Building a DevOps pipeline for containers is easy.

But once you have the cluster running, 90% of the tasks we'll do in this course will be identical for every cloud.  Squint hard, tilt your head sideways, search a lot, and you can probably do the rest of this course on your favorite public or private cloud too.
