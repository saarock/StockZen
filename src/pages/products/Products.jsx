import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import "./Product.css";

import ShowAndManageProductComponent from '../../components/adminDashComponents/ShowAndManageProductComponent';
import Bill from '../../components/bill/Bill';


const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      navigate(`/payment-success?data=${data}`);
    }
  }, [searchParams, navigate]);

  const [refresh, setRefresh] = useState(false);

  const handelRefresh = () => {
    setRefresh(!refresh);
  }
  return (
    <div className='product'>
      <ShowAndManageProductComponent refresh={refresh} />
      <div className='add-to-card-container'>
        <Bill handelRefresh={handelRefresh} />

      </div>
    </div>
  )
}

export default Products