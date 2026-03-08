import React, { useState } from 'react';
import API from "../.././api/axios";
import { formToJSON } from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import "./companysetup.css";

export default function CompanySetup(){
    const[ form,setForm] = useState({
        companyName:"",
        email:"",
        phone:"",
        address:"",
    });
    const navigate = useNavigate();
    const [logo,setLogo] = useState(null);
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach((key)=>{
            data.append(key,form[key]);
        });
        if(logo) data.append("logo",logo);

        try {
            await API.post("/company-profile",data);
            alert("company profile saved");
            navigate("/dashboard");
        } catch (error) {
            alert("Failed to save company");
            console.error(error);
        }
    };
    return(
         <div className="company-setup-container">
        <form  className="company-card" onSubmit={handleSubmit}>

            <h2>Setup Your Company</h2>
            <input placeholder='Company Name'
            onChange={(e)=>setForm({...form,companyName: e.target.value})}/>
            <input placeholder='Email'
            onChange={(e)=> setForm({...form,email:e.target.value})} />
             <input
        placeholder="Phone"
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <input
        placeholder="Address"
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />
      <input type="file" onChange={(e)=>setLogo(e.target.files[0])} />
      <button type='submit'>Save Company</button>
        </form>
              </div>
    )
}
