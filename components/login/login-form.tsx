"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth-service";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as React from "react";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) {
    setIsLoading(true);
    try {
      const response = AuthService.login({
        email: values.email,
        password: values.password,
        remember: false,
      });
      console.log(response);
    } catch (error) {
      logger.error("Ocurrió un error al intentar realizar el login...");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Field
                  id="email"
                  name="email" // Añadido para conectar con Formik
                  type="email"
                  as={Input}
                />
                <Label className="sr-only" htmlFor="password">
                  Contraseña
                </Label>
                <Field
                  id="password"
                  name="password" // Añadido para conectar con Formik
                  type="password"
                  as={Input}
                />
              </div>
              <Button disabled={isLoading || isSubmitting} type="submit">
                {isLoading ? "Cargando..." : "Ingresar"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
