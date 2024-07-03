import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import { HomeModules } from "@/components/sections/home-modules";
import InfoLanding from "@/components/sections/info-landing";
import Posts from "@/components/sections/posts";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";

export default function IndexPage() {
  return (
    <div>
      <HomeModules />
      <Posts />
    </div>
  );
}
