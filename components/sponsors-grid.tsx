
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe, Instagram, ExternalLink } from "lucide-react";

interface SponsorsGridProps {
  sponsors: any[];
}

export function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {sponsors.map((sponsor, index) => {
        const logoUrl = typeof sponsor === 'string'
          ? `/sponsors/${sponsor}`
          : sponsor.logo_path || sponsor.logo?.url;

        const websiteUrl = sponsor.website_url || sponsor.website;
        const instagramUrl = sponsor.instagram_url;

        return (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white border-slate-100 hover:border-primary/20 overflow-hidden cursor-pointer">
                <CardContent className="p-6 flex items-center justify-center w-full aspect-square relative bg-white">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={logoUrl}
                      alt={sponsor.name || `Patrocinador ${index + 1}`}
                      className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900 text-center mb-4">
                  {sponsor.name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="w-48 h-48 rounded-2xl bg-slate-50 border border-slate-100 p-8 flex items-center justify-center">
                  <img
                    src={logoUrl}
                    alt={sponsor.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="grid w-full gap-3">
                  {websiteUrl && (
                    <Button asChild variant="outline" className="w-full h-12 text-base font-semibold border-slate-200 hover:bg-slate-50 hover:text-primary transition-all">
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <Globe className="w-5 h-5" />
                        Visitar Website
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </a>
                    </Button>
                  )}

                  {instagramUrl && (
                    <Button asChild className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-lg shadow-pink-500/20 transition-all active:scale-[0.98]">
                      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <Instagram className="w-5 h-5" />
                        Seguir no Instagram
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </a>
                    </Button>
                  )}

                  {!websiteUrl && !instagramUrl && (
                    <p className="text-center text-slate-500 italic text-sm">
                      Links em breve
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}







