'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { Dumbbell, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const result = login(formData.email, formData.password);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 500);
  };

  const quickLogin = (email: string, password: string) => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="p-2 bg-primary rounded-lg">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">GymFinder</span>
        </Link>

        {/* Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Login to your GymFinder account</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="bg-secondary border-border"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="bg-secondary border-border"
              />
            </div>
<div className="text-right text-sm">
  <Link href="/forgot-password" className="text-primary hover:underline">
    Forgot Password?
  </Link>
</div>
            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-medium"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up here
            </Link>
          </div>

          {/* Demo Quick Login */}
          <div className="mt-8 border-t border-border/50 pt-6">
            <p className="text-xs font-medium text-muted-foreground mb-3">Quick Login (Demo):</p>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full border-border bg-transparent"
                onClick={() => quickLogin('user@example.com', 'user123')}
                disabled={loading}
              >
                Login as User
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-border bg-transparent"
                onClick={() => quickLogin('admin@example.com', 'admin123')}
                disabled={loading}
              >
                Login as Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-border bg-transparent"
                onClick={() => quickLogin('owner@example.com', 'owner123')}
                disabled={loading}
              >
                Login as Gym Owner
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-border bg-transparent"
                onClick={() => quickLogin('trainer@example.com', 'trainer123')}
                disabled={loading}
              >
                Login as Trainer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
