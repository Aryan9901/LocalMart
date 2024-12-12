import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.sendOtp(phone);
      // Handle navigation to OTP screen
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Welcome to Minify</h1>
        <p className="text-muted-foreground">Your go-to app for all groceries</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md">
              +91
            </span>
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-l-none"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Mobile OTP
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          By proceeding, I accept the{' '}
          <a href="/terms" className="text-primary hover:underline">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}