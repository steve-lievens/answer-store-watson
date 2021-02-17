<p align="center">
    <a href="https://cloud.ibm.com">
        <img src="https://cloud.ibm.com/media/docs/developer-appservice/resources/ibm-cloud.svg" height="100" alt="IBM Cloud">
    </a>
</p>

<p align="center">
    <a href="https://cloud.ibm.com">
    <img src="https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg" alt="IBM Cloud">
    </a>
    <img src="https://img.shields.io/badge/platform-node-lightgrey.svg?style=flat" alt="platform">
    <img src="https://img.shields.io/badge/license-Apache2-blue.svg?style=flat" alt="Apache 2">
</p>

# Create and deploy a Test Answer Store Application based on Node.js + Cloudant

This application was based on the <a href="https://cloud.ibm.com/developer/appservice/starter-kits/nodejs-+-cloudant"> Starter Kit Node.js + Cloudant </a>. Contains the basic operations to test an Answer Store attached to Watson Assisant using the POST webhook feature.

You can access the cloud native microservice capabilities at the following endpoints:

- Health endpoint: `/health`

## Steps

You can [deploy this application to IBM Cloud](https://cloud.ibm.com/developer/appservice/starter-kits/nodejs-+-cloudant) or [build it locally](#building-locally) by cloning this repo first. Once your app is live, you can access the `/health` endpoint to build out your cloud native application.

### Deploying to IBM Cloud

<p align="center">
    <a href="https://cloud.ibm.com/developer/appservice/starter-kits/nodejs-+-cloudant">
    <img src="https://cloud.ibm.com/devops/setup/deploy/button_x2.png" alt="Deploy to IBM Cloud">
    </a>
</p>

Click **Deploy to IBM Cloud** to deploy this same application to IBM Cloud. This option creates a deployment pipeline, complete with a hosted GitLab project and a DevOps toolchain. You can deploy your app to Cloud Foundry, a Kubernetes cluster, or a Red Hat OpenShift cluster. OpenShift is available only through a standard cluster, which requires you to have a billable account.

[IBM Cloud DevOps](https://www.ibm.com/cloud/devops) services provides toolchains as a set of tool integrations that support development, deployment, and operations tasks inside IBM Cloud.

### Building locally

To get started building this application locally, you can either run the application natively or use the [IBM Cloud Developer Tools](https://cloud.ibm.com/docs/cli?topic=cloud-cli-getting-started) for containerization and easy deployment to IBM Cloud.

#### Native application development

- Install the latest [Node.js](https://nodejs.org/en/download/) 12+ LTS version.

Once the Node toolchain has been installed, you can download the project dependencies with:

```bash
npm install
```

Please make sure you have the file `localdev-config.json` in the folder `server`, there you need to configure the cloudant credentials only for local developments, since in the cloud you need to attach the cloudant to this app.

To run your application locally:

```bash
npm run start
```

Your application will be running at `http://localhost:3000`. You can access the `/health` endpoint at the host. You can also verify the state of your locally running application using the Selenium UI test script included in the `scripts` directory.

#### IBM Cloud Developer Tools

Install [IBM Cloud Developer Tools](https://cloud.ibm.com/docs/cli?topic=cloud-cli-getting-started) on your machine by running the following command:

```
curl -sL https://ibm.biz/idt-installer | bash
```

## Testing, linting, and code coverage

### Running tests and code coverage

To run tests and code coverage, run `npm run test`. A `coverage` folder will be created with code coverage results that can be reviewed for gaps. The code coverage thresholds are also defined in `package.json` under `nyc` and can be adjusted if needed. Also, you can use the script `npm run fix` to automatically fix linting problems.

### Pre-commit hooks

By default, a [Husky](https://github.com/typicode/husky) pre-commit hook is defined in `package.json`, which runs linting, testing, and code coverage before the commit is made. If either the linting, testing, or code coverage fails, the pre-commit hook prevents the changes from being committed. Review the results and fix the problems, or modify the thresholds to allow the commit to succeed.

## Next steps

- Learn more about augmenting this Answer Store or Contact your sales representative to get the production ready Admin UI with Authentication, Role Based Actions, Search, Filter, Reporting and much more...
- Explore other [sample applications](https://cloud.ibm.com/developer/appservice/starter-kits) on IBM Cloud.

## License

This sample application is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
