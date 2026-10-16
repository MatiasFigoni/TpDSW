import { useForm } from "react-hook-form"
import { login, type AccountType } from "../../services/auth.services.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { useNavigate } from "react-router";
import { useState } from "react";

interface LoginFormValues{
    email:string;
    password:string;
}
interface LoginProps{
    accountType:AccountType;
    redirectTo?:string;
}

function Login({accountType = 'client' , redirectTo = '/'}:LoginProps){
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [submitError,setSubmitError] = useState<string | null>(null);
    const { 
        register,
        handleSubmit,
        formState : {errors, isSubmitting},
     } = useForm<LoginFormValues>({
        defaultValues:{
            email:'',
            password:'',
        }
    });
    const onSubmit = async ( {email,password}:LoginFormValues )=>{
        try{
            const user = await login(accountType,{email,password})
            setUser(user,accountType);
            navigate(redirectTo);
        }
        catch(error){
            setSubmitError(error instanceof Error?
                error.message: 
                'Ocurrió un error inesperado al iniciar sesión.'
            );
        }
    }
    const cssFormInput = "mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";
    return(
        <section className="felx items-center justify-center bg-zinc-900 px-4 py-12 sm:px-6">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-8">
            <div className="mb-8 text-center">
                     <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">Player Start</p>
                     <h1 className="mt-3 text-3xl font-bold text-white">Iniciar sesión</h1>
                     <p className="mt-2 text-sm text-zinc-400">
                         {accountType === "employee"
                             ? "Ingresá con tu cuenta de empleado para acceder al panel."
                             : "Ingresá con tu cuenta para continuar."}
                     </p>
                 </div>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                <label htmlFor="email" className="text-sm font-medium text-zinc-200">Email</label>
                <input type="email" id="email" className={cssFormInput} {...register('email',{
                        required: 'Ingresa un email',
                        pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Ingrese un email válido.",
                                },
                    })} />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                </div>
                <div>
                <label htmlFor="password" className="text-sm font-medium text-zinc-200">Contraseña</label>
                <input type="password" id="password" className={cssFormInput} {...register('password',{
                    required: 'Ingrese una contrseña',
                    validate: (value)=> value.trim().length> 0 || 'Ingrese su contraseña.'
                })} />
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                </div>
                {submitError && 
                    <p role="alert" className="rounded-xl border border-red-800 bg-red-950/70 px-4 py-3 text-sm text-red-300">
                       {submitError}
                    </p>}
                <button type="submit"
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}>
                    {isSubmitting?'Ingresando ...' :'Ingresar'}
                </button>
            </form>
            </div>
        </section>
    );
}
export default Login;