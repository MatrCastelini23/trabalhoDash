import { AuthGuard } from "@/src/components/auth/AuthGuard";

export default function Home() {
  return <AuthGuard />;
}