import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user : "postgres",
  host: "localhost",
  database:"permalist",
  password: "welcome123",
  port: 5432
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {

  const result = await db.query("SELECT * FROM todolist ORDER BY id ASC"); 

  items = result.rows;
  
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });

});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  var id;

  if(items.length==0){ 
    id =1;
  }
  else{
    id = items[items.length-1].id + 1;
  }

  try{
    await db.query("INSERT INTO todolist (id, title) VALUES($1,$2)",[id,item]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {

  try{
    await db.query("UPDATE todolist SET title = $1 WHERE id =$2",[req.body.updatedItemTitle,req.body.updatedItemId]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }

});

app.post("/delete", async (req, res) => {

  try{
    await db.query("DELETE FROM todolist WHERE id = $1",[req.body.deleteItemId]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
