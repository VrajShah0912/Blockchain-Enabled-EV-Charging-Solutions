import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Zap, Shield, Coins, MapPin } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-green-50 to-blue-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Blockchain-Powered EV Charging
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Revolutionizing electric vehicle charging with secure, transparent, and efficient blockchain
                  technology.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/stations">
                  <Button variant="outline">Find Charging Stations</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Tesla charging at station"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="500"
                src="https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                width="800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">Core Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Smart Charging Solutions</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform combines cutting-edge blockchain technology with EV charging infrastructure to create a
                seamless, secure, and transparent charging experience.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-700">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Efficient Charging</h3>
                  <p className="text-gray-500">
                    Optimize your charging schedule and costs with our smart charging algorithm.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Secure Transactions</h3>
                  <p className="text-gray-500">
                    All charging transactions are secured by blockchain technology for maximum security and
                    transparency.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <Coins className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Token Rewards</h3>
                  <p className="text-gray-500">
                    Earn tokens for sustainable charging practices that can be redeemed for future charging sessions.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
            <img
  alt="EV cars charging at a station"
  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
  height="400"
  width="600"
  src="/charge.jpg"
/>


            </div>
          </div>
        </div>
      </section>

      {/* EV Models Showcase */}
      <section className="w-full py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">Compatible With</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">All Major EV Models</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed">
                Our charging network supports vehicles from all leading manufacturers.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
            <div className="flex flex-col items-center">
              <img
                alt="Tesla Model 3"
                className="rounded-lg object-cover h-40 w-full"
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
              />
              <p className="mt-2 font-medium">Tesla</p>
            </div>
            <div className="flex flex-col items-center">
            <img
  alt="Ford Mustang Mach-E"
  className="rounded-lg object-cover h-40 w-full"
  src="/ford.jpeg"
/>

              <p className="mt-2 font-medium">Ford</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                alt="Audi e-tron"
                className="rounded-lg object-cover h-40 w-full"
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
              />
              <p className="mt-2 font-medium">Audi</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                alt="Chevy Bolt"
                className="rounded-lg object-cover h-40 w-full"
                src="/chev.jpeg"
              />
              <p className="mt-2 font-medium">Chevrolet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">Find Stations</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Locate Charging Stations
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find available charging stations near you with our interactive map. Filter by charging speed,
                  availability, and pricing.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/stations">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <MapPin className="mr-2 h-4 w-4" />
                    Explore Map
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center overflow-hidden rounded-xl">
              <img
                alt="EV charging station map with cars"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="400"
                src="https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                width="600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">Testimonials</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Our Users Say</h2>
            </div>
          </div>
          <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <img
                alt="Happy EV driver"
                className="rounded-full h-20 w-20 object-cover mb-4"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              />
              <p className="text-gray-600 italic mb-4">"The blockchain payments make charging so seamless and secure. Never worry about payment processing again!"</p>
              <p className="font-medium">Sarah J.</p>
              <p className="text-sm text-gray-500">Tesla Model 3 Owner</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <img
                alt="EV enthusiast"
                className="rounded-full h-20 w-20 object-cover mb-4"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              />
              <p className="text-gray-600 italic mb-4">"Earning tokens for off-peak charging has saved me hundreds this year. Brilliant incentive system!"</p>
              <p className="font-medium">Michael T.</p>
              <p className="text-sm text-gray-500">Ford Mustang Mach-E Owner</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <img
                alt="EV driver charging"
                className="rounded-full h-20 w-20 object-cover mb-4"
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              />
              <p className="text-gray-600 italic mb-4">"The station map is incredibly accurate and the availability updates in real-time. No more guessing games!"</p>
              <p className="font-medium">Priya K.</p>
              <p className="text-sm text-gray-500">Audi e-tron Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join the EV Revolution</h2>
              <p className="max-w-[900px] text-green-50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up today and be part of the sustainable future of transportation.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button className="bg-white text-green-600 hover:bg-gray-100">Create Account</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="border-white text-white hover:bg-green-700">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}