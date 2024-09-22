import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../src/lib/apis";

const UseUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Define the async function inside useEffect
        const getUsers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users`, {
                    headers: { "Content-Type": "application/json" },
                });
                setUsers(response.data);
            } catch (e) {
                console.log("Error:", e);
            }
        };

        getUsers();
    }, []); 

    return { users };
};

export default UseUsers;
