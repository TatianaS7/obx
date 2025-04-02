import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import axios from "axios";
import apiURL from "../api"

// Import Components
import LoginButton from "./Login";
import LogoutButton from "./Logout";

function App() {
    const { isAuthenticated, user } = useAuth0();

    return (
        <main>
            <h1>Hi {isAuthenticated ? user.name : "Guest"}</h1>
            <LoginButton />
            <LogoutButton />
        </main>
    )
}

export default App;