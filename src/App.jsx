import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios"

function App(){

  const [msg,setmsg]=useState("")
  const [emaillist,setemail]=useState([]);
  const [status,setstatus]=useState(false)

  function handletext(event){
    setmsg(event.target.value)
  }

  function handlefile(event){
    const file=event.target.files[0];
    const reader=new FileReader();
    reader.onload=function(event){
     const data=event.target.result;
     const workbook=XLSX.read(data,{type:"binary"});
     const sheetname=workbook.SheetNames[0];
     const worksheet=workbook.Sheets[sheetname];
     const emaillist=XLSX.utils.sheet_to_json(worksheet,{header:'A'})
     const totalemail=emaillist.map(function(item){
      return item.A
     })
     setemail(totalemail)
    }
    reader.readAsBinaryString(file)
  }

 function handlesend(){
    setstatus(true)
    axios.post("https://bulkmail-backend-lime.vercel.app/sendemail",{msg:msg,emaillist:emaillist}).then(function(data){
      if(data.data === true){
        alert("Email sent Successfully")
        setstatus(false)
      }
      else{
        alert("FAILED")
        setstatus(false)
      }
    })
 }



return(<>
<nav className="navbar">
  <h1 className="title">Bulk Mail</h1>
</nav>

<div>
  <p className="para1">We can help your business with sending multiple emails at once</p>
  <h2 className="para2">Drag and Drop</h2>
</div>

<div className="body">
  <textarea onChange={handletext} value={msg} className="textarea" placeholder="Enter the email text...."></textarea>
  <div>
    <input onChange={handlefile} type="file" className="file-section"></input>
  </div>
  <p className="para3">Total Emails in the file:{emaillist.length}</p>

  <button onClick={handlesend} className="send-btn">{status?"Sending...":"Send"}</button>
</div>

<footer className="last"></footer>
</>)
}

export default App