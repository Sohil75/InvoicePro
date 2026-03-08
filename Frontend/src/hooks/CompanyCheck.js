import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from ".././api/axios";
import "./companycheck.css";

export default function CompanyCheck(){
    const [loading,setLoading] =useState(true);
    const navigate = useNavigate();
    useEffect(()=>{
        const checkCompany = async()=>{
            try {
                const res = await API.get("/company-profile");

                if(!res.data){
                    navigate("/setup-company");
                }
            } catch (error) {
                navigate("/setup-company");
            }
            finally{
                setLoading(false);
            }
        };
        checkCompany();
    },[navigate]);
    return loading;
}
