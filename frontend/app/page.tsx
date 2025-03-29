import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, TrendingUp, Users, Filter, Search } from "lucide-react"
import EventCard from "@/components/event-card"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Plan Successful Events with Confidence
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Your all-in-one platform for event planning, ticket sales prediction, and audience feedback analysis.
                </p>
              </div>
              <div className="w-full max-w-3xl space-y-4">
                <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
                  <Input type="text" placeholder="Search events, venues, or artists" />
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Link href="/event-ideas" className="w-full">
                    <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
                      <MapPin className="h-10 w-10 text-primary" />
                      <h3 className="text-xl font-bold">Event Ideas</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Discover popular event types by location
                      </p>
                    </div>
                  </Link>
                  <Link href="/ticket-prediction" className="w-full">
                    <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
                      <TrendingUp className="h-10 w-10 text-primary" />
                      <h3 className="text-xl font-bold">Ticket Sales</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Predict attendance and optimize pricing
                      </p>
                    </div>
                  </Link>
                  <Link href="/event-feedback" className="w-full">
                    <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
                      <Users className="h-10 w-10 text-primary" />
                      <h3 className="text-xl font-bold">Event Feedback</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Analyze audience sentiment and feedback
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything You Need for Successful Events
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our platform provides comprehensive tools to help event organizers make data-driven decisions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Location Intelligence</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Discover the best locations for your events based on historical data and trends.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow">
                <div className="rounded-full bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Sales Forecasting</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Predict ticket sales and attendance with our advanced AI algorithms.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Audience Insights</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Understand your audience better with comprehensive feedback analysis.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow">
                <div className="rounded-full bg-primary/10 p-3">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Event Planning</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Streamline your event planning process with our intuitive tools.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow">
                <div className="rounded-full bg-primary/10 p-3">
                  <Filter className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Filtering</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Find the perfect event ideas with our advanced filtering system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow">
                <div className="rounded-full bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Trend Discovery</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Stay ahead of the curve with real-time event trend analysis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Events Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Trending Now
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Discover Trending Events Worldwide</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Explore the most popular events happening around the globe.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <TabsList>
                    <TabsTrigger value="all">All Events</TabsTrigger>
                    <TabsTrigger value="music">Music</TabsTrigger>
                    <TabsTrigger value="sports">Sports</TabsTrigger>
                    <TabsTrigger value="arts">Arts & Theater</TabsTrigger>
                    <TabsTrigger value="food">Food & Drink</TabsTrigger>
                  </TabsList>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <EventCard
                      title="Summer Music Festival"
                      location="Miami, FL"
                      date="Jun 15-18, 2023"
                      image="/placeholder.svg?height=400&width=600"
                      category="Music"
                      attendees="15.2K"
                    />
                    <EventCard
                      title="International Food Fair"
                      location="New York, NY"
                      date="Jul 8-10, 2023"
                      image="/placeholder.svg?height=400&width=600"
                      category="Food & Drink"
                      attendees="8.5K"
                    />
                    <EventCard
                      title="Tech Conference 2023"
                      location="San Francisco, CA"
                      date="Aug 22-25, 2023"
                      image="/placeholder.svg?height=400&width=600"
                      category="Technology"
                      attendees="12K"
                    />
                    <EventCard
                      title="Art Exhibition"
                      location="London, UK"
                      date="Sep 5-15, 2023"
                      image="/placeholder.svg?height=400&width=600"
                      category="Arts & Theater"
                      attendees="7.3K"
                    />
                    <EventCard
                      title="Sports Championship"
                      location="Tokyo, Japan"
                      date="Oct 10-12, 2023"
                      image="/placeholder.svg?height=400&width=600"
                      category="Sports"
                      attendees="25K"
                    />
                    <EventCard
                      title="Wine Tasting Festival"
                      location="Paris, France"
                      date="Nov 18-20, 2023"
                      image="/placeholder.svg?height=400&width=600"
                      category="Food & Drink"
                      attendees="5.8K"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="music" className="mt-0">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <EventCard
                      title="Summer Music Festival"
                      location="Miami, FL"
                      date="Jun 15-18, 2023"
                      image="/placeholder.svg?height=400&width=600"
                      category="Music"
                      attendees="15.2K"
                    />
                    <EventCard
                      title="Jazz in the Park"
                      location="Chicago, IL"
                      date="Jul 22-23, 2023"
                      image="/placeholder.svg?height=400&width=600"
                      category="Music"
                      attendees="9.7K"
                    />
                    <EventCard
                      title="Electronic Dance Weekend"
                      location="Las Vegas, NV"
                      date="Aug 5-7, 2023"
                      image="/placeholder.svg?height=400&width=600"
                      category="Music"
                      attendees="18.3K"
                    />
                  </div>
                </TabsContent>

                {/* Other tab contents would be similar */}
              </Tabs>
            </div>

            <div className="mt-12 flex justify-center">
              <Button size="lg">View All Events</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

