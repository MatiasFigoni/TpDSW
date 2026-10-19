import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { registerClient, type ClientRegistration } from "../../services/auth.services.ts";

interface RegisterFormValues extends ClientRegistration {
    confirmPassword: string;
}

const cssFormInput = "mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";

export function UserRegister() {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [registered, setRegistered] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async ({ confirmPassword: _confirmPassword, ...client }: RegisterFormValues) => {
        setSubmitError(null);
        try {
            await registerClient(client);
            setRegistered(true);
        } catch (error) {
            setSubmitError(error instanceof Error
                ? error.message
                : 'Ocurrió un error inesperado al registrar el usuario.');
        }
    };

    return (
        <section className="flex justify-center bg-zinc-900 px-4 py-12 sm:px-6">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-8">
                <div className="mb-8 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2rem] text-indigo-400">Player Start</p>
                    <h1 className="mt-3 text-3xl font-bold text-white">Crear cuenta</h1>
                    <p className="mt-2 text-sm text-zinc-400">Registrate para comenzar a usar nuestros servicios.</p>
                </div>

                {registered ? (
                    <div className="space-y-5 text-center">
                        <p role="status" className="rounded-xl border border-emerald-800 bg-emerald-950/70 px-4 py-3 text-sm text-emerald-300">
                            Tu cuenta fue creada correctamente. Ya podés iniciar sesión.
                        </p>
                        <Link
                            to="/login"
                            className="block w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
                        >
                            Ir a iniciar sesión
                        </Link>
                    </div>
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="grid gap-5 sm:grid-cols-2">
                            
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-zinc-200">Email</label>
                            <input id="email" type="email" autoComplete="email" className={cssFormInput} {...register('email', {
                                required: 'Ingresá un email.',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Ingresá un email válido.',
                                },
                            })} />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-zinc-200">Contraseña</label>
                            <input id="password" type="password" autoComplete="new-password" className={cssFormInput} {...register('password', {
                                required: 'Ingresá una contraseña.',
                                validate: (value) => value.trim().length > 0 || 'Ingresá una contraseña.',
                            })} />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-200">Confirmar contraseña</label>
                            <input id="confirmPassword" type="password" autoComplete="new-password" className={cssFormInput} {...register('confirmPassword', {
                                required: 'Confirmá tu contraseña.',
                                validate: (value, formValues) => value === formValues.password || 'Las contraseñas no coinciden.',
                            })} />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>}
                        </div>
                        </div>
                        {submitError && (
                            <p role="alert" className="rounded-xl border border-red-800 bg-red-950/70 px-4 py-3 text-sm text-red-300">
                                {submitError}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
