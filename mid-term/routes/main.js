module.exports = function(app) {
    
    /**
     * Add the "/home" route to render the Home page
     */
    app.get("/home",function(req, res){
        res.render("index.html")
    });

    /**
     * Add the "/about" route to render the About page
     */
    app.get("/about",function(req, res) {
        res.render("about.html");
    }); 

    /**
     * Add the "/add-food" route to render the Add food page
     */
    app.get("/add-food",function(req, res) {
        res.render("add-food.html");
    });

    /**
     * Add the "/food-added" route to save a food item and display the result
     */
    app.post("/food-added", function (req,res) {
        // saving a food item data in database
        let sqlquery = "INSERT INTO foods (name, typicalval, unit, cals, carbs, fat, protein, salt, sugar) VALUES (?,?,?,?,?,?,?,?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.typicalval, req.body.unit, req.body.cals, req.body.carbs, req.body.fat, req.body.protein, req.body.salt, req.body.sugar];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }else{ // send an HTTP response object displaying the added data
                res.send(" This food is added to database, <br>Name: "+ req.body.name 
                + "<br>Typical values per: "+ req.body.typicalval
                + "<br>Unit: "+ req.body.unit 
                + "<br>Calories: "+ req.body.cals 
                + "<br>Carbs: "+ req.body.carbs
                + "<br>Fat: "+ req.body.fat 
                + "<br>Protein: "+ req.body.protein 
                + "<br>Salt: "+ req.body.salt 
                + "<br>Sugar: "+ req.body.sugar
                + "<br><br><a href='/topic7/mid-term/home'>Return to Home</a>");
            }            
        });
    });

     /**
     * Add the "/search-food" route to render the Search food page
     */
    app.get("/search-food",function(req, res) {
        res.render("search-food.html");
    });

    /**
     * Add the "/search-result-db" route to render the Search food page 
     * that displays the search result
     */
    app.get("/search-result-db", function (req, res) {
        //search a keyword that partially or fully matches in the database
        let word = [req.query.keyword];
        let sqlquery = "SELECT * FROM `foods` WHERE name rlike ?";
        // execute sql query
        db.query(sqlquery,word, (err, result) => {
            if (err) {
                return console.error("error: "+ err.message);       
            }else{  // pass the variable, availableFoods to front-end   
                res.render ('search-result.html',{availableFoods: result});
            }
        });
    });
    /**
     * Add the "/update-food" route to render the Update food page
     */
    app.get("/update-food",function(req, res) {
        res.render("update-food.html");
    });

    /**
     * Add the "/food-displayed" route to render the Update food page 
     * that displays the search result to be updated
     */
    app.get("/food-displayed", function (req, res) {
        //search a keyword that partially or fully matches in the database
        let word = [req.query.keyword];
        let sqlquery = "SELECT * FROM `foods` WHERE name rlike ?"; 
        // execute sql query
        db.query(sqlquery,word, (err, result) => {
            if (err) {
                return console.error("error: "+ err.message);       
            }else{    
                // pass the variable, availableFoods to front-end          
                res.render ('update.html',{availableFoods: result});
            }
        });
    });

    /**
     * Add the "/food-updated" route to update a food item data and display the result
     */
    app.post("/food-updated", function (req,res) {
        // update data in database
        let sqlquery = "UPDATE foods SET typicalval=" + req.body.typicalval + ", cals= " + req.body.cals + 
                        ", carbs=" + req.body.carbs + ", fat=" + req.body.fat + ", protein=" + req.body.protein + 
                        ", salt=" + req.body.salt + ", sugar = " + req.body.sugar + " WHERE id = " + req.body.id;
        // execute sql query
        let newrecord = [req.body.name, req.body.typicalval, req.body.cals, req.body.carbs, req.body.fat, 
                            req.body.protein, req.body.salt, req.body.sugar, req.body.id];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }else{ // send an HTTP response object displaying the updated data
                res.send(" The update operation has been completed. <br>Name: "+ req.body.name + 
                "<br>Typical values per: "+ req.body.typicalval +"<br>Unit: "+ req.body.unit + 
                "<br>Calories: "+ req.body.cals + "<br>Carbs: "+ req.body.carbs +
                "<br>Fat: "+ req.body.fat + "<br>Protein: "+ req.body.protein + 
                "<br>Salt: "+ req.body.salt + "<br>Sugar: "+ req.body.sugar +
                "<br><br><a href='/topic7/mid-term/home'>Return to Home</a>");
            }            
        });
    });

    /**
     * Add the "/food-deleted" route to delete a food item data and display the result
     */
    app.post("/food-deleted", function (req,res) {
        // delete data from database
        let sqlquery = "DELETE FROM foods WHERE id = " + req.body.id;
        // execute sql query
        let newrecord = [req.body.name, req.body.id];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }else{ // send an HTTP response object displaying the deleted food name
                res.send(" This food has been deleted, <br>Name: "+ req.body.name 
                + "<br>ID: "+ req.body.id        
                +"<br><br><a href='/topic7/mid-term/home'>Return to Home</a>");
            }            
        });
    });

    /**
     * Add the "/list-foods" route to render the List foods page with the DB query result 
     */
    app.get("/list-foods", function(req, res) {
        // query database to get all the food items
        let sqlquery = "SELECT * FROM foods";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                return console.error("error: "+ err.message);
            }     
            // sort the resulted food items by name
            result.sort(function(a, b) {
                var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }              
                // names must be equal
                return 0;
            });
            // pass the sorted result as availableFoods to frontend
            res.render("list-foods.html", {availableFoods: result});
        });
    }); 

    /**
     *  Add the "/list-calc" route to render the List foods page that displays the nutritional information
     */
    app.get("/list-calc", function(req, res) {
        // query database to get the selected food items
        let word = [req.query.ids]; // contains a list of food item IDs
        let sqlquery = "SELECT * FROM `foods` WHERE `id` IN "+req.query.ids;
        // execute sql query
        db.query(sqlquery,word, (err, result) => {
            if (err) {
                return console.error("error: "+ err.message);
            }else{
                // pass the variables, availableFoods and amount to front-end
                res.render("list-calc-nutrition.html", {availableFoods: result, amount: req.query.amount});
            }
        });
    }); 
   } 