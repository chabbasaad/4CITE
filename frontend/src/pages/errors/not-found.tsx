import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))] p-4">
      <div className="text-center space-y-6">
        {/* 404 Header */}
        <motion.h1
          className="text-7xl font-bold text-[hsl(var(--primary))]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-lg text-[hsl(var(--muted-foreground))]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to='/login'
            className="inline-flex items-center px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg shadow hover:bg-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--primary))] transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Back Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
