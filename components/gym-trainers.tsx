"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Award, DollarSign } from "lucide-react"

interface Trainer {
  id: string
  name: string
  experience?: string
  yearsExperience?: number
  specialization: string
  image?: string
  avatar?: string
  gymSlug: string
  rating?: number
  hourlyRate?: number
  certifications?: string
}

export default function GymTrainers({ trainers }: { trainers: Trainer[] }) {
  if (!trainers || trainers.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No trainers available for this gym yet.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {trainers.map((trainer) => {
        const photoSrc = trainer.avatar || trainer.image || "/placeholder-user.jpg"
        const experienceLabel = trainer.experience || (trainer.yearsExperience ? `${trainer.yearsExperience} years` : null)
        const profileUrl = `/gym/${trainer.gymSlug}/trainers/${trainer.id}`

        return (
          <Card key={trainer.id} className="border-border/50 overflow-hidden group hover:border-primary/50 transition-all">
            {/* Photo */}
            <div className="relative h-44 overflow-hidden bg-secondary">
              <img
                src={photoSrc}
                alt={trainer.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              {trainer.rating && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold text-foreground">{trainer.rating}</span>
                </div>
              )}
            </div>

            <CardContent className="p-4 space-y-3">
              {/* Name + Specialization */}
              <div>
                <h3 className="text-base font-semibold text-foreground">{trainer.name}</h3>
                <Badge className="mt-1 bg-primary/20 text-primary text-xs">{trainer.specialization}</Badge>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {experienceLabel && (
                  <div className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-primary" />
                    <span>{experienceLabel} exp</span>
                  </div>
                )}
                {trainer.hourlyRate && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-green-500" />
                    <span>₹{trainer.hourlyRate}/hr</span>
                  </div>
                )}
              </div>

              {/* Certs */}
              {trainer.certifications && (
                <p className="text-xs text-muted-foreground truncate">🏅 {trainer.certifications}</p>
              )}

              {/* TWO separate buttons */}
              <div className="flex gap-2 pt-1 border-t border-border/50">
                <Link href={profileUrl} className="flex-1">
                  <Button variant="outline" className="w-full border-border bg-transparent text-xs">
                    View Profile
                  </Button>
                </Link>
                <Link href={profileUrl} className="flex-1">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                    Book
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
