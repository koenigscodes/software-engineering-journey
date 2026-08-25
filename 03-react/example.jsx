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
  );
}

function UserCard({ user }) {
    return (
       <div>
            <h2>{user.name}</h2>

            <p>
                {user.role === "Developer"
                    ? "💻 Developer"
                    : user.role === "Designer"
                        ? "🎨 Designer"
                        : "📊 Manager"}
            </p>
       </div>   
    );
}



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
  );
}

function UserCard({ user }) {
  const roleLabels = {
    Developer: "💻 Developer",
    Designer: "🎨 Designer",
    Manager: "📊 Manager"
  };

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{roleLabels[user.role]}</p>
    </div>
  );
}

export default Users;