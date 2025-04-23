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
                alt="EV Charging Station"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="500"
                src="/placeholder.svg?height=500&width=800"
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
                alt="EV Charging Features"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="400"
                src="/placeholder.svg?height=400&width=600"
                width="600"
              />
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
                alt="Charging Station Map"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="400"
                src="/placeholder.svg?height=400&width=600"
                width="600"
              />
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

