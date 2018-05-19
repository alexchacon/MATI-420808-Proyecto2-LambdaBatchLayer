/**
 * Business logic that manages the batch insert in the table accounting
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

exports.handler = (event, context, callback) => {
    
    event.Records.forEach(function(record) {
        console.log('DynamoDB record to process: %j', record.dynamodb.Keys.ID.N);
        
        //
        // Setup query on table tickets
        var params = {
            "TableName" : "Tickets",
            "Key" : { 
                "ID" : parseFloat(record.dynamodb.Keys.ID.N)
            }
        };
  
        docClient.getItem(params, function(err, data) {
            if (err) {
                console.log(err);
            } 
            else {
                insertAccounting(data);
            }
        });
    });
    callback(null, "Accounting record inserted.");
};

//--------------------
// Helper methods
//--------------------

/**
 * Basic dynamo insert function to Accounting
 * 
 * @param data Ticket information
 */
function insertAccounting (data) {
    var quantity = data.Item.quantity;
    var cost = data.Item.cost;
    
    //
    // Accounting attributes setup
    var params = {};
    params.TableName = "Accounting";
    params.Item = {
        ID: Math.random(), 
        Type : "Income", 
        Value: quantity * cost, 
        CreatedDate:Date.now()
    };
    
    //
    // Dynamo data insert
    docClient.putItem(params, dynamoCallback);
} 

/**
 * Basic dynamo callback function
 * 
 * @param err Associated Dynamo access error
 * @param data Associated Dynamo return value when the process is executed correctly 
 */
function dynamoCallback(err, data) { 
    if (err)
        console.log(err, err.stack);
    else 
        console.log(data);
}