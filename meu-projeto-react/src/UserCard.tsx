// UserCard.tsx
import React from "react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <h3>{user.name}</h3>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
};

export default UserCard;
