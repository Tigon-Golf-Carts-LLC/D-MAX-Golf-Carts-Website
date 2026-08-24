import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDown, ArrowUpRight, BatteryCharging, CarFront, ChevronLeft, ChevronRight, Download, Gauge, Menu, Moon, Mountain, PhoneCall, ShieldCheck, Sun, X, Zap } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

import { useSeoHead } from '@/use-seo-head';

const queryClient = new QueryClient();

type ModelKey = 'GT4' | 'GT6' | 'XT4' | 'XT6';

const models: Record<ModelKey, {
  name: ModelKey;
  type: string;
  image: string;
  passengers: string;
  drive: string;
  range: string;
  speed: string;
  price: string;
  description: string;
  badge: string;
}> = {
  GT4: {
    name: 'GT4',
    type: 'Grand Touring / four seat',
    image: '/models/gt4.jpg',
    passengers: '4 passengers',
    drive: 'Rear-wheel drive',
    range: '45 mi',
    speed: '25 mph',
    price: '$13,595',
    description: 'The sharp, social runabout. A premium four-seat layout with a road-going stance, tuned for effortless resort loops and long afternoons outside.',
    badge: '4-PASSENGER GRAND TOURER',
  },
  GT6: {
    name: 'GT6',
    type: 'Grand Touring / six seat',
    image: '/models/gt6.jpg',
    passengers: '6 passengers',
    drive: 'Rear-wheel drive',
    range: '45 mi',
    speed: '25 mph',
    price: '$15,595',
    description: 'Bring the whole crew. GT6 stretches the D-MAX cabin into a composed six-passenger cruiser without giving up the details that make every drive feel special.',
    badge: '6-PASSENGER GRAND TOURER',
  },
  XT4: {
    name: 'XT4',
    type: 'Xtreme Terrain / four seat',
    image: '/models/xt4.jpg',
    passengers: '4 passengers',
    drive: '4x4 all-wheel drive',
    range: '48 mi',
    speed: '25 mph',
    price: '$15,595',
    description: 'Four driven wheels, four proper seats. XT4 turns the trail into a destination with all-wheel traction, lifted clearance, and a seriously capable attitude.',
    badge: '4-PASSENGER • 4X4 AWD',
  },
  XT6: {
    name: 'XT6',
    type: 'Xtreme Terrain / six seat',
    image: '/models/xt6.jpg',
    passengers: '6 passengers',
    drive: '4x4 all-wheel drive',
    range: '48 mi',
    speed: '25 mph',
    price: '$17,595',
    description: 'The big-mission machine. Six seats, 4x4 all-wheel drive, and the ground clearance to move your people further beyond the pavement.',
    badge: '6-PASSENGER • 4X4 AWD',
  },
};

const sponsoredModelLinks: Record<ModelKey, string> = {
  GT4: 'https://tigongolfcarts.com/evolution/d6-max-gt4',
  GT6: 'https://tigongolfcarts.com/evolution/d6-max-gt6',
  XT4: 'https://tigongolfcarts.com/evolution/d6-max-xt4',
  XT6: 'https://tigongolfcarts.com/evolution/d6-max-xt6',
};

const gt4Colors = [
  { name: 'Arctic Gray', image: '/gt4/colors/D-MAX-GT4-color-ARCTIC-GRAY_1787582393484.png' },
  { name: 'Portimao Blue', image: '/gt4/colors/D-MAX-GT4-color-PORTIMAO-BLUE_1787582393484.png' },
  { name: 'Black Sapphire', image: '/gt4/colors/D-Max-GT4-color-BLACK-SAPPHIRE_1787582393485.png' },
  { name: 'Mineral White', image: '/gt4/colors/D-MAX-GT4-color-MINERAL-WHITE_1787582393485.png' },
];

const gt4Features = [
  'Adjustable steering column',
  '10.1 inch touchscreen with CarPlay compatibility',
  'Retractable rear tray with portable 74-QT cooler',
  'Foldable rear basket with portable utility box',
  'Extended rear tray with optional golf bag holder for up to 4 bags',
  'Multifunction dash with built-in refrigerator and dual wireless cell phone charger',
  'Automotive-grade and marine-style luxury seats',
  '24-speaker surround sound system with seat bucket speakers, roof speakers, and dual soundbar',
  'Cupholders, USB ports, and storage pockets for all passengers',
  'Electric motor with EM brake and brake release',
  'LED headlights and taillights',
  'Foldable windshield with sliding air vents',
  'Automobile-style rear bumper',
  '16×8.5 aluminum wheels with 225/45R16 radial tires',
  'Automotive e-coat chassis',
];

const gt4Gallery = [
  { title: 'GT4 from every angle', image: '/gt4/gallery/vehicle-rear.jpg' },
  { title: 'Advanced dashboard', image: '/gt4/gallery/dashboard.jpg' },
  { title: '16-inch radial tire', image: '/gt4/gallery/radial-tire.jpg' },
  { title: 'LED lighting', image: '/gt4/gallery/led-lighting.jpg' },
  { title: 'Seat backcover assembly', image: '/gt4/gallery/seat-backcover.jpg' },
  { title: 'Passenger safety belt', image: '/gt4/gallery/safety-belt.jpg' },
  { title: 'Advanced dash panel', image: '/gt4/gallery/advanced-dash.jpg' },
  { title: 'Golf bag holder', image: '/gt4/gallery/golf-bag-holder.jpg' },
  { title: 'Detachable cooler box', image: '/gt4/gallery/cooler-box.jpg' },
  { title: 'Foldable rear storage basket', image: '/gt4/gallery/rear-basket.jpg' },
  { title: 'Built-in dash refrigerator', image: '/gt4/gallery/dash-refrigerator.jpg' },
  { title: 'Dual wireless charging', image: '/gt4/gallery/wireless-charging.jpg' },
  { title: '16-speaker sound system', image: '/gt4/gallery/sound-system.jpg' },
  { title: 'Touchscreen with CarPlay', image: '/gt4/gallery/touchscreen.jpg' },
];

const gt6Colors = [
  { name: 'Arctic Gray', image: '/gt6/colors/evolution-d-max-artic-gray.png' },
  { name: 'Portimao Blue', image: '/gt6/colors/evolution-d-max-gt6-portimao-blue.png' },
  { name: 'Black Sapphire', image: '/gt6/colors/evolution-d-max-black-sapphire.png' },
  { name: 'Pearl White', image: '/gt6/colors/evolution-d-max-pearl-white.png' },
];

const gt6Features = [
  'Adjustable steering column', '10.1 inch touchscreen with CarPlay compatibility', 'Sliding rear tray with portable 74-QT cooler',
  'Electric power steering', 'Foldable basket with portable storage caddy', 'Golf bag holder with dual-holder option',
  'Multifunction dash with built-in refrigerator and wireless cell phone charger', 'Marine luxury seats',
  'Roof-mounted speakers and dual soundbar', 'Cupholders, USB ports, and storage pockets for all passengers',
  'EM brake', 'LED headlights and taillights', 'Foldable windshield with slidable air vents',
  'Automobile-style rear bumper', '16×8.5 aluminum wheels with 225/45R16 radial tires', 'Automotive e-coat chassis',
];

const gt6Gallery = [
  { title: 'GT6 feature detail', image: '/gt6/gallery/DMAX-DASHBOARD-1.jpg' },
  { title: 'Advanced dash panel', image: '/gt6/gallery/D-MAX-Advanced-Dash-Panel.jpg' },
  { title: '16-inch radial tire', image: '/gt6/gallery/D-MAX-16-RADIAL-TIRE.jpg' },
  { title: 'LED lighting', image: '/gt6/gallery/D-MAX-led-LIGHTING.jpg' },
  { title: 'Seat backcover assembly', image: '/gt6/gallery/D-MAX-SEAT-BACKCOVER-ASSEMBLY.jpg' },
  { title: 'Passenger safety belt', image: '/gt6/gallery/D-MAX-SAFETY-BELT.jpg' },
  { title: 'Golf bag holder', image: '/gt6/gallery/D-MAX-GOLF-BAG-HOLDER.jpg' },
  { title: 'Detachable cooler box', image: '/gt6/gallery/D-MAX-Detachable-drag-insulation-box-1.jpg' },
  { title: 'Foldable rear storage basket', image: '/gt6/gallery/D-MAX-Foldable-rear-storage-basket-1.jpg' },
  { title: 'Built-in dash refrigerator', image: '/gt6/gallery/D-MAX-BUILT-IN-DASH-REFRIGERATOR.jpg' },
  { title: 'Dual wireless charging', image: '/gt6/gallery/D-MAX-DOUBLE-WIRELESS-MOBILE-PHONE-CHARGING.jpg' },
  { title: 'Multicolor LED speakers', image: '/gt6/gallery/Features-ALL-d6-Multicolor-LED-Lighted-Speakers-6.jpg' },
  { title: 'Touchscreen with CarPlay', image: '/gt6/gallery/D-MAX_-TOUCHSCREEN-WITH-Carplay-Compatibility.jpg' },
];

