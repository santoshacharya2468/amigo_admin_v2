"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useUserProfile } from "@/hooks/useUserProfile";
import { loginSchema } from "@/lib/schema";
import { login } from "@/repository/auth.repository";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

export function LoginForm() {
  const [loading, setloading] = useState(false);
  const { setUser } = useUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search parameters (for redirect)

  const redirectUrl = searchParams.get("redirect") || "/dashboard"; // Default to /dashboard if no redirect param

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setloading(true);
    toast.promise(
      login(values.username, values.password),
      {
        loading: "Logging in...",
        success: (data) => {
          setUser(data);
          router.push(redirectUrl); // Redirect to the original URL after login
          return "Logged in successfully";
        },
        error: "Invalid email or password",
      }
    );
    setloading(false);
  }

 


  return (
    <Card className=" max-w-lg w-[350px] md:w-[500px] bg-popover">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between gap-2">
          Login{" "}
         
        </CardTitle>
        <CardDescription>
          Enter your  email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-10 h-10"></div>
            <Button
              type="submit"
              className="w-full  text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              variant={"default"}
              disabled={loading}
            >
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
