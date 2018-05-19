/**
 * Business logic that manages the accounting process
 * 
 * @autor Alex Vicente Chacon Jimenez (av.chacon10@uniandes.edu.co)
 * @since Node.js 6.10
 * @date 2018-03-01
 */

/**
 * Global variables 
 */
var doc = require('dynamodb-doc');
var docClient = new doc.DynamoDB();

/**
 * Main function
 * 
 * @param event AWS Lambda uses this parameter to pass in event data to the handler
 * @param context AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing
 * @param callback You can use the optional callback to return information to the caller, otherwise return value is null
 */
exports.handler = (event, context, callback) => {
    
    switch (event.httpMethod) {
        case 'GET':
            getIncomes(event, callback);
            break;
        default:
            unsupportedMethod(callback);
    }
    
};

//--------------------
// Helper methods
//--------------------

/**
 * Get incomes from Dynamo bussiness logic function
 * 
 * @param event event data provided by the handler
 * @param callback Call back invocation function
 */
function getIncomes(event, callback) { 
    //
    // Accounting attributes  setup
    var params = {};
    params.TableName = "Accounting";
    
    //
    // Dynamo call back function
    var dynamoCallback = function(err, data) { 
        if (err)
            console.log(err, err.stack);
        else
        {
            callback(null, {
                  statusCode: 200,
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data)
            });
        }
    };

    docClient.scan(params, dynamoCallback);
}

/**
 * Unsupported http method bussiness logic function
 * 
 * @param callback Call back invocation function
 */
function unsupportedMethod(callback){
    callback(null, {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"resp":'Unsupported method "${event.httpMethod}"'})
    });
}