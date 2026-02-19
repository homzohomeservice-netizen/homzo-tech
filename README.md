<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Homzo Godhra Panel</title>

<style>
body{font-family:Arial;background:#f2f4f8;margin:0}
.container{padding:15px}
.card{background:#fff;padding:15px;margin-bottom:10px;border-radius:8px}
input,button{width:100%;padding:10px;margin:5px 0}
button{background:#007bff;color:#fff;border:none;border-radius:5px}
.hidden{display:none}
.job{border-left:5px solid #007bff}
h2{margin-top:0}
.topbar{background:#007bff;color:white;padding:10px;text-align:center}
.logout{background:red}
</style>
</head>
<body>

<div class="topbar">HOMZO GODHRA SYSTEM</div>

<div class="container">

<!-- LOGIN -->
<div id="login">
<h2>Login</h2>
<input type="text" id="loginId" placeholder="User ID">
<input type="password" id="loginPass" placeholder="Password">
<button onclick="login()">Login</button>
</div>

<!-- ADMIN PANEL -->
<div id="adminPanel" class="hidden">
<h2>Admin Panel</h2>

<div class="card">
<h3>Create Job</h3>
<input type="text" id="custName" placeholder="Customer Name">
<input type="text" id="area" placeholder="Area (Godhra)">
<input type="text" id="service" placeholder="Service Type">
<input type="number" id="price" placeholder="Total Price">
<button onclick="addJob()">Post Job</button>
</div>

<h3>All Jobs</h3>
<div id="adminJobs"></div>
<button class="logout" onclick="logout()">Logout</button>
</div>

<!-- TECH PANEL -->
<div id="techPanel" class="hidden">
<h2>Technician Panel</h2>
<div><b>Total Earnings:</b> ₹ <span id="earnings">0</span></div>
<div id="techJobs"></div>
<button class="logout" onclick="logout()">Logout</button>
</div>

</div>

<audio id="notifySound">
<source src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg">
</audio>

<script>

const users = {
  admin:{password:"homzo123",role:"admin"},
  tech1:{password:"1234",role:"tech"},
  tech2:{password:"1234",role:"tech"}
};

let currentUser="";
let jobs=JSON.parse(localStorage.getItem("jobs"))||[];
let earnings=JSON.parse(localStorage.getItem("earnings"))||{};

function saveData(){
localStorage.setItem("jobs",JSON.stringify(jobs));
localStorage.setItem("earnings",JSON.stringify(earnings));
}

function login(){
let id=document.getElementById("loginId").value;
let pass=document.getElementById("loginPass").value;

if(!users[id]||users[id].password!==pass){
alert("Invalid Login");
return;
}

currentUser=id;
document.getElementById("login").classList.add("hidden");

if(users[id].role==="admin"){
document.getElementById("adminPanel").classList.remove("hidden");
renderAdmin();
}else{
document.getElementById("techPanel").classList.remove("hidden");
renderTech();
}
}

function logout(){
location.reload();
}

function addJob(){
let job={
id:Date.now(),
customer:custName.value,
area:area.value,
service:service.value,
price:Number(price.value),
status:"new",
tech:""
};

jobs.push(job);
saveData();
renderAdmin();
alert("Job Posted Successfully!");
}

function renderAdmin(){
let html="";
jobs.forEach(j=>{
html+=`
<div class="card job">
<b>${j.service}</b><br>
Customer: ${j.customer}<br>
Area: ${j.area}<br>
₹ ${j.price}<br>
Status: ${j.status}<br>
Technician: ${j.tech||"Not Assigned"}
</div>
`;
});
document.getElementById("adminJobs").innerHTML=html;
}

function renderTech(){
let html="";
let total=earnings[currentUser]||0;

jobs.forEach(j=>{

if(j.status==="new"){
document.getElementById("notifySound").play();

html+=`
<div class="card job">
<b>${j.service}</b><br>
${j.area}<br>
₹ ${j.price}<br>
<button onclick="acceptJob(${j.id})">Accept</button>
</div>
`;
}

if(j.tech===currentUser && j.status==="accepted"){
html+=`
<div class="card">
<b>${j.service}</b><br>
₹ ${j.price}<br>
<button onclick="completeJob(${j.id})">Complete</button>
</div>
`;
}

});

document.getElementById("techJobs").innerHTML=html;
document.getElementById("earnings").innerText=total;
}

function acceptJob(id){
let job=jobs.find(j=>j.id===id);
if(job.status!=="new") return;

job.status="accepted";
job.tech=currentUser;
saveData();
renderTech();
}

function completeJob(id){
let job=jobs.find(j=>j.id===id);
job.status="completed";

earnings[currentUser]=(earnings[currentUser]||0)+job.price;

saveData();
renderTech();
alert("Job Completed!");
}

setInterval(()=>{
if(currentUser && users[currentUser].role==="tech"){
renderTech();
}
},3000);

</script>

</body>
</html>
