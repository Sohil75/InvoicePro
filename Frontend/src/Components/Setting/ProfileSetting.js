import React, {useEffect,useState } from 'react';
import API from "../../api/axios";

export default function ProfileSetting(){
    const [profile,setProfile] = useState({
        name:"",
        email:"",
        company:"",

    });
    const[loading,setLoading] = useState(true);
    useEffect(()=>{
        const fetchProfile= async()=>{
            try {
                const companyRes = await API.get("/company-profile");

        console.log("Company:", companyRes.data);
                setProfile({
                    name:companyRes.data?.companyName || "",
                    email:companyRes.data?.email ||"",
                    company:companyRes.data?.companyName || "",
                });
            } catch (error) {
                console.error("Profile load error",error);
            }
            finally{
                setLoading(false);
            }
        };
        fetchProfile();
    },[]);
    if(loading){
        return <div className='setting-card glass'>Loading profile...</div>
    }
    return(
         <div className="settings-card glass">
      <h3>Profile Information</h3>

      <div className="profile-row">
        <label>Company Name : </label>
        <p>{profile.company || "No company added"}</p>
      </div>

      <div className="profile-row">
        <label>Company Email :</label>
        <p>{profile.email || "No email added"}</p>
      </div>
    </div>
    )
}

