package com.asanka.travel.config;

import com.asanka.travel.model.*;
import com.asanka.travel.repo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Fills an empty database with the starter content so the site is complete on first run.
 * Nothing is overwritten: once a collection has documents, the seeder leaves it alone.
 * To reload this content, drop the collection in MongoDB Compass and restart the backend.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final VehicleRepository vehicles;
    private final PostRepository posts;
    private final TestimonialRepository testimonials;
    private final GalleryRepository gallery;
    private final ServiceRepository services;
    private final SettingsRepository settings;
    private final AdminRepository admins;
    private final PasswordEncoder encoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:asanka@2026}")
    private String adminPassword;

    public DataSeeder(VehicleRepository vehicles, PostRepository posts, TestimonialRepository testimonials,
                      GalleryRepository gallery, ServiceRepository services, SettingsRepository settings,
                      AdminRepository admins, PasswordEncoder encoder) {
        this.vehicles = vehicles;
        this.posts = posts;
        this.testimonials = testimonials;
        this.gallery = gallery;
        this.services = services;
        this.settings = settings;
        this.admins = admins;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedSettings();
        seedServices();
        seedVehicles();
        seedPosts();
        seedTestimonials();
        seedGallery();
    }

    // ------------------------------------------------------------------ admin
    private void seedAdmin() {
        if (admins.count() > 0) return;
        AdminUser user = new AdminUser();
        user.setUsername(adminUsername);
        user.setPasswordHash(encoder.encode(adminPassword));
        user.setDisplayName("Asanka");
        admins.save(user);
        log.info("Admin account created -> username: {} / password: {} (change it after the first sign in)",
                adminUsername, adminPassword);
    }

    // ------------------------------------------------------------------ settings
    private SiteSettings.HeroSlide slide(String image, String title, String subtitle, String cta, String link) {
        SiteSettings.HeroSlide s = new SiteSettings.HeroSlide();
        s.setImage(image);
        s.setTitle(title);
        s.setSubtitle(subtitle);
        s.setCtaLabel(cta);
        s.setCtaLink(link);
        return s;
    }

    private void seedSettings() {
        if (settings.existsById("site")) return;
        SiteSettings s = new SiteSettings();
        s.setLogo("/images/ui/logo.svg");
        s.setHeroSlides(List.of(
                slide("/images/hero/hero-sigiriya.jpg", "Feel the nature",
                        "Sigiriya at sunrise, on the road before the crowds wake up.",
                        "Plan my trip", "/contact"),
                slide("/images/hero/hero-tea-country.jpg", "Ride through the hills",
                        "Tea country roads from Kandy to Ella, at your own pace.",
                        "See our vehicles", "/vehicles"),
                slide("/images/hero/hero-safari.jpg", "Meet the wild ones",
                        "Kaudulla, Minneriya and Wilpattu with a driver who knows the timing.",
                        "Book a safari day", "/blog/kaudulla"),
                slide("/images/hero/hero-south-coast.jpg", "Chase the south coast",
                        "Blue whales off Mirissa, and every quiet bay in between.",
                        "Read our guides", "/blog"),
                slide("/images/hero/hero-train.jpg", "Take the famous train",
                        "We carry your luggage to Ella while you keep the window seat.",
                        "Ask about the train day", "/contact"),
                slide("/images/hero/hero-galle.jpg", "Walk the old ramparts",
                        "Galle Fort at golden hour, forty minutes from the surf.",
                        "Explore the south", "/blog/galle-fort")
        ));
        s.setAboutIntro("Discover Sri Lanka with Travel With Asanka. Our affordable travel service covers everything "
                + "that makes a trip easy: a friendly driver who speaks English, a clean vehicle that fits your group, "
                + "and honest prices agreed before you leave. From an airport pickup at 3am to a two week island loop, "
                + "we plan around you.");
        s.setAboutImage("/images/hero/about-team.jpg");
        s.setAboutSecondaryText("Travelling with a big group or just two friends, you get the same care: fixed prices, "
                + "flexible stops, and a driver who will happily wait while you take one more photo.");
        s.setAboutSecondaryImage("/images/hero/about-together.jpg");
        s.setCeylonImage("/images/hero/ceylon.jpg");
        s.setCountryIntro("Sri Lanka packs eight UNESCO World Heritage sites, twenty six national parks and 1,340 km "
                + "of coastline into an island you can cross in a day. Ancient capitals in the north, misty tea estates "
                + "in the centre, whales off the south coast, and a train ride that people fly here just to take. "
                + "Known through history as Serendib, Ceylon and Taprobane, it is still the Pearl of the Indian Ocean.");
        settings.save(s);
    }

    // ------------------------------------------------------------------ services
    private ServiceItem service(String title, String description, String icon, String image, int order) {
        ServiceItem s = new ServiceItem();
        s.setTitle(title);
        s.setDescription(description);
        s.setIcon(icon);
        s.setImage(image);
        s.setSortOrder(order);
        return s;
    }

    private void seedServices() {
        if (services.count() > 0) return;
        services.saveAll(List.of(
                service("Tour around Sri Lanka",
                        "Multi day island tours with a driver-guide. We build the route around what you want to see, "
                        + "and adjust it while you travel.", "map", "/images/places/sigiriya.jpg", 1),
                service("Airport transfer",
                        "Meet and greet at Bandaranaike International, day or night. Flight tracked, so a delay never "
                        + "costs you the pickup.", "plane", "/images/places/negombo.jpg", 2),
                service("Hotel booking",
                        "Need a comfortable hotel, a homestay or a beach cabana? Tell us the budget and we book it "
                        + "before you land.", "bed", "/images/places/unawatuna.jpg", 3),
                service("Baggage transport",
                        "Hiking Ella Rock or riding the train? Send the luggage ahead with us and travel light.",
                        "luggage", "/images/places/nine-arch-bridge.jpg", 4),
                service("Safari day trips",
                        "Kaudulla, Minneriya, Wilpattu, Yala and Udawalawe with a 4x4 jeep and the right timing "
                        + "for the herds.", "binoculars", "/images/places/yala.jpg", 5),
                service("Long distance transfers",
                        "Colombo to Ella, Kandy to Arugam Bay, anywhere to anywhere, priced per route with tea "
                        + "factory and waterfall stops built into the drive.", "route", "/images/places/ella.jpg", 6)
        ));
    }

    // ------------------------------------------------------------------ vehicles
    private Vehicle vehicle(String name, String slug, String category, String description,
                            int seats, int luggage, String transmission, String fuel,
                            double perKm, double perDay, boolean best, boolean top, int order) {
        Vehicle v = new Vehicle();
        v.setName(name);
        v.setSlug(slug);
        v.setCategory(category);
        v.setImage("/images/vehicles/" + slug + ".jpg");
        v.setGallery(List.of("/images/vehicles/" + slug + ".jpg"));
        v.setDescription(description);
        v.setSeats(seats);
        v.setLuggage(luggage);
        v.setTransmission(transmission);
        v.setFuel(fuel);
        v.setPricePerKm(perKm);
        v.setPricePerDay(perDay);
        v.setBestSelling(best);
        v.setTopRated(top);
        v.setSortOrder(order);
        v.setFeatures(new ArrayList<>(Arrays.asList(
                "Air conditioning", "English speaking driver", "Bottled water",
                "Free WiFi hotspot", "Phone charger", "Fuel and driver included")));
        return v;
    }

    private void seedVehicles() {
        if (vehicles.count() > 0) return;
        List<Vehicle> fleet = new ArrayList<>();
        fleet.add(vehicle("Suzuki Alto", "suzuki-alto", "Car",
                "The budget pick for couples and short city hops. Small, easy to park in Kandy traffic, and the "
                + "cheapest way to see a lot in a few days.",
                3, 1, "Manual", "Petrol", 65, 9000, false, false, 1));
        fleet.add(vehicle("Suzuki Wagon R", "suzuki-wagon-r", "Car",
                "Our most requested car. Tall roof, real leg room and a proper boot, still cheap to run on long hill "
                + "country days.",
                4, 2, "Automatic", "Hybrid", 75, 11000, true, true, 2));
        fleet.add(vehicle("Honda Fit", "honda-fit", "Car",
                "A comfortable hybrid hatchback for two to four travellers, with space for a week of luggage and a "
                + "cool boot on coastal drives.",
                4, 2, "Automatic", "Hybrid", 80, 12000, true, true, 3));
        fleet.add(vehicle("Toyota Vitz", "toyota-vitz", "Car",
                "Compact, quiet and very economical. A good middle choice between the Alto and the Wagon R.",
                4, 2, "Automatic", "Petrol", 78, 11500, false, false, 4));
        fleet.add(vehicle("Toyota Prius", "toyota-prius", "Car",
                "The smooth option for long transfers. Ideal if you are driving Colombo to Ella in a single day and "
                + "want to arrive fresh.",
                4, 3, "Automatic", "Hybrid", 95, 15000, true, true, 5));
        fleet.add(vehicle("Toyota Axio", "toyota-axio", "Car",
                "A full size saloon with a big boot. Popular for airport transfers with two large suitcases.",
                4, 3, "Automatic", "Hybrid", 90, 14000, false, false, 6));
        fleet.add(vehicle("Toyota Premio", "toyota-premio", "Car",
                "Our most comfortable saloon: soft ride, quiet cabin and generous rear leg room. A favourite for "
                + "guests travelling with parents.",
                4, 3, "Automatic", "Petrol", 105, 16500, false, true, 7));
        fleet.add(vehicle("Toyota Hiace KDH", "toyota-hiace-kdh", "Van",
                "Our family and group van. Reclining seats, a wide aisle and room for everyone's bags on a two week "
                + "island loop.",
                9, 8, "Manual", "Diesel", 130, 22000, true, false, 8));
        fleet.add(vehicle("Hiace High Roof", "hiace-high-roof", "Van",
                "Stand-up head room, curtains and a fridge box. The comfortable choice for long distance group travel "
                + "with surfboards or camera gear.",
                12, 12, "Manual", "Diesel", 150, 26000, false, true, 9));
        fleet.add(vehicle("Nissan Caravan", "nissan-caravan", "Van",
                "A roomy alternative to the Hiace with the same seat count, often available at short notice.",
                9, 8, "Manual", "Diesel", 128, 21500, false, false, 10));
        fleet.add(vehicle("Toyota Prado", "toyota-prado-suv", "SUV",
                "Full size 4x4 for rough estate roads and hill country weather. Comfortable on tarmac, capable when "
                + "the road runs out.",
                6, 4, "Automatic", "Diesel", 165, 28000, false, true, 11));
        fleet.add(vehicle("Montero Sport", "mitsubishi-montero", "SUV",
                "High seating position and strong air conditioning. A good pick for families who want space without a "
                + "full van.",
                6, 4, "Automatic", "Diesel", 158, 27000, false, false, 12));
        fleet.add(vehicle("Safari Jeep 4x4", "safari-jeep", "SUV",
                "Open sided park jeep with a raised roof frame for standing photography. Booked per park entry, with "
                + "a tracker who knows where the herds are.",
                6, 2, "Manual", "Diesel", 0, 18000, true, true, 13));
        fleet.add(vehicle("Toyota Coaster", "coaster-bus", "Bus",
                "A 26 seat mini coach for weddings, school groups and company outings, with a luggage bay underneath.",
                26, 20, "Manual", "Diesel", 220, 42000, false, false, 14));
        fleet.add(vehicle("Luxury Coach", "luxury-coach", "Bus",
                "45 seats, reclining chairs, curtains and a sound system. For large tour groups moving between "
                + "provinces.",
                45, 40, "Manual", "Diesel", 290, 62000, false, false, 15));
        fleet.add(vehicle("Tuk Tuk", "tuk-tuk", "Tuk tuk",
                "The classic three wheeler, for short hops around Kandy, Galle or Ella. Fun, breezy and the easiest "
                + "way through a narrow lane.",
                3, 1, "Manual", "Petrol", 45, 6000, false, false, 16));
        vehicles.saveAll(fleet);
    }

    // ------------------------------------------------------------------ destinations
    private Post post(String title, String slug, String district, String bestTime,
                      String excerpt, String content, boolean featured) {
        Post p = new Post();
        p.setTitle(title);
        p.setSlug(slug);
        p.setDistrict(district);
        p.setBestTime(bestTime);
        p.setExcerpt(excerpt);
        p.setContent(content);
        p.setCoverImage("/images/places/" + slug + ".jpg");
        p.setGallery(List.of("/images/places/" + slug + ".jpg"));
        p.setFeatured(featured);
        return p;
    }

    private void seedPosts() {
        if (posts.count() > 0) return;
        List<Post> all = new ArrayList<>();

        all.add(post("Sigiriya", "sigiriya", "Matale", "January to April, early morning",
                "A fifth century palace on top of a 200 metre rock, reached by 1,200 steps and worth every one.",
                "Sigiriya rises straight out of the jungle in the Central Province and is the most photographed place "
                + "in Sri Lanka. King Kasyapa built his capital on the summit around 477 AD, complete with water "
                + "gardens, frescoes of court women and a gateway shaped like a lion, of which only the enormous paws "
                + "remain.\n\n"
                + "Start climbing by 7am. The stairs are exposed, the afternoon heat is punishing, and the queue for "
                + "the spiral staircase to the frescoes builds by nine. Allow two to three hours for the round trip "
                + "and carry water.\n\n"
                + "If the climb is not for you, Pidurangala Rock across the road gives the classic view of Sigiriya "
                + "itself for a fraction of the ticket price. We usually pair Sigiriya at sunrise with Dambulla at "
                + "midday and a Minneriya safari in the late afternoon.", true));

        all.add(post("Dambulla Cave Temple", "dambulla", "Matale", "All year, before 10am",
                "Five caves under one overhanging rock, painted end to end and filled with 153 Buddha statues.",
                "The Golden Temple of Dambulla has been a place of worship for more than two thousand years. Inside "
                + "the five caves every inch of ceiling is painted, following the contours of the rock, and the "
                + "statues range from small seated figures to a 14 metre reclining Buddha carved from the cliff.\n\n"
                + "It is a short climb up the rock face, about fifteen minutes, with monkeys along the path who will "
                + "take an unattended water bottle. Shoulders and knees must be covered and shoes come off at the "
                + "entrance, so bring socks for the hot stone.", true));

        all.add(post("Kandy", "kandy", "Kandy", "All year, cool and green",
                "The last royal capital, the Temple of the Tooth, and the gateway to the hill country.",
                "Kandy grew around its lake and the Sri Dalada Maligawa, the temple that holds a relic of the "
                + "Buddha's tooth. Time your visit for one of the three daily pujas, when drummers play at the shrine "
                + "door. Dress modestly and leave your shoes at the entrance.\n\n"
                + "The Royal Botanical Gardens at Peradeniya deserve half a day, especially the orchid house and the "
                + "giant Javan fig. In the evening, a Kandyan dance show ends with fire walking.\n\n"
                + "Kandy is our home base. Most tours start here, and the drive up from Colombo takes about three "
                + "hours with a spice garden stop on the way.", true));

        all.add(post("Anuradhapura", "anuradhapura", "Anuradhapura", "May to September, early morning",
                "The first capital of Sri Lanka: enormous white stupas, monastery ruins and a sacred fig tree.",
                "Anuradhapura was the island's capital for over a thousand years and the ruins spread across a wide "
                + "plain, so this is a site you drive between rather than walk. Ruwanwelisaya glows white in the "
                + "morning, Jetavanaramaya was once among the tallest structures in the ancient world, and the Sri "
                + "Maha Bodhi is grown from a cutting of the tree the Buddha sat under, planted in 288 BC.\n\n"
                + "Wear white if you can, cover shoulders and knees, and expect hot stone underfoot by midday. Half a "
                + "day covers the highlights; a full day rewards anyone interested in archaeology.", false));

        all.add(post("Polonnaruwa", "polonnaruwa", "Polonnaruwa", "June to September",
                "A compact medieval capital best seen by bicycle, with the finest rock carvings on the island.",
                "Polonnaruwa took over as capital in the 11th century and, unlike Anuradhapura, the ruins sit close "
                + "together, which makes a bicycle the perfect way around. The Gal Vihara group of four Buddha figures "
                + "carved from a single granite wall is the highlight, and the reclining figure is over 14 metres "
                + "long.\n\n"
                + "Start at the museum for the layout, then ride the loop through the royal palace, the Quadrangle "
                + "and the Lankatilaka. Minneriya and Kaudulla are both a short drive away for an afternoon safari.",
                false));

        all.add(post("Ella", "ella", "Badulla", "All year, mornings are clearest",
                "Little Adam's Peak, Ella Rock and the most relaxed town in the hill country.",
                "Ella sits at 1,041 metres and has become the backpacker heart of the highlands without losing its "
                + "views. Little Adam's Peak is a gentle 45 minute walk that looks through Ella Gap all the way to "
                + "the south coast on a clear morning. Ella Rock is harder, around four hours return, and best "
                + "started early.\n\n"
                + "Evenings are for the main street: rice and curry, wood fired pizza and cold Lion beer. We often "
                + "base guests here for two nights so there is time for both walks plus the waterfall drive.", true));

        all.add(post("Nine Arch Bridge", "nine-arch-bridge", "Badulla", "All year, check train times",
                "A stone viaduct built without steel, curving through jungle and tea just outside Ella.",
                "The bridge was finished during the First World War when steel was being sent to the front, so it was "
                + "built entirely from stone, brick and cement. Nine arches carry the track 24 metres above the "
                + "valley floor.\n\n"
                + "The walk from Ella town takes about twenty minutes downhill through tea. Check the timetable at "
                + "your guesthouse and be in position ten minutes before a train is due; the viewpoint on the far "
                + "side gives the classic shot. A tea stall at the top sells king coconut while you wait.", false));

        all.add(post("Nuwara Eliya", "nuwara-eliya", "Nuwara Eliya", "March to May, December to February",
                "Tea estates, cool air and colonial cottages in the place locals call Little England.",
                "At 1,868 metres Nuwara Eliya is the highest town in Sri Lanka and the only place on the island where "
                + "you will want a jacket at night. The British planted tea here in the 1800s and left behind a "
                + "racecourse, a golf course and rows of mock-Tudor bungalows.\n\n"
                + "Visit a working factory such as Pedro or Damro to follow the leaf from plucking to tasting. "
                + "Gregory Lake fills an easy afternoon, and Horton Plains with World's End is 90 minutes away; leave "
                + "at 5am, because the cliff view clouds over by nine.", true));

        all.add(post("Haputale", "haputale", "Badulla", "January to March",
                "A ridge town where the land drops away on both sides, and Lipton's Seat looks over five provinces.",
                "Haputale is quieter than Ella and sits on a knife-edge ridge, so on a clear day you can see the "
                + "south coast from the town itself. The drive up to Lipton's Seat through the Dambatenne estate is "
                + "one of the prettiest in the country.\n\n"
                + "Go for sunrise: the viewpoint is where Sir Thomas Lipton surveyed his plantations, and the mist "
                + "usually rolls in by mid morning. The tea factory below runs tours most weekdays.", false));

        all.add(post("Adam's Peak", "adams-peak", "Ratnapura", "December to May, night climb",
                "A 5,500 step night climb to a summit sacred to four religions, timed for sunrise.",
                "Sri Pada, or Adam's Peak, is a pilgrimage as much as a hike. Climbers set off around 2am so they "
                + "reach the 2,243 metre summit before dawn, when the mountain casts a perfect triangular shadow "
                + "across the clouds below.\n\n"
                + "The season runs from the December full moon to May, when the path is lit and the tea stalls along "
                + "the way are open. Allow three to five hours up. It is cold at the top, so carry a warm layer, and "
                + "expect your legs to remember the descent for two days.", false));

        all.add(post("Ravana Falls", "ravana-falls", "Badulla", "October to March for full flow",
                "A 25 metre waterfall right beside the Ella to Wellawaya road, easy to reach on any hill tour.",
                "Ravana Falls tumbles in wide sheets down a rock face six kilometres from Ella, and you can "
                + "photograph it from the roadside without a walk. Local legend ties the cave above it to the "
                + "Ramayana, where King Ravana is said to have hidden Princess Sita.\n\n"
                + "The falls are at their most dramatic from October to March. In the dry months the flow narrows and "
                + "the pools at the base become safe for a cold dip, though never swim after heavy rain upstream.",
                false));

        all.add(post("Kaudulla National Park", "kaudulla", "Polonnaruwa", "June to September, afternoon",
                "Herds of a hundred elephants gather around the reservoir here in the dry months.",
                "Kaudulla sits north of Habarana around a tank built by King Mahasen in the third century. During the "
                + "dry season the water draws elephants from across the region, and it is common to watch fifty to a "
                + "hundred grazing together on the grassland the receding lake leaves behind.\n\n"
                + "Jeeps enter from about 2pm and the last two hours before sunset are best for both animals and "
                + "light. Kaudulla and neighbouring Minneriya trade places depending on water levels, so we check "
                + "which park the herds have moved to on the morning of your safari.", true));

        all.add(post("Minneriya National Park", "minneriya", "Polonnaruwa", "July to October",
                "The Gathering: the largest seasonal meeting of Asian elephants anywhere in the world.",
                "As the dry season deepens, elephants converge on the Minneriya tank from the surrounding forests. At "
                + "its peak in August and September, three hundred animals can be on the grassland at once, including "
                + "young calves learning to use their trunks.\n\n"
                + "Afternoon drives run from around 2pm to 6pm. Bring a zoom lens, a hat and patience: the herds move "
                + "with the water, and the best sightings come to those who wait rather than chase.", false));

        all.add(post("Wilpattu National Park", "wilpattu", "Puttalam", "February to October, full day",
                "The island's largest and quietest park, named for the natural lakes scattered through it.",
                "Wilpattu covers over 1,300 square kilometres of dry forest in the northwest, dotted with villus, "
                + "natural sand-rimmed lakes that fill with rain and pull in wildlife. It is the biggest national "
                + "park in Sri Lanka and, because most visitors head south to Yala, by far the most peaceful.\n\n"
                + "This is the best park in the country for leopard sightings without a queue of jeeps. Sloth bears "
                + "appear in June and July when the palu fruit ripens. Elephants, spotted deer, mugger crocodiles and "
                + "around 200 bird species share the same water.", true));

        all.add(post("Yala National Park", "yala", "Hambantota", "February to July",
                "The highest density of leopards on earth, plus elephants, crocodiles and a wild coastline.",
                "Yala's Block One has a leopard population dense enough that a morning drive gives you a real chance "
                + "of a sighting, especially between February and July when the water holes shrink. Sloth bears, "
                + "elephants and hundreds of bird species live alongside them.\n\n"
                + "It is popular, so jeeps queue at the gate from 5.30am. Go early rather than late, book a full day "
                + "if you can, and expect dust. The park usually closes for maintenance in September.", true));

        all.add(post("Udawalawe National Park", "udawalawe", "Ratnapura", "All year",
                "The most reliable elephant park in the country, with a transit home for orphaned calves next door.",
                "Udawalawe has around six hundred resident elephants and open grassland with few trees, which means "
                + "you see them clearly at almost any time of year. Unlike Yala, sightings do not depend much on the "
                + "season.\n\n"
                + "Next to the park, the Elephant Transit Home rehabilitates orphaned calves and releases them back "
                + "into the wild. Feeding times are open to visitors and make a good stop for families with children.",
                false));

        all.add(post("Mirissa", "mirissa", "Matara", "November to April",
                "Blue whales offshore, a palm-lined bay, and the calmest swimming on the south coast.",
                "Mirissa is a crescent of sand between two headlands, with Coconut Tree Hill at one end and Parrot "
                + "Rock at the other. Between November and April the sea is calm and the sunsets keep people an extra "
                + "week.\n\n"
                + "Blue whale trips leave the harbour before 6.30am from December to April. Choose an operator that "
                + "keeps its distance from the animals; we book with crews that follow the guidelines. Weligama next "
                + "door is where beginners learn to surf.", true));

        all.add(post("Unawatuna", "unawatuna", "Galle", "November to April",
                "A sheltered horseshoe bay with warm shallow water, ten minutes from Galle Fort.",
                "Unawatuna's reef takes the force out of the waves, which makes it one of the safest swimming beaches "
                + "in the south and a good place to try snorkelling. Jungle Beach around the headland is quieter, and "
                + "the small Japanese peace pagoda above it is worth the climb for the view.\n\n"
                + "Restaurants sit right on the sand. Order the day's catch and eat it as the sun goes down behind "
                + "the palms.", false));

        all.add(post("Hikkaduwa", "hikkaduwa", "Galle", "November to April",
                "Coral sanctuary, green turtles in the shallows, and the liveliest beach town on the west coast.",
                "You can snorkel straight off the beach at Hikkaduwa and meet green turtles that come in to feed on "
                + "the seagrass. Glass bottom boats run over the coral sanctuary for anyone who would rather stay "
                + "dry.\n\n"
                + "Several turtle hatcheries operate nearby; ask us which ones actually release their hatchlings, "
                + "because standards vary. The surf suits beginners in season and gets punchier in December.", false));

        all.add(post("Arugam Bay", "arugam-bay", "Ampara", "May to September",
                "The best surf point in Sri Lanka, on the quiet east coast, with lagoon safaris behind it.",
                "Arugam Bay's right hand point break works when the west coast is blown out, which puts its season "
                + "opposite the rest of the island: May to September. Whiskey Point and Peanut Farm suit less "
                + "confident surfers.\n\n"
                + "Behind the beach, lagoon trips at dawn turn up crocodiles and elephants, and Kumana National Park "
                + "is an hour south for birdlife. The town is a single sandy street, and that is the appeal.", false));

        all.add(post("Trincomalee", "trincomalee", "Trincomalee", "May to September",
                "One of the world's finest natural harbours, with white sand beaches and sperm whales offshore.",
                "Trincomalee's season is the mirror of the south: the east coast is at its best from May to "
                + "September. Nilaveli and Uppuveli have wide, quiet beaches, and Pigeon Island a short boat ride out "
                + "has living coral and blacktip reef sharks in the shallows.\n\n"
                + "Koneswaram temple sits on a cliff above the harbour with a drop straight to the sea. Sperm whales "
                + "and dolphins pass offshore between June and August.", false));

        all.add(post("Galle Fort", "galle-fort", "Galle", "All year, sunset on the ramparts",
                "A Dutch walled town from 1663, still lived in, and the best evening walk in the south.",
                "The Portuguese built the first fort here and the Dutch rebuilt it in stone, leaving a grid of narrow "
                + "streets, colonnaded houses, a lighthouse and 3 km of ramparts you can walk right around. It is a "
                + "UNESCO World Heritage site and, unlike most, a working neighbourhood rather than a museum.\n\n"
                + "Come late afternoon, walk the walls anticlockwise from the Old Gate, and be at the lighthouse for "
                + "sunset. The lanes inside are full of jewellers, cafés and small galleries.", true));

        all.add(post("Colombo", "colombo", "Colombo", "All year",
                "The commercial capital: markets, colonial arcades and sea breeze on Galle Face Green.",
                "Most visitors pass straight through Colombo, which is a shame for a day. Pettah market is loud and "
                + "cheap, the Old Dutch Hospital has been turned into good restaurants, and Gangaramaya temple mixes "
                + "Sri Lankan, Thai and Chinese styles in one compound.\n\n"
                + "At dusk, Galle Face Green fills with families flying kites and stalls selling isso wade. It makes "
                + "a useful last stop before an evening flight, and we can hold your luggage in the vehicle.", false));

        all.add(post("Negombo", "negombo", "Gampaha", "November to April",
                "Fifteen minutes from the airport: fishing boats, a Dutch canal, and an easy first or last night.",
                "Negombo makes far more sense than Colombo for the first night of a trip. It is a twenty minute drive "
                + "from the airport instead of ninety, and there is a proper beach.\n\n"
                + "Get up early for the fish market, where outrigger boats land the night's catch, and walk the Dutch "
                + "canal that once carried cinnamon to the port. We collect guests here for the drive to Sigiriya or "
                + "Kandy after they have slept off the flight.", false));

        posts.saveAll(all);
    }

    // ------------------------------------------------------------------ reviews
    private Testimonial testimonial(String name, String country, String source, String message, boolean featured) {
        Testimonial t = new Testimonial();
        t.setName(name);
        t.setCountry(country);
        t.setSource(source);
        t.setMessage(message);
        t.setFeatured(featured);
        t.setRating(5);
        return t;
    }

    private void seedTestimonials() {
        if (testimonials.count() > 0) return;
        List<Testimonial> list = new ArrayList<>();
        list.add(testimonial("Ana Simkhada", "Nepal", "Facebook",
                "Asanka was the best guide we could have asked for in Sri Lanka. He met us on our first stop, made "
                + "every corner of the trip easy, and looked after our safety the whole way. We have already "
                + "recommended him to friends and we will book again on our next visit.", true));
        list.add(testimonial("Marie Schob", "France", "Facebook",
                "I travelled with a friend and as two girls we were never worried for a moment. Asanka showed us "
                + "parts of the island we would never have found alone and adjusted the plan whenever we changed our "
                + "minds. One hundred percent recommend this driver.", true));
        list.add(testimonial("Elonia Ilto", "Italy", "Facebook",
                "The best driver in Sri Lanka. Always calm, always caring. We arrived as two travellers and left "
                + "feeling like we had a friend on the island. Thank you for everything.", true));
        list.add(testimonial("Peter and Anne", "United Kingdom", "TripAdvisor",
                "Twelve days from Negombo to Yala and back, all arranged by email before we flew. The van was "
                + "spotless, the price never changed, and Asanka's suggestions were better than our own itinerary.",
                true));
        list.add(testimonial("Lukas Meier", "Switzerland", "Google",
                "Booked an airport transfer at 2am and got a message with the driver's details a day ahead. He was "
                + "waiting with a sign when we cleared customs. Simple, honest and exactly the price agreed.", false));
        list.add(testimonial("Sofia Novak", "Czech Republic", "Google",
                "We asked to see elephants and he checked which park the herds had moved to that morning. We counted "
                + "more than sixty at Kaudulla that evening. That local knowledge is the whole difference.", false));
        list.add(testimonial("Daniel and Maya", "Australia", "TripAdvisor",
                "Travelled with a two year old. Asanka carried the pram, found shade at every stop and never once "
                + "rushed us. Family travel in Sri Lanka made genuinely easy.", false));
        list.add(testimonial("Yuki Tanaka", "Japan", "Facebook",
                "Clean car, safe driving on the mountain roads and very good English. He waited two hours at Nine "
                + "Arch Bridge while we photographed the train and refused any extra charge.", false));
        list.add(testimonial("Emma Larsen", "Denmark", "TripAdvisor",
                "Nine days, five hotels, one train ride and a safari, all organised before we landed. He met us at "
                + "Nanu Oya with our luggage exactly as promised.", false));
        list.add(testimonial("Rajesh Menon", "India", "Google",
                "Booked the high roof van for eleven of us. Plenty of room, good music, and he knew every temple "
                + "schedule better than our own plan.", false));
        testimonials.saveAll(list);
    }

    // ------------------------------------------------------------------ gallery
    private GalleryImage photo(String file, String caption, String album, int order) {
        GalleryImage g = new GalleryImage();
        g.setUrl("/images/gallery/" + file);
        g.setCaption(caption);
        g.setAlbum(album);
        g.setSortOrder(order);
        return g;
    }

    private void seedGallery() {
        if (gallery.count() > 0) return;
        List<GalleryImage> photos = new ArrayList<>();
        photos.add(photo("gallery-01.jpg", "Sunrise below Sigiriya rock", "Ancient cities", 1));
        photos.add(photo("gallery-02.jpg", "The painted caves at Dambulla", "Ancient cities", 2));
        photos.add(photo("gallery-03.jpg", "Kandy in the cool of the morning", "Ancient cities", 3));
        photos.add(photo("gallery-04.jpg", "White stupa at Anuradhapura", "Ancient cities", 4));
        photos.add(photo("gallery-05.jpg", "Ruins at Polonnaruwa", "Ancient cities", 5));
        photos.add(photo("gallery-06.jpg", "The blue train pulling into Ella", "Hill country", 6));
        photos.add(photo("gallery-07.jpg", "Tea terraces above Nuwara Eliya", "Hill country", 7));
        photos.add(photo("gallery-08.jpg", "Ridge views from Haputale", "Hill country", 8));
        photos.add(photo("gallery-09.jpg", "First light on Adam's Peak", "Hill country", 9));
        photos.add(photo("gallery-10.jpg", "Ravana Falls in full flow", "Hill country", 10));
        photos.add(photo("gallery-11.jpg", "Elephant herd at Kaudulla tank", "Safari", 11));
        photos.add(photo("gallery-12.jpg", "The Gathering at Minneriya", "Safari", 12));
        photos.add(photo("gallery-13.jpg", "Morning drive in Wilpattu", "Safari", 13));
        photos.add(photo("gallery-14.jpg", "Leopard country in Yala", "Safari", 14));
        photos.add(photo("gallery-15.jpg", "Open grassland at Udawalawe", "Safari", 15));
        photos.add(photo("gallery-16.jpg", "Whale watching off Mirissa", "Beaches", 16));
        photos.add(photo("gallery-17.jpg", "Fishing boats at Unawatuna", "Beaches", 17));
        photos.add(photo("gallery-18.jpg", "Turtles in the shallows at Hikkaduwa", "Beaches", 18));
        photos.add(photo("gallery-19.jpg", "Surf season at Arugam Bay", "Beaches", 19));
        photos.add(photo("gallery-20.jpg", "Clear water at Trincomalee", "Beaches", 20));
        gallery.saveAll(photos);
    }
}
