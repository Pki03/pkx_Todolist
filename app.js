/*mujhe itna sab .then aur catch isliye karna pad raha hai kyuki callback allowed nahi hai */
/*lodash is used for converting to lower or upper case */



const express =require("express");
const bodyParser = require("body-parser");
const date = require(__dirname);
const _ = require("lodash")

const mongoose = require("mongoose");

const app = express();
let items = ["buy ketchup",
    "buy pizza",
    "smell oregano"] ;

let workitems = [];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

    var today = new Date();
    var x =today.getDay();
    
var options = {
    weekday:"long",
    day:"numeric",
    month:"long"

};

var day = today.toLocaleDateString("en-US",options);


mongoose.connect("mongodb://127.0.0.1:27017/lizzDB",{useNewUrlParser:true});

/*here we are making a schema */



/*here we are connectiing the schema with a model */

var itemschema = {name:String};

var Item = mongoose.model("Item",itemschema);

var item1 = new Item({name:"Welcome to Todolist web"});

var item2 = new Item({name:"Click the + button to add a new task"});


var defaultitems = [item1,item2];

/*creating a list schema for default */

var listschema = {name:String,items:[itemschema]};
const List = mongoose.model("List",listschema);


app.get("/", function(req, res){
    
    Item.find({})
       .then(foundItems => {
        if(foundItems.length===0)
        {
            Item.insertMany(defaultitems);
            res.redirect("/");

        }
        else
        {
             res.render("list", {listtitle: day, newlistitems: foundItems});    
        }
           
     })
       .catch(err => {
           console.log(err);
   });
 });


app.post("/",function(req,res)
{

    const itemname = req.body.newitem;
    const listname = req.body.list;
    const item = new Item({name:itemname});


    /*const list = new List({name:customlistname,items:defaultitems});*/

    if(listname===day)
    {
        item.save();
    
        res.redirect("/");


    }
    else
    {
        List.findOne({name: listname}).then(x => {
            
                

                x.items.push(item);
                x.save();

            res.redirect("/"+listname);
    
               
         })
           .catch(err => {
               console.log(err);
       });
    


    }


});
/*why the f*ck is callback not supported */
app.post("/delete",async(req,res)=>{
    try {
        const checkeditemid = req.body.checkbox;

        const listname = req.body.listname;

        if(listname===day)
        {
            const articles = await Item.findByIdAndRemove(checkeditemid);
            res.redirect("/");
      

        }
        else
        {
            List.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkeditemid}}}).then(y => {
            
                

               /* x.items.push(item);
                x.save();*/

            res.redirect("/"+listname);
    
               
         })
           .catch(err => {
               console.log(err);
       });
    

           

        }
/*{name:listname},{$pull:{items:{_id:checkeditemid}}} */

    } catch (err) {
      console.log(err);
    }
  });
/*
app.get("/:customlistname",async(req,res)=>{
    try 
    {

        const customlistname = req.params.customlistname;
        const list = new List({name:customlistname,items:defaultitems});
        list.save();

        const existing = await Item.findOne({name:customlistname});

        if(!existing)
        {
            console.log("doesnt exist")
            
        }
        else{console.log("exists")}

        
    

    } 
    catch (err) 
    {
      console.log(err);
    }
  });
*/
  
app.get("/:customlistname",function(req,res)
{
    const customlistname = _.capitalize(req.params.customlistname);
        /**/

    List.findOne({name: customlistname}).then(exist_or_not => {
        if(!exist_or_not)
        {
            
            const list = new List({name:customlistname,items:defaultitems});
        list.save();
        res.redirect("/"+customlistname);

        }
        else
        {
             res.render("list",{listtitle: exist_or_not.name, newlistitems: exist_or_not.items});
        }
           
     })
       .catch(err => {
           console.log(err);
   });

});







/*
app.post("/",function(req,res)
{
    let item = req.body.newitem;

    if(req.body.list==="work")
    {
        workitems.push(item);
        res.redirect("/work");
    }

    else{
        items.push(item);
        res.redirect("/");
    }

});
app.get("/work",function(req,res)
{
    res.render("list",{listtitle:"work",newlistitems:workitems});

});
*/

app.listen(3000,function(req,res)
{
    console.log("listening on 3000");
});