export async function getUsers() {
  const response = await fetch("/users")

  if (!response.ok) {
    throw new Error(`Request Failed: ${response.status}`)
  }

  return response.json();
};

export async function createUser({name, role}) {
  const response = await fetch("/users", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({name, role})
  })

  if (!response.ok) {
    throw new Error(`Request Failed: ${response.status}`)
  }

  return response.json();
}

export async function updateUser(id, updates) {
  const response = await fetch(`/users/${id}`, {
    method: 'PATCH',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(updates)
  })

  if (!response.ok) {
    throw new Error(`Request Failed: ${response.status}`)
  }

  return response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Request Failed: ${response.status}`)
  }
};