"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, TrendingUp, Calendar, Users, DollarSign, Clock } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"

export default function TicketPredictionPage() {
  const [eventType, setEventType] = useState("music")
  const [venueCapacity, setVenueCapacity] = useState(1000)
  const [ticketPrice, setTicketPrice] = useState(50)
  const [duration, setDuration] = useState(3)

  // Simulated prediction results
  const predictedAttendance = Math.round(venueCapacity * 0.75)
  const predictedRevenue = predictedAttendance * ticketPrice
  const fillRate = Math.round((predictedAttendance / venueCapacity) * 100)

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
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Ticket Sales Prediction</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Predict attendance and optimize pricing for your events
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Parameters</CardTitle>
                  <CardDescription>Enter your event details to get predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="event-type" className="text-sm font-medium">
                        Event Type
                      </label>
                      <Select value={eventType} onValueChange={setEventType}>
                        <SelectTrigger id="event-type">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Select defaultValue="newyork">
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newyork">New York, USA</SelectItem>
                          <SelectItem value="london">London, UK</SelectItem>
                          <SelectItem value="tokyo">Tokyo, Japan</SelectItem>
                          <SelectItem value="paris">Paris, France</SelectItem>
                          <SelectItem value="sydney">Sydney, Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="date" className="text-sm font-medium">
                        Event Date
                      </label>
                      <div className="flex">
                        <Input id="date" type="date" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="time" className="text-sm font-medium">
                        Event Time
                      </label>
                      <div className="flex">
                        <Input id="time" type="time" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="venue-capacity" className="text-sm font-medium">
                          Venue Capacity
                        </label>
                        <span className="text-sm text-muted-foreground">{venueCapacity.toLocaleString()} people</span>
                      </div>
                      <Slider
                        id="venue-capacity"
                        min={100}
                        max={10000}
                        step={100}
                        value={[venueCapacity]}
                        onValueChange={(value) => setVenueCapacity(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="ticket-price" className="text-sm font-medium">
                          Ticket Price
                        </label>
                        <span className="text-sm text-muted-foreground">${ticketPrice}</span>
                      </div>
                      <Slider
                        id="ticket-price"
                        min={10}
                        max={500}
                        step={5}
                        value={[ticketPrice]}
                        onValueChange={(value) => setTicketPrice(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="duration" className="text-sm font-medium">
                          Event Duration (hours)
                        </label>
                        <span className="text-sm text-muted-foreground">{duration} hours</span>
                      </div>
                      <Slider
                        id="duration"
                        min={1}
                        max={12}
                        step={0.5}
                        value={[duration]}
                        onValueChange={(value) => setDuration(value[0])}
                      />
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Prediction
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prediction Results</CardTitle>
                  <CardDescription>Based on historical data and your parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <Users className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-bold">{predictedAttendance.toLocaleString()}</h3>
                      <p className="text-sm text-muted-foreground">Expected Attendance</p>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <DollarSign className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-bold">${predictedRevenue.toLocaleString()}</h3>
                      <p className="text-sm text-muted-foreground">Projected Revenue</p>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <TrendingUp className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-bold">{fillRate}%</h3>
                      <p className="text-sm text-muted-foreground">Venue Fill Rate</p>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                      <Calendar className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-bold">2 Weeks</h3>
                      <p className="text-sm text-muted-foreground">Optimal Promotion</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border bg-card p-4">
                    <h3 className="mb-2 font-semibold">Optimization Suggestions</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="mr-2 rounded-full bg-primary/10 p-1">
                          <DollarSign className="h-3 w-3 text-primary" />
                        </span>
                        <span>Consider increasing ticket price by $10 to maximize revenue</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 rounded-full bg-primary/10 p-1">
                          <Calendar className="h-3 w-3 text-primary" />
                        </span>
                        <span>Optimal day of week: Friday or Saturday</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 rounded-full bg-primary/10 p-1">
                          <Clock className="h-3 w-3 text-primary" />
                        </span>
                        <span>Optimal start time: 7:00 PM</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historical Trends</CardTitle>
                  <CardDescription>Based on similar events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] rounded-lg border bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Attendance trend chart</p>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Similar Events Average</span>
                        <span className="text-sm text-muted-foreground">850 attendees</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "85%" }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Your Prediction</span>
                        <span className="text-sm text-muted-foreground">{predictedAttendance} attendees</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${fillRate}%` }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Sensitivity</CardTitle>
                  <CardDescription>Impact of price on attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] rounded-lg border bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Price sensitivity chart</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium">Recommended Price Points</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Economy</span>
                        <span className="font-medium">${Math.round(ticketPrice * 0.7)}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Standard</span>
                        <span className="font-medium">${ticketPrice}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Premium</span>
                        <span className="font-medium">${Math.round(ticketPrice * 1.5)}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>VIP</span>
                        <span className="font-medium">${Math.round(ticketPrice * 2.5)}</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

