"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Zap, Coins, Users, Globe, Leaf } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch("https://api.example.com/data") // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => console.error("Error fetching data:", error))
  }, [])
  
  return (
    <div className="container mx-auto py-6 space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About EV Chain</h1>
        <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl/relaxed">
          Revolutionizing electric vehicle charging with blockchain technology for a sustainable future.
        </p>
        <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
            alt="EV charging station"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            At EV Chain, we're on a mission to accelerate the transition to sustainable transportation by making EV
            charging more accessible, transparent, and efficient through blockchain technology.
          </p>
          <p className="text-muted-foreground">
            We believe that by combining cutting-edge blockchain solutions with electric vehicle infrastructure, we can
            create a more sustainable and equitable energy ecosystem for everyone.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/stations">
              <Button>Find Stations</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Join Us</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src="/station.jpeg"
            alt="Multiple EVs charging"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Technology Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Our Technology</h2>
          <p className="max-w-[800px] mx-auto text-muted-foreground">
            Powered by blockchain for maximum security, transparency, and efficiency.
          </p>
        </div>

        <Tabs defaultValue="blockchain" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="charging">Charging Network</TabsTrigger>
            <TabsTrigger value="tokens">Token Economy</TabsTrigger>
          </TabsList>

          <TabsContent value="blockchain" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-start gap-4">
                    <Shield className="h-10 w-10 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold">Secure Transactions</h3>
                      <p className="text-muted-foreground">
                        All charging transactions are secured by blockchain technology, ensuring tamper-proof records and
                        maximum security for users.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-start gap-4">
                    <Globe className="h-10 w-10 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold">Decentralized Network</h3>
                      <p className="text-muted-foreground">
                        Our decentralized charging network eliminates intermediaries, reducing costs and increasing
                        reliability for EV owners.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">How Our Blockchain Works</h3>
              <img
                src="https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Blockchain technology"
                className="w-full h-64 object-cover rounded-md"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Our blockchain architecture ensures secure, transparent transactions for all charging sessions.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="charging" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-start gap-4">
                    <Zap className="h-10 w-10 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold">Smart Charging</h3>
                      <p className="text-muted-foreground">
                        Our intelligent charging algorithms optimize charging times and costs based on grid demand and
                        renewable energy availability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-start gap-4">
                    <Leaf className="h-10 w-10 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold">Renewable Integration</h3>
                      <p className="text-muted-foreground">
                        We prioritize charging from renewable energy sources, helping to reduce the carbon footprint of
                        electric vehicles.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Our Charging Network</h3>
              <img
                src="https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Charging network map"
                className="w-full h-64 object-cover rounded-md"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Growing network of charging stations across the country
              </p>
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-start gap-4">
                    <Coins className="h-10 w-10 text-purple-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold">EV Tokens</h3>
                      <p className="text-muted-foreground">
                        Our native EV tokens (EVT) can be used for charging payments, rewards, and governance within our
                        ecosystem.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-start gap-4">
                    <Users className="h-10 w-10 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold">Community Governance</h3>
                      <p className="text-muted-foreground">
                        Token holders can participate in platform governance, voting on key decisions and network upgrades.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Token Economics</h3>
              <img
                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Token economy visualization"
                className="w-full h-64 object-cover rounded-md"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Sustainable token model designed for long-term growth
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Team Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Our Team</h2>
          <p className="max-w-[800px] mx-auto text-muted-foreground">Meet the passionate experts behind EV Chain.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {[
    { 
      name: "Yuvraj Aryan",  
      imageUrl: "/yuvraj.jpg"
    },
    { 
      name: "Vraj Shah", 
      imageUrl: "/vraj.jpg"
    },
    { 
      name: "Yash Bhisekar", 
      imageUrl: "/yash.jpg"
    },
    {
      name: "Sanvi Verma",
      imageUrl: "/sanvi.jpg"
    }
  ].map((person, index) => (
    <div key={index} className="flex items-center space-x-6 p-6 border rounded-xl shadow-md bg-white">
      <img 
        className="h-20 w-20 rounded-full object-cover" 
        src={person.imageUrl} 
        alt={person.name} 
      />
      <div>
        <p className="text-xl font-semibold text-gray-900">{person.name}</p>
      </div>
    </div>
  ))}
</div>

      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white rounded-lg p-8 text-center space-y-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Join the EV Revolution</h2>
          <p className="mt-4">
            Be part of the sustainable future of transportation. Sign up today and start using our blockchain-powered EV
            charging network.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/register">
              <Button className="bg-white text-green-600 hover:bg-gray-100">Create Account</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-green-700">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-8 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
            alt="Happy EV owners"
            className="w-full h-48 object-cover"
          />
        </div>
      </section>
    </div>
  )
}