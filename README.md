<p align="center">
    <a href="https://cloud.ibm.com">
    <img src="https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg" alt="IBM Cloud">
    </a>
    <img src="https://img.shields.io/badge/platform-node-lightgrey.svg?style=flat" alt="platform">
    <img src="https://img.shields.io/badge/license-Apache2-blue.svg?style=flat" alt="Apache 2">
</p>

# Create and deploy a Test Answer Store Application

This application contains the basic operations to test an Answer Store attached to Watson Assisant using the PRE and POST webhook feature.

You can access the cloud native microservice capabilities at the following endpoints:

- Health endpoint: `/health`

## Steps

You can deploy this application to IBM Cloud or [build it locally](#building-locally) by cloning this repo first. Then you can follow the Answer Store Steps to configure Watson Assistant and this sample Answer Store [here](#Answer-Store-Steps)

## Pre-requisites

Login to IBM Cloud and create an instance of a `Cloudant` database, then check the service credentials and keep the `CLOUDANT_URL` and `CLOUDANT_APIKEY` to enter in the toolchain form (if you deploy via button), or to add in the `.ENV` file

### Deploying to IBM Cloud

<p align="center">
<a href="https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/foward/answer_store_watson&branch=master"><img src="https://cloud.ibm.com/devops/setup/deploy/button.png" alt="Deploy to IBM Cloud"></a>
</p>

Click **Deploy to IBM Cloud** to deploy this same application to IBM Cloud. This option creates a deployment pipeline, complete with a hosted GitLab project and a DevOps toolchain.

[IBM Cloud DevOps](https://www.ibm.com/cloud/devops) services provides toolchains as a set of tool integrations that support development, deployment, and operations tasks inside IBM Cloud.

### Building locally

To get started building this application locally, you can either run the application natively or use the [IBM Cloud Developer Tools](https://cloud.ibm.com/docs/cli?topic=cloud-cli-getting-started) for containerization and easy deployment to IBM Cloud.

#### Native application development

- Install the latest [Node.js](https://nodejs.org/en/download/) 12+ LTS version.

Once the Node toolchain has been installed, you can download the project dependencies with:

```bash
npm install
```

Please rename the `.env.EXAMPLE` to `.env` and add the `CLOUDANT_URL` and `CLOUDANT_APIKEY`.

To run your application locally:

```bash
npm run start
```

Your application will be running at `http://localhost:3000`. You can access the `/health` endpoint at the host. You can also verify the state of your locally running application using the Selenium UI test script included in the `scripts` directory.

## Answer Store Steps

### Using pattern Actions + Answer Store

In order to implement this pattern, we need to setup some things first:

1. Create your Watson Assistant Plus instance
2. Create a Cloudant NoSQL Database with authentication method: "IAM and Legacy Credentials" (https://cloud.ibm.com/catalog/services/cloudant)
3. Install locally or in the cloud the Test Answer Store (https://github.com/foward/answer_store_watson)
4. Setup a IBM Cloud Function to implement the Post-message webhook
5. Create a Watson Language Translator Service in your IBM Cloud account

Now that we have all the prerequisites, we need to understand the flow:

1. The user is going to ask something using the UI of Watson Assistant in a different language, like Spanish, saying "Hola que tal?".
2. As our Watson Assistant Dialog is trained in English, we need to identify and translate the input from the user using our Pre-message webhook, as we saw in the Strategy 1.
3. With the Input from the user translated to English, in this case "Hello how about?" , Watson Assistant will identify the right intent of the utterance, and will trigger the right Dialog Node, in this case, in our example we have a node called "Greet", trained with greet intents.
4. Then Watson Assistant will return an output, which we have intentionally written "WELCOME". This will be our AnswerID or Key to search the right answer unit in our Answer Store Database.
5. Now we need to run our Answer Store UI to create an answer unit with the AnswerID equals to "WELCOME" in Spanish. Please remember that as we have identified the language, this is coming in a language code from Watson Language Translator, so in order to maintain the same we create with the language code "es" (you can take a look on other language codes here: https://cloud.ibm.com/apidocs/language-translator#identify) .
   5.1) Other option without deploy the Test Answer Store is to create manually the answer unit docs in the Cloudant DB Dashboard. Just check the format of the Answer Unit and modify and add new documents in Cloudant.
6. Great!, now we have our first answer store with the text "Bienvenido desde el Answer Store!" to return to the user in Spanish.
   7)  Now we can add more responses for the same answerID "WELCOME" in another language. Remember that the answerID must be unique and the same as is in our Answer Store DB. Lets add a greet in German (de) and English (en).
7. Now that we have all set, we need to create the post-message webhook to call the database to query the answerID plus the language code.
8. Lets jump to IBM Cloud functions (https://cloud.ibm.com/functions/). If you don't have experience with this don't worry is going to be easy and fun. Create an Action (https://cloud.ibm.com/functions/create/action) where the action name we can name it as : "post-webhook" and we can leave the Default package with the runtime with Node.js 12 as the following picture:
9. Now we need to implement the function to call the Cloudant Database that you have created before to use the Test Answer Store UI. For this we need the Cloudant URL. This you can find it under the Service Credentials section:
10. Lets back to the IBM Cloud Function screen, and paste the following code https://raw.githubusercontent.com/foward/answer-store-watson/master/cloud_functions/post-message/post-output-message.js (Please remember that you should change the Cloudant URL and Watson Language Translator URL)
    it should looks like this:
    You can run it using the expected parameter coming from Watson Assistant, this is one example:
    ```
       {
            "payload" : { "output" : 
                {  
                    "generic" : 
                    [
                            {
                              "response_type": "text",
                              "text": "WELCOME"
                            }
                     ]
                  }
              }
            }
    ```
11. Now we need to enable the Cloud function as Web Action in order to be called by Watson Assistant. Lets go to the section Endpoints and mark the checkbox "Enable as Web Action" and click the Save button. Copy the HTTP method URL with Auth Public, e.g https://eu-de.functions.appdomain.cloud/api/v1/web/youraccount_resource-group/default/post-webhook . It should looks like this:
12. We are almost there!. Lets go back to the Watson Assistant to configure our post-message webhook.  To enable and configure, in the assistants page, select the Assistant that you want to configure the webhook and click on "Settings".
    Then we can click on the left side menu the "Webhooks" section and select the Post-message webhook link. There we enable the webhook and we copy the Cloud function URL from the point 12. The options Secret you can write whatever you want, as is required, but in our basic implementation, the cloud function implemented doesn't need an authentication secret, but it should.

13. Finger cross, now we have everything in place to run our solution! ... Open a preview on watson assistant and write in spanish "hola que tal?"... 
    Tada! we have our dialog identifying the language, translating the input of the user from Spanish to English, then Watson Assistant sending the output to the user, then we intercepted with our post message webhook which calls the cloudant DB to retrieve the answer Unit containing the text in Spanish, which is in this case: "Bienvenido desde el Answer Store!". You can also ask in german "Hallo wie geths?" which means the same and as we added an answer unit in German is responding with the text from the answer store: "Herzlich Willkommen!"

### Troubleshooting:

During the execution or test of your multilingual chatbot, is good to have this tips if you are stuck:

- If you are developing your webhooks as cloud functions is good to see the logs in your console: 
  ibmcloud fn property set --namespace "NAMESPACE" 
  ibmcloud fn activation poll
- Disable Autocorrection for Multilingual Input, this will avoid to correct some word in other language and break the translation.
- Check the Assistant Analytics section to check the logs. There you can see what is received by the Post-message webhook as input from the pre-message webhook.
- if the output message is one word in uppercase like "WELCOME" it will not be translated by Watson Language Translator.
- if you use cloud function sequence, make sure that the last cloud function is returning the with the JSON Format:   return { body: params }

## Next steps

- Learn more about augmenting this Answer Store or Contact your sales representative to get the production ready Admin UI with Authentication, Role Based Actions, Search, Filter, Reporting and much more...

<p align="center">
    <a href="https://cloud.ibm.com">
        <img src="https://cloud.ibm.com/media/docs/developer-appservice/resources/ibm-cloud.svg" height="100" alt="IBM Cloud">
    </a>
</p>

## License

This sample application is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
