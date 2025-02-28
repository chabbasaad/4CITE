import { motion } from 'framer-motion';
import { LoginForm } from '../../components/auth/login-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';



export function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center w-screen">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-[380px] shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
          Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
            <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground text-center">
          Don't have an account?
          </div>
          <Button
            variant="ghost"
            className="w-full"
            asChild
          >
           <Link to='/signup'>Create account</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
    </div>
  );
}