import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function Auth() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Custom CSS untuk animasi gradasi bergerak
  const animatedGradientStyle = {
    background:
      "linear-gradient(-45deg, #1a1a1a, #0f0f0f, #2d1b69, #1e3a8a, #312e81)",
    backgroundSize: "400% 400%",
    animation: "gradientShift 15s ease infinite",
  };

  // Inject CSS animation
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Username dan password harus diisi");
      return;
    }

    login(username, password);
  };

  // Show loading if auth is still checking
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated Background */}
      <div className="absolute inset-0" style={animatedGradientStyle}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-indigo-900/30 animate-pulse"></div>
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute top-0 left-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-bounce"
            style={{ animationDuration: "6s" }}
          ></div>
          <div
            className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-bounce"
            style={{ animationDuration: "8s", animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-bounce"
            style={{ animationDuration: "10s", animationDelay: "4s" }}
          ></div>
        </div>
      </div>

      {/* Glassmorphism Card */}
      <Card className="relative w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Login</h1>
          <p className="text-gray-300">Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-white/30 focus:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-white/30 focus:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
