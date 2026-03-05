import { notFound } from "next/navigation";
import Link from "next/link";
import { gyms, getGymBySlug } from "@/data/gyms";
import { Header } from "@/components/header";
import { PhotoGallery } from "@/components/photo-gallery";
import { PricingTable } from "@/components/pricing-table";
import { GoogleGymMap } from "@/components/google-gym-map";
import GymTrainers from "@/components/gym-trainers";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Dumbbell,
  Ruler,
  Calendar,
  ArrowLeft,
  Check,
} from "lucide-react";
import { getTrainersByGymId } from "@/data/trainer-gyms";


// const gymTrainers = trainerGyms.filter(
//   (trainer) => trainer.gymSlug === params.slug
// )

export function generateStaticParams() {
  return gyms.map((gym) => ({
    slug: gym.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gym = getGymBySlug(slug);

  

  if (!gym) {
    return {
      title: "Gym Not Found | GymFinder",
    };
  }

  return {
    title: `${gym.name} | GymFinder`,
    description: gym.description,
  };
}

export default async function GymDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gym = getGymBySlug(slug);
  
  if (!gym) {
    notFound();
  }
const trainers = getTrainersByGymId(gym.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all gyms
          </Button>
        </Link>
      </div>

      {/* Gym Header */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{gym.name}</h1>
              {gym.featured && (
                <Badge className="bg-primary text-primary-foreground">Featured</Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground italic mb-3">{gym.tagline}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{gym.rating}</span>
                <span className="text-muted-foreground">({gym.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{gym.city}, {gym.state}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Est. {gym.established}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border bg-transparent">
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            <a href="#pricing">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Join This Gym
              </Button>
            </a>
          </div>
        </div>

        {/* Photo Gallery */}
        <PhotoGallery photos={gym.photos} gymName={gym.name} />
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>About {gym.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{gym.description}</p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-border/50">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{gym.trainers}</p>
                  <p className="text-sm text-muted-foreground">Trainers</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6 text-center">
                  <Dumbbell className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{gym.equipment}+</p>
                  <p className="text-sm text-muted-foreground">Equipment</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6 text-center">
                  <Ruler className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{(gym.sqft / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Sq. Ft.</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6 text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{gym.rating}</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Amenities */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gym.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Features & Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {gym.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-sm py-1.5 px-3">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Section */}
            <div id="pricing">
              <h2 className="text-2xl font-bold text-foreground mb-6">Membership Plans</h2>
              <PricingTable pricing={gym.pricing} gym={gym} />
              {/* Trainer Section */}
              
{/* Trainer Section */}
<div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">Choose Your Trainer</h2>
  <GymTrainers trainers={trainers} />
</div>


            </div>
          </div>

   {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{gym.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {gym.city}, {gym.state} {gym.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href={`tel:${gym.phone}`} className="hover:text-primary transition-colors">
                    {gym.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href={`mailto:${gym.email}`} className="hover:text-primary transition-colors text-sm">
                    {gym.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <a
                    href={`https://${gym.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors text-sm"
                  >
                    {gym.website}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">{gym.operatingHours.weekdays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">{gym.operatingHours.saturday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">{gym.operatingHours.sunday}</span>
                </div>
              </CardContent>
            </Card>

           
            {/* Location Map */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Location & Service Area</h3>
              <GoogleGymMap gym={gym} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GymFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 GymFinder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
