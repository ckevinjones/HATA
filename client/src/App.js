import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        console.log('API Response:', data); // Log the API response to verify the format
        if (data.users && Array.isArray(data.users.users)) {
          setUsers(data.users.users); // Use the correct nested structure
        } else {
          setUsers([]); // Handle unexpected data formats
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError(error.message);
      }
    };
    fetchUsers();
  }, []);


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>User List</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.email}</strong> - {user.user_metadata?.role || 'No role defined'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
