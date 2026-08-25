const users = [
  { id: 1, name: "Jordan", role: "Developer" },
  { id: 2, name: "Alex", role: "Designer" },
  { id: 3, name: "Sam", role: "Manager" }
];

function Users() {
    return (
        <div>
            {users.map(user => (
                <UserCard 
                    key={user.id}
                    user={user}
                />
            ))}
        </div>
    )
}

function UserCard ({ user }) {
    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.role}</p>
        </div>
    )
}



import { useState } from "react";

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);

  function increaseQuantity() {
    setQuantity(prevQuantity => prevQuantity + 1)
  }

  function decreaseQuantity() {
    setQuantity((prevQuantity) => 
        prevQuantity === 1 
        ? 1
        : prevQuantity - 1
    )
  }

  return (
    <div>
      <h2>{product.name}</h2>

      <p>Price: ${product.price}</p>

      <div>
        <button onClick={decreaseQuantity}>
          -
        </button>

        <span>{quantity}</span>

        <button onClick={increaseQuantity}>
          +
        </button>
      </div>

      <p>Total: ${product.price * quantity}</p>
    </div>
  );
}

function Products() {
    const [quantity, setQuantity] = useState(1);

    return (
        Products.map(product => (
            <ProductCard 
                key={product.id}
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
            />
        ))
    )
}

function ProductCard({ product, quantity, setQuantity }) {
    function increaseQuantity() {
        setQuantity(prevQuantity => prevQuantity + 1)
    }

    function decreaseQuantity() {
        setQuantity(prevQuantity => 
            prevQuantity === 1
            ? 1
            : prevQuantity - 1
        )
    }

    return (
        <div>
            <h2>{product.name}</h2>

            <p>Price: ${product.price}</p>

            <div>
                <button onClick={decreaseQuantity}>
                -
                </button>

                <span>{quantity}</span>

                <button onClick={increaseQuantity}>
                +
                </button>
            </div>

            <p>Total: ${product.price * quantity}</p>
        </div>
    )
}

// useEffect
import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch("/users");

        if (!response.ok) {
          throw new Error(`Request Failed: ${response.status}`);
        }

        const data = await response.json();

        setUsers(data);
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getUsers();    
  }, [])

  if (loading) {
    return <p>Loading users</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return ( 
    <div>
      {
        users.length === 0
        ? 
        <p>No users found</p>
        :
        users.map(user => (
          <div key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.role}</p>
          </div>
        )) 
      }
    </div>
  );
}

// Separation of concerns

function getUsers() {
  const response = await fetch("/users")

  if (!response.ok) {
    throw new Error(`Request Failed: ${response.status}`)
  }

  return response.json();
}


import { getUsers } from "../api/users";
import { useState, useEffect } from "react"

function users() {
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

  if (loading) {
    return <p>Loading users</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      {
        users.length === 0
        ? 
        <p>No users found</p>
        :
        users.map(user => (
          <div key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.role}</p>
          </div>
        )) 
      }
    </div>
  )
}
