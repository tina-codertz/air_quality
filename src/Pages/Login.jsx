import React, { useState } from "react";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt", { email, password });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-700">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-center text-lg font-bold">Login</h1>
        <form onSubmit={handleSubmit} action="">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 py-4 border rounded"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 ">
              Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </form>
        <button
          onSubmit={handleSubmit}
          className="py-3 px-3 bg-blue-600 rounded-lg"
        >
          submit
        </button>
      </div>
    </div>
  );
};

export default Login;
