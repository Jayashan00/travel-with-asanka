package com.asanka.travel.config;

import com.asanka.travel.model.Tour;
import com.asanka.travel.repo.TourRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/**
 * Fills the tours collection on first run so /tours is never empty.
 * Once the collection has documents this runner does nothing, so the
 * client's own edits in the admin panel are never overwritten.
 */
@Component
@Order(20)
public class TourSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(TourSeeder.class);

    private final TourRepository tours;

    public TourSeeder(TourRepository tours) {
        this.tours = tours;
    }

    @Override
    public void run(String... args) {
        if (tours.count() > 0) return;

        List<Tour> list = new ArrayList<>();

        list.add(tour(
                "Cultural Triangle Discovery (04 Days | 03 Nights)", "Cultural",
                "/images/places/sigiriya.jpg",
                "Sigiriya, Dambulla and Polonnaruwa at an easy pace, with a private driver for the whole route.",
                Arrays.asList("Sigiriya", "Dambulla", "Polonnaruwa", "Kandy"),
                4, 3, 6, 495.0, 590.0, 4.9, 42, 1, true,
                Arrays.asList("Climb Sigiriya Rock at sunrise", "Golden Cave Temple at Dambulla",
                        "Cycle through the ruins of Polonnaruwa", "Evening dance show in Kandy"),
                Arrays.asList("Private air conditioned vehicle with driver", "3 nights on a bed and breakfast basis",
                        "All road tolls, parking and fuel", "Bottled water each day"),
                Arrays.asList("Entrance tickets to sites", "Lunch and dinner", "Personal expenses and tips"),
                Arrays.asList("Day 1 — Airport to Sigiriya: meet your driver and travel north, evening at leisure.",
                        "Day 2 — Sigiriya Rock at sunrise, then Dambulla Cave Temple in the afternoon.",
                        "Day 3 — Polonnaruwa ancient city by bicycle, then on to Kandy.",
                        "Day 4 — Temple of the Tooth, then transfer back to Colombo or the airport.")));

        list.add(tour(
                "Hill Country & Tea Trails (05 Days | 04 Nights)", "Hill Country",
                "/images/places/ella.jpg",
                "Kandy to Ella by the blue train, with tea estates, waterfalls and the Nine Arch Bridge.",
                Arrays.asList("Kandy", "Nuwara Eliya", "Ella", "Haputale"),
                5, 4, 6, 620.0, 720.0, 4.8, 61, 2, true,
                Arrays.asList("Scenic train from Nanu Oya to Ella", "Working tea factory tour",
                        "Nine Arch Bridge at golden hour", "Little Adam's Peak walk"),
                Arrays.asList("Private air conditioned vehicle with driver", "4 nights with breakfast",
                        "Reserved train tickets", "All road tolls, parking and fuel"),
                Arrays.asList("Entrance tickets to sites", "Lunch and dinner", "Personal expenses and tips"),
                Arrays.asList("Day 1 — Colombo to Kandy, lake walk and the Temple of the Tooth.",
                        "Day 2 — Peradeniya gardens, then up to Nuwara Eliya through the tea estates.",
                        "Day 3 — Train from Nanu Oya to Ella, afternoon free.",
                        "Day 4 — Nine Arch Bridge, Little Adam's Peak and Ravana Falls.",
                        "Day 5 — Return to Colombo or the airport.")));

        list.add(tour(
                "Wildlife Safari Escape (03 Days | 02 Nights)", "Wildlife",
                "/images/places/yala.jpg",
                "Two national parks, two game drives and a night beside the jungle at Udawalawe.",
                Arrays.asList("Yala", "Udawalawe", "Tissamaharama"),
                3, 2, 6, 365.0, null, 4.7, 28, 3, false,
                Arrays.asList("Morning game drive in Yala", "Elephants at Udawalawe",
                        "Elephant Transit Home feeding", "Bird watching at Tissa lake"),
                Arrays.asList("Private air conditioned vehicle with driver", "2 nights with breakfast",
                        "Jeep hire for two game drives", "All road tolls, parking and fuel"),
                Arrays.asList("National park entrance fees", "Lunch and dinner", "Personal expenses and tips"),
                Arrays.asList("Day 1 — Colombo to Tissamaharama, evening at the lake.",
                        "Day 2 — Sunrise game drive in Yala, afternoon at leisure.",
                        "Day 3 — Udawalawe safari, then transfer back.")));

        list.add(tour(
                "South Coast Beach Break (04 Days | 03 Nights)", "Beach",
                "/images/places/mirissa.jpg",
                "Galle Fort, whale watching at Mirissa and long slow afternoons on the sand.",
                Arrays.asList("Galle", "Mirissa", "Unawatuna", "Hikkaduwa"),
                4, 3, 8, 430.0, 510.0, 4.6, 35, 4, false,
                Arrays.asList("Sunset walk on the Galle Fort ramparts", "Whale watching off Mirissa",
                        "Snorkelling at Hikkaduwa reef", "Stilt fishermen at Koggala"),
                Arrays.asList("Private air conditioned vehicle with driver", "3 nights with breakfast",
                        "Whale watching boat ticket", "All road tolls, parking and fuel"),
                Arrays.asList("Entrance tickets to sites", "Lunch and dinner", "Personal expenses and tips"),
                Arrays.asList("Day 1 — Airport to Unawatuna along the coast road.",
                        "Day 2 — Galle Fort in the morning, beach afternoon.",
                        "Day 3 — Early whale watching at Mirissa, then Koggala lagoon.",
                        "Day 4 — Hikkaduwa reef, then transfer to Colombo or the airport.")));

        list.add(tour(
                "Round Sri Lanka Grand Tour (10 Days | 09 Nights)", "Round Tour",
                "/images/places/nine-arch-bridge.jpg",
                "The full island in one route: ancient cities, hill country, safari and the south coast.",
                Arrays.asList("Negombo", "Sigiriya", "Kandy", "Nuwara Eliya", "Ella", "Yala", "Galle"),
                10, 9, 6, 1195.0, 1390.0, 5.0, 88, 5, true,
                Arrays.asList("Sigiriya Rock and Dambulla caves", "Temple of the Tooth in Kandy",
                        "Blue train to Ella", "Yala safari", "Galle Fort at sunset"),
                Arrays.asList("Private air conditioned vehicle with driver", "9 nights with breakfast",
                        "Reserved train tickets", "Jeep hire for one game drive", "All road tolls, parking and fuel"),
                Arrays.asList("Entrance tickets to sites", "Lunch and dinner", "Personal expenses and tips"),
                Arrays.asList("Day 1 — Arrival and overnight in Negombo.",
                        "Day 2 — Anuradhapura ancient city.",
                        "Day 3 — Sigiriya Rock and Dambulla.",
                        "Day 4 — Polonnaruwa and Minneriya elephant gathering.",
                        "Day 5 — Kandy: temple, gardens and a dance show.",
                        "Day 6 — Nuwara Eliya and the tea estates.",
                        "Day 7 — Train to Ella, Nine Arch Bridge.",
                        "Day 8 — Yala safari, overnight in Tissamaharama.",
                        "Day 9 — Galle Fort and Unawatuna beach.",
                        "Day 10 — Transfer to the airport.")));

        list.add(tour(
                "Ramayana Trail Pilgrimage (07 Days | 06 Nights)", "Pilgrimage",
                "/images/places/ravana-falls.jpg",
                "The Ramayana sites across the island, guided at a gentle pace for families and groups.",
                Arrays.asList("Colombo", "Kandy", "Nuwara Eliya", "Ella", "Kataragama"),
                7, 6, 10, 840.0, 980.0, 4.8, 24, 6, false,
                Arrays.asList("Munneswaram and Manavari temples", "Seetha Amman Temple",
                        "Ravana Falls and cave", "Kataragama Temple"),
                Arrays.asList("Private air conditioned vehicle with driver", "6 nights with breakfast and dinner",
                        "All road tolls, parking and fuel", "Bottled water each day"),
                Arrays.asList("Entrance tickets and offerings", "Lunch", "Personal expenses and tips"),
                Arrays.asList("Day 1 — Airport to Chilaw, Munneswaram and Manavari temples.",
                        "Day 2 — Anuradhapura and on to Trincomalee.",
                        "Day 3 — Koneswaram Temple, then to Kandy.",
                        "Day 4 — Temple of the Tooth and on to Nuwara Eliya.",
                        "Day 5 — Seetha Amman Temple and Hakgala gardens.",
                        "Day 6 — Ravana Falls, Ella and Kataragama.",
                        "Day 7 — Return to Colombo or the airport.")));

        list.add(tour(
                "Honeymoon Island Romance (06 Days | 05 Nights)", "Honeymoon",
                "/images/places/unawatuna.jpg",
                "Tea country mornings and a quiet beach finish, built for two with private transfers throughout.",
                Arrays.asList("Kandy", "Nuwara Eliya", "Bentota", "Galle"),
                6, 5, 2, 780.0, null, 4.9, 19, 7, false,
                Arrays.asList("Private candlelit dinner on the beach", "Tea estate bungalow morning",
                        "Madu river boat safari", "Sunset at Galle Fort"),
                Arrays.asList("Private air conditioned vehicle with driver", "5 nights with breakfast",
                        "One candlelit dinner", "Madu river boat ride", "All road tolls, parking and fuel"),
                Arrays.asList("Entrance tickets to sites", "Lunch and other dinners", "Personal expenses and tips"),
                Arrays.asList("Day 1 — Airport to Kandy, evening by the lake.",
                        "Day 2 — Tea country drive to Nuwara Eliya.",
                        "Day 3 — Estate walk, then down to the coast.",
                        "Day 4 — Bentota: Madu river safari and beach time.",
                        "Day 5 — Galle Fort and a candlelit dinner.",
                        "Day 6 — Transfer to the airport.")));

        list.add(tour(
                "Colombo City & Day Trip (02 Days | 01 Night)", "City Break",
                "/images/places/colombo.jpg",
                "A short stopover package: the city by day, a temple and a market run, then back to the airport.",
                Arrays.asList("Colombo", "Negombo"),
                2, 1, 4, 185.0, 220.0, 4.5, 12, 8, false,
                Arrays.asList("Gangaramaya Temple", "Pettah market walk",
                        "Galle Face Green at sunset", "Negombo fish market"),
                Arrays.asList("Private air conditioned vehicle with driver", "1 night with breakfast",
                        "All road tolls, parking and fuel"),
                Arrays.asList("Entrance tickets to sites", "Meals", "Personal expenses and tips"),
                Arrays.asList("Day 1 — Airport pick up, Colombo city tour, sunset at Galle Face.",
                        "Day 2 — Negombo lagoon and fish market, then airport drop off.")));

        tours.saveAll(list);
        log.info("Seeded {} starter tour packages.", list.size());
    }

    private Tour tour(String title, String category, String image, String summary, List<String> locations,
                      int days, int nights, int maxGuests, Double price, Double oldPrice,
                      double rating, int reviewCount, int sortOrder, boolean featured,
                      List<String> highlights, List<String> includes, List<String> excludes,
                      List<String> itinerary) {
        Tour t = new Tour();
        t.setTitle(title);
        t.setSlug(slug(title));
        t.setCategory(category);
        t.setImage(image);
        t.setGallery(new ArrayList<>(List.of(image)));
        t.setSummary(summary);
        t.setDescription(summary);
        t.setLocations(new ArrayList<>(locations));
        t.setDays(days);
        t.setNights(nights);
        t.setMaxGuests(maxGuests);
        t.setPrice(price);
        t.setOldPrice(oldPrice);
        t.setCurrency("USD");
        t.setRating(rating);
        t.setReviewCount(reviewCount);
        t.setHighlights(new ArrayList<>(highlights));
        t.setIncludes(new ArrayList<>(includes));
        t.setExcludes(new ArrayList<>(excludes));
        t.setItinerary(new ArrayList<>(itinerary));
        t.setFeatured(featured);
        t.setActive(true);
        t.setSortOrder(sortOrder);
        return t;
    }

    private String slug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        String slug = normalized.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return slug.isBlank() ? "tour-" + System.currentTimeMillis() : slug;
    }
}