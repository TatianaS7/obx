import React, { useState } from "react";
import {} from "@mui/material";
import { useApi } from "../api/ApiContext";
import "../styles/StartOrder.css";

// Import Components
import OrderStepper from "../components/OrderStepper";
import ProductVisual from "../components/ProductVisual";
import UserInformation from "../components/UserInformation";

interface NewBlendCard {
    name: string;
    description: string;
    product_type: string;
    category: string;
    bottle_size: string;
    bottle_type: string;
}

export default function StartOrder() {
    const [newBlendCard, setNewBlendCard] = useState({
        name: "",
        description: "",
        product_type: "",
        category: "",
        bottle_size: "",
        bottle_type: "DROPPER",
    });

    return (
        <div className="start-order-container">
            <OrderStepper />

            <div>
                {/* <ProductVisual newBlendCard={newBlendCard}/> */}
                <UserInformation />
            </div>
        </div>
        
    )
}