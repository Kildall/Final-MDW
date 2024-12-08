"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectIsValidSession, setCredentials, setUser } from "@/lib/features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth-service";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { redirect } from "next/navigation";
import * as React from "react";
import { z } from "zod";
import { toFormikValidationSchema } from 'zod-formik-adapter';

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const loginSchema = z.object({
  email: z
    .string({ required_error: "El email es requerido" })
    .email("Ingrese un email válido"),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  remember: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;


export function LoginForm({ className, ...props }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidSession);

  if (isLoggedIn) {
    redirect('/');
  }

  async function onSubmit(
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) {
    try {
      const response = await AuthService.login({
        email: values.email,
        password: values.password,
        remember: values.remember,
      });


      if (response.data.token) {
        const expiresAt = new Date(response.data.expires).getTime();
        dispatch(setCredentials({ token: response.data.token, expiresAt }));
      }

      const userResponse = await AuthService.getUser(response.data.token);
      if (userResponse.data.user) {
        dispatch(setUser({ user: userResponse.data.user }));
      }

    } catch (error) {
      logger.error("An error occurred while trying to login", { error });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Formik
        validationSchema={toFormikValidationSchema(loginSchema)}
        initialValues={{
          email: "",
          password: "",
          remember: false,
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, getFieldProps }) => (
          <Form>
            <div className="grid gap-2">
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <Field
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    type="email"
                    as={Input}
                  />
                  <ErrorMessage name="email" component={Label} className="text-red-500" />
                  <Label className="sr-only" htmlFor="password">
                    Contraseña
                  </Label>
                  <Field
                    name="password"
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    type="password"
                    as={Input}
                  />
                  <ErrorMessage name="password" component={Label} className="text-red-500" />
                </div>
                {/* 
                TODO: For some reason when the checkbox is clicked, the form is submitted. No idea why the fuck that is happening.
                <div className="flex flex-row items-center gap-2">
                  <Field
                    name="remember"
                    type="checkbox"
                    component={Checkbox}
                    defaultChecked={true}
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                      // Prevent the default form submission
                      e.preventDefault();
                      const value = e.currentTarget.checked;
                      const fieldProps = getFieldProps('remember');
                      fieldProps.onChange({
                        target: {
                          name: 'remember',
                          value: value
                        }
                      });
                    }}
                  />
                  <Label htmlFor="remember" onClick={(e) => e.preventDefault()}>
                    Recordarme
                  </Label>
                </div> */}
                <Button disabled={isSubmitting || !isValid} type="submit">
                  {isSubmitting ? "Cargando..." : "Ingresar"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
