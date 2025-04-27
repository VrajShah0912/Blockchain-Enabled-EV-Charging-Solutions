"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Form validation schema
const userFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const vehicleFormSchema = z.object({
  make: z.string().min(1, { message: "Vehicle make is required." }),
  model: z.string().min(1, { message: "Vehicle model is required." }),
  year: z.string().min(4, { message: "Valid year is required." }),
  battery_capacity: z.string().optional(),
  charging_port_type: z.string().min(1, { message: "Charging port type is required." }),
})

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [hasVehicle, setHasVehicle] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // User form
  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  })

  // Vehicle form
  const vehicleForm = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      battery_capacity: "",
      charging_port_type: "",
    },
  })

  async function handleFinalSubmit(userData: z.infer<typeof userFormSchema>, vehicleData: z.infer<typeof vehicleFormSchema>) {
    setIsSubmitting(true)
    
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        vehicle: hasVehicle ? vehicleData : null
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function onUserSubmit(values: z.infer<typeof userFormSchema>) {
    if (hasVehicle) {
      setStep(2)
    } else {
      handleFinalSubmit(values, vehicleForm.getValues())
    }
  }

  function onVehicleSubmit(values: z.infer<typeof vehicleFormSchema>) {
    handleFinalSubmit(userForm.getValues(), values)
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center text-center mb-8">
        <Zap className="h-12 w-12 text-green-600 mb-4" />
        <h1 className="text-3xl font-bold">Create Your EV Chain Account</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          Join our blockchain-powered EV charging network and start your sustainable journey today.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registration</CardTitle>
              <CardDescription>
                {step === 1 ? "Enter your personal information" : "Add your vehicle details"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}
              >
                1
              </div>
              <div className="w-8 h-0.5 bg-muted"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-6">
                <FormField
                  control={userForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={userForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasVehicle"
                      checked={hasVehicle}
                      onCheckedChange={(checked) => setHasVehicle(checked as boolean)}
                    />
                    <label
                      htmlFor="hasVehicle"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I have an electric vehicle to register
                    </label>
                  </div>

                  <FormField
                    control={userForm.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I accept the{" "}
                            <Link href="/terms" className="text-blue-600 hover:underline">
                              terms and conditions
                            </Link>
                          </FormLabel>
                          <FormDescription>
                            You must agree to our terms and conditions to create an account.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : hasVehicle ? "Next: Vehicle Details" : "Create Account"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...vehicleForm}>
              <form onSubmit={vehicleForm.handleSubmit(onVehicleSubmit)} className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Vehicle Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={vehicleForm.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Make</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select make" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Tesla">Tesla</SelectItem>
                            <SelectItem value="Nissan">Nissan</SelectItem>
                            <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                            <SelectItem value="Ford">Ford</SelectItem>
                            <SelectItem value="BMW">BMW</SelectItem>
                            <SelectItem value="Audi">Audi</SelectItem>
                            <SelectItem value="Hyundai">Hyundai</SelectItem>
                            <SelectItem value="Kia">Kia</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={vehicleForm.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Model</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Model 3, Leaf, Bolt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={vehicleForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={vehicleForm.control}
                    name="charging_port_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Charging Port Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select port type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Type 1">Type 1 (J1772)</SelectItem>
                            <SelectItem value="Type 2">Type 2 (Mennekes)</SelectItem>
                            <SelectItem value="CCS">CCS Combo</SelectItem>
                            <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                            <SelectItem value="Tesla">Tesla</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={vehicleForm.control}
                  name="battery_capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Battery Capacity (kWh)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 75" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-center w-full">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}