const xt4Colors = [
  { name: 'Arctic Gray', image: '/xt4/colors/evolution-d-max-xt4-artic-gray.png' },
  { name: 'Portimao Blue', image: '/xt4/colors/evolution-d-max-gt6-portimao-blue-.png' },
  { name: 'Black Sapphire', image: '/xt4/colors/evolution-d-max-xt4-black-sapphire.png' },
  { name: 'Mineral White', image: '/xt4/colors/evolution-d-max-xt4-mineral-white.png' },
];

const xt4Features = [
  'On-demand 4-wheel drive', 'Electric power steering', 'Adjustable steering column',
  '10.1 inch touchscreen with CarPlay compatibility', 'Sliding rear tray with portable 74-QT cooler',
  'Foldable basket with portable utility box', 'Extended rear tray with optional golf bag holder extension for up to 4 bags',
  'Multifunction dash with built-in refrigerator and wireless cell phone charger',
  'Automotive-grade and marine-style luxury seats', 'Surround sound system with seat bucket speakers, roof-mounted speakers, and dual soundbar',
  'Cupholders, USB ports, and storage pockets for all passengers', 'Electric motor with EM brake and brake release',
  'LED headlights and taillights', 'LED illuminated running board', 'Foldable windshield with slidable air vents',
  'Automobile-style rear bumper', 'Premium brushguard', '16×8.5 aluminum wheels with 24×10R16 quiet all-terrain tires',
  'Automotive e-coat chassis',
];

const xt4Gallery = [
  { title: 'On-demand 4-wheel drive', image: '/xt4/gallery/D-Max-XT4-ON-DEMAND-4-WHEEL-DRIVE-1.jpg' },
  { title: 'Electric power steering', image: '/xt4/gallery/D-Max-XT4-Electric-Power-Steering-1.jpg' },
  { title: 'Quiet all-terrain tire', image: '/xt4/gallery/Features-ALL-d6-16-SILENT-TIRE-WITH-OFF-ROAD-THREAD.jpg' },
  { title: 'LED illuminated side steps', image: '/xt4/gallery/Features-ALL-d6-LUMINOUS-SIDE-STEPS-4.jpg' },
  { title: 'LED lighting', image: '/xt4/gallery/D-MAX-led-LIGHTING.jpg' },
  { title: 'Premium seat details', image: '/xt4/gallery/D-MAX-SEAT-BACKCOVER-ASSEMBLY.jpg' },
  { title: 'Passenger safety belt', image: '/xt4/gallery/D-MAX-SAFETY-BELT.jpg' },
  { title: 'Golf bag holder', image: '/xt4/gallery/D-MAX-GOLF-BAG-HOLDER.jpg' },
  { title: 'Detachable cooler box', image: '/xt4/gallery/D-MAX-Detachable-drag-insulation-box-1.jpg' },
  { title: 'Foldable rear storage basket', image: '/xt4/gallery/D-MAX-Foldable-rear-storage-basket-1.jpg' },
  { title: 'Built-in dash refrigerator', image: '/xt4/gallery/D-MAX-BUILT-IN-DASH-REFRIGERATOR.jpg' },
  { title: 'Dual wireless charging', image: '/xt4/gallery/D-MAX-DOUBLE-WIRELESS-MOBILE-PHONE-CHARGING.jpg' },
  { title: '16-speaker off-road sound system', image: '/xt4/gallery/D-Max-XT4-16-speaker-Sound-System-off-road-1.jpg' },
  { title: 'Touchscreen with CarPlay', image: '/xt4/gallery/D-MAX_-TOUCHSCREEN-WITH-Carplay-Compatibility.jpg' },
];

const xt6Colors = [
  { name: 'Black Sapphire', image: '/xt6/colors/evolution-d-max-xt6-black-sapphire.png' },
  { name: 'Flamenco Red', image: '/xt6/colors/evolution-d-max-xt6-flamenco-red.png' },
  { name: 'Mineral White', image: '/xt6/colors/evolution-d-max-xt6-mineral-white.png' },
  { name: 'Portimao Blue', image: '/xt6/colors/evolution-d-max-xt6-portimao-blue.png' },
];

const xt6Features = [
  'Adjustable steering column', '10.1 inch touchscreen with CarPlay compatibility',
  'Sliding rear tray with portable 74-QT cooler', 'On-demand 4-wheel drive', 'Electric power steering',
  'Foldable basket with portable storage caddy', 'Golf bag holder with dual-holder option',
  'Multifunction dash with built-in refrigerator and wireless cell phone charger', 'Marine luxury seats',
  'Roof-mounted speakers and dual soundbar', 'Cupholders, USB ports, and storage pockets for all passengers',
  'EM brake', 'LED headlights and taillights', 'Foldable windshield with slidable air vents',
  'Automobile-style rear bumper', '16×8.5 aluminum wheels with 225/45R16 radial tires', 'Automotive e-coat chassis',
];

const xt6Gallery = [
  { title: 'XT6 six-wheel-drive profile', image: '/xt6/gallery/D-MAX-6-WHEEL-DRIVE-pic-a.jpg' },
  { title: 'Luxury six-seat interior', image: '/xt6/gallery/D6-pic-a-LUXURY-SEATS-w.jpg' },
  { title: 'Advanced dashboard', image: '/xt6/gallery/DMAX-DASHBOARD-1.jpg' },
  { title: 'Multicolor LED speakers', image: '/xt6/gallery/Features-ALL-d6-Multicolor-LED-Lighted-Speakers-6.jpg' },
  { title: 'LED lighting', image: '/xt6/gallery/D-MAX-led-LIGHTING.jpg' },
  { title: '16-inch radial tire', image: '/xt6/gallery/Features-ALL-d6-16-SILENT-TIRE-WITH-OFF-ROAD-THREAD.jpg' },
  { title: 'LED illuminated side steps', image: '/xt6/gallery/Features-ALL-d6-LUMINOUS-SIDE-STEPS-6.jpg' },
  { title: 'Seat backcover assembly', image: '/xt6/gallery/D-MAX-SEAT-BACKCOVER-ASSEMBLY.jpg' },
  { title: 'Golf bag holder', image: '/xt6/gallery/D-MAX-GOLF-BAG-HOLDER.jpg' },
  { title: 'Built-in dash refrigerator', image: '/xt6/gallery/D-MAX-BUILT-IN-DASH-REFRIGERATOR.jpg' },
  { title: 'Dual wireless charging', image: '/xt6/gallery/D-MAX-DOUBLE-WIRELESS-MOBILE-PHONE-CHARGING.jpg' },
  { title: 'Foldable rear storage basket', image: '/xt6/gallery/D-MAX-Foldable-rear-storage-basket-1.jpg' },
  { title: 'Touchscreen with CarPlay', image: '/xt6/gallery/D-MAX_-TOUCHSCREEN-WITH-Carplay-Compatibility.jpg' },
];

const modelCardImages: Record<ModelKey, string> = {
  GT4: gt4Colors[0].image,
  GT6: gt6Colors[0].image,
  XT4: xt4Colors[0].image,
  XT6: xt6Colors[0].image,
};

