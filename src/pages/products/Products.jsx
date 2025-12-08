import React, { useState } from "react";
import "./Product.css";
import ShowAndManageProductComponent from "../../components/adminDashComponents/ShowAndManageProductComponent";

const Products = () => {
  const [refresh, setRefresh] = useState(false);

  const handelRefresh = () => {
    setRefresh(!refresh);
  };
  return (
    <div className="product">
      <ShowAndManageProductComponent refresh={refresh} />
      <div className="add-to-card-container"></div>
    </div>
  );
};

export default Products;
