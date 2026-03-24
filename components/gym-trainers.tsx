"use client"

import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Award, DollarSign, Lock, Eye } from "lucide-react"

interface Trainer {
  id: string
  name: string
  experience?: string
  yearsExperience?: number
  specialization: string
  image?: string
  avatar?: string
  gymSlug: string
  gymId: string          // needed to check subscription
  rating?: number
  hourlyRate?: number
  certifications?: string
}

interface GymTrainersProps {
  trainers: Trainer[]
  gymId: string
  gymSlug: string
}

export default function GymTrainers({ trainers, gymId, gymSlug }: GymTrainersProps) {
  const { isAuthenticated } = useAuth()
  const { subscriptions } = useUser()

  // Check if user has an active subscription to THIS gym
  const hasSubscription = isAuthenticated && subscriptions.some(
    s => s.gymId === gymId && (s.status === "active" || s.status === "pending_checkin")
  )

  if (!trainers || trainers.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No trainers available for this gym yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Subscription prompt banner — only show if not subscribed */}
      {!hasSubscription && (
        <div className="flex items-center justify-between gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-yellow-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Subscribe to unlock trainer profiles</p>
              <p className="text-xs text-muted-foreground">Get a gym membership to view trainer details and book sessions</p>
            </div>
          </div>
          <a href={`/gym/${gymSlug}#pricing`}>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
              View Plans
            </Button>
          </a>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trainers.map((trainer) => {
          const photoSrc = trainer.avatar || trainer.image || "/placeholder-user.jpg"
          const experienceLabel = trainer.experience || (trainer.yearsExperience ? `${trainer.yearsExperience} years` : null)
          const profileUrl = `/gym/${gymSlug}/trainers/${trainer.id}`

          return (
            <Card
              key={trainer.id}
              className={`border-border/50 overflow-hidden transition-all ${
                hasSubscription
                  ? "hover:border-primary/50 group"
                  : "opacity-90"
              }`}
            >
              {/* Photo */}
              <div className="relative h-44 overflow-hidden bg-secondary">
                <img
                  src={photoSrc}
                  alt={trainer.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    hasSubscription ? "group-hover:scale-105" : "filter brightness-75"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                {/* Lock overlay if no subscription */}
                {!hasSubscription && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/70 backdrop-blur-sm rounded-full p-3">
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                )}

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

                {/* Stats — always visible */}
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
                      {hasSubscription
                        ? <span>₹{trainer.hourlyRate}/hr</span>
                        : <span className="blur-sm select-none">₹XX/hr</span>
                      }
                    </div>
                  )}
                </div>

                {trainer.certifications && (
                  <p className="text-xs text-muted-foreground truncate">
                    🏅 {hasSubscription ? trainer.certifications : "Subscribe to view"}
                  </p>
                )}

                {/* Buttons — conditional on subscription */}
                <div className="pt-1 border-t border-border/50">
                  {hasSubscription ? (
                    /* Subscribed: two buttons */
                    <div className="flex gap-2">
                      <Link href={profileUrl} className="flex-1">
                        <Button variant="outline" className="w-full border-border bg-transparent text-xs gap-1.5">
                          <Eye className="h-3.5 w-3.5" />View Profile
                        </Button>
                      </Link>
                      <Link href={profileUrl} className="flex-1">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                          Book
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    /* Not subscribed: single locked button redirecting to pricing */
                    <a href={`/gym/${gymSlug}#pricing`} className="block">
                      <Button
                        variant="outline"
                        className="w-full border-border bg-transparent text-xs gap-1.5 text-muted-foreground"
                      >
                        <Lock className="h-3.5 w-3.5" />Subscribe to View & Book
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
