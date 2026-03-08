import React, { act, useState } from 'react'
import "./setting.css";
import ProfileSetting from './ProfileSetting';
import SecuritySettings from './SecuritySetting';

export default function Setting(){
    const[activeTab , setActiveTab ] = useState("profile");

    return(
        <div className='setting-container'>
            <h2 className='page-title'>Settings</h2>

            <div className="setting-tabs">
                <button 
                className={activeTab==="profile"? "tab active" : "tab"}
                onClick={()=>setActiveTab("profile")}>Profile</button>
                <button className={activeTab === "security" ? "tab active": "tab"}
                onClick={()=>setActiveTab("security")}>
                    Security
                </button>
            </div>

            <div className="setting-content">
                {activeTab === "profile" &&<ProfileSetting/>}
                {activeTab === "security" && <SecuritySettings/>}
            </div>
        </div>
    );
}
