var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Gobby911!",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
   start();
  });

// function which prompts the user for what action they should take
function start() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter id of item you wish to purchase"
        },
        {
            name: "amount",
            type: "input",
            message: "How many items do you wish to purchase?"
        }
    ]).then(function (answ) {
            console.log("connected to Bamazon \n");
            itemCheck(answ.id, answ.amount);
            
        });
        // if id exists and quantity > requested amount
        // adjust db and console.log cost
        // else{
        // console.log("Order cannot be completed- insufficient quantity!");
        // }
    };
    
    // function readProducts() {
    //     console.log("Selecting all products...\n");
    //     connection.query("SELECT * FROM products", function(err, res) {
    //       if (err) throw err;
    //       // Log all results of the SELECT statement
    //       console.log(res);
    //       connection.end();
    //     });
    //   }
    
    // looks up item's id and checks if quantity > requested amount
    itemCheck = function (id, amount) {
        connection.query(
            "SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: id,
            },
            function (err, res) {
                console.log(res[0].stock_quantity);
                if (err) {
                    throw err
                };
                // if amount stocked is greater or equal to amount requested
                if (res[0].stock_quantity > amount) {
                    // run function for order successfully fulfilled
                    orderFulfilled(id, amount);
                } else {
                    console.log("Order cannot be completed- insufficient quantity!");
                }
            }
        )
    };
    
    // adjusts db, calc and log cost
    orderFulfilled = function (id, amount, current_quantity) {
        console.log("You purchased "+amount+" items with id "+id+"!");
        var query = connection.query(
            "UPDATE products SET ? Where ?",
            [
                {
                    stock_quantity: current_quantity - amount   
                },
                {
                    item_id: id
                }
            ]
        )
    };
    

