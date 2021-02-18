/**
  *
  * main() will be run when you invoke this action
  *
  * @params JSON Object that comes from WA 
  * 
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
  *
  * @return The output of this action, which must be a JSON object and in the WA output format
  * 
  * The structure of the Answer Unit in the Cloudant DB, looks like this:
  * 
        {
          "_id": "WELCOME:es",
          "_rev": "1-375f4d60b95aed3669886a9ec0ee108f",
          "display_id": "WELCOME",
          "language": "es",
          "answerText": "Bienvenido!",
          "timestamp": "2021-02-18T16:06:52.658Z"
        }
  *
  */
function main(params) {
  // initialize Cloudant
  const CloudantSDK = require("@cloudant/cloudant");
  const cloudant = new CloudantSDK("<CLOUDANT_URL_FROM_SERVICE_CREDENTIALS>");

  //Check if the output from WA is not empty
  if (params.payload.output.generic[0].text !== "") {
    var languageCode = "es"; //this is comming from the WLT, possibly stored in the context
    //We need to build the search key in order to search in our DB the right answer unit for the languageCode identified
    var searchKey = params.payload.output.generic[0].text + ":" + languageCode;

    return new Promise(function (resolve, reject) {
      cloudant
        .use("mydb")
        .get(searchKey)
        .then((answerUnit) => {
          if (answerUnit) {
            const response = {
              body: {
                payload: {
                  output: {
                    generic: [
                      {
                        response_type: "text",
                        text: answerUnit.answerText,
                      },
                    ],
                  },
                },
              },
            };
            resolve(response);
          } else {
            // If there is no data from the DB, we return the same parameters as they entered

            const response = {
              body: params,
            };
            resolve(response);
          }
        });
    });
  } else {
    //If there is no data from the DB, we return the same parameters as they entered
    return {
      body: params,
    };
  }
}
