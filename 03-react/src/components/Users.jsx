import { useState } from "react";

import { useUsers } from "../hooks/useUsers";

function Users() {
    const {
        users,
        loading,
        error,
        addUser,
        promoteUser,
        removeUser
    } = useUsers();

    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await addUser({
                name,
                role
            });

            setName("");
            setRole("");
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) return <p>Loading users...</p>

    if (error) return <p>{error}</p>

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder="Name"
                />

                <input
                value={role}
                onChange={event => setRole(event.target.value)}
                placeholder="Role"
                />

                <button type="submit">
                Add User
                </button>
            </form>

            {users.length === 0 ? (
                <p>No users found</p>
            ) : (
                users.map(user => (
                <div key={user.id}>
                    <h2>{user.name}</h2>
                    <p>{user.role}</p>
                    <button onClick={() => promoteUser(user.id)}>
                        Promote User 
                    </button>
                </div>
                ))
            )}
        </div>
    );
};