import { useState } from "react";
import authService from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login(email, password);
      console.log("Login success:", response);
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email/username or password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-lg w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Accepts email OR username */}
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          placeholder="Email or Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-4 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
