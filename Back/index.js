import express from "express"
import fs from "fs"
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname=dirname(fileURLToPath(import.meta.url));

const app=express();
const port=3000;
var backslash="\\";
var postspath=`${__dirname}${backslash}posts.json`;
const json=bodyParser.json;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended :true}));


app.get("/",(req,res)=>
{
    res.render("sign_up.ejs");
    // const _posts=getPosts();
    // res.render("index.ejs",
    //     {postsarr : _posts}
    // );
});
app.get("/home",(req,res)=>
{
    // res.render("sign_up.ejs");
    const _posts=getPosts();
    res.render("index.ejs",
        {postsarr : _posts}
    );
});
app.post("/sign_up",(req,res)=>{
   const username=req.body.email;
   const password=req.body.password;
   if(username==="Walid@asmaa" && password==="Asmaa")
   {
    // const _posts=getPosts();
    // res.render("index.ejs",
    //     {postsarr : _posts}
    // );
     res.redirect("/home");
   
   }
   else
   {
    //  res.render("sign_up.ejs");
    res.redirect("/");
   }
});

app.listen(port,(req,res)=>
{
    console.log(`port started  on ${port}`);
})

app.post("/add-post",(req,res)=>
{
   const titlepost=req.body["title"];
   const bodypost=req.body["content"];
   const post={titlepost,bodypost};
    savePosts(post);
  //  const _posts=getPosts();
    // const _posts=getPosts();
    // res.render("index.ejs",
    //     {postsarr : _posts}
    // );
    res.redirect("/home");
    // res.render("index.ejs",
    //     {postsarr : _posts}
    // );
});

app.post("/delete-post", (req, res) => {
  const index = parseInt(req.body.id);
  if (!isNaN(index)) {
    const data = fs.readFileSync(postspath, "utf8");
    let posts = JSON.parse(data);
    posts.splice(index, 1); // delete post at index
    fs.writeFileSync(postspath, JSON.stringify(posts, null, 2));
  }
//   res.redirect("/");
//  const _posts=getPosts();
//     res.render("index.ejs",
//         {postsarr : _posts}
//     );
res.redirect("/home");
});


app.post("/edit-post",(req,res)=>{
    const _index=parseInt(req.body.id);
    const _title=req.body.title;
    const _content=req.body.content;
    var data=getPosts();
    data[_index]["titlepost"]=_title;
    data[_index]["bodypost"]=_content;

    fs.writeFileSync(postspath,JSON.stringify(data,null,2));
    // res.redirect("/");
    //  const _posts=getPosts();
    // res.render("index.ejs",
    //     {postsarr : _posts}
    // );
    res.redirect("/home");
});





function savePosts(newPost) {
  let posts = [];

  if (fs.existsSync(postspath)) {
    const data = fs.readFileSync(postspath, "utf8");

    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        posts = parsed;
      } else {
        // Handle case where file contains a single object
        posts = [parsed];
      }
    } catch (err) {
      console.error("Invalid JSON, starting fresh.");
    }
  }

  posts.push(newPost);
  fs.writeFileSync(postspath, JSON.stringify(posts, null, 2));
}




function getPosts() {
  if (!fs.existsSync(postspath)) return [];
  return JSON.parse(fs.readFileSync(postspath, "utf8"));
}



