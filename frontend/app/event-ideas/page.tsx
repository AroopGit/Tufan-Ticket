"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Filter, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import EventHeatmap from "@/components/event-heatmap"

export default function EventIdeasPage() {
  const [eventType, setEventType] = useState("all")
  const [timeFrame, setTimeFrame] = useState("current")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Event Ideas</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Discover popular event types by location with our interactive heatmap
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>Refine the heatmap data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="event-type" className="text-sm font-medium">
                      Event Type
                    </label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger id="event-type">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="arts">Arts & Theater</SelectItem>
                        <SelectItem value="food">Food & Drink</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="time-frame" className="text-sm font-medium">
                      Time Frame
                    </label>
                    <Select value={timeFrame} onValueChange={setTimeFrame}>
                      <SelectTrigger id="time-frame">
                        <SelectValue placeholder="Select time frame" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="3months">Next 3 Months</SelectItem>
                        <SelectItem value="6months">Next 6 Months</SelectItem>
                        <SelectItem value="year">Next Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="region" className="text-sm font-medium">
                      Region
                    </label>
                    <Select defaultValue="worldwide">
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worldwide">Worldwide</SelectItem>
                        <SelectItem value="northamerica">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="southamerica">South America</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Locations</CardTitle>
                  <CardDescription>Top event locations this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      { city: "New York", country: "USA", count: 245 },
                      { city: "London", country: "UK", count: 189 },
                      { city: "Tokyo", country: "Japan", count: 156 },
                      { city: "Paris", country: "France", count: 132 },
                      { city: "Los Angeles", country: "USA", count: 128 },
                    ].map((location, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {location.city}, {location.country}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{location.count}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Popularity Heatmap</CardTitle>
                  <CardDescription>Visualize event popularity across different locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="heatmap">
                    <TabsList className="mb-4">
                      <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                      <TabsTrigger value="clusters">Clusters</TabsTrigger>
                      <TabsTrigger value="growth">Growth Areas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="heatmap" className="mt-0">
                      <div className="aspect-[16/9] overflow-hidden rounded-lg border">
                        <EventHeatmap eventType={eventType} timeFrame={timeFrame} />
                      </div>
                    </TabsContent>
                    <TabsContent value="clusters" className="mt-0">
                      <div className="aspect-[16/9] overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Event clusters visualization</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="growth" className="mt-0">
                      <div className="aspect-[16/9] overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Growth areas visualization</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Type Breakdown</CardTitle>
                    <CardDescription>Most popular event types in selected region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: "Music Festivals", percentage: 28 },
                        { type: "Food & Drink", percentage: 22 },
                        { type: "Sports", percentage: 18 },
                        { type: "Arts & Theater", percentage: 15 },
                        { type: "Business", percentage: 10 },
                        { type: "Other", percentage: 7 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.type}</span>
                            <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seasonal Trends</CardTitle>
                    <CardDescription>Event popularity by season</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { season: "Spring (Mar-May)", percentage: 24 },
                        { season: "Summer (Jun-Aug)", percentage: 38 },
                        { season: "Fall (Sep-Nov)", percentage: 26 },
                        { season: "Winter (Dec-Feb)", percentage: 12 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.season}</span>
                            <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

