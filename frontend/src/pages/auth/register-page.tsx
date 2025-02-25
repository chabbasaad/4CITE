import { motion } from 'framer-motion';
import { RegisterForm } from '../../components/auth/register-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';



export function RegisterPage() {
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
          Create account
          </CardTitle>
          <CardDescription className="text-center">
          Sign up for an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
            <RegisterForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground text-center">
          Already have an account?
          </div>
          <Button
            variant="ghost"
            className="w-full"
            asChild
          >
          <Link to='/login'> Sign in </Link>
            
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
    </div>
  );
}