function GT4Details({ onOrder }: { onOrder: () => void }) {
  const [activeGallery, setActiveGallery] = useState(0);
  const activeGalleryItem = gt4Gallery[activeGallery];
  const showPrevious = () => setActiveGallery((current) => (current - 1 + gt4Gallery.length) % gt4Gallery.length);
  const showNext = () => setActiveGallery((current) => (current + 1) % gt4Gallery.length);
  return (
    <section className="gt4-details section section-dark">
      <div className="section-wrap">
        <div className="gt4-story reveal">
          <div><div className="eyebrow">The ultimate forward-facing design</div><h2 className="section-title">Embrace<br /><em>the beast.</em></h2></div>
          <div><p>Evolution D-MAX GT4 is crafted for those who demand both functionality and elegance in a golf car. Its spacious four-seat configuration, automotive-grade luxury seats, and rotating armrests provide comfort for every passenger.</p><p>The streamlined forward-facing design is paired with a 10.1-inch touchscreen with CarPlay, Bluetooth, and a backup camera, keeping every journey connected and informed.</p><p>With a built-in refrigerator, wireless charging, and immersive sound system, the GT4 turns every outing into an occasion—whether you are navigating the golf course or exploring your community.</p></div>
        </div>
        <div className="gt4-info-grid">
          <div className="gt4-info-panel reveal"><div className="eyebrow">Standard equipment</div><h3>Features</h3><ul>{gt4Features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
          <div className="gt4-info-panel reveal stagger-1"><div className="eyebrow">Power system</div><h3>Power</h3><div className="gt4-stat-list"><div><strong>48V</strong><span>Lithium battery with smart management</span></div><div><strong>6.3kW</strong><span>Motor with EM brake</span></div><div><strong>400A</strong><span>AC controller</span></div><div><strong>25A</strong><span>On-board charger</span></div><div><strong>19 mph</strong><span>Maximum speed</span></div></div><div className="gt4-dimensions"><span>Dimensions</span><strong>122.6 × 56.1 × 83.7 in</strong><small>Rearview mirror width included</small></div></div>
        </div>
        <div className="gt4-gallery-heading reveal"><div className="eyebrow">See the details</div><h3>GT4 gallery.</h3></div>
        <div className="gt4-gallery reveal">
          <div className="gt4-slideshow">
            <div className="gt4-slideshow-image"><img src={activeGalleryItem.image} alt={activeGalleryItem.title} /><div className="gt4-slide-count">{String(activeGallery + 1).padStart(2, '0')} / {String(gt4Gallery.length).padStart(2, '0')}</div><button className="gt4-slide-arrow gt4-slide-prev" onClick={showPrevious} type="button" aria-label="Previous GT4 gallery image"><ChevronRight size={18} /></button><button className="gt4-slide-arrow gt4-slide-next" onClick={showNext} type="button" aria-label="Next GT4 gallery image"><ChevronRight size={18} /></button></div>
            <div className="gt4-slide-caption"><span>GT4 / feature detail</span><strong>{activeGalleryItem.title}</strong></div>
          </div>
          <div className="gt4-gallery-accordion" role="list" aria-label="GT4 gallery images">
            {gt4Gallery.map((item, index) => <button className={`gt4-gallery-row ${activeGallery === index ? 'active' : ''}`} key={item.image} onClick={() => setActiveGallery(index)} type="button" role="listitem" aria-current={activeGallery === index ? 'true' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><ChevronRight size={15} /></button>)}
          </div>
        </div>
        <div className="gt4-downloads reveal"><div><div className="eyebrow">Download the details</div><h3>Take the GT4<br />with you.</h3></div><div className="gt4-download-actions"><a className="button-ghost" href="/gt4/docs/gt4-sell-sheet.pdf" download>GT4 sell sheet <Download size={15} /></a><a className="button-ghost" href="/gt4/docs/dmax-series-brochure.pdf" download>D-MAX series brochure <Download size={15} /></a><button className="button-primary" onClick={onOrder} type="button">Order yours today <ArrowUpRight size={15} /></button></div></div>
      </div>
    </section>
  );
}

function GT6Details({ onOrder }: { onOrder: () => void }) {
  const [activeGallery, setActiveGallery] = useState(0);
  const activeGalleryItem = gt6Gallery[activeGallery];
  const showPrevious = () => setActiveGallery((current) => (current - 1 + gt6Gallery.length) % gt6Gallery.length);
  const showNext = () => setActiveGallery((current) => (current + 1) % gt6Gallery.length);
  return (
    <section className="gt4-details section section-dark">
      <div className="section-wrap">
        <div className="gt4-story reveal">
          <div><div className="eyebrow">Premium six-seater</div><h2 className="section-title">Experience<br /><em>elite comfort.</em></h2></div>
          <div><p>Discover the epitome of luxury and style with the trendsetting six-seater D-MAX GT6, designed for the discerning rider seeking both comfort and class.</p><p>Each seat offers unparalleled comfort, while the state-of-the-art touchscreen interface with Apple CarPlay and Android Auto compatibility keeps every journey connected.</p><p>Perfect for upscale golf courses, gated communities, or leisurely cruises, GT6 sets the standard in high-class travel.</p></div>
        </div>
        <div className="gt4-info-grid">
          <div className="gt4-info-panel reveal"><div className="eyebrow">Standard equipment</div><h3>Features</h3><ul>{gt6Features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
          <div className="gt4-info-panel reveal stagger-1"><div className="eyebrow">Power system</div><h3>Power</h3><div className="gt4-stat-list"><div><strong>48V</strong><span>Lithium battery with smart management system</span></div><div><strong>6.3kW</strong><span>Motor with EM brake</span></div><div><strong>400A</strong><span>AC controller</span></div><div><strong>25A</strong><span>On-board charger</span></div><div><strong>19 mph</strong><span>Maximum speed</span></div></div><div className="gt4-dimensions"><span>Dimensions</span><strong>156.1 × 56.1 × 84.6 in</strong><small>Rearview mirror width included</small></div></div>
        </div>
        <div className="gt4-gallery-heading reveal"><div className="eyebrow">See the details</div><h3>GT6 gallery.</h3></div>
        <div className="gt4-gallery reveal">
          <div className="gt4-slideshow"><div className="gt4-slideshow-image"><img src={activeGalleryItem.image} alt={activeGalleryItem.title} /><div className="gt4-slide-count">{String(activeGallery + 1).padStart(2, '0')} / {String(gt6Gallery.length).padStart(2, '0')}</div><button className="gt4-slide-arrow gt4-slide-prev" onClick={showPrevious} type="button" aria-label="Previous GT6 gallery image"><ChevronRight size={18} /></button><button className="gt4-slide-arrow gt4-slide-next" onClick={showNext} type="button" aria-label="Next GT6 gallery image"><ChevronRight size={18} /></button></div><div className="gt4-slide-caption"><span>GT6 / feature detail</span><strong>{activeGalleryItem.title}</strong></div></div>
          <div className="gt4-gallery-accordion" role="list" aria-label="GT6 gallery images">{gt6Gallery.map((item, index) => <button className={`gt4-gallery-row ${activeGallery === index ? 'active' : ''}`} key={item.image} onClick={() => setActiveGallery(index)} type="button" role="listitem" aria-current={activeGallery === index ? 'true' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><ChevronRight size={15} /></button>)}</div>
        </div>
        <div className="gt4-downloads reveal"><div><div className="eyebrow">Download the details</div><h3>Take the GT6<br />with you.</h3></div><div className="gt4-download-actions"><a className="button-ghost" href="/gt6/docs/gt6-sell-sheet.pdf" download>GT6 sell sheet <Download size={15} /></a><a className="button-ghost" href="/gt6/docs/dmax-series-brochure.pdf" download>D-MAX series brochure <Download size={15} /></a><button className="button-primary" onClick={onOrder} type="button">Order yours today <ArrowUpRight size={15} /></button></div></div>
      </div>
    </section>
  );
}

function XT4Details({ onOrder }: { onOrder: () => void }) {
  const [activeGallery, setActiveGallery] = useState(0);
  const activeGalleryItem = xt4Gallery[activeGallery];
  const showPrevious = () => setActiveGallery((current) => (current - 1 + xt4Gallery.length) % xt4Gallery.length);
  const showNext = () => setActiveGallery((current) => (current + 1) % xt4Gallery.length);
  return (
    <section className="gt4-details section section-dark">
      <div className="section-wrap">
        <div className="gt4-story reveal">
          <div><div className="eyebrow">Premium four-seater / on-demand 4WD</div><h2 className="section-title">Redefining<br /><em>outdoor excellence.</em></h2></div>
          <div><p>Evolution D-MAX XT4 transforms rugged landscapes into your playground. This vehicle epitomizes robust design and engineering excellence, crafted for the thrill-seeker in you.</p><p>The heightened chassis and advanced shock absorbers conquer harsh terrain, while the feature-rich interior, multi-functional touchscreen, and premium sound system keep every adventure stylish and exhilarating.</p><p>On-demand 4-wheel drive offers unparalleled control and traction, making every journey an adventure.</p></div>
        </div>
        <div className="gt4-info-grid">
          <div className="gt4-info-panel reveal"><div className="eyebrow">Off-road equipment</div><h3>Features</h3><ul>{xt4Features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
          <div className="gt4-info-panel reveal stagger-1"><div className="eyebrow">Power system</div><h3>Power</h3><div className="gt4-stat-list"><div><strong>48V</strong><span>Lithium battery with smart management system</span></div><div><strong>6.3kW</strong><span>Motor with EM brake</span></div><div><strong>400A</strong><span>AC controller</span></div><div><strong>25A</strong><span>On-board charger</span></div><div><strong>19 mph</strong><span>Maximum speed</span></div></div><div className="gt4-dimensions"><span>Dimensions</span><strong>122.6 × 56.1 × 83.9 in</strong><small>Rearview mirror width included</small></div></div>
        </div>
        <div className="gt4-story xt4-story-accent reveal"><div><div className="eyebrow">Embrace the beast</div><h3 className="section-title">Built to<br /><em>break away.</em></h3></div><div><p>XT4 transcends mere transportation, making a dynamic statement on every journey. Aggressive off-road tires deliver maximum traction, while the rugged beast-like exterior and functional side running board blend style with substance.</p></div></div>
        <div className="gt4-gallery-heading reveal"><div className="eyebrow">See the details</div><h3>XT4 gallery.</h3></div>
        <div className="gt4-gallery reveal">
          <div className="gt4-slideshow"><div className="gt4-slideshow-image"><img src={activeGalleryItem.image} alt={activeGalleryItem.title} /><div className="gt4-slide-count">{String(activeGallery + 1).padStart(2, '0')} / {String(xt4Gallery.length).padStart(2, '0')}</div><button className="gt4-slide-arrow gt4-slide-prev" onClick={showPrevious} type="button" aria-label="Previous XT4 gallery image"><ChevronRight size={18} /></button><button className="gt4-slide-arrow gt4-slide-next" onClick={showNext} type="button" aria-label="Next XT4 gallery image"><ChevronRight size={18} /></button></div><div className="gt4-slide-caption"><span>XT4 / feature detail</span><strong>{activeGalleryItem.title}</strong></div></div>
          <div className="gt4-gallery-accordion" role="list" aria-label="XT4 gallery images">{xt4Gallery.map((item, index) => <button className={`gt4-gallery-row ${activeGallery === index ? 'active' : ''}`} key={item.image} onClick={() => setActiveGallery(index)} type="button" role="listitem" aria-current={activeGallery === index ? 'true' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><ChevronRight size={15} /></button>)}</div>
        </div>
        <div className="gt4-downloads reveal"><div><div className="eyebrow">Download the details</div><h3>Take the XT4<br />with you.</h3></div><div className="gt4-download-actions"><a className="button-ghost" href="/xt4/docs/xt4-sell-sheet.pdf" download>XT4 sell sheet <Download size={15} /></a><a className="button-ghost" href="/xt4/docs/dmax-series-brochure.pdf" download>D-MAX series brochure <Download size={15} /></a><button className="button-primary" onClick={onOrder} type="button">Order yours today <ArrowUpRight size={15} /></button></div></div>
      </div>
    </section>
  );
}

function XT6Details({ onOrder }: { onOrder: () => void }) {
  const [activeGallery, setActiveGallery] = useState(0);
  const activeGalleryItem = xt6Gallery[activeGallery];
  const showPrevious = () => setActiveGallery((current) => (current - 1 + xt6Gallery.length) % xt6Gallery.length);
  const showNext = () => setActiveGallery((current) => (current + 1) % xt6Gallery.length);
  return (
    <section className="gt4-details section section-dark">
      <div className="section-wrap">
        <div className="gt4-story reveal">
          <div><div className="eyebrow">Premium six-seater / lifted 4WD</div><h2 className="section-title">Unleash<br /><em>power & comfort.</em></h2></div>
          <div><p>D-MAX XT6 is the lifted six-seater golf car for those who demand adventure and luxury in equal measure. Its rugged design and elevated performance are ready for diverse terrain.</p><p>With spacious seating for six, smooth four-wheel-drive handling, customizable lighting, and a premium sound system, every passenger gets a top-tier driving experience.</p><p>Whether you are cruising a golf community or taking on a more challenging route, XT6 delivers confidence, comfort, and style.</p></div>
        </div>
        <div className="gt4-info-grid">
          <div className="gt4-info-panel reveal"><div className="eyebrow">Standard equipment</div><h3>Features</h3><ul>{xt6Features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
          <div className="gt4-info-panel reveal stagger-1"><div className="eyebrow">Power system</div><h3>Power</h3><div className="gt4-stat-list"><div><strong>48V</strong><span>Lithium battery with smart management system</span></div><div><strong>6.3kW</strong><span>Motor with EM brake</span></div><div><strong>400A</strong><span>AC controller</span></div><div><strong>25A</strong><span>On-board charger</span></div><div><strong>19 mph</strong><span>Maximum speed</span></div></div><div className="gt4-dimensions"><span>Dimensions</span><strong>156.1 × 56.1 × 84.8 in</strong><small>Rearview mirror width included</small></div></div>
        </div>
        <div className="gt4-story xt4-story-accent reveal"><div><div className="eyebrow">Embrace the beast</div><h3 className="section-title">Six seats.<br /><em>One wild ride.</em></h3></div><div><p>The XT6 4WD lifted six-seater is built for those who demand both adventure and luxury. Its robust four-wheel-drive system brings confidence to any terrain, while the spacious cabin provides superior comfort and legroom for all six passengers.</p></div></div>
        <div className="gt4-gallery-heading reveal"><div className="eyebrow">See the details</div><h3>XT6 gallery.</h3></div>
        <div className="gt4-gallery reveal">
          <div className="gt4-slideshow"><div className="gt4-slideshow-image"><img src={activeGalleryItem.image} alt={activeGalleryItem.title} /><div className="gt4-slide-count">{String(activeGallery + 1).padStart(2, '0')} / {String(xt6Gallery.length).padStart(2, '0')}</div><button className="gt4-slide-arrow gt4-slide-prev" onClick={showPrevious} type="button" aria-label="Previous XT6 gallery image"><ChevronRight size={18} /></button><button className="gt4-slide-arrow gt4-slide-next" onClick={showNext} type="button" aria-label="Next XT6 gallery image"><ChevronRight size={18} /></button></div><div className="gt4-slide-caption"><span>XT6 / feature detail</span><strong>{activeGalleryItem.title}</strong></div></div>
          <div className="gt4-gallery-accordion" role="list" aria-label="XT6 gallery images">{xt6Gallery.map((item, index) => <button className={`gt4-gallery-row ${activeGallery === index ? 'active' : ''}`} key={item.image} onClick={() => setActiveGallery(index)} type="button" role="listitem" aria-current={activeGallery === index ? 'true' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><ChevronRight size={15} /></button>)}</div>
        </div>
        <div className="gt4-downloads reveal"><div><div className="eyebrow">Download the details</div><h3>Take the XT6<br />with you.</h3></div><div className="gt4-download-actions"><a className="button-ghost" href="/xt6/docs/xt6-sell-sheet.pdf" download>XT6 sell sheet <Download size={15} /></a><a className="button-ghost" href="/xt6/docs/dmax-series-brochure.pdf" download>D-MAX series brochure <Download size={15} /></a><button className="button-primary" onClick={onOrder} type="button">Order yours today <ArrowUpRight size={15} /></button></div></div>
      </div>
    </section>
  );
}

function useRevealAnimations() {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function Logo() {
  return (
    <a href="/" className="flex items-center gap-3" data-testid="link-brand-home">
      <span className="grid h-9 w-9 place-items-center border border-cyan-300/70 text-cyan-300 font-display text-xl font-bold leading-none">D</span>
      <span className="brand-mark font-display text-2xl font-extrabold text-slate-100">D-MAX Golf Carts</span>
    </a>
  );
}

function Navigation({ onQuote }: { onQuote: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightTheme, setLightTheme] = useState(() => window.localStorage.getItem('dmax-theme') === 'light');
  const links = [['/models', 'D-MAX MODELS'], ['/capability', 'Capability'], ['/engineering', 'Engineering'], ['/experience', 'The D-MAX way']];
  const navigate = () => setMobileOpen(false);
  useEffect(() => {
    document.documentElement.dataset.theme = lightTheme ? 'light' : 'dark';
    window.localStorage.setItem('dmax-theme', lightTheme ? 'light' : 'dark');
  }, [lightTheme]);
  return (
    <header className="topbar fixed left-0 right-0 top-0 z-40">
      <div className="section-wrap flex h-full items-center justify-between">
        <Logo />
        <nav className="nav-desktop flex items-center gap-8" aria-label="Primary navigation">
          {links.map(([path, label]) => (
            <a key={path} className="nav-link" href={path} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>
          ))}
          <a className="call-link" href="tel:18448441920" data-testid="link-nav-call">Call now <span>1-844-844-1920</span></a>
          <button className="button-primary min-h-[38px] px-4" onClick={onQuote} type="button" data-testid="button-nav-quote">
            Build yours <ArrowUpRight size={15} />
          </button>
          <button className="theme-toggle" onClick={() => setLightTheme(!lightTheme)} type="button" aria-label={`Switch to ${lightTheme ? 'dark' : 'light'} theme`} data-testid="button-theme-toggle">
            {lightTheme ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </nav>
        <button className="mobile-menu-button hidden place-items-center border border-slate-600/70 p-2 text-cyan-300" onClick={() => setMobileOpen(!mobileOpen)} type="button" aria-label="Toggle navigation" data-testid="button-mobile-menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <nav className="absolute left-0 right-0 top-[65px] border-b border-slate-700/70 bg-[#091525] px-4 py-5 shadow-2xl md:hidden" aria-label="Mobile navigation">
          {links.map(([path, label]) => (
            <a key={path} className="nav-link block border-b border-slate-700/50 py-4" href={path} onClick={navigate} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>
          ))}
          <a className="call-link mobile-call-link" href="tel:18448441920" onClick={navigate} data-testid="link-mobile-call">Call now <span>1-844-844-1920</span></a>
          <button className="button-primary mt-5 w-full" onClick={() => { navigate(); onQuote(); }} type="button" data-testid="button-mobile-quote">Build your D-MAX <ArrowUpRight size={15} /></button>
          <button className="theme-toggle mobile-theme-toggle" onClick={() => setLightTheme(!lightTheme)} type="button" aria-label={`Switch to ${lightTheme ? 'dark' : 'light'} theme`} data-testid="button-mobile-theme-toggle">
            {lightTheme ? <Moon size={16} /> : <Sun size={16} />} <span>{lightTheme ? 'Dark theme' : 'Light theme'}</span>
          </button>
        </nav>
      )}
    </header>
  );
}

function QuoteModal({ selectedModel, onClose }: { selectedModel: ModelKey; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="quote-modal call-modal" role="dialog" aria-modal="true" aria-labelledby="call-title">
        <button className="modal-close" onClick={onClose} type="button" aria-label="Close call panel" data-testid="button-close-quote"><X size={17} /></button>
        <div className="eyebrow">Call D-MAX</div>
        <h2 id="call-title" className="modal-title">Let’s talk<br />{selectedModel}.</h2>
        <p className="modal-copy">Speak with a D-MAX product specialist about availability, configuration, and your next ride.</p>
        <a className="call-modal-number" href="tel:18448441920" data-testid="link-modal-call"><PhoneCall size={22} /><strong>1-844-844-1920</strong></a>
        <p className="call-modal-note">Tap the number to call now.</p>
      </div>
    </div>
  );
}

function Home() {
  const [selectedModel, setSelectedModel] = useState<ModelKey>('XT4');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const current = models[selectedModel];
  useRevealAnimations();
  return (
    <main id="top" className="site-shell noise">
      <Navigation onQuote={() => setQuoteOpen(true)} />

      <section className="hero" aria-label="D-MAX introduction">
        <img className="hero-image" src="/models/xt4.jpg" alt="D-MAX XT4 all-wheel-drive utility vehicle" data-testid="img-hero-xt4" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-kicker reveal is-visible"><span className="h-px w-8 bg-cyan-300" /> D-MAX / engineered to roam</div>
          <h1 className="hero-title reveal is-visible stagger-1">D-MAX<br /><em>Golf Carts</em></h1>
          <p className="hero-copy reveal is-visible stagger-2">Premium electric vehicles with the stance, quiet power, and presence to make every destination feel closer.</p>
          <div className="hero-actions reveal is-visible stagger-3">
            <a className="button-primary" href="#models" data-testid="link-hero-explore">Explore the range <ArrowDown size={15} /></a>
            <button className="button-ghost" onClick={() => setQuoteOpen(true)} type="button" data-testid="button-hero-quote">Talk to D-MAX <ArrowUpRight size={15} /></button>
          </div>
          <div className="hero-meta reveal is-visible stagger-3">
            <div><strong>25</strong>MPH TOP SPEED</div>
            <div><strong>48</strong>MI RANGE*</div>
            <div><strong>4x4</strong>AWD AVAILABLE</div>
          </div>
        </div>
        <div className="scroll-cue">Scroll to discover</div>
      </section>

      <section className="stat-rail" aria-label="D-MAX highlights">
        <div className="section-wrap stat-grid">
          <div className="stat reveal"><span className="stat-value">04</span><span className="stat-label">Distinct models</span></div>
          <div className="stat reveal stagger-1"><span className="stat-value">48<span className="text-lg">MI</span></span><span className="stat-label">Estimated range*</span></div>
          <div className="stat reveal stagger-2"><span className="stat-value">72V</span><span className="stat-label">Lithium powertrain</span></div>
          <div className="stat reveal stagger-3"><span className="stat-value">4×4</span><span className="stat-label">All-wheel drive, XT only</span></div>
        </div>
      </section>

      <section id="models" className="section section-dark">
        <div className="section-wrap">
          <div className="section-header reveal">
            <div><div className="eyebrow">The line-up</div><h2 className="section-title">Choose your<br />terrain.</h2></div>
            <p className="section-intro">Two expressions of the D-MAX spirit. GT is made for the open road. XT brings four driven wheels to the places roads stop.</p>
          </div>
          <div className="model-layout reveal stagger-1">
            <div className="model-tabs" role="tablist" aria-label="D-MAX models">
              {(Object.keys(models) as ModelKey[]).map((key) => (
                <button key={key} className={`model-tab ${selectedModel === key ? 'active' : ''}`} role="tab" aria-selected={selectedModel === key} onClick={() => setSelectedModel(key)} type="button" data-testid={`button-select-model-${key.toLowerCase()}`}>
                  {key}<span>{models[key].passengers.split(' ')[0]} seats</span><ChevronRight size={15} />
                </button>
              ))}
            </div>
            <div className="model-showcase" data-testid={`panel-model-${selectedModel.toLowerCase()}`}>
              <div className="model-image-wrap">
                <img className="model-image" src={modelCardImages[selectedModel]} alt={`D-MAX ${current.name} vehicle`} data-testid={`img-model-${selectedModel.toLowerCase()}`} />
                <div className="image-shade" />
              </div>
              <div className="model-detail">
                <div className="model-type">{current.type}</div>
                <h3 className="model-name">{current.name}</h3>
                <p className="model-description">{current.description}</p>
                <div className="truth-badge"><strong>{current.badge}</strong><br /><span>{selectedModel.startsWith('XT') ? 'The only D-MAX line with 4x4 all-wheel drive.' : `A ${current.passengers} D-MAX grand tourer.`}</span></div>
                <div className="spec-list">
                  <div><div className="spec-label">Seating</div><div className="spec-value">{current.passengers}</div></div>
                  <div><div className="spec-label">Drivetrain</div><div className="spec-value">{current.drive}</div></div>
                  <div><div className="spec-label">Est. range</div><div className="spec-value">{current.range}*</div></div>
                  <div><div className="spec-label">Top speed</div><div className="spec-value">{current.speed}</div></div>
                </div>
                <a className="button-primary mt-7 w-fit" href={`/models/${selectedModel.toLowerCase()}`} data-testid={`link-model-details-${selectedModel.toLowerCase()}`}>Get {selectedModel} details <ArrowUpRight size={15} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capability" className="section section-alt">
        <div className="section-wrap">
          <div className="drive-layout">
            <div className="drive-copy reveal">
              <div className="eyebrow">Capability, clarified</div>
              <h2 className="section-title">Four wheels.<br />Zero excuses.</h2>
              <p className="mt-7">When the route turns rough, XT keeps its composure. The 4x4 all-wheel-drive system sends torque where traction lives, while independent suspension and all-terrain tires keep the cabin calm.</p>
              <div className="drive-note"><Zap size={15} /> XT4 + XT6 only / 4x4 AWD</div>
            </div>
            <div className="drive-diagram reveal stagger-1" aria-label="All-wheel-drive diagram">
              <div className="drive-callout">Live torque distribution / XT platform</div>
              <div className="axle-line" />
              <div className="drive-center"><span>4×4<br />AWD</span></div>
              <div className="wheel-label front">Front axle / driven</div>
              <div className="wheel-label rear">Rear axle / driven</div>
            </div>
          </div>
        </div>
      </section>

      <section id="engineering" className="section section-dark">
        <div className="section-wrap">
          <div className="section-header reveal">
            <div><div className="eyebrow">Built with intent</div><h2 className="section-title">Details that<br />do the work.</h2></div>
            <p className="section-intro">Nothing is decorative by accident. Every component is there to make the miles quieter, more capable, and more yours.</p>
          </div>
          <div className="engineering-grid">
            <article className="eng-card reveal"><span className="eng-index">01 / POWER</span><div className="eng-icon"><BatteryCharging size={21} /></div><h3 className="eng-title">Lithium, tuned.</h3><p>A responsive 72V system delivers smooth pull-away power and dependable range without the weight of yesterday.</p><div className="eng-rule" /></article>
            <article className="eng-card reveal stagger-1"><span className="eng-index">02 / CONTROL</span><div className="eng-icon"><Gauge size={21} /></div><h3 className="eng-title">Quiet authority.</h3><p>Calibrated acceleration, hydraulic disc brakes, and a composed steering feel put you in command of every turn.</p><div className="eng-rule" /></article>
            <article className="eng-card reveal stagger-2"><span className="eng-index">03 / PRESENCE</span><div className="eng-icon"><CarFront size={21} /></div><h3 className="eng-title">Seen from afar.</h3><p>Signature lighting, automotive lines, and a premium cockpit make a D-MAX unmistakable before it ever arrives.</p><div className="eng-rule" /></article>
          </div>
        </div>
      </section>

      <section id="experience" className="section section-alt">
        <div className="section-wrap">
          <div className="experience reveal">
            <div className="experience-image" role="img" aria-label="D-MAX XT6 ready for the open road" />
            <div className="experience-copy">
              <div className="eyebrow">More than a vehicle</div>
              <blockquote>“It changes the way you see your own backyard.”</blockquote>
              <p>From a sunrise lap around the property to a full afternoon beyond the gate, D-MAX turns utility into an invitation. Take the long way. There is more out there.</p>
              <div className="mt-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-lime-300"><Mountain size={16} /> Designed for the unplanned route</div>
            </div>
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="section-wrap quote-inner">
          <div className="reveal"><div className="eyebrow">Your next move</div><h2 className="quote-title">Ready when<br />you are.</h2></div>
          <div className="reveal stagger-1"><p className="quote-copy">Tell us what you need to carry, where you need to go, and what you want to feel behind the wheel.</p><button className="button-primary" onClick={() => setQuoteOpen(true)} type="button" data-testid="button-cta-quote">Request a tailored quote <ArrowUpRight size={15} /></button></div>
        </div>
      </section>

      <footer className="footer">
        <div className="section-wrap">
          <div className="footer-main">
            <div><Logo /><p className="footer-blurb">Electric utility vehicles for people who would rather be out there. Engineered in motion.</p></div>
            <div className="footer-links">
              <div className="footer-col"><h4>Models</h4><a href="/models/gt4" data-testid="link-footer-gt4">EVolution D-MAX GT4</a><a href="/models/gt6" data-testid="link-footer-gt6">EVolution D-MAX GT6</a><a href="/models/xt4" data-testid="link-footer-xt4">EVolution D-MAX XT4</a><a href="/models/xt6" data-testid="link-footer-xt6">EVolution D-MAX XT6</a></div>
              <div className="footer-col"><h4>Explore</h4><a href="#capability" data-testid="link-footer-capability">Capability</a><a href="#engineering" data-testid="link-footer-engineering">Engineering</a></div>
              <div className="footer-col"><h4>Policies</h4><a href="/policies/terms">Terms &amp; Conditions</a><a href="/policies/returns">Return Policy</a><a href="/policies/privacy">Privacy Policy</a></div>
              <div className="footer-col"><h4>Service Policies</h4><a href="/policies/delivery">Delivery Policy</a><a href="/policies/storage">Storage Policy</a></div>
              <div className="footer-col"><h4>Content Policies</h4><a href="/policies/publishing">Publishing Policy</a><a href="/policies/feedback">Feedback Policy</a><a href="/policies/corrections">Corrections Policy</a></div>
              <div className="footer-col"><h4>Work Policies</h4><a href="/policies/diversity">Diversity Policy</a><a href="/policies/ethics">Ethics Policy</a><a href="/policies/staffing">Staffing Report</a></div>
              <div className="footer-col"><h4>Connect</h4><button onClick={() => setQuoteOpen(true)} type="button" data-testid="button-footer-contact">Contact D-MAX</button><a href="mailto:hello@dmaxgolfcarts.com" data-testid="link-footer-email">Email us</a><a href="#top" data-testid="link-footer-top">Back to top</a></div>
            </div>
          </div>
          <div className="footer-bottom"><span>© 2025 D-MAX Golf Carts</span><span>Built for the long way around</span><span>* Estimated figures. Actual performance varies.</span></div>
        </div>
      </footer>
      {quoteOpen && <QuoteModal selectedModel={selectedModel} onClose={() => setQuoteOpen(false)} />}
    </main>
  );
}

type PageKind = 'models' | 'capability' | 'engineering' | 'experience';

const pageContent: Record<PageKind, {
  eyebrow: string;
  title: ReactNode;
  intro: string;
}> = {
  models: {
    eyebrow: 'The D-MAX line-up',
    title: <>Choose your<br /><em>terrain.</em></>,
    intro: 'Four distinct builds. One unmistakable D-MAX attitude. Find the vehicle that fits the way you move.',
  },
  capability: {
    eyebrow: 'Go beyond the pavement',
    title: <>Four wheels.<br /><em>Zero excuses.</em></>,
    intro: 'XT4 and XT6 are the only D-MAX models with 4x4 all-wheel drive—built to keep traction when the map runs out.',
  },
  engineering: {
    eyebrow: 'Built with intent',
    title: <>Details that<br /><em>do the work.</em></>,
    intro: 'Every component is chosen to make the miles quieter, more capable, and more yours.',
  },
  experience: {
    eyebrow: 'The D-MAX way',
    title: <>Take the long<br /><em>way around.</em></>,
    intro: 'A D-MAX is more than a vehicle. It is an invitation to make the next destination feel closer.',
  },
};

const policyPages = {
  terms: { label: 'Policies', title: 'Terms & Conditions', intro: 'These terms describe the basic conditions for using the D-MAX Golf Carts website and requesting information from D-MAX.', sections: [['Website information', 'This website provides general product, model, and contact information for D-MAX Golf Carts. Published specifications, prices, imagery, and availability may change and should be confirmed directly with D-MAX.'], ['Contact and orders', 'Submitting an inquiry or contacting D-MAX does not create a purchase agreement. Any order, quote, delivery arrangement, or other transaction is subject to separate written terms provided by D-MAX.'], ['Acceptable use', 'Use this website lawfully and do not copy, disrupt, reverse engineer, or misuse its content, forms, or services.']] },
  returns: { label: 'Policies', title: 'Return Policy', intro: 'Return eligibility, timing, condition requirements, and any applicable fees are confirmed for each purchase directly with D-MAX before a transaction is completed.', sections: [['Before returning a vehicle or product', 'Contact D-MAX at 1-844-844-1920 before sending or transporting any vehicle, accessory, document, or other item. Do not assume a return is approved until D-MAX confirms the process in writing.'], ['Purchase-specific terms', 'Return rights can depend on the product, purchase documents, delivery status, condition, and applicable law. The written terms provided with a transaction control if they differ from this general website notice.'], ['Contact', 'For a return question, call 1-844-844-1920 or email hello@dmaxgolfcarts.com.']] },
  privacy: { label: 'Policies', title: 'Privacy Policy', intro: 'D-MAX Golf Carts uses information submitted through this website to respond to inquiries, provide requested product information, and operate the site.', sections: [['Information you provide', 'You may choose to provide contact details and message content when you call, email, or use a contact interaction. Do not submit sensitive personal information through this public website.'], ['How information is used', 'D-MAX may use inquiry information to respond, discuss models, provide configuration or availability information, and maintain business communications. D-MAX does not publish private customer information in its public machine-readable files.'], ['Questions and requests', 'For privacy questions or a request concerning information you submitted, contact hello@dmaxgolfcarts.com.']] },
  delivery: { label: 'Service Policies', title: 'Delivery Policy', intro: 'Delivery options, timing, coverage, preparation, and charges are confirmed with D-MAX for each order because they depend on the vehicle and destination.', sections: [['Delivery arrangements', 'D-MAX will confirm the available delivery method, destination, timing, responsibilities, and charges before an order is finalized. Website availability does not guarantee delivery to a particular location.'], ['Receiving a vehicle', 'The recipient should inspect the vehicle and delivery documents at receipt and report visible concerns promptly through the contact information provided with the order.'], ['Confirm current details', 'For current delivery questions, call 1-844-844-1920. This website does not publish a live delivery map or a guaranteed service-area list.']] },
  storage: { label: 'Service Policies', title: 'Storage Policy', intro: 'Storage arrangements for a D-MAX vehicle are confirmed directly for each order or service situation; this website does not publish a universal storage program.', sections: [['Customer storage', 'Owners are responsible for selecting a safe, suitable storage location and following the vehicle documentation for charging, environmental conditions, and routine care.'], ['D-MAX-held vehicles', 'If D-MAX agrees to hold a vehicle or item, the written arrangement will identify the storage period, release conditions, responsibilities, and any charges.'], ['Questions', 'Contact D-MAX before relying on storage availability, storage capacity, or a particular storage term.']] },
  publishing: { label: 'Content Policies', title: 'Publishing Policy', intro: 'D-MAX publishes product and company information intended to be clear, useful, and attributable to the D-MAX Golf Carts website.', sections: [['Accuracy and updates', 'Published content is reviewed and may be updated when model information, prices, specifications, or company details change. Confirm important purchase decisions directly with D-MAX.'], ['Original materials', 'Site copy, graphics, photographs, downloadable documents, and branding are published for their intended website or customer-information purpose. Reuse requires appropriate permission.'], ['Corrections', 'If you identify a factual issue, use the correction process described on the Corrections Policy page.']] },
  feedback: { label: 'Content Policies', title: 'Feedback Policy', intro: 'D-MAX welcomes clear, constructive feedback about its website, vehicles, and customer-information experience.', sections: [['How to send feedback', 'Email hello@dmaxgolfcarts.com or call 1-844-844-1920. Include the page, model, or interaction involved and enough detail for D-MAX to understand the issue.'], ['How feedback is handled', 'Feedback may be reviewed by the appropriate D-MAX team. Sending feedback does not guarantee a response, publication, compensation, or a change to the site.'], ['Personal information', 'Do not include passwords, payment details, government identifiers, or other sensitive information in feedback.']] },
  corrections: { label: 'Content Policies', title: 'Corrections Policy', intro: 'D-MAX aims to correct material factual errors in public website content while preserving clear context about product information.', sections: [['Request a correction', 'Email hello@dmaxgolfcarts.com with the page URL, the specific statement, the proposed correction, and a reliable source or explanation.'], ['Review process', 'D-MAX may review the request, confirm the current source information, and update the relevant page or document when a correction is warranted.'], ['Product information', 'Prices, specifications, range, and availability can change. For a purchase decision, contact D-MAX for the current information rather than relying only on an older copy or search result.']] },
  diversity: { label: 'Work Policies', title: 'Diversity Policy', intro: 'D-MAX Golf Carts supports a respectful environment where people are treated fairly and can contribute without unlawful discrimination or harassment.', sections: [['Respectful participation', 'D-MAX expects professional, respectful conduct in customer, partner, workplace, and community interactions.'], ['Equal opportunity', 'Employment and business decisions should be based on relevant qualifications, performance, and lawful business requirements.'], ['Questions', 'Questions about this statement can be directed to hello@dmaxgolfcarts.com.']] },
  ethics: { label: 'Work Policies', title: 'Ethics Policy', intro: 'D-MAX expects honest, responsible conduct in product information, customer communications, business relationships, and use of company resources.', sections: [['Truthful communication', 'Represent product capabilities, pricing, availability, and business relationships accurately. Do not make unsupported claims or mislead customers, partners, or the public.'], ['Responsible conduct', 'Respect applicable laws, agreements, confidential information, intellectual property, and the safety of people and property.'], ['Raising a concern', 'Ethics concerns can be submitted to hello@dmaxgolfcarts.com with relevant details.']] },
  staffing: { label: 'Work Policies', title: 'Staffing Report', intro: 'D-MAX Golf Carts does not currently publish a public staffing count or workforce report on this website.', sections: [['What is published', 'This page exists as a transparent public reference point for staffing-report requests. It does not represent a headcount, hiring forecast, demographic report, or certification.'], ['Request information', 'For a specific staffing or business inquiry, contact D-MAX at hello@dmaxgolfcarts.com. Any response will be limited to information D-MAX is able and authorized to share.'], ['Update status', 'If D-MAX publishes verified staffing information in the future, this page can be updated with the relevant reporting period and methodology.']] },
} as const;

type PolicyKey = keyof typeof policyPages;

function SiteFooter({ onQuote }: { onQuote: () => void }) {
  return (
    <footer className="footer">
      <div className="section-wrap">
        <div className="footer-main">
          <div><Logo /><p className="footer-blurb">Electric utility vehicles for people who would rather be out there. Engineered in motion.</p></div>
          <div className="footer-links">
            <div className="footer-col"><h4>Models</h4><a href="/models/gt4">EVolution D-MAX GT4</a><a href="/models/gt6">EVolution D-MAX GT6</a><a href="/models/xt4">EVolution D-MAX XT4</a><a href="/models/xt6">EVolution D-MAX XT6</a></div>
            <div className="footer-col"><h4>Explore</h4><a href="/capability">Capability</a><a href="/engineering">Engineering</a><a href="/experience">The D-MAX way</a></div>
            <div className="footer-col"><h4>Policies</h4><a href="/policies/terms">Terms &amp; Conditions</a><a href="/policies/returns">Return Policy</a><a href="/policies/privacy">Privacy Policy</a></div>
            <div className="footer-col"><h4>Service Policies</h4><a href="/policies/delivery">Delivery Policy</a><a href="/policies/storage">Storage Policy</a></div>
            <div className="footer-col"><h4>Content Policies</h4><a href="/policies/publishing">Publishing Policy</a><a href="/policies/feedback">Feedback Policy</a><a href="/policies/corrections">Corrections Policy</a></div>
            <div className="footer-col"><h4>Work Policies</h4><a href="/policies/diversity">Diversity Policy</a><a href="/policies/ethics">Ethics Policy</a><a href="/policies/staffing">Staffing Report</a></div>
            <div className="footer-col"><h4>Connect</h4><button onClick={onQuote} type="button">Contact D-MAX</button><a href="tel:18448441920">Call 1-844-844-1920</a><a href="mailto:hello@dmaxgolfcarts.com">Email us</a><a href="/">Back to home</a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 D-MAX Golf Carts</span><span>Built for the long way around</span><span>* Estimated figures. Actual performance varies.</span></div>
      </div>
    </footer>
  );
}

function ModelDetailPage({ modelKey }: { modelKey: ModelKey }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [viewingColor, setViewingColor] = useState<number | null>(null);
  const model = models[modelKey];
  const isGT4 = modelKey === 'GT4';
  const isGT6 = modelKey === 'GT6';
  const isXT4 = modelKey === 'XT4';
  const isXT6 = modelKey === 'XT6';
  const hasColorPicker = isGT4 || isGT6 || isXT4 || isXT6;
  const colorOptions = isXT6 ? xt6Colors : isXT4 ? xt4Colors : isGT6 ? gt6Colors : gt4Colors;
  const displayImage = hasColorPicker ? colorOptions[selectedColor].image : model.image;
  const changeColor = (direction: number) => {
    setSelectedColor((currentColor) => (currentColor + direction + colorOptions.length) % colorOptions.length);
  };
  useRevealAnimations();
  return (
    <main id="top" className="site-shell noise">
      <Navigation onQuote={() => setQuoteOpen(true)} />
      <section className="model-detail-hero section-dark">
        <div className="section-wrap model-detail-hero-grid">
          <div className="model-detail-hero-copy">
            <a className="back-link" href="/models"><ChevronRight size={14} className="rotate-180" /> Back to all models</a>
            <div className="eyebrow reveal is-visible">{model.type}</div>
            <h1 className="model-detail-page-title reveal is-visible stagger-1">{model.name}</h1>
            <p className="page-intro reveal is-visible stagger-2">{model.description}</p>
            <div className="truth-badge reveal is-visible stagger-3"><strong>{model.badge}</strong><br /><span>{model.drive}</span></div>
            <div className="sponsored-link-wrap reveal is-visible stagger-3">
              <span>Sponsored</span>
              <a href={sponsoredModelLinks[modelKey]} target="_blank" rel="sponsored noopener noreferrer" data-testid={`link-sponsored-${modelKey.toLowerCase()}`}>{model.name}</a>
            </div>
            <div className="model-price reveal is-visible stagger-3"><span>MSRP</span><strong>{model.price}</strong></div>
            <button className="button-primary mt-8 reveal is-visible stagger-3" onClick={() => setQuoteOpen(true)} type="button">Order yours today <ArrowUpRight size={15} /></button>
            <a className="button-ghost model-call-button reveal is-visible stagger-3" href="tel:18448441920">Call now <PhoneCall size={15} /> <span>1-844-844-1920</span></a>
          </div>
          <div className="model-detail-hero-image reveal is-visible stagger-2">
            <img src={displayImage} alt={`D-MAX ${model.name} in ${hasColorPicker ? colorOptions[selectedColor].name : 'standard finish'}`} />
            {hasColorPicker && (
              <div className="model-color-nav" aria-label={`${model.name} color options`}>
                <button type="button" onClick={() => changeColor(-1)} aria-label={`Previous ${model.name} color`}><ChevronLeft size={18} /></button>
                <button type="button" onClick={() => changeColor(1)} aria-label={`Next ${model.name} color`}><ChevronRight size={18} /></button>
              </div>
            )}
            {hasColorPicker && <span className="model-color-count">{selectedColor + 1} / {colorOptions.length}</span>}
          </div>
        </div>
      </section>
      {hasColorPicker && (
        <section className="gt4-colors section section-alt">
          <div className="section-wrap">
            <div className="section-header reveal"><div><div className="eyebrow">Make it yours</div><h2 className="section-title">Choose your<br />finish.</h2></div><p className="section-intro">Select a {model.name} color to preview its look. Every finish keeps the D-MAX’s unmistakable silhouette.</p></div>
            <div className="gt4-color-picker reveal stagger-1" role="list" aria-label="GT4 color options">
              {colorOptions.map((color, index) => <button className={`gt4-color-option ${selectedColor === index ? 'active' : ''}`} key={color.name} onClick={() => { setSelectedColor(index); setViewingColor(index); }} type="button" aria-pressed={selectedColor === index} data-testid={`button-${modelKey.toLowerCase()}-color-${index}`}><span className="gt4-color-image"><img src={color.image} alt={`View ${color.name} ${model.name}`} /><span className="gt4-color-zoom">View larger</span></span><span>{color.name}</span></button>)}
            </div>
          </div>
        </section>
      )}
      <section className="section section-alt">
        <div className="section-wrap">
          <div className="model-spec-banner reveal">
            <div><span>Seating</span><strong>{model.passengers}</strong></div>
            <div><span>Drivetrain</span><strong>{model.drive}</strong></div>
            <div><span>Est. range</span><strong>{model.range}*</strong></div>
            <div><span>Top speed</span><strong>{model.speed}</strong></div>
            <div><span>MSRP</span><strong>{model.price}</strong></div>
          </div>
          <div className="model-detail-copy reveal">
            <div><div className="eyebrow">Why {model.name}</div><h2 className="section-title">Made for<br /><em>your route.</em></h2></div>
            <p>{modelKey.startsWith('XT') ? 'The XT line is the only D-MAX range with 4x4 all-wheel drive. It is engineered for confident traction and more freedom when the surface changes.' : 'The GT line brings a composed, premium ride to the places you already love. More room, more presence, and effortless electric power for every loop.'}</p>
          </div>
        </div>
      </section>
      {isGT4 && <GT4Details onOrder={() => setQuoteOpen(true)} />}
      {isGT6 && <GT6Details onOrder={() => setQuoteOpen(true)} />}
      {isXT4 && <XT4Details onOrder={() => setQuoteOpen(true)} />}
      {isXT6 && <XT6Details onOrder={() => setQuoteOpen(true)} />}
      {hasColorPicker && viewingColor !== null && (
        <div className="gt4-color-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewingColor(null); }}>
          <div className="gt4-color-lightbox-inner" role="dialog" aria-modal="true" aria-label={`${colorOptions[viewingColor].name} ${model.name} preview`}>
            <button className="gt4-lightbox-close" onClick={() => setViewingColor(null)} type="button" aria-label="Close color preview"><X size={18} /></button>
            <img src={colorOptions[viewingColor].image} alt={`${colorOptions[viewingColor].name} ${model.name}`} />
            <div><span>{model.name} finish</span><strong>{colorOptions[viewingColor].name}</strong></div>
          </div>
        </div>
      )}
      <section className="quote-section">
        <div className="section-wrap quote-inner"><div><div className="eyebrow">Your next move</div><h2 className="quote-title">Ready when<br />you are.</h2></div><div><p className="quote-copy">Get configuration, availability, and a tailored quote for the {model.name}.</p><button className="button-primary" onClick={() => setQuoteOpen(true)} type="button">Order yours today <ArrowUpRight size={15} /></button></div></div>
      </section>
      <SiteFooter onQuote={() => setQuoteOpen(true)} />
      {quoteOpen && <QuoteModal selectedModel={modelKey} onClose={() => setQuoteOpen(false)} />}
    </main>
  );
}

function PolicyPage({ policyKey }: { policyKey: PolicyKey }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const policy = policyPages[policyKey];
  return (
    <main id="top" className="site-shell noise">
      <Navigation onQuote={() => setQuoteOpen(true)} />
      <section className="page-hero section-dark policy-hero">
        <div className="section-wrap page-hero-inner">
          <div className="eyebrow">{policy.label}</div>
          <h1 className="page-title">{policy.title}</h1>
          <p className="page-intro">{policy.intro}</p>
        </div>
      </section>
      <article className="section section-alt">
        <div className="section-wrap policy-content">
          <div className="policy-notice">This page is a public website policy summary. Transaction-specific written terms provided by D-MAX control where applicable.</div>
          {policy.sections.map(([heading, copy]) => (
            <section className="policy-section" key={heading}>
              <h2>{heading}</h2>
              <p>{copy}</p>
            </section>
          ))}
        </div>
      </article>
      <SiteFooter onQuote={() => setQuoteOpen(true)} />
      {quoteOpen && <QuoteModal selectedModel="XT4" onClose={() => setQuoteOpen(false)} />}
    </main>
  );
}

function DedicatedPage({ kind }: { kind: PageKind }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const content = pageContent[kind];
  useRevealAnimations();
  return (
    <main id="top" className="site-shell noise">
      <Navigation onQuote={() => setQuoteOpen(true)} />
      <section className="page-hero section-dark">
        <div className="section-wrap page-hero-inner">
          <div className="eyebrow reveal is-visible">{content.eyebrow}</div>
          <h1 className="page-title reveal is-visible stagger-1">{content.title}</h1>
          <p className="page-intro reveal is-visible stagger-2">{content.intro}</p>
        </div>
      </section>

      {kind === 'models' && (
        <section className="section section-alt">
          <div className="section-wrap">
            <div className="model-grid reveal">
              {(Object.keys(models) as ModelKey[]).map((key) => {
                const model = models[key];
                return (
                  <a className="model-card" key={key} href={`/models/${key.toLowerCase()}`} aria-label={`Explore D-MAX ${key}`}>
                    <div className="model-card-image"><img src={modelCardImages[key]} alt={`D-MAX ${key}`} /><span className="model-card-index">{key}</span></div>
                    <div className="model-card-copy"><div className="model-type">{model.type}</div><h2 className="model-card-title">{key}</h2><p>{model.description}</p><div className="truth-badge"><strong>{model.badge}</strong><br /><span>{model.drive}</span></div><div className="model-card-price"><span>MSRP</span><strong>{model.price}</strong></div><span className="button-primary mt-6">Explore {key} <ArrowUpRight size={15} /></span></div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {kind === 'capability' && (
        <section className="section section-alt">
          <div className="section-wrap">
            <div className="capability-page-grid reveal">
              <div className="capability-panel"><div className="eyebrow">4x4 all-wheel drive</div><div className="capability-number">XT</div><h2>Only XT goes<br />all the way.</h2><p>XT4 and XT6 are the only D-MAX vehicles equipped with 4x4 all-wheel drive. That means confident traction across loose ground, wet grass, steep approaches, and the routes that do not have a name.</p></div>
              <div className="capability-list"><div><Mountain size={22} /><span><strong>Ground clearance</strong>Clear the ordinary path.</span></div><div><ShieldCheck size={22} /><span><strong>All-wheel traction</strong>Power where it matters.</span></div><div><Gauge size={22} /><span><strong>25 mph top speed</strong>Move with purpose.</span></div></div>
            </div>
          </div>
        </section>
      )}

      {kind === 'engineering' && (
        <section className="section section-alt">
          <div className="section-wrap">
            <div className="engineering-page-grid reveal">
              <img src="/models/gt6.jpg" alt="D-MAX GT6 cockpit and seats" />
              <div><div className="eyebrow">The hardware</div><h2 className="section-title">Quiet power.<br />Serious range.</h2><p className="section-intro">From the 72V lithium powertrain to the composed suspension and premium cabin materials, D-MAX is designed around the feeling of effortless progress.</p><div className="engineering-specs"><div><BatteryCharging size={18} /><strong>72V</strong><span>Lithium powertrain</span></div><div><Zap size={18} /><strong>48 MI*</strong><span>Estimated range</span></div><div><CarFront size={18} /><strong>25 MPH</strong><span>Top speed</span></div></div></div>
            </div>
          </div>
        </section>
      )}

      {kind === 'experience' && (
        <section className="section section-alt">
          <div className="section-wrap">
            <div className="experience-page-grid reveal">
              <div className="experience-image" role="img" aria-label="D-MAX XT6 ready for the open road" />
              <div><div className="eyebrow">More than a vehicle</div><blockquote>“It changes the way you see your own backyard.”</blockquote><p>From a sunrise lap around the property to a full afternoon beyond the gate, D-MAX turns utility into an invitation. Take the long way. There is more out there.</p><div className="mt-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-lime-300"><Mountain size={16} /> Designed for the unplanned route</div></div>
            </div>
          </div>
        </section>
      )}

      <section className="quote-section">
        <div className="section-wrap quote-inner"><div><div className="eyebrow">Your next move</div><h2 className="quote-title">Ready when<br />you are.</h2></div><div><p className="quote-copy">Tell us what you need to carry, where you need to go, and what you want to feel behind the wheel.</p><button className="button-primary" onClick={() => setQuoteOpen(true)} type="button">Request a tailored quote <ArrowUpRight size={15} /></button></div></div>
      </section>
      <SiteFooter onQuote={() => setQuoteOpen(true)} />
      {quoteOpen && <QuoteModal selectedModel={kind === 'models' ? 'XT4' : 'GT4'} onClose={() => setQuoteOpen(false)} />}
    </main>
  );
}

function Router() {
  // Prerendered pages ship the right <head>; this keeps it right after the
  // client router takes over navigation.
  useSeoHead();

  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/models/gt4" component={() => <ModelDetailPage modelKey="GT4" />} />
        <Route path="/models/gt6" component={() => <ModelDetailPage modelKey="GT6" />} />
        <Route path="/models/xt4" component={() => <ModelDetailPage modelKey="XT4" />} />
        <Route path="/models/xt6" component={() => <ModelDetailPage modelKey="XT6" />} />
        <Route path="/models" component={() => <DedicatedPage kind="models" />} />
        <Route path="/capability" component={() => <DedicatedPage kind="capability" />} />
        <Route path="/engineering" component={() => <DedicatedPage kind="engineering" />} />
        <Route path="/experience" component={() => <DedicatedPage kind="experience" />} />
        <Route path="/policies/terms" component={() => <PolicyPage policyKey="terms" />} />
        <Route path="/policies/returns" component={() => <PolicyPage policyKey="returns" />} />
        <Route path="/policies/privacy" component={() => <PolicyPage policyKey="privacy" />} />
        <Route path="/policies/delivery" component={() => <PolicyPage policyKey="delivery" />} />
        <Route path="/policies/storage" component={() => <PolicyPage policyKey="storage" />} />
        <Route path="/policies/publishing" component={() => <PolicyPage policyKey="publishing" />} />
        <Route path="/policies/feedback" component={() => <PolicyPage policyKey="feedback" />} />
        <Route path="/policies/corrections" component={() => <PolicyPage policyKey="corrections" />} />
        <Route path="/policies/diversity" component={() => <PolicyPage policyKey="diversity" />} />
        <Route path="/policies/ethics" component={() => <PolicyPage policyKey="ethics" />} />
        <Route path="/policies/staffing" component={() => <PolicyPage policyKey="staffing" />} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;