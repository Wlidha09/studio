
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithGoogle, signInWithEmail, createUserWithEmail } from "@/lib/auth";
import { Briefcase, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { FirebaseError } from "firebase/app";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.999,36.586,44,31.1,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
)

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [authError, setAuthError] = useState<FirebaseError | null>(null);

    const handleAuthError = (error: any) => {
        const firebaseError = error as FirebaseError;
        setAuthError(firebaseError);

        let description = "An unexpected error occurred. Please try again.";

        if (isRegisterMode) {
            if (firebaseError.code === "auth/email-already-in-use") {
                description = "This email is already in use. Please sign in or use a different email.";
            }
        } else {
            if (firebaseError.code === "auth/wrong-password" || firebaseError.code === "auth/user-not-found" || firebaseError.code === 'auth/invalid-credential') {
                description = "Invalid email or password. Please try again.";
            } else if (firebaseError.code === 'auth/user-disabled') {
                description = "This user account has been disabled by an administrator.";
            }
        }
        
        if (firebaseError.code !== "auth/unauthorized-domain") {
            toast({
                title: isRegisterMode ? "Registration Failed" : "Login Failed",
                description: description,
                variant: "destructive",
            });
        }
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthError(null);
        try {
            const user = isRegisterMode 
                ? await createUserWithEmail(email, password)
                : await signInWithEmail(email, password);

            if (user) {
                router.push("/dashboard");
            } else {
                 handleAuthError({code: 'auth/generic-error'});
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setAuthError(null);
        try {
            const user = await signInWithGoogle();
            if (user) {
                router.push("/dashboard");
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <Briefcase className="h-8 w-8 mr-3 text-logo" />
                        <CardTitle className="text-2xl font-bold">HResource</CardTitle>
                    </div>
                    <CardDescription>
                        {isRegisterMode ? "Create an account to get started" : "Sign in to access your dashboard"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {authError?.code === "auth/unauthorized-domain" && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Action Required: Unauthorized Domain</AlertTitle>
                            <AlertDescription>
                                This app's domain is not authorized for Firebase Authentication.
                                <br /><br />
                                To fix this, open your <strong>Firebase Console</strong>, navigate to <strong>Authentication &gt; Settings &gt; Authorized domains</strong>, and add <strong>localhost</strong> to the list.
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleFormSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <CardFooter className="flex flex-col gap-4 pt-6 px-0">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isRegisterMode ? "Register" : "Sign In"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-0">
                        <Button type="button" variant="link" onClick={() => setIsRegisterMode(!isRegisterMode)}>
                        {isRegisterMode ? "Already have an account? Sign In" : "Don't have an account? Register"}
                    </Button>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin} type="button" disabled={isGoogleLoading}>
                        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :  <GoogleIcon className="mr-2 h-5 w-5" />}
                        Continue with Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

