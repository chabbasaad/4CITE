import { motion } from 'framer-motion';
import { LockKeyhole, ShieldAlert, UserX2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export function PrivateProfilePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Animated Lock Icon */}
            <motion.div
              initial={{ rotate: -15 }}
              animate={{ rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15
              }}
              className="relative"
            >
              <div className="bg-primary/10 p-4 rounded-full">
                <LockKeyhole className="w-12 h-12 text-primary" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-1 -right-1"
              >
                <ShieldAlert className="w-6 h-6 text-primary" />
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight">Private Profile</h1>
              <p className="text-muted-foreground max-w-sm">
                This profile is set to private. Only approved followers can view this profile's content.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-secondary/50 rounded-lg p-3">
                <UserX2 className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <span className="text-sm text-muted-foreground">Private Content</span>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <ShieldAlert className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <span className="text-sm text-muted-foreground">Protected Account</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 w-full pt-2">
            
              <Button asChild  variant="outline" className="w-full" size="lg">
                <Link to={"/dashboard"}>  Go Back  </Link>
              </Button>
            </div>

            {/* Footer */}
            <p className="text-xs text-muted-foreground pt-4">
              This user has chosen to keep their profile private.
              <br />
              Send a follow request to access their content.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}