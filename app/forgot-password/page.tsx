'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, ArrowLeft, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess('Password reset link sent to your email');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="flex justify-center items-center gap-2 mb-8">
          <div className="p-2 bg-primary rounded-lg">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">GymFinder</span>
        </Link>

        <div className="bg-card p-8 rounded-2xl border border-border/50">

          <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
          <p className="text-muted-foreground mb-6">
            Enter your email to receive reset link
          </p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-secondary border-border"
              />
            </div>

            <Button className="w-full h-11" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-sm text-center">
            <Link href="/login" className="flex items-center justify-center gap-1 text-primary">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}