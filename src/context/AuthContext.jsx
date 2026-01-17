/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`https://json-server-api-dtr8.onrender.com/users?email=${email}&password=${password}`);
      const data = await res.json();

      if (data.length > 0) {
        const loggedUser = data[0];
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return { success: true };
      } else {
        setError("Invalid email or password");
        return { success: false };
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Signup / Register
  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Check if email exists
      const checkRes = await fetch(`https://json-server-api-dtr8.onrender.com/users?email=${email}`);
      const existing = await checkRes.json();
      if (existing.length > 0) {
        setError("Email already registered");
        return { success: false };
      }

      const res = await fetch("https://json-server-api-dtr8.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "user",
          address: "",
        }),
      });

      const newUser = await res.json();
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to register");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (userId, profileData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`https://json-server-api-dtr8.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Update Address
  const updateAddress = async (userId, addressData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`https://json-server-api-dtr8.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addressData }),
      });

      if (!res.ok) throw new Error("Address update failed");

      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      console.error("Address update error:", err);
      setError("Failed to update address");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        updateProfile,
        updateAddress,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}