import { VueConstructor } from "vue";

import FooterNav from "@/components/Footer.vue";
import HeaderBar from "@/components/Header.vue";
import PlainText from "@/components/PlainText.vue";

import HomeButton from "@/components/HomeButton.vue";

import Navigation from "@/components/horizontal/Navigation.vue";

import SideMenu from '@/components/partials/SideMenu.vue'

import Carousel from "@/components/BTW/Carousel.vue";
import ClickRevealChecks from "@/components/BTW/ClickRevealChecks.vue";
import ClickRevealHotspots from "@/components/BTW/ClickRevealHotspots.vue";
import ClickRevealIcons from "@/components/BTW/ClickRevealIcons.vue";
import ClickRevealImages from "@/components/BTW/ClickRevealImages.vue";
import TextImage from "@/components/BTW/TextImage.vue";
import TextOverlay from "@/components/BTW/TextOverlay.vue";
import Media from "@/components/BTW/Media.vue";
import Pins from "@/components/BTW/Pins.vue";
import Steps from "@/components/BTW/Steps.vue";
import Quiz from "@/components/BTW/Quiz.vue";

const Components: { [key: string]: VueConstructor } = {
  FooterNav,
  HeaderBar,
  HomeButton,
  Navigation,
  PlainText,
  SideMenu,

  Carousel,
  ClickRevealChecks,
  ClickRevealHotspots,
  ClickRevealIcons,
  ClickRevealImages,
  TextImage,
  TextOverlay,
  Media,
  Pins,
  Steps,
  Quiz
};

export default Components;
