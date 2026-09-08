import { useState, useEffect } from "react";
import { 
    getUsers,
    createUser,
    updateUser,
    deleteUser
 } from '../api/users';

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    async function loadUsers() {
        try {
        const data = await getUsers();

        setUsers(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }
        loadUsers();
    }, [])

    async function addUser(userData) {
        const newuser = await createUser(userData);

        setUsers(prevUsers => [...prevUsers, newuser])
    };

    async function promoteUser(id) {
        const promotedUser = await updateUser(id, {
            role: "Senior Developer"
        });

        setUsers(prevUsers => prevUsers.map(
            prevUser => prevUser.id === id ? promotedUser : prevUser 
        ))
    }

    async function removeUser(id) {
        try {
            await deleteUser(id);

            setUsers(prevUsers => 
                prevUsers.filter(prevUser => 
                    prevUser.id !== id
                )
            )
        } catch (error) {
            setError(error.message);
        }
        
    }

    return {
        users,
        loading,
        error,
        addUser,
        promoteUser, 
        removeUser
    }
} 



// return { users, loading, error };
// Why this works
// This is an object shorthand:

// return {
//   users: users,
//   loading: loading,
//   error: error
// };
// But because the property names and variable names are the same, 
// JavaScript lets us shorten it:

// return {
//   users,
//   loading,
//   error
// };

// Then inside the Users component, we can do:
// const { users, loading, error } = useUsers();

// So the flow is:
// useUsers()
//     ↓
// returns an object
//     ↓
// {
//   users,
//   loading,
//   error
// }
//     ↓
// Users component destructures them
//     ↓
// const { users, loading, error } = useUsers();