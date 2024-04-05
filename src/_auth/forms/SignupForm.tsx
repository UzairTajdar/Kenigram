import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
 


 
const SignupForm = () => {

     const { toast } = useToast()
     const {checkAuthUser, isLoading: isUserLoading} = useUserContext()
     const navigate = useNavigate();

      const {mutateAsync: createUserAccount, isPending:isCreatingAccount} = useCreateUserAccount()

       const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount()
      // 1. Define your form.
    const form = useForm<z.infer<typeof SignupValidation>>({
      resolver: zodResolver(SignupValidation),
      defaultValues: {
        name: "",
        username: "",
        email: "",
        password: "",
      },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignupValidation>) {
      const newUser = await createUserAccount(values)
      if(!newUser){
        return toast({
          title: "Sign up failed .Please try again"
        })
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      })

      if(!session){
        return toast({
          title: "Sign in failed .Please try again"
        })
      }
      
      const isLoggedIn = await checkAuthUser();

      if(isLoggedIn){
        form.reset()
        navigate('/')
      }else{
        return toast({
          title: "Sign up failed .Please try again"
        })
      }
}
  return (

    <Form {...form}>
 
      <div className="sm:w-250 flex-center flex-col">
         <img src="/assets/images/logo1.png" width={200} height={325} alt="logo" />
         <h3 className="h4-bold md:h3-bold pt-3 sm:pt-3">Create a new account</h3>
         <p className="text-light-3 small-medium md:base-regular mt-1">To use Kenigram, please enter your account detail</p>
    
 
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full mt-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
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
              <FormLabel className="text-sm">Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="shad-button_primary mt-1" type="submit">
          {isCreatingAccount ? 
          <div className="flex-center gap-2">
           <Loader /> Loading...
          </div> :  'Sign up' }
        </Button>
        <p className="flex-center text-light-2 text-sm">
          Already have an account? 
          <Link to='/sign-in' className="text-primary-500 text-small-semibold ml-1">Log in</Link>
        </p>
      </form>
      </div>  
  </Form>
  )
}

export default SignupForm