import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface EventCardProps {
  title: string
  location: string
  date: string
  image: string
  category: string
  attendees: string
}

export default function EventCard({ title, location, date, image, category, attendees }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-[16/9] relative">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <Badge className="absolute top-2 right-2">{category}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{location}</span>
        </div>
        <div className="text-sm text-muted-foreground">{date}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-sm">
          <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{attendees} attending</span>
        </div>
        <Link href="#" className="text-sm font-medium text-primary hover:underline">
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}

