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
      <section className="space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About EV Chain</h1>
        <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl/relaxed">
          Revolutionizing electric vehicle charging with blockchain technology for a sustainable future.
        </p>
      </section>

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
        <div className="rounded-lg overflow-hidden">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="EV Charging Station"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

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
                  <Shield className="h-10 w-10 text-green-600 mb-2" />
                  <h3 className="text-xl font-bold">Secure Transactions</h3>
                  <p className="text-muted-foreground">
                    All charging transactions are secured by blockchain technology, ensuring tamper-proof records and
                    maximum security for users.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-2">
                  <Globe className="h-10 w-10 text-blue-600 mb-2" />
                  <h3 className="text-xl font-bold">Decentralized Network</h3>
                  <p className="text-muted-foreground">
                    Our decentralized charging network eliminates intermediaries, reducing costs and increasing
                    reliability for EV owners.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">How Our Blockchain Works</h3>
              <div className="h-[200px] bg-white rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Blockchain architecture diagram</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="charging" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Zap className="h-10 w-10 text-yellow-600 mb-2" />
                  <h3 className="text-xl font-bold">Smart Charging</h3>
                  <p className="text-muted-foreground">
                    Our intelligent charging algorithms optimize charging times and costs based on grid demand and
                    renewable energy availability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-2">
                  <Leaf className="h-10 w-10 text-green-600 mb-2" />
                  <h3 className="text-xl font-bold">Renewable Integration</h3>
                  <p className="text-muted-foreground">
                    We prioritize charging from renewable energy sources, helping to reduce the carbon footprint of
                    electric vehicles.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Our Charging Network</h3>
              <div className="h-[200px] bg-white rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Charging network map</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Coins className="h-10 w-10 text-purple-600 mb-2" />
                  <h3 className="text-xl font-bold">EV Tokens</h3>
                  <p className="text-muted-foreground">
                    Our native EV tokens (EVT) can be used for charging payments, rewards, and governance within our
                    ecosystem.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-2">
                  <Users className="h-10 w-10 text-blue-600 mb-2" />
                  <h3 className="text-xl font-bold">Community Governance</h3>
                  <p className="text-muted-foreground">
                    Token holders can participate in platform governance, voting on key decisions and network upgrades.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Token Economics</h3>
              <div className="h-[200px] bg-white rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Token distribution chart</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Our Team</h2>
          <p className="max-w-[800px] mx-auto text-muted-foreground">Meet the passionate experts behind EV Chain.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: "Alex Johnson", role: "CEO & Founder", image: "/placeholder.svg?height=300&width=300" },
            { name: "Sarah Chen", role: "CTO", image: "/placeholder.svg?height=300&width=300" },
            { name: "Michael Rodriguez", role: "Head of Blockchain", image: "/placeholder.svg?height=300&width=300" },
            {
              name: "Emma Wilson",
              role: "Chief Sustainability Officer",
              image: "/placeholder.svg?height=300&width=300",
            },
          ].map((member, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full aspect-square object-cover rounded-md mb-4"
                />
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-green-600 text-white rounded-lg p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold">Join the EV Revolution</h2>
        <p className="max-w-[600px] mx-auto">
          Be part of the sustainable future of transportation. Sign up today and start using our blockchain-powered EV
          charging network.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register">
            <Button className="bg-white text-green-600 hover:bg-gray-100">Create Account</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="border-white text-white hover:bg-green-700">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

