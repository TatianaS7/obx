import React, { useState } from "react";
import {} from "@mui/material";
import { useApi } from "../api/ApiContext";
import "../styles/StartOrder.css";

// Import Components
import OrderStepper from "../components/OrderStepper";

export default function StartOrder() {

    return (
        <div className="start-order-container">
            <OrderStepper />
        </div>
        
    )
}