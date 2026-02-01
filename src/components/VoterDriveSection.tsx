import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import ThankYouVolunteer from "./ThankYouVolunteer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface VoterDriveSectionProps {
  showThankYou?: boolean;
}

// Kenyan Counties (All 47)
const kenyanCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita/Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo/Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
  "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
  "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi City"
];

// Kenyan Constituencies by County (Sample - you can expand)
// All 290 Kenyan Constituencies by County
const constituenciesByCounty = {
  "Mombasa": [
    "Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"
  ],
  "Kwale": [
    "Msambweni", "Lungalunga", "Matuga", "Kinango"
  ],
  "Kilifi": [
    "Kilifi North", "Kilifi South", "Kaloleni", "Rabai", "Ganze", "Malindi", "Magarini"
  ],
  "Tana River": [
    "Garsen", "Galole", "Bura"
  ],
  "Lamu": [
    "Lamu East", "Lamu West"
  ],
  "Taita/Taveta": [
    "Taveta", "Wundanyi", "Mwatate", "Voi"
  ],
  "Garissa": [
    "Garissa Township", "Balambala", "Lagdera", "Dadaab", "Fafi", "Ijara"
  ],
  "Wajir": [
    "Wajir North", "Wajir East", "Tarbaj", "Wajir West", "Eldas", "Wajir South"
  ],
  "Mandera": [
    "Mandera West", "Banissa", "Mandera North", "Mandera South", "Mandera East", "Lafey"
  ],
  "Marsabit": [
    "Moyale", "North Horr", "Saku", "Laisamis"
  ],
  "Isiolo": [
    "Isiolo North", "Isiolo South"
  ],
  "Meru": [
    "Igembe South", "Igembe Central", "Igembe North", "Tigania West", "Tigania East", 
    "North Imenti", "Buuri", "Central Imenti", "South Imenti"
  ],
  "Tharaka-Nithi": [
    "Maara", "Chuka/Igambang'ombe", "Tharaka"
  ],
  "Embu": [
    "Manyatta", "Runyenjes", "Mbeere North", "Mbeere South"
  ],
  "Kitui": [
    "Mwingi North", "Mwingi West", "Mwingi Central", "Kitui West", "Kitui Rural", 
    "Kitui Central", "Kitui East", "Kitui South"
  ],
  "Machakos": [
    "Masinga", "Yatta", "Kangundo", "Matungulu", "Kathiani", "Mavoko", "Machakos Town", "Mwala"
  ],
  "Makueni": [
    "Mbooni", "Kilome", "Kaiti", "Makueni", "Kibwezi West", "Kibwezi East"
  ],
  "Nyandarua": [
    "Kinangop", "Kipipiri", "Ol Kalou", "Ol Jorok", "Ndaragwa"
  ],
  "Nyeri": [
    "Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Nyeri Town"
  ],
  "Kirinyaga": [
    "Mwea", "Gichugu", "Ndia", "Kirinyaga Central"
  ],
  "Murang'a": [
    "Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragwa", "Kandara", "Gatanga"
  ],
  "Kiambu": [
    "Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru", "Githunguri", 
    "Kiambaa", "Kiambu Town", "Kabete", "Kikuyu", "Limuru", "Lari"
  ],
  "Turkana": [
    "Turkana North", "Turkana West", "Turkana Central", "Loima", "Turkana South", "Turkana East"
  ],
  "West Pokot": [
    "Kapenguria", "Sigor", "Kacheliba", "Pokot South"
  ],
  "Samburu": [
    "Samburu West", "Samburu North", "Samburu East"
  ],
  "Trans Nzoia": [
    "Kwanza", "Endebess", "Saboti", "Kiminini", "Cherangany"
  ],
  "Uasin Gishu": [
    "Soy", "Turbo", "Moiben", "Ainabkoi", "Kapseret", "Kesses"
  ],
  "Elgeyo/Marakwet": [
    "Marakwet East", "Marakwet West", "Keiyo North", "Keiyo South"
  ],
  "Nandi": [
    "Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop"
  ],
  "Baringo": [
    "Tiaty", "Baringo North", "Baringo Central", "Baringo South", "Mogotio", "Eldama Ravine"
  ],
  "Laikipia": [
    "Laikipia West", "Laikipia East", "Laikipia North"
  ],
  "Nakuru": [
    "Molo", "Njoro", "Naivasha", "Gilgil", "Kuresoi South", "Kuresoi North", 
    "Subukia", "Rongai", "Bahati", "Nakuru Town West", "Nakuru Town East"
  ],
  "Narok": [
    "Kilgoris", "Emurua Dikirr", "Narok North", "Narok East", "Narok South", "Narok West"
  ],
  "Kajiado": [
    "Kajiado North", "Kajiado Central", "Kajiado East", "Kajiado West", "Kajiado South"
  ],
  "Kericho": [
    "Kipkelion East", "Kipkelion West", "Ainamoi", "Bureti", "Belgut", "Sigowet/Soin"
  ],
  "Bomet": [
    "Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin"
  ],
  "Kakamega": [
    "Lugari", "Likuyani", "Malava", "Lurambi", "Navakholo", "Mumias West", "Mumias East", 
    "Matungu", "Butere", "Khwisero", "Shinyalu", "Ikolomani"
  ],
  "Vihiga": [
    "Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya"
  ],
  "Bungoma": [
    "Mt. Elgon", "Sirisia", "Kabuchai", "Bumula", "Kanduyi", "Webuye East", 
    "Webuye West", "Kimilili", "Tongaren"
  ],
  "Busia": [
    "Teso North", "Teso South", "Nambale", "Matayos", "Butula", "Funyula", "Budalangi"
  ],
  "Siaya": [
    "Ugenya", "Ugunja", "Alego Usonga", "Gem", "Bondo", "Rarieda"
  ],
  "Kisumu": [
    "Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando", "Muhoroni", "Nyakach"
  ],
  "Homa Bay": [
    "Kasipul", "Kabondo Kasipul", "Karachuonyo", "Rangwe", "Homa Bay Town", "Ndhiwa", "Suba North", "Suba South"
  ],
  "Migori": [
    "Rongo", "Awendo", "Suna East", "Suna West", "Uriri", "Nyatike", "Kuria East", "Kuria West"
  ],
  "Kisii": [
    "Bonchari", "South Mugirango", "Bomachoge Borabu", "Bobasi", "Bomachoge Chache", 
    "Nyaribari Masaba", "Nyaribari Chache", "Kitutu Chache North", "Kitutu Chache South"
  ],
  "Nyamira": [
    "Kitutu Masaba", "West Mugirango", "North Mugirango", "Borabu"
  ],
  "Nairobi City": [
    "Westlands", "Dagoretti North", "Dagoretti South", "Langata", "Kibra", "Roysambu", 
    "Kasarani", "Ruaraka", "Embakasi South", "Embakasi North", "Embakasi Central", 
    "Embakasi East", "Embakasi West", "Makadara", "Kamukunji", "Starehe", "Mathare"
  ]
};

// Wards by Constituency (Sample)
const wardsByConstituency = {
  // MOMBASA COUNTY
  "Changamwe": ["Port Reitz", "Kipevu", "Airport", "Changamwe", "Chaani"],
  "Jomvu": ["Jomvu Kuu", "Miritini", "Mikindani"],
  "Kisauni": ["Mjambere", "Junda", "Bamburi", "Mwakirunge", "Mtopanga", "Magogoni", "Shanzu"],
  "Nyali": ["Frere Town", "Ziwa la Ng'ombe", "Mkomani", "Kongowea", "Kadzandani"],
  "Likoni": ["Mtongwe", "Shika Adabu", "Bofu", "Likoni", "Timbwani"],
  "Mvita": ["Mji wa Kale/Makadara", "Tudor", "Tononoka", "Shimanzi/Ganjoni", "Majengo"],

  // KWAALE COUNTY
  "Msambweni": ["Gombato Bongwe", "Ukunda", "Kinondo", "Mackinnon Road", "Pongwe/Kikoneni", "Dzombo", "Mwereni"],
  "Lungalunga": ["Puma", "Kinango", "Mackinnon Road", "Ndavaya", "Chengoni/Samburu", "Mwavumbo", "Kasemeni"],
  "Matuga": ["Tiwi", "Kubo South", "Mkongani", "Ndavaya", "Kikoneni", "Mwawe", "Msambweni"],
  "Kinango": ["Kinango", "Mackinnon Road", "Chengoni/Samburu", "Mwavumbo", "Kasemeni", "Tezo", "Sokoni"],

  // KILIFI COUNTY
  "Kilifi North": ["Tezo", "Sokoni", "Kibarani", "Dabaso", "Matsangoni", "Watamu", "Mnarani"],
  "Kilifi South": ["Junju", "Mwarakaya", "Shimo la Tewa", "Chasimba", "Mtepeni"],
  "Kaloleni": ["Mariakani", "Kayafungo", "Kaloleni", "Mwanamwinga"],
  "Rabai": ["Mwawesa", "Ruruma", "Kambe/Ribe", "Rabai/Kisurutuni"],
  "Ganze": ["Bamba", "Jaribuni", "Sokoke", "Dida Ware", "Maji ya Chumvi", "Gongoni", "Mwarakaya"],
  "Malindi": ["Malindi Town", "Shella", "Ganda", "Mijomboni", "Matsangoni", "Madunguni"],
  "Magarini": ["Adu", "Garashi", "Gongoni", "Magarini", "Marikebuni", "Sabaki"],

  // TANA RIVER COUNTY
  "Garsen": ["Kipini East", "Garsen South", "Kipini West", "Garsen Central", "Garsen West", "Garsen North"],
  "Galole": ["Kinakomba", "Mikinduni", "Chewani", "Wayu", "Bangale", "Sala", "Madogo"],
  "Bura": ["Chewele", "Hirimani", "Bangale", "Galole", "Madogo", "Sala"],

  // LAMU COUNTY
  "Lamu East": ["Witu", "Hindi", "Mkunumbi", "Hongwe", "Bahari"],
  "Lamu West": ["Shella", "Mkomani", "Hindi", "Mkunumbi", "Hongwe", "Bahari"],

  // TAITA/TAVETA COUNTY
  "Taveta": ["Chala", "Mahoo", "Bomani", "Mboghoni", "Mata"],
  "Wundanyi": ["Werugha", "Wundanyi/Mbale", "Mwanda/Mghange", "Ronge", "Mbololo"],
  "Mwatate": ["Bura", "Chawia", "Wusi/Kishamba", "Mwatate", "Rong'e"],
  "Voi": ["Mbololo", "Sagala", "Kaloleni", "Marungu", "Kasigau", "Ngolia"],

  // GARISSA COUNTY
  "Garissa Township": ["Garissa", "Ijara", "Masalani", "Sankuri", "Ijara Township"],
  "Balambala": ["Balambala", "Danyere", "Jarajara", "Saka", "Sankuri"],
  "Lagdera": ["Modogashe", "Benane", "Goreale", "Maalimin", "Sabena"],
  "Dadaab": ["Dagahaley", "Liboi", "Abakaile", "Dadaab", "Labasigale"],
  "Fafi": ["Bura", "Dekaharia", "Jarajila", "Fafi", "Nanighi"],
  "Ijara": ["Masalani", "Sangailu", "Ijara", "Kotile", "Goreale"],

  // WAJIR COUNTY
  "Wajir North": ["Buna", "Dekaharia", "Jarajila", "Fafi", "Nanighi"],
  "Wajir East": ["Wajir Bor", "Barwago", "Khorof/Harar", "Batalu", "Wajir East"],
  "Tarbaj": ["Elben", "Sarman", "Tarbaj", "Wargadud", "Arbajahan"],
  "Wajir West": ["Gurar", "Bute", "Korondile", "Malkagufu", "Batalu"],
  "Eldas": ["Eldas", "Della", "Lakoley South/Basir", "Elnur/Tula Tula"],
  "Wajir South": ["Wajir South", "Gurar", "Buna", "Habaswein", "Sarman"],

  // MANDERA COUNTY
  "Mandera West": ["Elwak South", "Elwak North", "Shimbir Fatuma", "Arabia", "Libehia"],
  "Banissa": ["Banissa", "Derkhale", "Guba", "Malkamari", "Takaba South"],
  "Mandera North": ["Rhamu", "Rhamu Dimtu", "Wargadud", "Kutulo", "Ashabito"],
  "Mandera South": ["Omar Jillo", "Wargadud", "Khalalio", "Bulla Mpya", "Burmayo"],
  "Mandera East": ["Khalalio", "Guba", "Hareri/Hareri", "Rhamu", "Rhamu Dimtu"],
  "Lafey": ["Lafey", "Salam", "Warankara", "Godoma", "Madogo"],

  // MARSABIT COUNTY
  "Moyale": ["Moyale Township", "Uran", "Obbu", "Dukana", "Moyale", "Sololo"],
  "North Horr": ["North Horr", "Dukana", "Maikona", "Turbi", "Kalacha"],
  "Saku": ["Sagante/Jaldesa", "Karare", "Marsabit Central", "Loiyangalani", "Kargi/South Horr"],
  "Laisamis": ["Laisamis", "Korr/Ngurunit", "Logo Logo", "Loiyangalani", "Kargi"],

  // ISIOLO COUNTY
  "Isiolo North": ["Isiolo", "Wabera", "Bulapesa", "Moyale", "Garbatulla"],
  "Isiolo South": ["Garba Tulla", "Kina", "Sericho", "Oldonyiro", "Merti"],

  // MERU COUNTY
  "Igembe South": ["Maua", "Kiegoi/Antubochiu", "Athiru Gaiti", "Akachiu", "Kanuni"],
  "Igembe Central": ["Kangeta", "Akirang'ondu", "Athiru Ruujine", "Igembe East", "Njia"],
  "Igembe North": ["Kiang'ondu", "Athiru Ruujine", "Igembe East", "Mitunguu", "Kiegoi"],
  "Tigania West": ["Mikinduri", "Kiguchwa", "Muthara", "Karama", "Municipality"],
  "Tigania East": ["Mikinduri", "Kiguchwa", "Muthara", "Karama", "Municipality"],
  "North Imenti": ["Abothuguchi Central", "Abothuguchi West", "Kiagu", "Mitunguu", "Kiegoi"],
  "Buuri": ["Timau", "Kisima", "Kiirua/Naari", "Ruiri", "Kibirichia"],
  "Central Imenti": ["Abogeta East", "Abogeta West", "Nkuene", "Mitunguu", "Kiegoi"],
  "South Imenti": ["Mwangathia", "Abothuguchi West", "Kiagu", "Mitunguu", "Kiegoi"],

  // THARAKA-NITHI COUNTY
  "Maara": ["Mitheru", "Muthambi", "Mwimbi", "Ganga", "Chogoria"],
  "Chuka/Igambang'ombe": ["Mariani", "Karingani", "Magumoni", "Mugwe", "Igambang'ombe"],
  "Tharaka": ["Gatunga", "Mukothima", "Nkondi", "Chiakariga", "Marimanti"],

  // EMBU COUNTY
  "Manyatta": ["Ruguru/Ngandori", "Kithimu", "Nginda", "Mbeti North", "Kirimari"],
  "Runyenjes": ["Gaturi North", "Gaturi South", "Kagaari South", "Kagaari North", "Kyeni North", "Kyeni South"],
  "Mbeere North": ["Mwea", "Makima", "Mbeti South", "Mavuria", "Kiambere"],
  "Mbeere South": ["Mwea", "Makima", "Mbeti South", "Mavuria", "Kiambere"],

  // KITUI COUNTY
  "Mwingi North": ["Kyome/Thaana", "Nguutani", "Migunga", "Keewan", "Ikombe"],
  "Mwingi West": ["Mui", "Waita", "Kanziko", "Miambani", "Nuu"],
  "Mwingi Central": ["Nguni", "Nuu", "Mui", "Waita", "Mutonguni"],
  "Kitui West": ["Mutonguni", "Kauwi", "Matinyani", "Kwa Mutonga/Kithumula", "Kisasi"],
  "Kitui Rural": ["Kwa Mutonga/Kithumula", "Kisasi", "Mbitini", "Kwavonza/Yatta", "Kanyangi"],
  "Kitui Central": ["Miambani", "Township", "Kyangwithya West", "Mulango", "Kisasi"],
  "Kitui East": ["Voo/Kyamatu", "Endau/Malalani", "Mutito/Kaliku", "Ikanga/Kyatune", "Kanziko"],
  "Kitui South": ["Ikanga/Kyatune", "Mutomo", "Mutha", "Ikutha", "Kanziko"],

  // MACHAKOS COUNTY
  "Masinga": ["Masinga Central", "Ekalakala", "Muthesya", "Ndithini", "Ndalani"],
  "Yatta": ["Kithimani", "Ikombe", "Katangi", "Kangundo North", "Kangundo South"],
  "Kangundo": ["Kangundo North", "Kangundo South", "Kangundo Central", "Kangundo West", "Matungulu"],
  "Matungulu": ["Tala", "Matungulu North", "Matungulu East", "Matungulu West", "Kyeleni"],
  "Kathiani": ["Mitaboni", "Kathiani Central", "Upper Kaewa/Iveti", "Lower Kaewa/Kaani", "Kola"],
  "Mavoko": ["Athi River", "Kinanie", "Muthwani", "Syokimau/Mulolongo"],
  "Machakos Town": ["Muvuti/Kiima-Kimwe", "Kola", "Mbiuni", "Makutano/Mwala", "Masii"],
  "Mwala": ["Mbiuni", "Makutano/Mwala", "Masii", "Muthetheni", "Wamunyu"],

  // MAKUENI COUNTY
  "Mbooni": ["Kithungo/Kitundu", "Kisau/Kiteta", "Waia/Kako", "Kalawa", "Kasikeu"],
  "Kilome": ["Mbitini", "Makindu", "Nguumo", "Kikumbulyu North", "Kikumbulyu South"],
  "Kaiti": ["Kikumbulyu North", "Kikumbulyu South", "Nguu/Masumba", "Emali/Mulala", "Masongaleni"],
  "Makueni": ["Wote", "Muvau/Kikuumini", "Mavindini", "Kitise/Kithuki", "Kathonzweni"],
  "Kibwezi West": ["Kikumbulyu North", "Kikumbulyu South", "Nguu/Masumba", "Emali/Mulala", "Masongaleni"],
  "Kibwezi East": ["Masongaleni", "Mtito Andei", "Thange", "Ivingoni/Nzambani", "Kibwezi"],

  // NYANDARUA COUNTY
  "Kinangop": ["Engineer", "Gathara", "North Kinangop", "Murungaru", "Njabini/Kiburu"],
  "Kipipiri": ["Geta", "Githioro", "Kipipiri", "Wanjohi", "North Kinangop"],
  "Ol Kalou": ["Ol Kalou", "Kinangop", "Kaimbaga", "Rurii", "Gathanji"],
  "Ol Jorok": ["Mairo Inya", "Githioro", "Kipipiri", "Wanjohi", "Geta"],
  "Ndaragwa": ["Leshau/Pondo", "Kiriita", "Central", "Lanet/Umoja", "Bahati"],

  // NYERI COUNTY
  "Tetu": ["Dedan Kimathi", "Wamagana", "Aguthi", "Muringato", "Iriaini"],
  "Kieni": ["Mweiga", "Naromoru Kiamathaga", "Mwiyogo/Endarasha", "Mugunda", "Gatarakwa"],
  "Mathira": ["Karuri", "Gachika", "Kiamathaga", "Iriaini", "Ruguru"],
  "Othaya": ["Chinga", "Karima", "Mahiga", "Iria-ini", "Konyu"],
  "Mukurweini": ["Mukurweini Central", "Mukurweini West", "Gikondi", "Rugi", "Kiganjo/Mathari"],
  "Nyeri Town": ["Kiganjo/Mathari", "Rware", "Gatitu/Muruguru", "Ruring'u", "Kamakwa/Mukaro"],

  // KIRINYAGA COUNTY
  "Mwea": ["Thiba", "Kangai", "Njukiini", "Murinduko", "Gathigiriri", "Tebere"],
  "Gichugu": ["Kianyaga", "Kariti", "Murinduko", "Gathigiriri", "Tebere"],
  "Ndia": ["Baragwi", "Njukiini", "Gichugu", "Inoi", "Kanyekini"],
  "Kirinyaga Central": ["Mutithi", "Kangai", "Wamumu", "Nyangati", "Murinduko"],

  // MURANG'A COUNTY
  "Kangema": ["Kiharu", "Muruka", "Kangari", "Kinyona", "Kigumo"],
  "Mathioya": ["Kiriita", "Kangari", "Kinyona", "Muguru", "Rwathia"],
  "Kiharu": ["Kaharo", "Muruka", "Gaturi", "Muguru", "Rwathia"],
  "Kigumo": ["Kigumo", "Kangari", "Muguru", "Wangu", "Mbiri"],
  "Maragwa": ["Kambiti", "Kamahuha", "Kiharu", "Muruka", "Gaturi"],
  "Kandara": ["Gaichanjiru", "Ithiru", "Ruchu", "Kandara", "Muthithi"],
  "Gatanga": ["Kariara", "Nginda", "Gatanga", "Kihumbu-ini", "Kangari"],

  // KIAMBU COUNTY (Continued from earlier)
  "Gatundu South": ["Kiamwangi", "Kiganjo", "Ndarugu", "Ngenda"],
  "Gatundu North": ["Gatundu North", "Gatundu South", "Gituamba", "Githobokoni"],
  "Juja": ["Murera", "Theta", "Juja", "Witeithie", "Kalimoni"],
  "Thika Town": ["Township", "Kamenu", "Hospital", "Gatuanyaga", "Ngoliba"],
  "Ruiru": ["Githurai", "Kahawa Wendani", "Kahawa Sukari", "Kiuu", "Mwiki", "Mwihoko"],
  "Githunguri": ["Githunguri", "Githiga", "Ikinu", "Ngewa", "Komothai"],
  "Kiambaa": ["Cianda", "Karuri", "Ndenderu", "Muchatha", "Kihara"],
  "Kiambu Town": ["Township", "Riabai", "Gatuanyaga", "Kamenu", "Karai"],
  "Kabete": ["Nachu", "Sigona", "Kikuyu", "Karai", "Nderi"],
  "Kikuyu": ["Kinoo", "Kikuyu", "Karai", "Nachu"],
  "Limuru": ["Limuru Central", "Ndeiya", "Limuru East", "Ngecha Tigoni"],
  "Lari": ["Kinale", "Kijabe", "Nyanduma", "Kamburu", "Lari/Kirenga"],

  // TURKANA COUNTY
  "Turkana North": ["Kaeris", "Lake Zone", "Lapur", "Kaaleng/Kaikor", "Kibish", "Nakalale"],
  "Turkana West": ["Kakuma", "Lopur", "Letea", "Songot", "Kalobeyei", "Lokichogio"],
  "Turkana Central": ["Kanamkemer", "Kerio Delta", "Kang'atotha", "Kalokol", "Lodwar Township", "Songot"],
  "Loima": ["Kotaruk/Lobei", "Turkwell", "Loima", "Lokiriama/Lorengippi"],
  "Turkana South": ["Kaputir", "Katilu", "Lobokat", "Kalogoch", "Lokichar"],
  "Turkana East": ["Kapedo/Napeitom", "Katilia", "Lokori/Kochodin"],

  // WEST POKOT COUNTY
  "Kapenguria": ["Kapenguria", "Mnagei", "Siyoi", "Endugh", "Sook"],
  "Sigor": ["Kasei", "Kacheliba", "Kong'elai", "Weiwei", "Kipkomo"],
  "Kacheliba": ["Kasei", "Kacheliba", "Kong'elai", "Weiwei", "Kipkomo"],
  "Pokot South": ["Lelan", "Tapach", "Porkoyu", "Weiwei", "Kapchok"],

  // SAMBURU COUNTY
  "Samburu West": ["Suguta Marmar", "Maralal", "Loosuk", "Poro", "El Barta"],
  "Samburu North": ["Wamba West", "Wamba East", "Wamba North", "Waso", "El Barta"],
  "Samburu East": ["Waso", "Laisamis", "Korr/Ngurunit", "Logo Logo", "Loiyangalani"],

  // TRANS NZOIA COUNTY
  "Kwanza": ["Bidii", "Chepchoina", "Endebess", "Matumbei", "Tuigoin"],
  "Endebess": ["Endebess", "Matumbei", "Tuigoin", "Nabiswa", "Kakibora"],
  "Saboti": ["Machewa", "Kinyoro", "Rugunga", "Kiminini", "Waitaluk"],
  "Kiminini": ["Waitaluk", "Sirende", "Hospital", "Sikhendu", "Nabiswa"],
  "Cherangany": ["Chepchoina", "Endebess", "Matumbei", "Tuigoin", "Nabiswa"],

  // UASIN GISHU COUNTY
  "Soy": ["Kipsomba", "Soy", "Kubero", "Ziwa", "Segero/Barsombe"],
  "Turbo": ["Ngenyilel", "Tapsagoi", "Kamagut", "Kiplombe", "Kapsaos"],
  "Moiben": ["Kapsaos", "Tembelio", "Seretunin", "Cheptiret/Kipchamo", "Tulwet/Chuiyat"],
  "Ainabkoi": ["Kapseret", "Kipkenyo", "Ngeria", "Megun", "Langas"],
  "Kapseret": ["Megun", "Langas", "Racecourse", "Cheptiret/Kipchamo", "Tulwet/Chuiyat"],
  "Kesses": ["Tulwet/Chuiyat", "Tarakwa", "Kapyego", "Kaptagat", "Ainabkoi/Olare"],

  // ELGEYO/MARAKWET COUNTY
  "Marakwet East": ["Kapyego", "Tambach", "Kaptarakwa", "Chepkorio", "Soy North"],
  "Marakwet West": ["Soy North", "Soy South", "Kabiemit", "Metkei", "Songhor/Soba"],
  "Keiyo North": ["Tambach", "Kaptarakwa", "Chepkorio", "Soy North", "Metkei"],
  "Keiyo South": ["Metkei", "Songhor/Soba", "Kapkangani", "Kaptumo/Kaboi", "Koyo/Ndurio"],

  // NANDI COUNTY
  "Tinderet": ["Kabisaga", "Kapsabet", "Kilibwoni", "Chepterwai", "Kipkaren"],
  "Aldai": ["Kabiyet", "Ndalat", "Kabisaga", "Kapsabet", "Kilibwoni"],
  "Nandi Hills": ["Chepkunyuk", "Ol'lessos", "Kapchorua", "Kaimosi", "Kibwareng"],
  "Chesumei": ["Kapsabet", "Kilibwoni", "Chepterwai", "Kipkaren", "Kapsimotwo"],
  "Emgwen": ["Kapsabet", "Kilibwoni", "Chepterwai", "Kipkaren", "Kapsimotwo"],
  "Mosop": ["Kapsimotwo", "Kaptel/Kamoiywo", "Kiptuya", "Chepkumia", "Kapkangani"],

  // BARINGO COUNTY
  "Tiaty": ["Kolowa", "Ribkwo", "Silale", "Loiyamorok", "Tangulbei/Korossi"],
  "Baringo North": ["Saimo/Kipsaraman", "Saimo/Soi", "Bartabwa", "Kabartonjo", "Sacho"],
  "Baringo Central": ["Sacho", "Kabartonjo", "Bartabwa", "Kapropita", "Marigat"],
  "Baringo South": ["Marigat", "Mochongoi", "Mukutani", "Emining", "Lembus"],
  "Mogotio": ["Emining", "Lembus", "Mukutani", "Mogotio", "Ravine"],
  "Eldama Ravine": ["Ravine", "Mumberes/Maji Mazuri", "Lembus Kwen", "Koibatek", "Embobut/Embolot"],

  // LAIKIPIA COUNTY
  "Laikipia West": ["Ol-Moran", "Rumuruti Township", "Githiga", "Marmanet", "Igwamiti"],
  "Laikipia East": ["Ngobit", "Tigithi", "Thingithu", "Nanyuki", "Umande"],
  "Laikipia North": ["Sosian", "Segera", "Mukogodo West", "Mukogodo East", "Igwamiti"],

  // NAKURU COUNTY (Continued from earlier)
  "Molo": ["Molo", "Elburgon", "Mariashoni", "Turi"],
  "Njoro": ["Njoro", "Mauche", "Kihingo", "Nessuit", "Lare", "Mau Narok"],
  "Naivasha": ["Naivasha East", "Naivasha West", "Maella", "Biashara", "Kihoto", "Lake View"],
  "Gilgil": ["Gilgil", "Elementaita", "Mbaruk/Eburu", "Malewa West", "Murindati"],
  "Kuresoi South": ["Keringet", "Kiptagich", "Tinet", "Kiptororo"],
  "Kuresoi North": ["Sirikwa", "Kamara", "Kapkures", "Kiptororo"],
  "Subukia": ["Subukia", "Waseges", "Kabazi", "Mogotio"],
  "Rongai": ["Solai", "Mosop", "Moi's Bridge", "Kapkangani", "Rongai"],
  "Bahati": ["Bahati", "Dundori", "Kabatini", "Kiamaina", "Lanet/Umoja"],
  "Nakuru Town West": ["Barut", "London", "Kaptembwo", "Kapkures", "Rhoda", "Shaabab"],
  "Nakuru Town East": ["Biashara", "Kivumbini", "Flamingo", "Menengai", "Nakuru East"],

  // NAROK COUNTY
  "Kilgoris": ["Kilgoris Central", "Keyian", "Angata Barikoi", "Shankoe", "Kimintet"],
  "Emurua Dikirr": ["Ilkerin", "Ololmasani", "Mogondo", "Kapsasian"],
  "Narok North": ["Ololulung'a", "Mara", "Siana", "Narosura", "Melili"],
  "Narok East": ["Suswa", "Majimoto/Naroosura", "Ololulung'a", "Melelo", "Loita"],
  "Narok South": ["Melelo", "Loita", "Sogoo", "Sagamian", "Ilmotiok"],
  "Narok West": ["Mogondo", "Ilkerin", "Ololmasani", "Kapsasian", "Sogoo"],

  // KAJIADO COUNTY
  "Kajiado North": ["Ongata Rongai", "Nkaimurunya", "Oloolua", "Ngong", "Matasia"],
  "Kajiado Central": ["Ildamat", "Dalalekutuk", "Matapato North", "Matapato South", "Kaputiei North"],
  "Kajiado East": ["Kaputiei North", "Kitengela", "Oloosirkon/Sholinke", "Kenyawa-Poka", "Imaroro"],
  "Kajiado West": ["Kajiado", "Iloodokilani", "Magadi", "Ewuaso Oonkidong'i", "Keek-Onyokie"],
  "Kajiado South": ["Purko", "Ildamat", "Dalalekutuk", "Matapato North", "Matapato South"],

  // KERICHO COUNTY
  "Kipkelion East": ["Londiani", "Kedowa/Kimugul", "Chepseon", "Tendeno/Sorget"],
  "Kipkelion West": ["Kunyak", "Kamasian", "Kipkelion", "Chilchila"],
  "Ainamoi": ["Kapsoit", "Ainamoi", "Kapkugerwet", "Kipchebor", "Kapsaos"],
  "Bureti": ["Cheborge", "Kipreres", "Sigowet", "Kapkatet", "Soliat"],
  "Belgut": ["Londiani", "Kedowa/Kimugul", "Chepseon", "Tendeno/Sorget"],
  "Sigowet/Soin": ["Sigowet", "Soin", "Kaplelartet", "Soliat", "Roret"],

  // BOMET COUNTY
  "Sotik": ["Sotik", "Chepalungu", "Konoin", "Bomet East", "Bomet Central"],
  "Chepalungu": ["Sigor", "Chebunyo", "Nyongores", "Sigor", "Mutarakwa"],
  "Bomet East": ["Merigi", "Kembu", "Longisa", "Kipreres", "Chemaner"],
  "Bomet Central": ["Silibwet", "Singorwet", "Ndaraweta", "Bonet", "Chesoen"],
  "Konoin": ["Embomos", "Mogogosiek", "Boito", "Embobut", "Kapsowar"],

  // KAKAMEGA COUNTY (Continued from earlier)
  "Lugari": ["Mautuma", "Lugari", "Lumakanda", "Chekalini", "Lwandeti"],
  "Likuyani": ["Sango", "Kongoni", "Nzoia", "Sinoko", "Likuyani"],
  "Malava": ["Malava", "Lurambi North", "Lurambi South", "Malaha", "South Kabras", "North Kabras", "Butali/Chegulo"],
  "Lurambi": ["Shinoyi-Shikomari", "Lurambi East", "Lurambi West", "Manda/Shivanga", "Sheywe"],
  "Navakholo": ["Ingostre-Mathia", "Shinamwenyuli", "Bunyala West", "Bunyala East", "Bunyala Central"],
  "Mumias West": ["Mumias Central", "Mumias North", "Etenje", "Musanda"],
  "Mumias East": ["Lusheya/Lubinu", "Malaha/Isongo/Makunga", "East Wanga"],
  "Matungu": ["Kholera", "Khalaba", "Mayoni", "Namamali"],
  "Butere": ["Marama West", "Marama Central", "Marenyo-Shianda", "West Butere", "Central Butere", "Butere"],
  "Khwisero": ["Emakina", "Butsotso East", "Butsotso South", "Butsotso Central", "Butsotso North"],
  "Shinyalu": ["Shinyalu", "Musikoma", "East Sang'alo", "Marakaru/Tuuti", "West Sang'alo"],
  "Ikolomani": ["Idakho East", "Idakho South", "Idakho Central", "Idakho North"],

  // VIHIGA COUNTY
  "Vihiga": ["Luanda", "Wemilabi", "Muhudu", "Tambua", "Jepkoyai"],
  "Sabatia": ["Chavakali", "North Maragoli", "Wodanga", "Busali", "Shiru"],
  "Hamisi": ["Shamakhokho", "Banja", "Muhudu", "Tambua", "Jepkoyai"],
  "Luanda": ["Luanda", "Wemilabi", "Muhudu", "Tambua", "Jepkoyai"],
  "Emuhaya": ["North East Bunyore", "Central Bunyore", "West Bunyore", "Cheptais", "Kapsokwony"],

  // BUNGOMA COUNTY
  "Mt. Elgon": ["Cheptais", "Kapsokwony", "Kopsiro", "Kaptama", "Chepyuk"],
  "Sirisia": ["Kabuchai", "Chwele", "Bokoli", "Mukuyuni", "Misikhu"],
  "Kabuchai": ["Kabuchai", "Chwele", "Bokoli", "Mukuyuni", "Misikhu"],
  "Bumula": ["Kimaeti", "Bukembe West", "Bukembe East", "Township", "Mukwa"],
  "Kanduyi": ["Bukembe West", "Bukembe East", "Township", "Mukwa", "South Bukusu"],
  "Webuye East": ["Mihuu", "Ndivisi", "Maraka", "Misikhu", "Bokoli"],
  "Webuye West": ["Bukembe West", "Bukembe East", "Township", "Mukwa", "South Bukusu"],
  "Kimilili": ["Kimilili", "Maeni", "Kamukuywa", "Kibingei", "Township"],
  "Tongaren": ["Tongaren", "Soysambu/Mitua", "Kabuyefwe", "Naitiri/Kabuyefwe", "Bukembe"],

  // BUSIA COUNTY
  "Teso North": ["Ang'urai South", "Ang'urai North", "Ang'urai East", "Malaba Central", "Malaba North"],
  "Teso South": ["Ang'urai South", "Ang'urai North", "Ang'urai East", "Malaba Central", "Malaba North"],
  "Nambale": ["Bukhayo North/Walatsi", "Bukhayo Central", "Bukhayo East", "Nambale Township", "Bukhayo West"],
  "Matayos": ["Budalangi", "Bunyala Central", "Bunyala North", "Bunyala West", "Bunyala South"],
  "Butula": ["Marachi West", "Marachi Central", "Marachi East", "Marachi North", "Elugulu"],
  "Funyula": ["Budalangi", "Bunyala Central", "Bunyala North", "Bunyala West", "Bunyala South"],
  "Budalangi": ["Budalangi", "Bunyala Central", "Bunyala North", "Bunyala West", "Bunyala South"],

  // SIAYA COUNTY
  "Ugenya": ["Sidindi", "Sigomere", "Ugunja", "Ukwala", "Sega"],
  "Ugunja": ["Ugunja", "Sega", "Sidindi", "Sigomere", "Ukwala"],
  "Alego Usonga": ["Usonga", "North Alego", "Central Alego", "Siaya Township", "West Alego"],
  "Gem": ["East Gem", "West Gem", "North Gem", "South Gem", "Central Gem"],
  "Bondo": ["West Yimbo", "Central Sakwa", "South Sakwa", "Yimbo East", "West Sakwa"],
  "Rarieda": ["East Asembo", "West Asembo", "North Uyoma", "South Uyoma", "West Uyoma"],

  // KISUMU COUNTY (Continued from earlier)
  "Kisumu East": ["Kajulu", "Kolwa East", "Manyatta 'B'", "Nyalenda 'A'", "Nyalenda 'B'"],
  "Kisumu West": ["Kisumu North", "West Kisumu", "North West Kisumu", "Central Kisumu"],
  "Kisumu Central": ["Kajulu", "Kakola/Kaburini", "Kondele", "Milimani", "Nyalenda 'A'", "Nyalenda 'B'"],
  "Seme": ["West Seme", "Central Seme", "East Seme", "North Seme"],
  "Nyando": ["Kakola", "South West Nyakach", "North Nyakach", "Central Nyakach", "South Nyakach"],
  "Muhoroni": ["Muhoroni/Koru", "South West Nyakach", "Nyakach", "Lower Nyakach", "Upper Nyakach"],
  "Nyakach": ["Lower Nyakach", "Central Nyakach", "Upper Nyakach", "South East Nyakach", "West Nyakach"],

  // HOMA BAY COUNTY
  "Kasipul": ["West Kasipul", "South Kasipul", "Central Kasipul", "East Kamagak", "West Kamagak"],
  "Kabondo Kasipul": ["Kabondo East", "Kabondo West", "Kokwanyo/Kakelo", "Kojwach", "West Karachuonyo"],
  "Karachuonyo": ["Kanyaluo", "Kibiri", "Wang'chieng", "Kendu Bay Town", "West Karachuonyo"],
  "Rangwe": ["Kanyikela", "North Kabuoch", "Kabuoch South/Pala", "Kanyamwa Kologi", "Kanyamwa Kosewe"],
  "Homa Bay Town": ["Homa Bay Central", "Homa Bay Arujo", "Homa Bay West", "Homa Bay East"],
  "Ndhiwa": ["Kanyikela", "North Kabuoch", "Kabuoch South/Pala", "Kanyamwa Kologi", "Kanyamwa Kosewe"],
  "Suba North": ["Gembe", "Lambwe", "Gwassi South", "Gwassi North", "Kaksingri West"],
  "Suba South": ["Gwassi South", "Gwassi North", "Kaksingri West", "Kaksingri East", "Mfangano"],

  // MIGORI COUNTY
  "Rongo": ["North Kamagambo", "Central Kamagambo", "East Kamagambo", "South Kamagambo", "West Kamagambo"],
  "Awendo": ["North East Sakwa", "South Sakwa", "West Sakwa", "Central Sakwa", "God Jope"],
  "Suna East": ["Kakrao", "Kwa", "Central Kanyamkago", "South Kanyamkago", "East Kanyamkago"],
  "Suna West": ["West Kanyamkago", "North Kanyamkago", "Central Kanyamkago", "South Kanyamkago", "East Kanyamkago"],
  "Uriri": ["Central Kanyamkago", "South Kanyamkago", "East Kanyamkago", "West Kanyamkago", "North Kanyamkago"],
  "Nyatike": ["Kanyasa", "North Kadem", "Macalder/Kanyarwanda", "Kaler", "Got Kachola"],
  "Kuria East": ["Bukira East", "Bukira Central/Ikerege", "Isibania", "Makerero", "Masaba"],
  "Kuria West": ["Bukira East", "Bukira Central/Ikerege", "Isibania", "Makerero", "Masaba"],

  // KISII COUNTY
  "Bonchari": ["Bogiakumu", "Bomorenda", "Bomorianga", "Bogusero", "Bokeira"],
  "South Mugirango": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],
  "Bomachoge Borabu": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],
  "Bobasi": ["Bobasi Chache", "Bobasi Boitangare", "Bomorenda", "Bomorianga", "Bogusero"],
  "Bomachoge Chache": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],
  "Nyaribari Masaba": ["Masige East", "Masige West", "Bomorenda", "Bomorianga", "Bogusero"],
  "Nyaribari Chache": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],
  "Kitutu Chache North": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],
  "Kitutu Chache South": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],

  // NYAMIRA COUNTY
  "Kitutu Masaba": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],
  "West Mugirango": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],
  "North Mugirango": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],
  "Borabu": ["Bomorenda", "Bomorianga", "Bogusero", "Bokeira", "Bomachoge"],

  // NAIROBI COUNTY (Continued from earlier)
  "Westlands": ["Kitisuru", "Parklands/Highridge", "Karura", "Kangemi", "Mountain View"],
  "Dagoretti North": ["Kilimani", "Kawangware", "Gatina", "Kileleshwa", "Kabiro"],
  "Dagoretti South": ["Mutu-ini", "Ngando", "Riruta", "Uthiru/Ruthimitu", "Waithaka"],
  "Langata": ["Karen", "Nairobi West", "Mugumo-ini", "South C", "Nyayo Highrise"],
  "Kibra": ["Laini Saba", "Lindi", "Makina", "Woodley/Kenyatta Golf Course", "Sarang'ombe"],
  "Roysambu": ["Roysambu", "Kasarani", "Kahawa West", "Zimmerman", "Kahawa"],
  "Kasarani": ["Clay City", "Mwiki", "Kasarani", "Njiru", "Ruai"],
  "Ruaraka": ["Babadogo", "Utalii", "Mathare North", "Lucky Summer", "Korogocho"],
  "Embakasi South": ["Imara Daima", "Kwa Njenga", "Kwa Reuben", "Pipeline", "Kware"],
  "Embakasi North": ["Kariobangi North", "Dandora Area I", "Dandora Area II", "Dandora Area III", "Dandora Area IV"],
  "Embakasi Central": ["Kayole North", "Kayole Central", "Kayole South", "Komarock", "Matopeni"],
  "Embakasi East": ["Upper Savanna", "Lower Savanna", "Embakasi", "Utawala", "Mihang'o"],
  "Embakasi West": ["Umoja I", "Umoja II", "Mowlem", "Kariobangi South"],
  "Makadara": ["Maringo/Hamza", "Viwandani", "Harambee", "Makongeni", "Mbotela"],
  "Kamukunji": ["Pumwani", "Eastleigh North", "Eastleigh South", "Airbase", "California"],
  "Starehe": ["Nairobi Central", "Ngara", "Pangani", "Ziwani/Kariokor", "Landimawe", "Nairobi South"],
  "Mathare": ["Hospital", "Mabatini", "Huruma", "Ngei", "Mlango Kubwa", "Kiamaiko"]
};

// Polling Stations by Ward (Sample)
const pollingStationsByWard = {
  // MOMBASA
  "Port Reitz": ["Port Reitz Primary", "Mikindani Secondary", "Port Reitz Hospital"],
  "Kipevu": ["Kipevu Primary", "Kipevu Secondary", "Magongo Health Centre"],
  "Airport": ["Moi International Airport", "Airport View Primary", "Freight Terminal"],
  "Changamwe": ["Changamwe Primary", "Changamwe Secondary", "Changamwe Police Station"],
  "Chaani": ["Chaani Primary", "Chaani Secondary", "Chaani Health Centre"],
  "Jomvu Kuu": ["Jomvu Primary", "Jomvu Secondary", "Jomvu Health Centre"],
  "Miritini": ["Miritini Primary", "Miritini Secondary", "Miritini Health Centre"],
  "Mikindani": ["Mikindani Primary", "Mikindani Secondary", "Mikindani Health Centre"],
  "Mjambere": ["Mjambere Primary", "Mjambere Secondary", "Mjambere Social Hall"],
  "Junda": ["Junda Primary", "Junda Secondary", "Junda Health Centre"],
  "Bamburi": ["Bamburi Primary", "Bamburi Secondary", "Bamburi Health Centre"],
  "Mwakirunge": ["Mwakirunge Primary", "Mwakirunge Secondary", "Mwakirunge Health Centre"],
  "Mtopanga": ["Mtopanga Primary", "Mtopanga Secondary", "Mtopanga Health Centre"],
  "Magogoni": ["Magogoni Primary", "Magogoni Secondary", "Magogoni Health Centre"],
  "Shanzu": ["Shanzu Primary", "Shanzu Secondary", "Shanzu Health Centre"],
  "Frere Town": ["Frere Town Primary", "Frere Town Secondary", "Frere Town Health Centre"],
  "Ziwa la Ng'ombe": ["Ziwa la Ng'ombe Primary", "Ziwa la Ng'ombe Secondary", "Ziwa la Ng'ombe Health Centre"],
  "Mkomani": ["Mkomani Primary", "Mkomani Secondary", "Mkomani Health Centre"],
  "Kongowea": ["Kongowea Primary", "Kongowea Secondary", "Kongowea Health Centre"],
  "Kadzandani": ["Kadzandani Primary", "Kadzandani Secondary", "Kadzandani Health Centre"],
  "Mtongwe": ["Mtongwe Primary", "Mtongwe Secondary", "Mtongwe Health Centre"],
  "Shika Adabu": ["Shika Adabu Primary", "Shika Adabu Secondary", "Shika Adabu Health Centre"],
  "Bofu": ["Bofu Primary", "Bofu Secondary", "Bofu Health Centre"],
  "Likoni": ["Likoni Primary", "Likoni Secondary", "Likoni Health Centre"],
  "Timbwani": ["Timbwani Primary", "Timbwani Secondary", "Timbwani Health Centre"],
  "Mji wa Kale/Makadara": ["Makadara Primary", "Makadara Secondary", "Makadara Health Centre"],
  "Tudor": ["Tudor Primary", "Tudor Secondary", "Tudor Health Centre"],
  "Tononoka": ["Tononoka Primary", "Tononoka Secondary", "Tononoka Health Centre"],
  "Shimanzi/Ganjoni": ["Shimanzi Primary", "Ganjoni Primary", "Shimanzi Health Centre"],
  "Majengo": ["Majengo Primary", "Majengo Secondary", "Majengo Health Centre"],

  // NAIROBI
  "Kitisuru": ["Kitisuru Primary", "Kitisuru Social Hall", "Kitisuru Chief's Office"],
  "Parklands/Highridge": ["Parklands Baptist", "Aga Khan Primary", "Hillcrest Secondary"],
  "Karura": ["Karura Forest Station", "Muthaiga Police Station", "Karura Social Hall"],
  "Kangemi": ["Kangemi Primary", "Kangemi Secondary", "Kangemi Health Centre"],
  "Mountain View": ["Mountain View Primary", "Mountain View Secondary", "Mountain View Health Centre"],
  "Kilimani": ["Kilimani Primary", "Kilimani Secondary", "Kilimani Health Centre"],
  "Kawangware": ["Kawangware Primary", "Kawangware Secondary", "Kawangware Health Centre"],
  "Gatina": ["Gatina Primary", "Gatina Secondary", "Gatina Health Centre"],
  "Kileleshwa": ["Kileleshwa Primary", "Kileleshwa Secondary", "Kileleshwa Health Centre"],
  "Kabiro": ["Kabiro Primary", "Kabiro Secondary", "Kabiro Health Centre"],
  "Mutu-ini": ["Mutu-ini Primary", "Mutu-ini Secondary", "Mutu-ini Health Centre"],
  "Ngando": ["Ngando Primary", "Ngando Secondary", "Ngando Health Centre"],
  "Riruta": ["Riruta Primary", "Riruta Secondary", "Riruta Health Centre"],
  "Uthiru/Ruthimitu": ["Uthiru Primary", "Ruthimitu Primary", "Uthiru Health Centre"],
  "Waithaka": ["Waithaka Primary", "Waithaka Secondary", "Waithaka Health Centre"],
  "Karen": ["Karen Primary", "Karen Shopping Centre", "Dagoretti Corner"],
  "Nairobi West": ["Nairobi West Primary", "Nairobi West Social Hall", "Tumaini Primary"],
  "Mugumo-ini": ["Mugumo-ini Primary", "Mugumo-ini Secondary", "Mugumo-ini Health Centre"],
  "South C": ["South C Primary", "South C Secondary", "South C Health Centre"],
  "Nyayo Highrise": ["Nyayo Highrise Primary", "Nyayo Highrise Secondary", "Nyayo Health Centre"],
  "Laini Saba": ["Laini Saba Primary", "Laini Saba Secondary", "Laini Saba Health Centre"],
  "Lindi": ["Lindi Primary", "Lindi Secondary", "Lindi Health Centre"],
  "Makina": ["Makina Primary", "Makina Secondary", "Makina Health Centre"],
  "Woodley/Kenyatta Golf Course": ["Woodley Primary", "Kenyatta Golf Course", "Woodley Health Centre"],
  "Sarang'ombe": ["Sarang'ombe Primary", "Sarang'ombe Secondary", "Sarang'ombe Health Centre"],
   // KIWAALE COUNTY
  "Gombato Bongwe": ["Gombato Primary", "Bongwe Secondary", "Gombato Health Centre"],
  "Ukunda": ["Ukunda Primary", "Ukunda Secondary", "Ukunda Hospital"],
  "Kinondo": ["Kinondo Primary", "Kinondo Secondary", "Kinondo Health Centre"],
  "Mackinnon Road": ["Mackinnon Road Primary", "Mackinnon Secondary", "Mackinnon Health Centre"],
  "Pongwe/Kikoneni": ["Pongwe Primary", "Kikoneni Primary", "Pongwe Health Centre"],
  "Dzombo": ["Dzombo Primary", "Dzombo Secondary", "Dzombo Health Centre"],
  "Mwereni": ["Mwereni Primary", "Mwereni Secondary", "Mwereni Health Centre"],
  "Puma": ["Puma Primary", "Puma Secondary", "Puma Health Centre"],
  "Kinango": ["Kinango Primary", "Kinango Secondary", "Kinango Hospital"],
  "Ndavaya": ["Ndavaya Primary", "Ndavaya Secondary", "Ndavaya Health Centre"],
  "Chengoni/Samburu": ["Chengoni Primary", "Samburu Primary", "Chengoni Health Centre"],
  "Mwavumbo": ["Mwavumbo Primary", "Mwavumbo Secondary", "Mwavumbo Health Centre"],
  "Kasemeni": ["Kasemeni Primary", "Kasemeni Secondary", "Kasemeni Health Centre"],
  "Tiwi": ["Tiwi Primary", "Tiwi Secondary", "Tiwi Health Centre"],
  "Kubo South": ["Kubo Primary", "Kubo Secondary", "Kubo Health Centre"],
  "Mkongani": ["Mkongani Primary", "Mkongani Secondary", "Mkongani Health Centre"],
  "Kikoneni": ["Kikoneni Primary", "Kikoneni Secondary", "Kikoneni Health Centre"],
  "Mwawe": ["Mwawe Primary", "Mwawe Secondary", "Mwawe Health Centre"],
  "Msambweni": ["Msambweni Primary", "Msambweni Secondary", "Msambweni Hospital"],
  "Tezo": ["Tezo Primary", "Tezo Secondary", "Tezo Health Centre"],
  "Sokoni": ["Sokoni Primary", "Sokoni Secondary", "Sokoni Health Centre"],

  // KILIFI COUNTY
  "Kibarani": ["Kibarani Primary", "Kibarani Secondary", "Kibarani Health Centre"],
  "Dabaso": ["Dabaso Primary", "Dabaso Secondary", "Dabaso Health Centre"],
  "Matsangoni": ["Matsangoni Primary", "Matsangoni Secondary", "Matsangoni Health Centre"],
  "Watamu": ["Watamu Primary", "Watamu Secondary", "Watamu Health Centre"],
  "Mnarani": ["Mnarani Primary", "Mnarani Secondary", "Mnarani Health Centre"],
  "Junju": ["Junju Primary", "Junju Secondary", "Junju Health Centre"],
  "Mwarakaya": ["Mwarakaya Primary", "Mwarakaya Secondary", "Mwarakaya Health Centre"],
  "Shimo la Tewa": ["Shimo la Tewa Primary", "Shimo la Tewa Secondary", "Shimo la Tewa Health Centre"],
  "Chasimba": ["Chasimba Primary", "Chasimba Secondary", "Chasimba Health Centre"],
  "Mtepeni": ["Mtepeni Primary", "Mtepeni Secondary", "Mtepeni Health Centre"],
  "Mariakani": ["Mariakani Primary", "Mariakani Secondary", "Mariakani Health Centre"],
  "Kayafungo": ["Kayafungo Primary", "Kayafungo Secondary", "Kayafungo Health Centre"],
  "Kaloleni": ["Kaloleni Primary", "Kaloleni Secondary", "Kaloleni Health Centre"],
  "Mwanamwinga": ["Mwanamwinga Primary", "Mwanamwinga Secondary", "Mwanamwinga Health Centre"],
  "Mwawesa": ["Mwawesa Primary", "Mwawesa Secondary", "Mwawesa Health Centre"],
  "Ruruma": ["Ruruma Primary", "Ruruma Secondary", "Ruruma Health Centre"],
  "Kambe/Ribe": ["Kambe Primary", "Ribe Primary", "Kambe Health Centre"],
  "Rabai/Kisurutuni": ["Rabai Primary", "Kisurutuni Primary", "Rabai Health Centre"],
  "Bamba": ["Bamba Primary", "Bamba Secondary", "Bamba Health Centre"],
  "Jaribuni": ["Jaribuni Primary", "Jaribuni Secondary", "Jaribuni Health Centre"],
  "Sokoke": ["Sokoke Primary", "Sokoke Secondary", "Sokoke Health Centre"],
  "Dida Ware": ["Dida Ware Primary", "Dida Ware Secondary", "Dida Ware Health Centre"],
  "Maji ya Chumvi": ["Maji ya Chumvi Primary", "Maji ya Chumvi Secondary", "Maji ya Chumvi Health Centre"],
  "Gongoni": ["Gongoni Primary", "Gongoni Secondary", "Gongoni Health Centre"],
  "Mwarakaya": ["Mwarakaya Primary", "Mwarakaya Secondary", "Mwarakaya Health Centre"],
  "Malindi Town": ["Malindi Primary", "Malindi Secondary", "Malindi Hospital"],
  "Shella": ["Shella Primary", "Shella Secondary", "Shella Health Centre"],
  "Ganda": ["Ganda Primary", "Ganda Secondary", "Ganda Health Centre"],
  "Mijomboni": ["Mijomboni Primary", "Mijomboni Secondary", "Mijomboni Health Centre"],
  "Madunguni": ["Madunguni Primary", "Madunguni Secondary", "Madunguni Health Centre"],
  "Adu": ["Adu Primary", "Adu Secondary", "Adu Health Centre"],
  "Garashi": ["Garashi Primary", "Garashi Secondary", "Garashi Health Centre"],
  "Magarini": ["Magarini Primary", "Magarini Secondary", "Magarini Health Centre"],
  "Marikebuni": ["Marikebuni Primary", "Marikebuni Secondary", "Marikebuni Health Centre"],
  "Sabaki": ["Sabaki Primary", "Sabaki Secondary", "Sabaki Health Centre"],

  // TANA RIVER COUNTY
  "Kipini East": ["Kipini Primary", "Kipini Secondary", "Kipini Health Centre"],
  "Garsen South": ["Garsen Primary", "Garsen Secondary", "Garsen Health Centre"],
  "Kipini West": ["Kipini West Primary", "Kipini West Secondary", "Kipini West Health Centre"],
  "Garsen Central": ["Garsen Central Primary", "Garsen Central Secondary", "Garsen Central Health Centre"],
  "Garsen West": ["Garsen West Primary", "Garsen West Secondary", "Garsen West Health Centre"],
  "Garsen North": ["Garsen North Primary", "Garsen North Secondary", "Garsen North Health Centre"],
  "Kinakomba": ["Kinakomba Primary", "Kinakomba Secondary", "Kinakomba Health Centre"],
  "Mikinduni": ["Mikinduni Primary", "Mikinduni Secondary", "Mikinduni Health Centre"],
  "Chewani": ["Chewani Primary", "Chewani Secondary", "Chewani Health Centre"],
  "Wayu": ["Wayu Primary", "Wayu Secondary", "Wayu Health Centre"],
  "Bangale": ["Bangale Primary", "Bangale Secondary", "Bangale Health Centre"],
  "Sala": ["Sala Primary", "Sala Secondary", "Sala Health Centre"],
  "Madogo": ["Madogo Primary", "Madogo Secondary", "Madogo Health Centre"],
  "Chewele": ["Chewele Primary", "Chewele Secondary", "Chewele Health Centre"],
  "Hirimani": ["Hirimani Primary", "Hirimani Secondary", "Hirimani Health Centre"],
  "Galole": ["Galole Primary", "Galole Secondary", "Galole Health Centre"],

  // LAMU COUNTY
  "Witu": ["Witu Primary", "Witu Secondary", "Witu Health Centre"],
  "Hindi": ["Hindi Primary", "Hindi Secondary", "Hindi Health Centre"],
  "Mkunumbi": ["Mkunumbi Primary", "Mkunumbi Secondary", "Mkunumbi Health Centre"],
  "Hongwe": ["Hongwe Primary", "Hongwe Secondary", "Hongwe Health Centre"],
  "Bahari": ["Bahari Primary", "Bahari Secondary", "Bahari Health Centre"],
  "Shella": ["Shella Primary", "Shella Secondary", "Shella Health Centre"],
  "Mkomani": ["Mkomani Primary", "Mkomani Secondary", "Mkomani Health Centre"],

  // TAITA/TAVETA COUNTY
  "Chala": ["Chala Primary", "Chala Secondary", "Chala Health Centre"],
  "Mahoo": ["Mahoo Primary", "Mahoo Secondary", "Mahoo Health Centre"],
  "Bomani": ["Bomani Primary", "Bomani Secondary", "Bomani Health Centre"],
  "Mboghoni": ["Mboghoni Primary", "Mboghoni Secondary", "Mboghoni Health Centre"],
  "Mata": ["Mata Primary", "Mata Secondary", "Mata Health Centre"],
  "Werugha": ["Werugha Primary", "Werugha Secondary", "Werugha Health Centre"],
  "Wundanyi/Mbale": ["Wundanyi Primary", "Mbale Primary", "Wundanyi Health Centre"],
  "Mwanda/Mghange": ["Mwanda Primary", "Mghange Primary", "Mwanda Health Centre"],
  "Ronge": ["Ronge Primary", "Ronge Secondary", "Ronge Health Centre"],
  "Mbololo": ["Mbololo Primary", "Mbololo Secondary", "Mbololo Health Centre"],
  "Bura": ["Bura Primary", "Bura Secondary", "Bura Health Centre"],
  "Chawia": ["Chawia Primary", "Chawia Secondary", "Chawia Health Centre"],
  "Wusi/Kishamba": ["Wusi Primary", "Kishamba Primary", "Wusi Health Centre"],
  "Mwatate": ["Mwatate Primary", "Mwatate Secondary", "Mwatate Health Centre"],
  "Rong'e": ["Rong'e Primary", "Rong'e Secondary", "Rong'e Health Centre"],
  "Sagala": ["Sagala Primary", "Sagala Secondary", "Sagala Health Centre"],
  "Kaloleni": ["Kaloleni Primary", "Kaloleni Secondary", "Kaloleni Health Centre"],
  "Marungu": ["Marungu Primary", "Marungu Secondary", "Marungu Health Centre"],
  "Kasigau": ["Kasigau Primary", "Kasigau Secondary", "Kasigau Health Centre"],
  "Ngolia": ["Ngolia Primary", "Ngolia Secondary", "Ngolia Health Centre"],

  // GARISSA COUNTY
  "Garissa": ["Garissa Primary", "Garissa Secondary", "Garissa Hospital"],
  "Ijara": ["Ijara Primary", "Ijara Secondary", "Ijara Health Centre"],
  "Masalani": ["Masalani Primary", "Masalani Secondary", "Masalani Health Centre"],
  "Sankuri": ["Sankuri Primary", "Sankuri Secondary", "Sankuri Health Centre"],
  "Ijara Township": ["Ijara Township Primary", "Ijara Township Secondary", "Ijara Township Health Centre"],
  "Balambala": ["Balambala Primary", "Balambala Secondary", "Balambala Health Centre"],
  "Danyere": ["Danyere Primary", "Danyere Secondary", "Danyere Health Centre"],
  "Jarajara": ["Jarajara Primary", "Jarajara Secondary", "Jarajara Health Centre"],
  "Saka": ["Saka Primary", "Saka Secondary", "Saka Health Centre"],
  "Modogashe": ["Modogashe Primary", "Modogashe Secondary", "Modogashe Health Centre"],
  "Benane": ["Benane Primary", "Benane Secondary", "Benane Health Centre"],
  "Goreale": ["Goreale Primary", "Goreale Secondary", "Goreale Health Centre"],
  "Maalimin": ["Maalimin Primary", "Maalimin Secondary", "Maalimin Health Centre"],
  "Sabena": ["Sabena Primary", "Sabena Secondary", "Sabena Health Centre"],
  "Dagahaley": ["Dagahaley Primary", "Dagahaley Secondary", "Dagahaley Health Centre"],
  "Liboi": ["Liboi Primary", "Liboi Secondary", "Liboi Health Centre"],
  "Abakaile": ["Abakaile Primary", "Abakaile Secondary", "Abakaile Health Centre"],
  "Dadaab": ["Dadaab Primary", "Dadaab Secondary", "Dadaab Health Centre"],
  "Labasigale": ["Labasigale Primary", "Labasigale Secondary", "Labasigale Health Centre"],
  "Bura": ["Bura Primary", "Bura Secondary", "Bura Health Centre"],
  "Dekaharia": ["Dekaharia Primary", "Dekaharia Secondary", "Dekaharia Health Centre"],
  "Jarajila": ["Jarajila Primary", "Jarajila Secondary", "Jarajila Health Centre"],
  "Fafi": ["Fafi Primary", "Fafi Secondary", "Fafi Health Centre"],
  "Nanighi": ["Nanighi Primary", "Nanighi Secondary", "Nanighi Health Centre"],
  "Sangailu": ["Sangailu Primary", "Sangailu Secondary", "Sangailu Health Centre"],
  "Kotile": ["Kotile Primary", "Kotile Secondary", "Kotile Health Centre"],

  // WAJIR COUNTY
  "Buna": ["Buna Primary", "Buna Secondary", "Buna Health Centre"],
  "Wajir Bor": ["Wajir Bor Primary", "Wajir Bor Secondary", "Wajir Bor Health Centre"],
  "Barwago": ["Barwago Primary", "Barwago Secondary", "Barwago Health Centre"],
  "Khorof/Harar": ["Khorof Primary", "Harar Primary", "Khorof Health Centre"],
  "Batalu": ["Batalu Primary", "Batalu Secondary", "Batalu Health Centre"],
  "Wajir East": ["Wajir East Primary", "Wajir East Secondary", "Wajir East Health Centre"],
  "Elben": ["Elben Primary", "Elben Secondary", "Elben Health Centre"],
  "Sarman": ["Sarman Primary", "Sarman Secondary", "Sarman Health Centre"],
  "Tarbaj": ["Tarbaj Primary", "Tarbaj Secondary", "Tarbaj Health Centre"],
  "Wargadud": ["Wargadud Primary", "Wargadud Secondary", "Wargadud Health Centre"],
  "Arbajahan": ["Arbajahan Primary", "Arbajahan Secondary", "Arbajahan Health Centre"],
  "Gurar": ["Gurar Primary", "Gurar Secondary", "Gurar Health Centre"],
  "Bute": ["Bute Primary", "Bute Secondary", "Bute Health Centre"],
  "Korondile": ["Korondile Primary", "Korondile Secondary", "Korondile Health Centre"],
  "Malkagufu": ["Malkagufu Primary", "Malkagufu Secondary", "Malkagufu Health Centre"],
  "Eldas": ["Eldas Primary", "Eldas Secondary", "Eldas Health Centre"],
  "Della": ["Della Primary", "Della Secondary", "Della Health Centre"],
  "Lakoley South/Basir": ["Lakoley Primary", "Basir Primary", "Lakoley Health Centre"],
  "Elnur/Tula Tula": ["Elnur Primary", "Tula Tula Primary", "Elnur Health Centre"],
  "Wajir South": ["Wajir South Primary", "Wajir South Secondary", "Wajir South Health Centre"],
  "Habaswein": ["Habaswein Primary", "Habaswein Secondary", "Habaswein Health Centre"],

  // MANDERA COUNTY
  "Elwak South": ["Elwak South Primary", "Elwak South Secondary", "Elwak South Health Centre"],
  "Elwak North": ["Elwak North Primary", "Elwak North Secondary", "Elwak North Health Centre"],
  "Shimbir Fatuma": ["Shimbir Fatuma Primary", "Shimbir Fatuma Secondary", "Shimbir Fatuma Health Centre"],
  "Arabia": ["Arabia Primary", "Arabia Secondary", "Arabia Health Centre"],
  "Libehia": ["Libehia Primary", "Libehia Secondary", "Libehia Health Centre"],
  "Banissa": ["Banissa Primary", "Banissa Secondary", "Banissa Health Centre"],
  "Derkhale": ["Derkhale Primary", "Derkhale Secondary", "Derkhale Health Centre"],
  "Guba": ["Guba Primary", "Guba Secondary", "Guba Health Centre"],
  "Malkamari": ["Malkamari Primary", "Malkamari Secondary", "Malkamari Health Centre"],
  "Takaba South": ["Takaba South Primary", "Takaba South Secondary", "Takaba South Health Centre"],
  "Rhamu": ["Rhamu Primary", "Rhamu Secondary", "Rhamu Health Centre"],
  "Rhamu Dimtu": ["Rhamu Dimtu Primary", "Rhamu Dimtu Secondary", "Rhamu Dimtu Health Centre"],
  "Kutulo": ["Kutulo Primary", "Kutulo Secondary", "Kutulo Health Centre"],
  "Ashabito": ["Ashabito Primary", "Ashabito Secondary", "Ashabito Health Centre"],
  "Omar Jillo": ["Omar Jillo Primary", "Omar Jillo Secondary", "Omar Jillo Health Centre"],
  "Khalalio": ["Khalalio Primary", "Khalalio Secondary", "Khalalio Health Centre"],
  "Bulla Mpya": ["Bulla Mpya Primary", "Bulla Mpya Secondary", "Bulla Mpya Health Centre"],
  "Burmayo": ["Burmayo Primary", "Burmayo Secondary", "Burmayo Health Centre"],
  "Lafey": ["Lafey Primary", "Lafey Secondary", "Lafey Health Centre"],
  "Salam": ["Salam Primary", "Salam Secondary", "Salam Health Centre"],
  "Warankara": ["Warankara Primary", "Warankara Secondary", "Warankara Health Centre"],
  "Godoma": ["Godoma Primary", "Godoma Secondary", "Godoma Health Centre"],
  "Madogo": ["Madogo Primary", "Madogo Secondary", "Madogo Health Centre"],

  // MARSABIT COUNTY
  "Moyale Township": ["Moyale Township Primary", "Moyale Township Secondary", "Moyale Township Hospital"],
  "Uran": ["Uran Primary", "Uran Secondary", "Uran Health Centre"],
  "Obbu": ["Obbu Primary", "Obbu Secondary", "Obbu Health Centre"],
  "Dukana": ["Dukana Primary", "Dukana Secondary", "Dukana Health Centre"],
  "Sololo": ["Sololo Primary", "Sololo Secondary", "Sololo Health Centre"],
  "North Horr": ["North Horr Primary", "North Horr Secondary", "North Horr Health Centre"],
  "Maikona": ["Maikona Primary", "Maikona Secondary", "Maikona Health Centre"],
  "Turbi": ["Turbi Primary", "Turbi Secondary", "Turbi Health Centre"],
  "Kalacha": ["Kalacha Primary", "Kalacha Secondary", "Kalacha Health Centre"],
  "Sagante/Jaldesa": ["Sagante Primary", "Jaldesa Primary", "Sagante Health Centre"],
  "Karare": ["Karare Primary", "Karare Secondary", "Karare Health Centre"],
  "Marsabit Central": ["Marsabit Central Primary", "Marsabit Central Secondary", "Marsabit Central Hospital"],
  "Loiyangalani": ["Loiyangalani Primary", "Loiyangalani Secondary", "Loiyangalani Health Centre"],
  "Kargi/South Horr": ["Kargi Primary", "South Horr Primary", "Kargi Health Centre"],
  "Laisamis": ["Laisamis Primary", "Laisamis Secondary", "Laisamis Health Centre"],
  "Korr/Ngurunit": ["Korr Primary", "Ngurunit Primary", "Korr Health Centre"],
  "Logo Logo": ["Logo Logo Primary", "Logo Logo Secondary", "Logo Logo Health Centre"],

  // ISIOLO COUNTY
  "Isiolo": ["Isiolo Primary", "Isiolo Secondary", "Isiolo Hospital"],
  "Wabera": ["Wabera Primary", "Wabera Secondary", "Wabera Health Centre"],
  "Bulapesa": ["Bulapesa Primary", "Bulapesa Secondary", "Bulapesa Health Centre"],
  "Moyale": ["Moyale Primary", "Moyale Secondary", "Moyale Health Centre"],
  "Garbatulla": ["Garbatulla Primary", "Garbatulla Secondary", "Garbatulla Health Centre"],
  "Garba Tulla": ["Garba Tulla Primary", "Garba Tulla Secondary", "Garba Tulla Health Centre"],
  "Kina": ["Kina Primary", "Kina Secondary", "Kina Health Centre"],
  "Sericho": ["Sericho Primary", "Sericho Secondary", "Sericho Health Centre"],
  "Oldonyiro": ["Oldonyiro Primary", "Oldonyiro Secondary", "Oldonyiro Health Centre"],
  "Merti": ["Merti Primary", "Merti Secondary", "Merti Health Centre"],

  // MERU COUNTY
  "Maua": ["Maua Primary", "Maua Secondary", "Maua Hospital"],
  "Kiegoi/Antubochiu": ["Kiegoi Primary", "Antubochiu Primary", "Kiegoi Health Centre"],
  "Athiru Gaiti": ["Athiru Gaiti Primary", "Athiru Gaiti Secondary", "Athiru Gaiti Health Centre"],
  "Akachiu": ["Akachiu Primary", "Akachiu Secondary", "Akachiu Health Centre"],
  "Kanuni": ["Kanuni Primary", "Kanuni Secondary", "Kanuni Health Centre"],
  "Kangeta": ["Kangeta Primary", "Kangeta Secondary", "Kangeta Health Centre"],
  "Akirang'ondu": ["Akirang'ondu Primary", "Akirang'ondu Secondary", "Akirang'ondu Health Centre"],
  "Athiru Ruujine": ["Athiru Ruujine Primary", "Athiru Ruujine Secondary", "Athiru Ruujine Health Centre"],
  "Igembe East": ["Igembe East Primary", "Igembe East Secondary", "Igembe East Health Centre"],
  "Njia": ["Njia Primary", "Njia Secondary", "Njia Health Centre"],
  "Kiang'ondu": ["Kiang'ondu Primary", "Kiang'ondu Secondary", "Kiang'ondu Health Centre"],
  "Mitunguu": ["Mitunguu Primary", "Mitunguu Secondary", "Mitunguu Health Centre"],
  "Mikinduri": ["Mikinduri Primary", "Mikinduri Secondary", "Mikinduri Health Centre"],
  "Kiguchwa": ["Kiguchwa Primary", "Kiguchwa Secondary", "Kiguchwa Health Centre"],
  "Muthara": ["Muthara Primary", "Muthara Secondary", "Muthara Health Centre"],
  "Karama": ["Karama Primary", "Karama Secondary", "Karama Health Centre"],
  "Municipality": ["Municipality Primary", "Municipality Secondary", "Municipality Health Centre"],
  "Abothuguchi Central": ["Abothuguchi Central Primary", "Abothuguchi Central Secondary", "Abothuguchi Central Health Centre"],
  "Abothuguchi West": ["Abothuguchi West Primary", "Abothuguchi West Secondary", "Abothuguchi West Health Centre"],
  "Kiagu": ["Kiagu Primary", "Kiagu Secondary", "Kiagu Health Centre"],
  "Timau": ["Timau Primary", "Timau Secondary", "Timau Health Centre"],
  "Kisima": ["Kisima Primary", "Kisima Secondary", "Kisima Health Centre"],
  "Kiirua/Naari": ["Kiirua Primary", "Naari Primary", "Kiirua Health Centre"],
  "Ruiri": ["Ruiri Primary", "Ruiri Secondary", "Ruiri Health Centre"],
  "Kibirichia": ["Kibirichia Primary", "Kibirichia Secondary", "Kibirichia Health Centre"],
  "Abogeta East": ["Abogeta East Primary", "Abogeta East Secondary", "Abogeta East Health Centre"],
  "Abogeta West": ["Abogeta West Primary", "Abogeta West Secondary", "Abogeta West Health Centre"],
  "Nkuene": ["Nkuene Primary", "Nkuene Secondary", "Nkuene Health Centre"],
  "Mwangathia": ["Mwangathia Primary", "Mwangathia Secondary", "Mwangathia Health Centre"],

  // THARAKA-NITHI COUNTY
  "Mitheru": ["Mitheru Primary", "Mitheru Secondary", "Mitheru Health Centre"],
  "Muthambi": ["Muthambi Primary", "Muthambi Secondary", "Muthambi Health Centre"],
  "Mwimbi": ["Mwimbi Primary", "Mwimbi Secondary", "Mwimbi Health Centre"],
  "Ganga": ["Ganga Primary", "Ganga Secondary", "Ganga Health Centre"],
  "Chogoria": ["Chogoria Primary", "Chogoria Secondary", "Chogoria Health Centre"],
  "Mariani": ["Mariani Primary", "Mariani Secondary", "Mariani Health Centre"],
  "Karingani": ["Karingani Primary", "Karingani Secondary", "Karingani Health Centre"],
  "Magumoni": ["Magumoni Primary", "Magumoni Secondary", "Magumoni Health Centre"],
  "Mugwe": ["Mugwe Primary", "Mugwe Secondary", "Mugwe Health Centre"],
  "Igambang'ombe": ["Igambang'ombe Primary", "Igambang'ombe Secondary", "Igambang'ombe Health Centre"],
  "Gatunga": ["Gatunga Primary", "Gatunga Secondary", "Gatunga Health Centre"],
  "Mukothima": ["Mukothima Primary", "Mukothima Secondary", "Mukothima Health Centre"],
  "Nkondi": ["Nkondi Primary", "Nkondi Secondary", "Nkondi Health Centre"],
  "Chiakariga": ["Chiakariga Primary", "Chiakariga Secondary", "Chiakariga Health Centre"],
  "Marimanti": ["Marimanti Primary", "Marimanti Secondary", "Marimanti Health Centre"],

  // EMBU COUNTY
  "Ruguru/Ngandori": ["Ruguru Primary", "Ngandori Primary", "Ruguru Health Centre"],
  "Kithimu": ["Kithimu Primary", "Kithimu Secondary", "Kithimu Health Centre"],
  "Nginda": ["Nginda Primary", "Nginda Secondary", "Nginda Health Centre"],
  "Mbeti North": ["Mbeti North Primary", "Mbeti North Secondary", "Mbeti North Health Centre"],
  "Kirimari": ["Kirimari Primary", "Kirimari Secondary", "Kirimari Health Centre"],
  "Gaturi North": ["Gaturi North Primary", "Gaturi North Secondary", "Gaturi North Health Centre"],
  "Gaturi South": ["Gaturi South Primary", "Gaturi South Secondary", "Gaturi South Health Centre"],
  "Kagaari South": ["Kagaari South Primary", "Kagaari South Secondary", "Kagaari South Health Centre"],
  "Kagaari North": ["Kagaari North Primary", "Kagaari North Secondary", "Kagaari North Health Centre"],
  "Kyeni North": ["Kyeni North Primary", "Kyeni North Secondary", "Kyeni North Health Centre"],
  "Kyeni South": ["Kyeni South Primary", "Kyeni South Secondary", "Kyeni South Health Centre"],
  "Mwea": ["Mwea Primary", "Mwea Secondary", "Mwea Health Centre"],
  "Makima": ["Makima Primary", "Makima Secondary", "Makima Health Centre"],
  "Mbeti South": ["Mbeti South Primary", "Mbeti South Secondary", "Mbeti South Health Centre"],
  "Mavuria": ["Mavuria Primary", "Mavuria Secondary", "Mavuria Health Centre"],
  "Kiambere": ["Kiambere Primary", "Kiambere Secondary", "Kiambere Health Centre"],

  // KITUI COUNTY
  "Kyome/Thaana": ["Kyome Primary", "Thaana Primary", "Kyome Health Centre"],
  "Nguutani": ["Nguutani Primary", "Nguutani Secondary", "Nguutani Health Centre"],
  "Migunga": ["Migunga Primary", "Migunga Secondary", "Migunga Health Centre"],
  "Keewan": ["Keewan Primary", "Keewan Secondary", "Keewan Health Centre"],
  "Ikombe": ["Ikombe Primary", "Ikombe Secondary", "Ikombe Health Centre"],
  "Mui": ["Mui Primary", "Mui Secondary", "Mui Health Centre"],
  "Waita": ["Waita Primary", "Waita Secondary", "Waita Health Centre"],
  "Kanziko": ["Kanziko Primary", "Kanziko Secondary", "Kanziko Health Centre"],
  "Miambani": ["Miambani Primary", "Miambani Secondary", "Miambani Health Centre"],
  "Nuu": ["Nuu Primary", "Nuu Secondary", "Nuu Health Centre"],
  "Mutonguni": ["Mutonguni Primary", "Mutonguni Secondary", "Mutonguni Health Centre"],
  "Kauwi": ["Kauwi Primary", "Kauwi Secondary", "Kauwi Health Centre"],
  "Matinyani": ["Matinyani Primary", "Matinyani Secondary", "Matinyani Health Centre"],
  "Kwa Mutonga/Kithumula": ["Kwa Mutonga Primary", "Kithumula Primary", "Kwa Mutonga Health Centre"],
  "Kisasi": ["Kisasi Primary", "Kisasi Secondary", "Kisasi Health Centre"],
  "Mbitini": ["Mbitini Primary", "Mbitini Secondary", "Mbitini Health Centre"],
  "Kwavonza/Yatta": ["Kwavonza Primary", "Yatta Primary", "Kwavonza Health Centre"],
  "Kanyangi": ["Kanyangi Primary", "Kanyangi Secondary", "Kanyangi Health Centre"],
  "Township": ["Township Primary", "Township Secondary", "Township Health Centre"],
  "Kyangwithya West": ["Kyangwithya West Primary", "Kyangwithya West Secondary", "Kyangwithya West Health Centre"],
  "Mulango": ["Mulango Primary", "Mulango Secondary", "Mulango Health Centre"],
  "Voo/Kyamatu": ["Voo Primary", "Kyamatu Primary", "Voo Health Centre"],
  "Endau/Malalani": ["Endau Primary", "Malalani Primary", "Endau Health Centre"],
  "Mutito/Kaliku": ["Mutito Primary", "Kaliku Primary", "Mutito Health Centre"],
  "Ikanga/Kyatune": ["Ikanga Primary", "Kyatune Primary", "Ikanga Health Centre"],
  "Mutomo": ["Mutomo Primary", "Mutomo Secondary", "Mutomo Health Centre"],
  "Mutha": ["Mutha Primary", "Mutha Secondary", "Mutha Health Centre"],
  "Ikutha": ["Ikutha Primary", "Ikutha Secondary", "Ikutha Health Centre"],

  // MACHAKOS COUNTY
  "Masinga Central": ["Masinga Central Primary", "Masinga Central Secondary", "Masinga Central Health Centre"],
  "Ekalakala": ["Ekalakala Primary", "Ekalakala Secondary", "Ekalakala Health Centre"],
  "Muthesya": ["Muthesya Primary", "Muthesya Secondary", "Muthesya Health Centre"],
  "Ndithini": ["Ndithini Primary", "Ndithini Secondary", "Ndithini Health Centre"],
  "Ndalani": ["Ndalani Primary", "Ndalani Secondary", "Ndalani Health Centre"],
  "Kithimani": ["Kithimani Primary", "Kithimani Secondary", "Kithimani Health Centre"],
  "Ikombe": ["Ikombe Primary", "Ikombe Secondary", "Ikombe Health Centre"],
  "Katangi": ["Katangi Primary", "Katangi Secondary", "Katangi Health Centre"],
  "Kangundo North": ["Kangundo North Primary", "Kangundo North Secondary", "Kangundo North Health Centre"],
  "Kangundo South": ["Kangundo South Primary", "Kangundo South Secondary", "Kangundo South Health Centre"],
  "Kangundo Central": ["Kangundo Central Primary", "Kangundo Central Secondary", "Kangundo Central Health Centre"],
  "Kangundo West": ["Kangundo West Primary", "Kangundo West Secondary", "Kangundo West Health Centre"],
  "Tala": ["Tala Primary", "Tala Secondary", "Tala Health Centre"],
  "Matungulu North": ["Matungulu North Primary", "Matungulu North Secondary", "Matungulu North Health Centre"],
  "Matungulu East": ["Matungulu East Primary", "Matungulu East Secondary", "Matungulu East Health Centre"],
  "Matungulu West": ["Matungulu West Primary", "Matungulu West Secondary", "Matungulu West Health Centre"],
  "Kyeleni": ["Kyeleni Primary", "Kyeleni Secondary", "Kyeleni Health Centre"],
  "Mitaboni": ["Mitaboni Primary", "Mitaboni Secondary", "Mitaboni Health Centre"],
  "Kathiani Central": ["Kathiani Central Primary", "Kathiani Central Secondary", "Kathiani Central Health Centre"],
  "Upper Kaewa/Iveti": ["Upper Kaewa Primary", "Iveti Primary", "Upper Kaewa Health Centre"],
  "Lower Kaewa/Kaani": ["Lower Kaewa Primary", "Kaani Primary", "Lower Kaewa Health Centre"],
  "Kola": ["Kola Primary", "Kola Secondary", "Kola Health Centre"],
  "Athi River": ["Athi River Primary", "Athi River Secondary", "Athi River Health Centre"],
  "Kinanie": ["Kinanie Primary", "Kinanie Secondary", "Kinanie Health Centre"],
  "Muthwani": ["Muthwani Primary", "Muthwani Secondary", "Muthwani Health Centre"],
  "Syokimau/Mulolongo": ["Syokimau Primary", "Mulolongo Primary", "Syokimau Health Centre"],
  "Muvuti/Kiima-Kimwe": ["Muvuti Primary", "Kiima-Kimwe Primary", "Muvuti Health Centre"],
  "Mbiuni": ["Mbiuni Primary", "Mbiuni Secondary", "Mbiuni Health Centre"],
  "Makutano/Mwala": ["Makutano Primary", "Mwala Primary", "Makutano Health Centre"],
  "Masii": ["Masii Primary", "Masii Secondary", "Masii Health Centre"],
  "Wamunyu": ["Wamunyu Primary", "Wamunyu Secondary", "Wamunyu Health Centre"],

  // MAKUENI COUNTY
  "Kithungo/Kitundu": ["Kithungo Primary", "Kitundu Primary", "Kithungo Health Centre"],
  "Kisau/Kiteta": ["Kisau Primary", "Kiteta Primary", "Kisau Health Centre"],
  "Waia/Kako": ["Waia Primary", "Kako Primary", "Waia Health Centre"],
  "Kalawa": ["Kalawa Primary", "Kalawa Secondary", "Kalawa Health Centre"],
  "Kasikeu": ["Kasikeu Primary", "Kasikeu Secondary", "Kasikeu Health Centre"],
  "Mbitini": ["Mbitini Primary", "Mbitini Secondary", "Mbitini Health Centre"],
  "Makindu": ["Makindu Primary", "Makindu Secondary", "Makindu Health Centre"],
  "Nguumo": ["Nguumo Primary", "Nguumo Secondary", "Nguumo Health Centre"],
  "Kikumbulyu North": ["Kikumbulyu North Primary", "Kikumbulyu North Secondary", "Kikumbulyu North Health Centre"],
  "Kikumbulyu South": ["Kikumbulyu South Primary", "Kikumbulyu South Secondary", "Kikumbulyu South Health Centre"],
  "Nguu/Masumba": ["Nguu Primary", "Masumba Primary", "Nguu Health Centre"],
  "Emali/Mulala": ["Emali Primary", "Mulala Primary", "Emali Health Centre"],
  "Masongaleni": ["Masongaleni Primary", "Masongaleni Secondary", "Masongaleni Health Centre"],
  "Wote": ["Wote Primary", "Wote Secondary", "Wote Health Centre"],
  "Muvau/Kikuumini": ["Muvau Primary", "Kikuumini Primary", "Muvau Health Centre"],
  "Mavindini": ["Mavindini Primary", "Mavindini Secondary", "Mavindini Health Centre"],
  "Kitise/Kithuki": ["Kitise Primary", "Kithuki Primary", "Kitise Health Centre"],
  "Kathonzweni": ["Kathonzweni Primary", "Kathonzweni Secondary", "Kathonzweni Health Centre"],
  "Mtito Andei": ["Mtito Andei Primary", "Mtito Andei Secondary", "Mtito Andei Health Centre"],
  "Thange": ["Thange Primary", "Thange Secondary", "Thange Health Centre"],
  "Ivingoni/Nzambani": ["Ivingoni Primary", "Nzambani Primary", "Ivingoni Health Centre"],
  "Kibwezi": ["Kibwezi Primary", "Kibwezi Secondary", "Kibwezi Health Centre"],

  // NYANDARUA COUNTY
  "Engineer": ["Engineer Primary", "Engineer Secondary", "Engineer Health Centre"],
  "Gathara": ["Gathara Primary", "Gathara Secondary", "Gathara Health Centre"],
  "North Kinangop": ["North Kinangop Primary", "North Kinangop Secondary", "North Kinangop Health Centre"],
  "Murungaru": ["Murungaru Primary", "Murungaru Secondary", "Murungaru Health Centre"],
  "Njabini/Kiburu": ["Njabini Primary", "Kiburu Primary", "Njabini Health Centre"],
  "Geta": ["Geta Primary", "Geta Secondary", "Geta Health Centre"],
  "Githioro": ["Githioro Primary", "Githioro Secondary", "Githioro Health Centre"],
  "Kipipiri": ["Kipipiri Primary", "Kipipiri Secondary", "Kipipiri Health Centre"],
  "Wanjohi": ["Wanjohi Primary", "Wanjohi Secondary", "Wanjohi Health Centre"],
  "Ol Kalou": ["Ol Kalou Primary", "Ol Kalou Secondary", "Ol Kalou Health Centre"],
  "Kaimbaga": ["Kaimbaga Primary", "Kaimbaga Secondary", "Kaimbaga Health Centre"],
  "Rurii": ["Rurii Primary", "Rurii Secondary", "Rurii Health Centre"],
  "Gathanji": ["Gathanji Primary", "Gathanji Secondary", "Gathanji Health Centre"],
  "Mairo Inya": ["Mairo Inya Primary", "Mairo Inya Secondary", "Mairo Inya Health Centre"],
  "Leshau/Pondo": ["Leshau Primary", "Pondo Primary", "Leshau Health Centre"],
  "Kiriita": ["Kiriita Primary", "Kiriita Secondary", "Kiriita Health Centre"],
  "Central": ["Central Primary", "Central Secondary", "Central Health Centre"],
  "Lanet/Umoja": ["Lanet Primary", "Umoja Primary", "Lanet Health Centre"],
  "Bahati": ["Bahati Primary", "Bahati Secondary", "Bahati Health Centre"],

  // NYERI COUNTY
  "Dedan Kimathi": ["Dedan Kimathi Primary", "Dedan Kimathi Secondary", "Dedan Kimathi Health Centre"],
  "Wamagana": ["Wamagana Primary", "Wamagana Secondary", "Wamagana Health Centre"],
  "Aguthi": ["Aguthi Primary", "Aguthi Secondary", "Aguthi Health Centre"],
  "Muringato": ["Muringato Primary", "Muringato Secondary", "Muringato Health Centre"],
  "Iriaini": ["Iriaini Primary", "Iriaini Secondary", "Iriaini Health Centre"],
  "Mweiga": ["Mweiga Primary", "Mweiga Secondary", "Mweiga Health Centre"],
  "Naromoru Kiamathaga": ["Naromoru Primary", "Kiamathaga Primary", "Naromoru Health Centre"],
  "Mwiyogo/Endarasha": ["Mwiyogo Primary", "Endarasha Primary", "Mwiyogo Health Centre"],
  "Mugunda": ["Mugunda Primary", "Mugunda Secondary", "Mugunda Health Centre"],
  "Gatarakwa": ["Gatarakwa Primary", "Gatarakwa Secondary", "Gatarakwa Health Centre"],
  "Karuri": ["Karuri Primary", "Karuri Secondary", "Karuri Health Centre"],
  "Gachika": ["Gachika Primary", "Gachika Secondary", "Gachika Health Centre"],
  "Kiamathaga": ["Kiamathaga Primary", "Kiamathaga Secondary", "Kiamathaga Health Centre"],
  "Ruguru": ["Ruguru Primary", "Ruguru Secondary", "Ruguru Health Centre"],
  "Chinga": ["Chinga Primary", "Chinga Secondary", "Chinga Health Centre"],
  "Karima": ["Karima Primary", "Karima Secondary", "Karima Health Centre"],
  "Mahiga": ["Mahiga Primary", "Mahiga Secondary", "Mahiga Health Centre"],
  "Konyu": ["Konyu Primary", "Konyu Secondary", "Konyu Health Centre"],
  "Mukurweini Central": ["Mukurweini Central Primary", "Mukurweini Central Secondary", "Mukurweini Central Health Centre"],
  "Mukurweini West": ["Mukurweini West Primary", "Mukurweini West Secondary", "Mukurweini West Health Centre"],
  "Gikondi": ["Gikondi Primary", "Gikondi Secondary", "Gikondi Health Centre"],
  "Rugi": ["Rugi Primary", "Rugi Secondary", "Rugi Health Centre"],
  "Kiganjo/Mathari": ["Kiganjo Primary", "Mathari Primary", "Kiganjo Health Centre"],
  "Rware": ["Rware Primary", "Rware Secondary", "Rware Health Centre"],
  "Gatitu/Muruguru": ["Gatitu Primary", "Muruguru Primary", "Gatitu Health Centre"],
  "Ruring'u": ["Ruring'u Primary", "Ruring'u Secondary", "Ruring'u Health Centre"],
  "Kamakwa/Mukaro": ["Kamakwa Primary", "Mukaro Primary", "Kamakwa Health Centre"],

  // KIRINYAGA COUNTY
  "Thiba": ["Thiba Primary", "Thiba Secondary", "Thiba Health Centre"],
  "Kangai": ["Kangai Primary", "Kangai Secondary", "Kangai Health Centre"],
  "Njukiini": ["Njukiini Primary", "Njukiini Secondary", "Njukiini Health Centre"],
  "Murinduko": ["Murinduko Primary", "Murinduko Secondary", "Murinduko Health Centre"],
  "Gathigiriri": ["Gathigiriri Primary", "Gathigiriri Secondary", "Gathigiriri Health Centre"],
  "Tebere": ["Tebere Primary", "Tebere Secondary", "Tebere Health Centre"],
  "Kianyaga": ["Kianyaga Primary", "Kianyaga Secondary", "Kianyaga Health Centre"],
  "Kariti": ["Kariti Primary", "Kariti Secondary", "Kariti Health Centre"],
  "Inoi": ["Inoi Primary", "Inoi Secondary", "Inoi Health Centre"],
  "Kanyekini": ["Kanyekini Primary", "Kanyekini Secondary", "Kanyekini Health Centre"],
  "Mutithi": ["Mutithi Primary", "Mutithi Secondary", "Mutithi Health Centre"],
  "Wamumu": ["Wamumu Primary", "Wamumu Secondary", "Wamumu Health Centre"],
  "Nyangati": ["Nyangati Primary", "Nyangati Secondary", "Nyangati Health Centre"],
  "Baragwi": ["Baragwi Primary", "Baragwi Secondary", "Baragwi Health Centre"],

  // MURANG'A COUNTY
  "Kiharu": ["Kiharu Primary", "Kiharu Secondary", "Kiharu Health Centre"],
  "Muruka": ["Muruka Primary", "Muruka Secondary", "Muruka Health Centre"],
  "Kangari": ["Kangari Primary", "Kangari Secondary", "Kangari Health Centre"],
  "Kinyona": ["Kinyona Primary", "Kinyona Secondary", "Kinyona Health Centre"],
  "Kigumo": ["Kigumo Primary", "Kigumo Secondary", "Kigumo Health Centre"],
  "Kiriita": ["Kiriita Primary", "Kiriita Secondary", "Kiriita Health Centre"],
  "Muguru": ["Muguru Primary", "Muguru Secondary", "Muguru Health Centre"],
  "Rwathia": ["Rwathia Primary", "Rwathia Secondary", "Rwathia Health Centre"],
  "Kaharo": ["Kaharo Primary", "Kaharo Secondary", "Kaharo Health Centre"],
  "Gaturi": ["Gaturi Primary", "Gaturi Secondary", "Gaturi Health Centre"],
  "Wangu": ["Wangu Primary", "Wangu Secondary", "Wangu Health Centre"],
  "Mbiri": ["Mbiri Primary", "Mbiri Secondary", "Mbiri Health Centre"],
  "Kambiti": ["Kambiti Primary", "Kambiti Secondary", "Kambiti Health Centre"],
  "Kamahuha": ["Kamahuha Primary", "Kamahuha Secondary", "Kamahuha Health Centre"],
  "Gaichanjiru": ["Gaichanjiru Primary", "Gaichanjiru Secondary", "Gaichanjiru Health Centre"],
  "Ithiru": ["Ithiru Primary", "Ithiru Secondary", "Ithiru Health Centre"],
  "Ruchu": ["Ruchu Primary", "Ruchu Secondary", "Ruchu Health Centre"],
  "Kandara": ["Kandara Primary", "Kandara Secondary", "Kandara Health Centre"],
  "Muthithi": ["Muthithi Primary", "Muthithi Secondary", "Muthithi Health Centre"],
  "Kariara": ["Kariara Primary", "Kariara Secondary", "Kariara Health Centre"],
  "Nginda": ["Nginda Primary", "Nginda Secondary", "Nginda Health Centre"],
  "Gatanga": ["Gatanga Primary", "Gatanga Secondary", "Gatanga Health Centre"],
  "Kihumbu-ini": ["Kihumbu-ini Primary", "Kihumbu-ini Secondary", "Kihumbu-ini Health Centre"],

  // KIAMBU COUNTY (Continued)
  "Kiamwangi": ["Kiamwangi Primary", "Kiamwangi Secondary", "Kiamwangi Health Centre"],
  "Kiganjo": ["Kiganjo Primary", "Kiganjo Secondary", "Kiganjo Health Centre"],
  "Ndarugu": ["Ndarugu Primary", "Ndarugu Secondary", "Ndarugu Health Centre"],
  "Ngenda": ["Ngenda Primary", "Ngenda Secondary", "Ngenda Health Centre"],
  "Gatundu North": ["Gatundu North Primary", "Gatundu North Secondary", "Gatundu North Health Centre"],
  "Gatundu South": ["Gatundu South Primary", "Gatundu South Secondary", "Gatundu South Health Centre"],
  "Gituamba": ["Gituamba Primary", "Gituamba Secondary", "Gituamba Health Centre"],
  "Githobokoni": ["Githobokoni Primary", "Githobokoni Secondary", "Githobokoni Health Centre"],
  "Murera": ["Murera Primary", "Murera Secondary", "Murera Health Centre"],
  "Theta": ["Theta Primary", "Theta Secondary", "Theta Health Centre"],
  "Juja": ["Juja Primary", "Juja Secondary", "Juja Health Centre"],
  "Witeithie": ["Witeithie Primary", "Witeithie Secondary", "Witeithie Health Centre"],
  "Kalimoni": ["Kalimoni Primary", "Kalimoni Secondary", "Kalimoni Health Centre"],
  "Township": ["Township Primary", "Township Secondary", "Township Health Centre"],
  "Kamenu": ["Kamenu Primary", "Kamenu Secondary", "Kamenu Health Centre"],
  "Hospital": ["Hospital Primary", "Hospital Secondary", "Hospital Health Centre"],
  "Gatuanyaga": ["Gatuanyaga Primary", "Gatuanyaga Secondary", "Gatuanyaga Health Centre"],
  "Ngoliba": ["Ngoliba Primary", "Ngoliba Secondary", "Ngoliba Health Centre"],
  "Githurai": ["Githurai Primary", "Githurai Secondary", "Githurai Health Centre"],
  "Kahawa Wendani": ["Kahawa Wendani Primary", "Kahawa Wendani Secondary", "Kahawa Wendani Health Centre"],
  "Kahawa Sukari": ["Kahawa Sukari Primary", "Kahawa Sukari Secondary", "Kahawa Sukari Health Centre"],
  "Kiuu": ["Kiuu Primary", "Kiuu Secondary", "Kiuu Health Centre"],
  "Mwiki": ["Mwiki Primary", "Mwiki Secondary", "Mwiki Health Centre"],
  "Mwihoko": ["Mwihoko Primary", "Mwihoko Secondary", "Mwihoko Health Centre"],
  "Githunguri": ["Githunguri Primary", "Githunguri Secondary", "Githunguri Health Centre"],
  "Githiga": ["Githiga Primary", "Githiga Secondary", "Githiga Health Centre"],
  "Ikinu": ["Ikinu Primary", "Ikinu Secondary", "Ikinu Health Centre"],
  "Ngewa": ["Ngewa Primary", "Ngewa Secondary", "Ngewa Health Centre"],
  "Komothai": ["Komothai Primary", "Komothai Secondary", "Komothai Health Centre"],
  "Cianda": ["Cianda Primary", "Cianda Secondary", "Cianda Health Centre"],
  "Karuri": ["Karuri Primary", "Karuri Secondary", "Karuri Health Centre"],
  "Ndenderu": ["Ndenderu Primary", "Ndenderu Secondary", "Ndenderu Health Centre"],
  "Muchatha": ["Muchatha Primary", "Muchatha Secondary", "Muchatha Health Centre"],
  "Kihara": ["Kihara Primary", "Kihara Secondary", "Kihara Health Centre"],
  "Riabai": ["Riabai Primary", "Riabai Secondary", "Riabai Health Centre"],
  "Nachu": ["Nachu Primary", "Nachu Secondary", "Nachu Health Centre"],
  "Sigona": ["Sigona Primary", "Sigona Secondary", "Sigona Health Centre"],
  "Kikuyu": ["Kikuyu Primary", "Kikuyu Secondary", "Kikuyu Health Centre"],
  "Nderi": ["Nderi Primary", "Nderi Secondary", "Nderi Health Centre"],
  "Kinoo": ["Kinoo Primary", "Kinoo Secondary", "Kinoo Health Centre"],
  "Limuru Central": ["Limuru Central Primary", "Limuru Central Secondary", "Limuru Central Health Centre"],
  "Ndeiya": ["Ndeiya Primary", "Ndeiya Secondary", "Ndeiya Health Centre"],
  "Limuru East": ["Limuru East Primary", "Limuru East Secondary", "Limuru East Health Centre"],
  "Ngecha Tigoni": ["Ngecha Primary", "Tigoni Primary", "Ngecha Health Centre"],
  "Kinale": ["Kinale Primary", "Kinale Secondary", "Kinale Health Centre"],
  "Kijabe": ["Kijabe Primary", "Kijabe Secondary", "Kijabe Health Centre"],
  "Nyanduma": ["Nyanduma Primary", "Nyanduma Secondary", "Nyanduma Health Centre"],
  "Kamburu": ["Kamburu Primary", "Kamburu Secondary", "Kamburu Health Centre"],
  "Lari/Kirenga": ["Lari Primary", "Kirenga Primary", "Lari Health Centre"],

  // TURKANA COUNTY
  "Kaeris": ["Kaeris Primary", "Kaeris Secondary", "Kaeris Health Centre"],
  "Lake Zone": ["Lake Zone Primary", "Lake Zone Secondary", "Lake Zone Health Centre"],
  "Lapur": ["Lapur Primary", "Lapur Secondary", "Lapur Health Centre"],
  "Kaaleng/Kaikor": ["Kaaleng Primary", "Kaikor Primary", "Kaaleng Health Centre"],
  "Kibish": ["Kibish Primary", "Kibish Secondary", "Kibish Health Centre"],
  "Nakalale": ["Nakalale Primary", "Nakalale Secondary", "Nakalale Health Centre"],
  "Kakuma": ["Kakuma Primary", "Kakuma Secondary", "Kakuma Health Centre"],
  "Lopur": ["Lopur Primary", "Lopur Secondary", "Lopur Health Centre"],
  "Letea": ["Letea Primary", "Letea Secondary", "Letea Health Centre"],
  "Songot": ["Songot Primary", "Songot Secondary", "Songot Health Centre"],
  "Kalobeyei": ["Kalobeyei Primary", "Kalobeyei Secondary", "Kalobeyei Health Centre"],
  "Lokichogio": ["Lokichogio Primary", "Lokichogio Secondary", "Lokichogio Health Centre"],
  "Kanamkemer": ["Kanamkemer Primary", "Kanamkemer Secondary", "Kanamkemer Health Centre"],
  "Kerio Delta": ["Kerio Delta Primary", "Kerio Delta Secondary", "Kerio Delta Health Centre"],
  "Kang'atotha": ["Kang'atotha Primary", "Kang'atotha Secondary", "Kang'atotha Health Centre"],
  "Kalokol": ["Kalokol Primary", "Kalokol Secondary", "Kalokol Health Centre"],
  "Lodwar Township": ["Lodwar Township Primary", "Lodwar Township Secondary", "Lodwar Township Health Centre"],
  "Kotaruk/Lobei": ["Kotaruk Primary", "Lobei Primary", "Kotaruk Health Centre"],
  "Turkwell": ["Turkwell Primary", "Turkwell Secondary", "Turkwell Health Centre"],
  "Loima": ["Loima Primary", "Loima Secondary", "Loima Health Centre"],
  "Lokiriama/Lorengippi": ["Lokiriama Primary", "Lorengippi Primary", "Lokiriama Health Centre"],
  "Kaputir": ["Kaputir Primary", "Kaputir Secondary", "Kaputir Health Centre"],
  "Katilu": ["Katilu Primary", "Katilu Secondary", "Katilu Health Centre"],
  "Lobokat": ["Lobokat Primary", "Lobokat Secondary", "Lobokat Health Centre"],
  "Kalogoch": ["Kalogoch Primary", "Kalogoch Secondary", "Kalogoch Health Centre"],
  "Lokichar": ["Lokichar Primary", "Lokichar Secondary", "Lokichar Health Centre"],
  "Kapedo/Napeitom": ["Kapedo Primary", "Napeitom Primary", "Kapedo Health Centre"],
  "Katilia": ["Katilia Primary", "Katilia Secondary", "Katilia Health Centre"],
  "Lokori/Kochodin": ["Lokori Primary", "Kochodin Primary", "Lokori Health Centre"],

  // WEST POKOT COUNTY
  "Kapenguria": ["Kapenguria Primary", "Kapenguria Secondary", "Kapenguria Health Centre"],
  "Mnagei": ["Mnagei Primary", "Mnagei Secondary", "Mnagei Health Centre"],
  "Siyoi": ["Siyoi Primary", "Siyoi Secondary", "Siyoi Health Centre"],
  "Endugh": ["Endugh Primary", "Endugh Secondary", "Endugh Health Centre"],
  "Sook": ["Sook Primary", "Sook Secondary", "Sook Health Centre"],
  "Kasei": ["Kasei Primary", "Kasei Secondary", "Kasei Health Centre"],
  "Kacheliba": ["Kacheliba Primary", "Kacheliba Secondary", "Kacheliba Health Centre"],
  "Kong'elai": ["Kong'elai Primary", "Kong'elai Secondary", "Kong'elai Health Centre"],
  "Weiwei": ["Weiwei Primary", "Weiwei Secondary", "Weiwei Health Centre"],
  "Kipkomo": ["Kipkomo Primary", "Kipkomo Secondary", "Kipkomo Health Centre"],
  "Lelan": ["Lelan Primary", "Lelan Secondary", "Lelan Health Centre"],
  "Tapach": ["Tapach Primary", "Tapach Secondary", "Tapach Health Centre"],
  "Porkoyu": ["Porkoyu Primary", "Porkoyu Secondary", "Porkoyu Health Centre"],
  "Kapchok": ["Kapchok Primary", "Kapchok Secondary", "Kapchok Health Centre"],

  // SAMBURU COUNTY
  "Suguta Marmar": ["Suguta Marmar Primary", "Suguta Marmar Secondary", "Suguta Marmar Health Centre"],
  "Maralal": ["Maralal Primary", "Maralal Secondary", "Maralal Health Centre"],
  "Loosuk": ["Loosuk Primary", "Loosuk Secondary", "Loosuk Health Centre"],
  "Poro": ["Poro Primary", "Poro Secondary", "Poro Health Centre"],
  "El Barta": ["El Barta Primary", "El Barta Secondary", "El Barta Health Centre"],
  "Wamba West": ["Wamba West Primary", "Wamba West Secondary", "Wamba West Health Centre"],
  "Wamba East": ["Wamba East Primary", "Wamba East Secondary", "Wamba East Health Centre"],
  "Wamba North": ["Wamba North Primary", "Wamba North Secondary", "Wamba North Health Centre"],
  "Waso": ["Waso Primary", "Waso Secondary", "Waso Health Centre"],
  "Laisamis": ["Laisamis Primary", "Laisamis Secondary", "Laisamis Health Centre"],
  "Korr/Ngurunit": ["Korr Primary", "Ngurunit Primary", "Korr Health Centre"],
  "Logo Logo": ["Logo Logo Primary", "Logo Logo Secondary", "Logo Logo Health Centre"],
  "Loiyangalani": ["Loiyangalani Primary", "Loiyangalani Secondary", "Loiyangalani Health Centre"],

  // TRANS NZOIA COUNTY
  "Bidii": ["Bidii Primary", "Bidii Secondary", "Bidii Health Centre"],
  "Chepchoina": ["Chepchoina Primary", "Chepchoina Secondary", "Chepchoina Health Centre"],
  "Endebess": ["Endebess Primary", "Endebess Secondary", "Endebess Health Centre"],
  "Matumbei": ["Matumbei Primary", "Matumbei Secondary", "Matumbei Health Centre"],
  "Tuigoin": ["Tuigoin Primary", "Tuigoin Secondary", "Tuigoin Health Centre"],
  "Nabiswa": ["Nabiswa Primary", "Nabiswa Secondary", "Nabiswa Health Centre"],
  "Kakibora": ["Kakibora Primary", "Kakibora Secondary", "Kakibora Health Centre"],
  "Machewa": ["Machewa Primary", "Machewa Secondary", "Machewa Health Centre"],
  "Kinyoro": ["Kinyoro Primary", "Kinyoro Secondary", "Kinyoro Health Centre"],
  "Rugunga": ["Rugunga Primary", "Rugunga Secondary", "Rugunga Health Centre"],
  "Kiminini": ["Kiminini Primary", "Kiminini Secondary", "Kiminini Health Centre"],
  "Waitaluk": ["Waitaluk Primary", "Waitaluk Secondary", "Waitaluk Health Centre"],
  "Sirende": ["Sirende Primary", "Sirende Secondary", "Sirende Health Centre"],
  "Hospital": ["Hospital Primary", "Hospital Secondary", "Hospital Health Centre"],
  "Sikhendu": ["Sikhendu Primary", "Sikhendu Secondary", "Sikhendu Health Centre"],

  // UASIN GISHU COUNTY
  "Kipsomba": ["Kipsomba Primary", "Kipsomba Secondary", "Kipsomba Health Centre"],
  "Soy": ["Soy Primary", "Soy Secondary", "Soy Health Centre"],
  "Kubero": ["Kubero Primary", "Kubero Secondary", "Kubero Health Centre"],
  "Ziwa": ["Ziwa Primary", "Ziwa Secondary", "Ziwa Health Centre"],
  "Segero/Barsombe": ["Segero Primary", "Barsombe Primary", "Segero Health Centre"],
  "Ngenyilel": ["Ngenyilel Primary", "Ngenyilel Secondary", "Ngenyilel Health Centre"],
  "Tapsagoi": ["Tapsagoi Primary", "Tapsagoi Secondary", "Tapsagoi Health Centre"],
  "Kamagut": ["Kamagut Primary", "Kamagut Secondary", "Kamagut Health Centre"],
  "Kiplombe": ["Kiplombe Primary", "Kiplombe Secondary", "Kiplombe Health Centre"],
  "Kapsaos": ["Kapsaos Primary", "Kapsaos Secondary", "Kapsaos Health Centre"],
  "Tembelio": ["Tembelio Primary", "Tembelio Secondary", "Tembelio Health Centre"],
  "Seretunin": ["Seretunin Primary", "Seretunin Secondary", "Seretunin Health Centre"],
  "Cheptiret/Kipchamo": ["Cheptiret Primary", "Kipchamo Primary", "Cheptiret Health Centre"],
  "Tulwet/Chuiyat": ["Tulwet Primary", "Chuiyat Primary", "Tulwet Health Centre"],
  "Kapseret": ["Kapseret Primary", "Kapseret Secondary", "Kapseret Health Centre"],
  "Kipkenyo": ["Kipkenyo Primary", "Kipkenyo Secondary", "Kipkenyo Health Centre"],
  "Ngeria": ["Ngeria Primary", "Ngeria Secondary", "Ngeria Health Centre"],
  "Megun": ["Megun Primary", "Megun Secondary", "Megun Health Centre"],
  "Langas": ["Langas Primary", "Langas Secondary", "Langas Health Centre"],
  "Racecourse": ["Racecourse Primary", "Racecourse Secondary", "Racecourse Health Centre"],
  "Tarakwa": ["Tarakwa Primary", "Tarakwa Secondary", "Tarakwa Health Centre"],
  "Kapyego": ["Kapyego Primary", "Kapyego Secondary", "Kapyego Health Centre"],
  "Kaptagat": ["Kaptagat Primary", "Kaptagat Secondary", "Kaptagat Health Centre"],
  "Ainabkoi/Olare": ["Ainabkoi Primary", "Olare Primary", "Ainabkoi Health Centre"],

  // ELGEYO/MARAKWET COUNTY
  "Tambach": ["Tambach Primary", "Tambach Secondary", "Tambach Health Centre"],
  "Kaptarakwa": ["Kaptarakwa Primary", "Kaptarakwa Secondary", "Kaptarakwa Health Centre"],
  "Chepkorio": ["Chepkorio Primary", "Chepkorio Secondary", "Chepkorio Health Centre"],
  "Soy North": ["Soy North Primary", "Soy North Secondary", "Soy North Health Centre"],
  "Soy South": ["Soy South Primary", "Soy South Secondary", "Soy South Health Centre"],
  "Kabiemit": ["Kabiemit Primary", "Kabiemit Secondary", "Kabiemit Health Centre"],
  "Metkei": ["Metkei Primary", "Metkei Secondary", "Metkei Health Centre"],
  "Songhor/Soba": ["Songhor Primary", "Soba Primary", "Songhor Health Centre"],
  "Kapkangani": ["Kapkangani Primary", "Kapkangani Secondary", "Kapkangani Health Centre"],
  "Kaptumo/Kaboi": ["Kaptumo Primary", "Kaboi Primary", "Kaptumo Health Centre"],
  "Koyo/Ndurio": ["Koyo Primary", "Ndurio Primary", "Koyo Health Centre"],

  // NANDI COUNTY
  "Kabisaga": ["Kabisaga Primary", "Kabisaga Secondary", "Kabisaga Health Centre"],
  "Kapsabet": ["Kapsabet Primary", "Kapsabet Secondary", "Kapsabet Health Centre"],
  "Kilibwoni": ["Kilibwoni Primary", "Kilibwoni Secondary", "Kilibwoni Health Centre"],
  "Chepterwai": ["Chepterwai Primary", "Chepterwai Secondary", "Chepterwai Health Centre"],
  "Kipkaren": ["Kipkaren Primary", "Kipkaren Secondary", "Kipkaren Health Centre"],
  "Kabiyet": ["Kabiyet Primary", "Kabiyet Secondary", "Kabiyet Health Centre"],
  "Ndalat": ["Ndalat Primary", "Ndalat Secondary", "Ndalat Health Centre"],
  "Chepkunyuk": ["Chepkunyuk Primary", "Chepkunyuk Secondary", "Chepkunyuk Health Centre"],
  "Ol'lessos": ["Ol'lessos Primary", "Ol'lessos Secondary", "Ol'lessos Health Centre"],
  "Kapchorua": ["Kapchorua Primary", "Kapchorua Secondary", "Kapchorua Health Centre"],
  "Kaimosi": ["Kaimosi Primary", "Kaimosi Secondary", "Kaimosi Health Centre"],
  "Kibwareng": ["Kibwareng Primary", "Kibwareng Secondary", "Kibwareng Health Centre"],
  "Kapsimotwo": ["Kapsimotwo Primary", "Kapsimotwo Secondary", "Kapsimotwo Health Centre"],
  "Kaptel/Kamoiywo": ["Kaptel Primary", "Kamoiywo Primary", "Kaptel Health Centre"],
  "Kiptuya": ["Kiptuya Primary", "Kiptuya Secondary", "Kiptuya Health Centre"],
  "Chepkumia": ["Chepkumia Primary", "Chepkumia Secondary", "Chepkumia Health Centre"],

  // BARINGO COUNTY
  "Kolowa": ["Kolowa Primary", "Kolowa Secondary", "Kolowa Health Centre"],
  "Ribkwo": ["Ribkwo Primary", "Ribkwo Secondary", "Ribkwo Health Centre"],
  "Silale": ["Silale Primary", "Silale Secondary", "Silale Health Centre"],
  "Loiyamorok": ["Loiyamorok Primary", "Loiyamorok Secondary", "Loiyamorok Health Centre"],
  "Tangulbei/Korossi": ["Tangulbei Primary", "Korossi Primary", "Tangulbei Health Centre"],
  "Saimo/Kipsaraman": ["Saimo Primary", "Kipsaraman Primary", "Saimo Health Centre"],
  "Saimo/Soi": ["Saimo Primary", "Soi Primary", "Saimo Health Centre"],
  "Bartabwa": ["Bartabwa Primary", "Bartabwa Secondary", "Bartabwa Health Centre"],
  "Kabartonjo": ["Kabartonjo Primary", "Kabartonjo Secondary", "Kabartonjo Health Centre"],
  "Sacho": ["Sacho Primary", "Sacho Secondary", "Sacho Health Centre"],
  "Kapropita": ["Kapropita Primary", "Kapropita Secondary", "Kapropita Health Centre"],
  "Marigat": ["Marigat Primary", "Marigat Secondary", "Marigat Health Centre"],
  "Mochongoi": ["Mochongoi Primary", "Mochongoi Secondary", "Mochongoi Health Centre"],
  "Mukutani": ["Mukutani Primary", "Mukutani Secondary", "Mukutani Health Centre"],
  "Emining": ["Emining Primary", "Emining Secondary", "Emining Health Centre"],
  "Lembus": ["Lembus Primary", "Lembus Secondary", "Lembus Health Centre"],
  "Mogotio": ["Mogotio Primary", "Mogotio Secondary", "Mogotio Health Centre"],
  "Ravine": ["Ravine Primary", "Ravine Secondary", "Ravine Health Centre"],
  "Mumberes/Maji Mazuri": ["Mumberes Primary", "Maji Mazuri Primary", "Mumberes Health Centre"],
  "Lembus Kwen": ["Lembus Kwen Primary", "Lembus Kwen Secondary", "Lembus Kwen Health Centre"],
  "Koibatek": ["Koibatek Primary", "Koibatek Secondary", "Koibatek Health Centre"],
  "Embobut/Embolot": ["Embobut Primary", "Embolot Primary", "Embobut Health Centre"],

  // LAIKIPIA COUNTY
  "Ol-Moran": ["Ol-Moran Primary", "Ol-Moran Secondary", "Ol-Moran Health Centre"],
  "Rumuruti Township": ["Rumuruti Township Primary", "Rumuruti Township Secondary", "Rumuruti Township Health Centre"],
  "Githiga": ["Githiga Primary", "Githiga Secondary", "Githiga Health Centre"],
  "Marmanet": ["Marmanet Primary", "Marmanet Secondary", "Marmanet Health Centre"],
  "Igwamiti": ["Igwamiti Primary", "Igwamiti Secondary", "Igwamiti Health Centre"],
  "Ngobit": ["Ngobit Primary", "Ngobit Secondary", "Ngobit Health Centre"],
  "Tigithi": ["Tigithi Primary", "Tigithi Secondary", "Tigithi Health Centre"],
  "Thingithu": ["Thingithu Primary", "Thingithu Secondary", "Thingithu Health Centre"],
  "Nanyuki": ["Nanyuki Primary", "Nanyuki Secondary", "Nanyuki Health Centre"],
  "Umande": ["Umande Primary", "Umande Secondary", "Umande Health Centre"],
  "Sosian": ["Sosian Primary", "Sosian Secondary", "Sosian Health Centre"],
  "Segera": ["Segera Primary", "Segera Secondary", "Segera Health Centre"],
  "Mukogodo West": ["Mukogodo West Primary", "Mukogodo West Secondary", "Mukogodo West Health Centre"],
  "Mukogodo East": ["Mukogodo East Primary", "Mukogodo East Secondary", "Mukogodo East Health Centre"],

  // NAKURU COUNTY (Continued)
  "Molo": ["Molo Primary", "Molo Secondary", "Molo Health Centre"],
  "Elburgon": ["Elburgon Primary", "Elburgon Secondary", "Elburgon Health Centre"],
  "Mariashoni": ["Mariashoni Primary", "Mariashoni Secondary", "Mariashoni Health Centre"],
  "Turi": ["Turi Primary", "Turi Secondary", "Turi Health Centre"],
  "Njoro": ["Njoro Primary", "Njoro Secondary", "Njoro Health Centre"],
  "Mauche": ["Mauche Primary", "Mauche Secondary", "Mauche Health Centre"],
  "Kihingo": ["Kihingo Primary", "Kihingo Secondary", "Kihingo Health Centre"],
  "Nessuit": ["Nessuit Primary", "Nessuit Secondary", "Nessuit Health Centre"],
  "Lare": ["Lare Primary", "Lare Secondary", "Lare Health Centre"],
  "Mau Narok": ["Mau Narok Primary", "Mau Narok Secondary", "Mau Narok Health Centre"],
  "Naivasha East": ["Naivasha East Primary", "Naivasha East Secondary", "Naivasha East Health Centre"],
  "Naivasha West": ["Naivasha West Primary", "Naivasha West Secondary", "Naivasha West Health Centre"],
  "Maella": ["Maella Primary", "Maella Secondary", "Maella Health Centre"],
  "Biashara": ["Biashara Primary", "Biashara Secondary", "Biashara Health Centre"],
  "Kihoto": ["Kihoto Primary", "Kihoto Secondary", "Kihoto Health Centre"],
  "Lake View": ["Lake View Primary", "Lake View Secondary", "Lake View Health Centre"],
  "Gilgil": ["Gilgil Primary", "Gilgil Secondary", "Gilgil Health Centre"],
  "Elementaita": ["Elementaita Primary", "Elementaita Secondary", "Elementaita Health Centre"],
  "Mbaruk/Eburu": ["Mbaruk Primary", "Eburu Primary", "Mbaruk Health Centre"],
  "Malewa West": ["Malewa West Primary", "Malewa West Secondary", "Malewa West Health Centre"],
  "Murindati": ["Murindati Primary", "Murindati Secondary", "Murindati Health Centre"],
  "Keringet": ["Keringet Primary", "Keringet Secondary", "Keringet Health Centre"],
  "Kiptagich": ["Kiptagich Primary", "Kiptagich Secondary", "Kiptagich Health Centre"],
  "Tinet": ["Tinet Primary", "Tinet Secondary", "Tinet Health Centre"],
  "Sirikwa": ["Sirikwa Primary", "Sirikwa Secondary", "Sirikwa Health Centre"],
  "Kamara": ["Kamara Primary", "Kamara Secondary", "Kamara Health Centre"],
  "Kapkures": ["Kapkures Primary", "Kapkures Secondary", "Kapkures Health Centre"],
  "Subukia": ["Subukia Primary", "Subukia Secondary", "Subukia Health Centre"],
  "Waseges": ["Waseges Primary", "Waseges Secondary", "Waseges Health Centre"],
  "Kabazi": ["Kabazi Primary", "Kabazi Secondary", "Kabazi Health Centre"],
  "Solai": ["Solai Primary", "Solai Secondary", "Solai Health Centre"],
  "Mosop": ["Mosop Primary", "Mosop Secondary", "Mosop Health Centre"],
  "Moi's Bridge": ["Moi's Bridge Primary", "Moi's Bridge Secondary", "Moi's Bridge Health Centre"],
  "Kapkangani": ["Kapkangani Primary", "Kapkangani Secondary", "Kapkangani Health Centre"],
  "Dundori": ["Dundori Primary", "Dundori Secondary", "Dundori Health Centre"],
  "Kabatini": ["Kabatini Primary", "Kabatini Secondary", "Kabatini Health Centre"],
  "Kiamaina": ["Kiamaina Primary", "Kiamaina Secondary", "Kiamaina Health Centre"],
  "Barut": ["Barut Primary", "Barut Secondary", "Barut Health Centre"],
  "London": ["London Primary", "London Secondary", "London Health Centre"],
  "Kaptembwo": ["Kaptembwo Primary", "Kaptembwo Secondary", "Kaptembwo Health Centre"],
  "Rhoda": ["Rhoda Primary", "Rhoda Secondary", "Rhoda Health Centre"],
  "Shaabab": ["Shaabab Primary", "Shaabab Secondary", "Shaabab Health Centre"],
  "Kivumbini": ["Kivumbini Primary", "Kivumbini Secondary", "Kivumbini Health Centre"],
  "Flamingo": ["Flamingo Primary", "Flamingo Secondary", "Flamingo Health Centre"],
  "Menengai": ["Menengai Primary", "Menengai Secondary", "Menengai Health Centre"],
  "Nakuru East": ["Nakuru East Primary", "Nakuru East Secondary", "Nakuru East Health Centre"],

  // NAROK COUNTY
  "Kilgoris Central": ["Kilgoris Central Primary", "Kilgoris Central Secondary", "Kilgoris Central Health Centre"],
  "Keyian": ["Keyian Primary", "Keyian Secondary", "Keyian Health Centre"],
  "Angata Barikoi": ["Angata Barikoi Primary", "Angata Barikoi Secondary", "Angata Barikoi Health Centre"],
  "Shankoe": ["Shankoe Primary", "Shankoe Secondary", "Shankoe Health Centre"],
  "Kimintet": ["Kimintet Primary", "Kimintet Secondary", "Kimintet Health Centre"],
  "Ilkerin": ["Ilkerin Primary", "Ilkerin Secondary", "Ilkerin Health Centre"],
  "Ololmasani": ["Ololmasani Primary", "Ololmasani Secondary", "Ololmasani Health Centre"],
  "Mogondo": ["Mogondo Primary", "Mogondo Secondary", "Mogondo Health Centre"],
  "Kapsasian": ["Kapsasian Primary", "Kapsasian Secondary", "Kapsasian Health Centre"],
  "Ololulung'a": ["Ololulung'a Primary", "Ololulung'a Secondary", "Ololulung'a Health Centre"],
  "Mara": ["Mara Primary", "Mara Secondary", "Mara Health Centre"],
  "Siana": ["Siana Primary", "Siana Secondary", "Siana Health Centre"],
  "Narosura": ["Narosura Primary", "Narosura Secondary", "Narosura Health Centre"],
  "Melili": ["Melili Primary", "Melili Secondary", "Melili Health Centre"],
  "Suswa": ["Suswa Primary", "Suswa Secondary", "Suswa Health Centre"],
  "Majimoto/Naroosura": ["Majimoto Primary", "Naroosura Primary", "Majimoto Health Centre"],
  "Melelo": ["Melelo Primary", "Melelo Secondary", "Melelo Health Centre"],
  "Loita": ["Loita Primary", "Loita Secondary", "Loita Health Centre"],
  "Sogoo": ["Sogoo Primary", "Sogoo Secondary", "Sogoo Health Centre"],
  "Sagamian": ["Sagamian Primary", "Sagamian Secondary", "Sagamian Health Centre"],
  "Ilmotiok": ["Ilmotiok Primary", "Ilmotiok Secondary", "Ilmotiok Health Centre"],

  // KAJIADO COUNTY
  "Ongata Rongai": ["Ongata Rongai Primary", "Ongata Rongai Secondary", "Ongata Rongai Health Centre"],
  "Nkaimurunya": ["Nkaimurunya Primary", "Nkaimurunya Secondary", "Nkaimurunya Health Centre"],
  "Oloolua": ["Oloolua Primary", "Oloolua Secondary", "Oloolua Health Centre"],
  "Ngong": ["Ngong Primary", "Ngong Secondary", "Ngong Health Centre"],
  "Matasia": ["Matasia Primary", "Matasia Secondary", "Matasia Health Centre"],
  "Ildamat": ["Ildamat Primary", "Ildamat Secondary", "Ildamat Health Centre"],
  "Dalalekutuk": ["Dalalekutuk Primary", "Dalalekutuk Secondary", "Dalalekutuk Health Centre"],
  "Matapato North": ["Matapato North Primary", "Matapato North Secondary", "Matapato North Health Centre"],
  "Matapato South": ["Matapato South Primary", "Matapato South Secondary", "Matapato South Health Centre"],
  "Kaputiei North": ["Kaputiei North Primary", "Kaputiei North Secondary", "Kaputiei North Health Centre"],
  "Kitengela": ["Kitengela Primary", "Kitengela Secondary", "Kitengela Health Centre"],
  "Oloosirkon/Sholinke": ["Oloosirkon Primary", "Sholinke Primary", "Oloosirkon Health Centre"],
  "Kenyawa-Poka": ["Kenyawa-Poka Primary", "Kenyawa-Poka Secondary", "Kenyawa-Poka Health Centre"],
  "Imaroro": ["Imaroro Primary", "Imaroro Secondary", "Imaroro Health Centre"],
  "Kajiado": ["Kajiado Primary", "Kajiado Secondary", "Kajiado Health Centre"],
  "Iloodokilani": ["Iloodokilani Primary", "Iloodokilani Secondary", "Iloodokilani Health Centre"],
  "Magadi": ["Magadi Primary", "Magadi Secondary", "Magadi Health Centre"],
  "Ewuaso Oonkidong'i": ["Ewuaso Oonkidong'i Primary", "Ewuaso Oonkidong'i Secondary", "Ewuaso Oonkidong'i Health Centre"],
  "Keek-Onyokie": ["Keek-Onyokie Primary", "Keek-Onyokie Secondary", "Keek-Onyokie Health Centre"],
  "Purko": ["Purko Primary", "Purko Secondary", "Purko Health Centre"],

  // KERICHO COUNTY
  "Londiani": ["Londiani Primary", "Londiani Secondary", "Londiani Health Centre"],
  "Kedowa/Kimugul": ["Kedowa Primary", "Kimugul Primary", "Kedowa Health Centre"],
  "Chepseon": ["Chepseon Primary", "Chepseon Secondary", "Chepseon Health Centre"],
  "Tendeno/Sorget": ["Tendeno Primary", "Sorget Primary", "Tendeno Health Centre"],
  "Kunyak": ["Kunyak Primary", "Kunyak Secondary", "Kunyak Health Centre"],
  "Kamasian": ["Kamasian Primary", "Kamasian Secondary", "Kamasian Health Centre"],
  "Chilchila": ["Chilchila Primary", "Chilchila Secondary", "Chilchila Health Centre"],
  "Kapsoit": ["Kapsoit Primary", "Kapsoit Secondary", "Kapsoit Health Centre"],
  "Ainamoi": ["Ainamoi Primary", "Ainamoi Secondary", "Ainamoi Health Centre"],
  "Kapkugerwet": ["Kapkugerwet Primary", "Kapkugerwet Secondary", "Kapkugerwet Health Centre"],
  "Kipchebor": ["Kipchebor Primary", "Kipchebor Secondary", "Kipchebor Health Centre"],
  "Cheborge": ["Cheborge Primary", "Cheborge Secondary", "Cheborge Health Centre"],
  "Kipreres": ["Kipreres Primary", "Kipreres Secondary", "Kipreres Health Centre"],
  "Sigowet": ["Sigowet Primary", "Sigowet Secondary", "Sigowet Health Centre"],
  "Kapkatet": ["Kapkatet Primary", "Kapkatet Secondary", "Kapkatet Health Centre"],
  "Soliat": ["Soliat Primary", "Soliat Secondary", "Soliat Health Centre"],
  "Roret": ["Roret Primary", "Roret Secondary", "Roret Health Centre"],
  "Kaplelartet": ["Kaplelartet Primary", "Kaplelartet Secondary", "Kaplelartet Health Centre"],
  "Soin": ["Soin Primary", "Soin Secondary", "Soin Health Centre"],

  // BOMET COUNTY
  "Sotik": ["Sotik Primary", "Sotik Secondary", "Sotik Health Centre"],
  "Chepalungu": ["Chepalungu Primary", "Chepalungu Secondary", "Chepalungu Health Centre"],
  "Konoin": ["Konoin Primary", "Konoin Secondary", "Konoin Health Centre"],
  "Bomet East": ["Bomet East Primary", "Bomet East Secondary", "Bomet East Health Centre"],
  "Bomet Central": ["Bomet Central Primary", "Bomet Central Secondary", "Bomet Central Health Centre"],
  "Sigor": ["Sigor Primary", "Sigor Secondary", "Sigor Health Centre"],
  "Chebunyo": ["Chebunyo Primary", "Chebunyo Secondary", "Chebunyo Health Centre"],
  "Nyongores": ["Nyongores Primary", "Nyongores Secondary", "Nyongores Health Centre"],
  "Mutarakwa": ["Mutarakwa Primary", "Mutarakwa Secondary", "Mutarakwa Health Centre"],
  "Merigi": ["Merigi Primary", "Merigi Secondary", "Merigi Health Centre"],
  "Kembu": ["Kembu Primary", "Kembu Secondary", "Kembu Health Centre"],
  "Longisa": ["Longisa Primary", "Longisa Secondary", "Longisa Health Centre"],
  "Kipreres": ["Kipreres Primary", "Kipreres Secondary", "Kipreres Health Centre"],
  "Chemaner": ["Chemaner Primary", "Chemaner Secondary", "Chemaner Health Centre"],
  "Silibwet": ["Silibwet Primary", "Silibwet Secondary", "Silibwet Health Centre"],
  "Singorwet": ["Singorwet Primary", "Singorwet Secondary", "Singorwet Health Centre"],
  "Ndaraweta": ["Ndaraweta Primary", "Ndaraweta Secondary", "Ndaraweta Health Centre"],
  "Bonet": ["Bonet Primary", "Bonet Secondary", "Bonet Health Centre"],
  "Chesoen": ["Chesoen Primary", "Chesoen Secondary", "Chesoen Health Centre"],
  "Embomos": ["Embomos Primary", "Embomos Secondary", "Embomos Health Centre"],
  "Mogogosiek": ["Mogogosiek Primary", "Mogogosiek Secondary", "Mogogosiek Health Centre"],
  "Boito": ["Boito Primary", "Boito Secondary", "Boito Health Centre"],
  "Embobut": ["Embobut Primary", "Embobut Secondary", "Embobut Health Centre"],
  "Kapsowar": ["Kapsowar Primary", "Kapsowar Secondary", "Kapsowar Health Centre"],

  // KAKAMEGA COUNTY (Continued)
  "Mautuma": ["Mautuma Primary", "Mautuma Secondary", "Mautuma Health Centre"],
  "Lugari": ["Lugari Primary", "Lugari Secondary", "Lugari Health Centre"],
  "Lumakanda": ["Lumakanda Primary", "Lumakanda Secondary", "Lumakanda Health Centre"],
  "Chekalini": ["Chekalini Primary", "Chekalini Secondary", "Chekalini Health Centre"],
  "Lwandeti": ["Lwandeti Primary", "Lwandeti Secondary", "Lwandeti Health Centre"],
  "Sango": ["Sango Primary", "Sango Secondary", "Sango Health Centre"],
  "Kongoni": ["Kongoni Primary", "Kongoni Secondary", "Kongoni Health Centre"],
  "Nzoia": ["Nzoia Primary", "Nzoia Secondary", "Nzoia Health Centre"],
  "Sinoko": ["Sinoko Primary", "Sinoko Secondary", "Sinoko Health Centre"],
  "Lurambi North": ["Lurambi North Primary", "Lurambi North Secondary", "Lurambi North Health Centre"],
  "Lurambi South": ["Lurambi South Primary", "Lurambi South Secondary", "Lurambi South Health Centre"],
  "Malaha": ["Malaha Primary", "Malaha Secondary", "Malaha Health Centre"],
  "South Kabras": ["South Kabras Primary", "South Kabras Secondary", "South Kabras Health Centre"],
  "North Kabras": ["North Kabras Primary", "North Kabras Secondary", "North Kabras Health Centre"],
  "Butali/Chegulo": ["Butali Primary", "Chegulo Primary", "Butali Health Centre"],
  "Shinoyi-Shikomari": ["Shinoyi Primary", "Shikomari Primary", "Shinoyi Health Centre"],
  "Lurambi East": ["Lurambi East Primary", "Lurambi East Secondary", "Lurambi East Health Centre"],
  "Lurambi West": ["Lurambi West Primary", "Lurambi West Secondary", "Lurambi West Health Centre"],
  "Manda/Shivanga": ["Manda Primary", "Shivanga Primary", "Manda Health Centre"],
  "Sheywe": ["Sheywe Primary", "Sheywe Secondary", "Sheywe Health Centre"],
  "Ingostre-Mathia": ["Ingostre Primary", "Mathia Primary", "Ingostre Health Centre"],
  "Shinamwenyuli": ["Shinamwenyuli Primary", "Shinamwenyuli Secondary", "Shinamwenyuli Health Centre"],
  "Bunyala West": ["Bunyala West Primary", "Bunyala West Secondary", "Bunyala West Health Centre"],
  "Bunyala East": ["Bunyala East Primary", "Bunyala East Secondary", "Bunyala East Health Centre"],
  "Bunyala Central": ["Bunyala Central Primary", "Bunyala Central Secondary", "Bunyala Central Health Centre"],
  "Mumias Central": ["Mumias Central Primary", "Mumias Central Secondary", "Mumias Central Health Centre"],
  "Mumias North": ["Mumias North Primary", "Mumias North Secondary", "Mumias North Health Centre"],
  "Etenje": ["Etenje Primary", "Etenje Secondary", "Etenje Health Centre"],
  "Musanda": ["Musanda Primary", "Musanda Secondary", "Musanda Health Centre"],
  "Lusheya/Lubinu": ["Lusheya Primary", "Lubinu Primary", "Lusheya Health Centre"],
  "Malaha/Isongo/Makunga": ["Malaha Primary", "Isongo Primary", "Malaha Health Centre"],
  "East Wanga": ["East Wanga Primary", "East Wanga Secondary", "East Wanga Health Centre"],
  "Kholera": ["Kholera Primary", "Kholera Secondary", "Kholera Health Centre"],
  "Khalaba": ["Khalaba Primary", "Khalaba Secondary", "Khalaba Health Centre"],
  "Mayoni": ["Mayoni Primary", "Mayoni Secondary", "Mayoni Health Centre"],
  "Namamali": ["Namamali Primary", "Namamali Secondary", "Namamali Health Centre"],
  "Marama West": ["Marama West Primary", "Marama West Secondary", "Marama West Health Centre"],
  "Marama Central": ["Marama Central Primary", "Marama Central Secondary", "Marama Central Health Centre"],
  "Marenyo-Shianda": ["Marenyo Primary", "Shianda Primary", "Marenyo Health Centre"],
  "West Butere": ["West Butere Primary", "West Butere Secondary", "West Butere Health Centre"],
  "Central Butere": ["Central Butere Primary", "Central Butere Secondary", "Central Butere Health Centre"],
  "Butere": ["Butere Primary", "Butere Secondary", "Butere Health Centre"],
  "Emakina": ["Emakina Primary", "Emakina Secondary", "Emakina Health Centre"],
  "Butsotso East": ["Butsotso East Primary", "Butsotso East Secondary", "Butsotso East Health Centre"],
  "Butsotso South": ["Butsotso South Primary", "Butsotso South Secondary", "Butsotso South Health Centre"],
  "Butsotso Central": ["Butsotso Central Primary", "Butsotso Central Secondary", "Butsotso Central Health Centre"],
  "Butsotso North": ["Butsotso North Primary", "Butsotso North Secondary", "Butsotso North Health Centre"],
  "Shinyalu": ["Shinyalu Primary", "Shinyalu Secondary", "Shinyalu Health Centre"],
  "Musikoma": ["Musikoma Primary", "Musikoma Secondary", "Musikoma Health Centre"],
  "East Sang'alo": ["East Sang'alo Primary", "East Sang'alo Secondary", "East Sang'alo Health Centre"],
  "Marakaru/Tuuti": ["Marakaru Primary", "Tuuti Primary", "Marakaru Health Centre"],
  "West Sang'alo": ["West Sang'alo Primary", "West Sang'alo Secondary", "West Sang'alo Health Centre"],
  "Idakho East": ["Idakho East Primary", "Idakho East Secondary", "Idakho East Health Centre"],
  "Idakho South": ["Idakho South Primary", "Idakho South Secondary", "Idakho South Health Centre"],
  "Idakho Central": ["Idakho Central Primary", "Idakho Central Secondary", "Idakho Central Health Centre"],
  "Idakho North": ["Idakho North Primary", "Idakho North Secondary", "Idakho North Health Centre"],

  // VIHIGA COUNTY
  "Luanda": ["Luanda Primary", "Luanda Secondary", "Luanda Health Centre"],
  "Wemilabi": ["Wemilabi Primary", "Wemilabi Secondary", "Wemilabi Health Centre"],
  "Muhudu": ["Muhudu Primary", "Muhudu Secondary", "Muhudu Health Centre"],
  "Tambua": ["Tambua Primary", "Tambua Secondary", "Tambua Health Centre"],
  "Jepkoyai": ["Jepkoyai Primary", "Jepkoyai Secondary", "Jepkoyai Health Centre"],
  "Chavakali": ["Chavakali Primary", "Chavakali Secondary", "Chavakali Health Centre"],
  "North Maragoli": ["North Maragoli Primary", "North Maragoli Secondary", "North Maragoli Health Centre"],
  "Wodanga": ["Wodanga Primary", "Wodanga Secondary", "Wodanga Health Centre"],
  "Busali": ["Busali Primary", "Busali Secondary", "Busali Health Centre"],
  "Shiru": ["Shiru Primary", "Shiru Secondary", "Shiru Health Centre"],
  "Shamakhokho": ["Shamakhokho Primary", "Shamakhokho Secondary", "Shamakhokho Health Centre"],
  "Banja": ["Banja Primary", "Banja Secondary", "Banja Health Centre"],
  "North East Bunyore": ["North East Bunyore Primary", "North East Bunyore Secondary", "North East Bunyore Health Centre"],
  "Central Bunyore": ["Central Bunyore Primary", "Central Bunyore Secondary", "Central Bunyore Health Centre"],
  "West Bunyore": ["West Bunyore Primary", "West Bunyore Secondary", "West Bunyore Health Centre"],
  "Cheptais": ["Cheptais Primary", "Cheptais Secondary", "Cheptais Health Centre"],
  "Kapsokwony": ["Kapsokwony Primary", "Kapsokwony Secondary", "Kapsokwony Health Centre"],

  // BUNGOMA COUNTY
  "Cheptais": ["Cheptais Primary", "Cheptais Secondary", "Cheptais Health Centre"],
  "Kapsokwony": ["Kapsokwony Primary", "Kapsokwony Secondary", "Kapsokwony Health Centre"],
  "Kopsiro": ["Kopsiro Primary", "Kopsiro Secondary", "Kopsiro Health Centre"],
  "Kaptama": ["Kaptama Primary", "Kaptama Secondary", "Kaptama Health Centre"],
  "Chepyuk": ["Chepyuk Primary", "Chepyuk Secondary", "Chepyuk Health Centre"],
  "Kabuchai": ["Kabuchai Primary", "Kabuchai Secondary", "Kabuchai Health Centre"],
  "Chwele": ["Chwele Primary", "Chwele Secondary", "Chwele Health Centre"],
  "Bokoli": ["Bokoli Primary", "Bokoli Secondary", "Bokoli Health Centre"],
  "Mukuyuni": ["Mukuyuni Primary", "Mukuyuni Secondary", "Mukuyuni Health Centre"],
  "Misikhu": ["Misikhu Primary", "Misikhu Secondary", "Misikhu Health Centre"],
  "Kimaeti": ["Kimaeti Primary", "Kimaeti Secondary", "Kimaeti Health Centre"],
  "Bukembe West": ["Bukembe West Primary", "Bukembe West Secondary", "Bukembe West Health Centre"],
  "Bukembe East": ["Bukembe East Primary", "Bukembe East Secondary", "Bukembe East Health Centre"],
  "Township": ["Township Primary", "Township Secondary", "Township Health Centre"],
  "Mukwa": ["Mukwa Primary", "Mukwa Secondary", "Mukwa Health Centre"],
  "South Bukusu": ["South Bukusu Primary", "South Bukusu Secondary", "South Bukusu Health Centre"],
  "Mihuu": ["Mihuu Primary", "Mihuu Secondary", "Mihuu Health Centre"],
  "Ndivisi": ["Ndivisi Primary", "Ndivisi Secondary", "Ndivisi Health Centre"],
  "Maraka": ["Maraka Primary", "Maraka Secondary", "Maraka Health Centre"],
  "Kimilili": ["Kimilili Primary", "Kimilili Secondary", "Kimilili Health Centre"],
  "Maeni": ["Maeni Primary", "Maeni Secondary", "Maeni Health Centre"],
  "Kamukuywa": ["Kamukuywa Primary", "Kamukuywa Secondary", "Kamukuywa Health Centre"],
  "Kibingei": ["Kibingei Primary", "Kibingei Secondary", "Kibingei Health Centre"],
  "Tongaren": ["Tongaren Primary", "Tongaren Secondary", "Tongaren Health Centre"],
  "Soysambu/Mitua": ["Soysambu Primary", "Mitua Primary", "Soysambu Health Centre"],
  "Kabuyefwe": ["Kabuyefwe Primary", "Kabuyefwe Secondary", "Kabuyefwe Health Centre"],
  "Naitiri/Kabuyefwe": ["Naitiri Primary", "Kabuyefwe Primary", "Naitiri Health Centre"],
  "Bukembe": ["Bukembe Primary", "Bukembe Secondary", "Bukembe Health Centre"],

  // BUSIA COUNTY
  "Ang'urai South": ["Ang'urai South Primary", "Ang'urai South Secondary", "Ang'urai South Health Centre"],
  "Ang'urai North": ["Ang'urai North Primary", "Ang'urai North Secondary", "Ang'urai North Health Centre"],
  "Ang'urai East": ["Ang'urai East Primary", "Ang'urai East Secondary", "Ang'urai East Health Centre"],
  "Malaba Central": ["Malaba Central Primary", "Malaba Central Secondary", "Malaba Central Health Centre"],
  "Malaba North": ["Malaba North Primary", "Malaba North Secondary", "Malaba North Health Centre"],
  "Bukhayo North/Walatsi": ["Bukhayo North Primary", "Walatsi Primary", "Bukhayo North Health Centre"],
  "Bukhayo Central": ["Bukhayo Central Primary", "Bukhayo Central Secondary", "Bukhayo Central Health Centre"],
  "Bukhayo East": ["Bukhayo East Primary", "Bukhayo East Secondary", "Bukhayo East Health Centre"],
  "Nambale Township": ["Nambale Township Primary", "Nambale Township Secondary", "Nambale Township Health Centre"],
  "Bukhayo West": ["Bukhayo West Primary", "Bukhayo West Secondary", "Bukhayo West Health Centre"],
  "Budalangi": ["Budalangi Primary", "Budalangi Secondary", "Budalangi Health Centre"],
  "Bunyala Central": ["Bunyala Central Primary", "Bunyala Central Secondary", "Bunyala Central Health Centre"],
  "Bunyala North": ["Bunyala North Primary", "Bunyala North Secondary", "Bunyala North Health Centre"],
  "Bunyala West": ["Bunyala West Primary", "Bunyala West Secondary", "Bunyala West Health Centre"],
  "Bunyala South": ["Bunyala South Primary", "Bunyala South Secondary", "Bunyala South Health Centre"],
  "Marachi West": ["Marachi West Primary", "Marachi West Secondary", "Marachi West Health Centre"],
  "Marachi Central": ["Marachi Central Primary", "Marachi Central Secondary", "Marachi Central Health Centre"],
  "Marachi East": ["Marachi East Primary", "Marachi East Secondary", "Marachi East Health Centre"],
  "Marachi North": ["Marachi North Primary", "Marachi North Secondary", "Marachi North Health Centre"],
  "Elugulu": ["Elugulu Primary", "Elugulu Secondary", "Elugulu Health Centre"],

  // SIAYA COUNTY
  "Sidindi": ["Sidindi Primary", "Sidindi Secondary", "Sidindi Health Centre"],
  "Sigomere": ["Sigomere Primary", "Sigomere Secondary", "Sigomere Health Centre"],
  "Ugunja": ["Ugunja Primary", "Ugunja Secondary", "Ugunja Health Centre"],
  "Ukwala": ["Ukwala Primary", "Ukwala Secondary", "Ukwala Health Centre"],
  "Sega": ["Sega Primary", "Sega Secondary", "Sega Health Centre"],
  "Usonga": ["Usonga Primary", "Usonga Secondary", "Usonga Health Centre"],
  "North Alego": ["North Alego Primary", "North Alego Secondary", "North Alego Health Centre"],
  "Central Alego": ["Central Alego Primary", "Central Alego Secondary", "Central Alego Health Centre"],
  "Siaya Township": ["Siaya Township Primary", "Siaya Township Secondary", "Siaya Township Health Centre"],
  "West Alego": ["West Alego Primary", "West Alego Secondary", "West Alego Health Centre"],
  "East Gem": ["East Gem Primary", "East Gem Secondary", "East Gem Health Centre"],
  "West Gem": ["West Gem Primary", "West Gem Secondary", "West Gem Health Centre"],
  "North Gem": ["North Gem Primary", "North Gem Secondary", "North Gem Health Centre"],
  "South Gem": ["South Gem Primary", "South Gem Secondary", "South Gem Health Centre"],
  "Central Gem": ["Central Gem Primary", "Central Gem Secondary", "Central Gem Health Centre"],
  "West Yimbo": ["West Yimbo Primary", "West Yimbo Secondary", "West Yimbo Health Centre"],
  "Central Sakwa": ["Central Sakwa Primary", "Central Sakwa Secondary", "Central Sakwa Health Centre"],
  "South Sakwa": ["South Sakwa Primary", "South Sakwa Secondary", "South Sakwa Health Centre"],
  "Yimbo East": ["Yimbo East Primary", "Yimbo East Secondary", "Yimbo East Health Centre"],
  "West Sakwa": ["West Sakwa Primary", "West Sakwa Secondary", "West Sakwa Health Centre"],
  "East Asembo": ["East Asembo Primary", "East Asembo Secondary", "East Asembo Health Centre"],
  "West Asembo": ["West Asembo Primary", "West Asembo Secondary", "West Asembo Health Centre"],
  "North Uyoma": ["North Uyoma Primary", "North Uyoma Secondary", "North Uyoma Health Centre"],
  "South Uyoma": ["South Uyoma Primary", "South Uyoma Secondary", "South Uyoma Health Centre"],
  "West Uyoma": ["West Uyoma Primary", "West Uyoma Secondary", "West Uyoma Health Centre"],

  // KISUMU COUNTY (Continued)
  "Kajulu": ["Kajulu Primary", "Kajulu Secondary", "Kajulu Health Centre"],
  "Kolwa East": ["Kolwa East Primary", "Kolwa East Secondary", "Kolwa East Health Centre"],
  "Manyatta 'B'": ["Manyatta 'B' Primary", "Manyatta 'B' Secondary", "Manyatta 'B' Health Centre"],
  "Nyalenda 'A'": ["Nyalenda 'A' Primary", "Nyalenda 'A' Secondary", "Nyalenda 'A' Health Centre"],
  "Nyalenda 'B'": ["Nyalenda 'B' Primary", "Nyalenda 'B' Secondary", "Nyalenda 'B' Health Centre"],
  "Kisumu North": ["Kisumu North Primary", "Kisumu North Secondary", "Kisumu North Health Centre"],
  "West Kisumu": ["West Kisumu Primary", "West Kisumu Secondary", "West Kisumu Health Centre"],
  "North West Kisumu": ["North West Kisumu Primary", "North West Kisumu Secondary", "North West Kisumu Health Centre"],
  "Central Kisumu": ["Central Kisumu Primary", "Central Kisumu Secondary", "Central Kisumu Health Centre"],
  "Kakola/Kaburini": ["Kakola Primary", "Kaburini Primary", "Kakola Health Centre"],
  "Kondele": ["Kondele Primary", "Kondele Secondary", "Kondele Health Centre"],
  "Milimani": ["Milimani Primary", "Milimani Secondary", "Milimani Health Centre"],
  "West Seme": ["West Seme Primary", "West Seme Secondary", "West Seme Health Centre"],
  "Central Seme": ["Central Seme Primary", "Central Seme Secondary", "Central Seme Health Centre"],
  "East Seme": ["East Seme Primary", "East Seme Secondary", "East Seme Health Centre"],
  "North Seme": ["North Seme Primary", "North Seme Secondary", "North Seme Health Centre"],
  "Kakola": ["Kakola Primary", "Kakola Secondary", "Kakola Health Centre"],
  "South West Nyakach": ["South West Nyakach Primary", "South West Nyakach Secondary", "South West Nyakach Health Centre"],
  "North Nyakach": ["North Nyakach Primary", "North Nyakach Secondary", "North Nyakach Health Centre"],
  "Central Nyakach": ["Central Nyakach Primary", "Central Nyakach Secondary", "Central Nyakach Health Centre"],
  "South Nyakach": ["South Nyakach Primary", "South Nyakach Secondary", "South Nyakach Health Centre"],
  "Muhoroni/Koru": ["Muhoroni Primary", "Koru Primary", "Muhoroni Health Centre"],
  "Lower Nyakach": ["Lower Nyakach Primary", "Lower Nyakach Secondary", "Lower Nyakach Health Centre"],
  "Upper Nyakach": ["Upper Nyakach Primary", "Upper Nyakach Secondary", "Upper Nyakach Health Centre"],
  "South East Nyakach": ["South East Nyakach Primary", "South East Nyakach Secondary", "South East Nyakach Health Centre"],
  "West Nyakach": ["West Nyakach Primary", "West Nyakach Secondary", "West Nyakach Health Centre"],

  // HOMA BAY COUNTY
  "West Kasipul": ["West Kasipul Primary", "West Kasipul Secondary", "West Kasipul Health Centre"],
  "South Kasipul": ["South Kasipul Primary", "South Kasipul Secondary", "South Kasipul Health Centre"],
  "Central Kasipul": ["Central Kasipul Primary", "Central Kasipul Secondary", "Central Kasipul Health Centre"],
  "East Kamagak": ["East Kamagak Primary", "East Kamagak Secondary", "East Kamagak Health Centre"],
  "West Kamagak": ["West Kamagak Primary", "West Kamagak Secondary", "West Kamagak Health Centre"],
  "Kabondo East": ["Kabondo East Primary", "Kabondo East Secondary", "Kabondo East Health Centre"],
  "Kabondo West": ["Kabondo West Primary", "Kabondo West Secondary", "Kabondo West Health Centre"],
  "Kokwanyo/Kakelo": ["Kokwanyo Primary", "Kakelo Primary", "Kokwanyo Health Centre"],
  "Kojwach": ["Kojwach Primary", "Kojwach Secondary", "Kojwach Health Centre"],
  "Kanyaluo": ["Kanyaluo Primary", "Kanyaluo Secondary", "Kanyaluo Health Centre"],
  "Kibiri": ["Kibiri Primary", "Kibiri Secondary", "Kibiri Health Centre"],
  "Wang'chieng": ["Wang'chieng Primary", "Wang'chieng Secondary", "Wang'chieng Health Centre"],
  "Kendu Bay Town": ["Kendu Bay Town Primary", "Kendu Bay Town Secondary", "Kendu Bay Town Health Centre"],
  "Kanyikela": ["Kanyikela Primary", "Kanyikela Secondary", "Kanyikela Health Centre"],
  "North Kabuoch": ["North Kabuoch Primary", "North Kabuoch Secondary", "North Kabuoch Health Centre"],
  "Kabuoch South/Pala": ["Kabuoch South Primary", "Pala Primary", "Kabuoch South Health Centre"],
  "Kanyamwa Kologi": ["Kanyamwa Kologi Primary", "Kanyamwa Kologi Secondary", "Kanyamwa Kologi Health Centre"],
  "Kanyamwa Kosewe": ["Kanyamwa Kosewe Primary", "Kanyamwa Kosewe Secondary", "Kanyamwa Kosewe Health Centre"],
  "Homa Bay Central": ["Homa Bay Central Primary", "Homa Bay Central Secondary", "Homa Bay Central Health Centre"],
  "Homa Bay Arujo": ["Homa Bay Arujo Primary", "Homa Bay Arujo Secondary", "Homa Bay Arujo Health Centre"],
  "Homa Bay West": ["Homa Bay West Primary", "Homa Bay West Secondary", "Homa Bay West Health Centre"],
  "Homa Bay East": ["Homa Bay East Primary", "Homa Bay East Secondary", "Homa Bay East Health Centre"],
  "Gembe": ["Gembe Primary", "Gembe Secondary", "Gembe Health Centre"],
  "Lambwe": ["Lambwe Primary", "Lambwe Secondary", "Lambwe Health Centre"],
  "Gwassi South": ["Gwassi South Primary", "Gwassi South Secondary", "Gwassi South Health Centre"],
  "Gwassi North": ["Gwassi North Primary", "Gwassi North Secondary", "Gwassi North Health Centre"],
  "Kaksingri West": ["Kaksingri West Primary", "Kaksingri West Secondary", "Kaksingri West Health Centre"],
  "Kaksingri East": ["Kaksingri East Primary", "Kaksingri East Secondary", "Kaksingri East Health Centre"],
  "Mfangano": ["Mfangano Primary", "Mfangano Secondary", "Mfangano Health Centre"],

  // MIGORI COUNTY
  "North Kamagambo": ["North Kamagambo Primary", "North Kamagambo Secondary", "North Kamagambo Health Centre"],
  "Central Kamagambo": ["Central Kamagambo Primary", "Central Kamagambo Secondary", "Central Kamagambo Health Centre"],
  "East Kamagambo": ["East Kamagambo Primary", "East Kamagambo Secondary", "East Kamagambo Health Centre"],
  "South Kamagambo": ["South Kamagambo Primary", "South Kamagambo Secondary", "South Kamagambo Health Centre"],
  "West Kamagambo": ["West Kamagambo Primary", "West Kamagambo Secondary", "West Kamagambo Health Centre"],
  "North East Sakwa": ["North East Sakwa Primary", "North East Sakwa Secondary", "North East Sakwa Health Centre"],
  "South Sakwa": ["South Sakwa Primary", "South Sakwa Secondary", "South Sakwa Health Centre"],
  "West Sakwa": ["West Sakwa Primary", "West Sakwa Secondary", "West Sakwa Health Centre"],
  "God Jope": ["God Jope Primary", "God Jope Secondary", "God Jope Health Centre"],
  "Kakrao": ["Kakrao Primary", "Kakrao Secondary", "Kakrao Health Centre"],
  "Kwa": ["Kwa Primary", "Kwa Secondary", "Kwa Health Centre"],
  "Central Kanyamkago": ["Central Kanyamkago Primary", "Central Kanyamkago Secondary", "Central Kanyamkago Health Centre"],
  "South Kanyamkago": ["South Kanyamkago Primary", "South Kanyamkago Secondary", "South Kanyamkago Health Centre"],
  "East Kanyamkago": ["East Kanyamkago Primary", "East Kanyamkago Secondary", "East Kanyamkago Health Centre"],
  "North Kanyamkago": ["North Kanyamkago Primary", "North Kanyamkago Secondary", "North Kanyamkago Health Centre"],
  "Kanyasa": ["Kanyasa Primary", "Kanyasa Secondary", "Kanyasa Health Centre"],
  "North Kadem": ["North Kadem Primary", "North Kadem Secondary", "North Kadem Health Centre"],
  "Macalder/Kanyarwanda": ["Macalder Primary", "Kanyarwanda Primary", "Macalder Health Centre"],
  "Kaler": ["Kaler Primary", "Kaler Secondary", "Kaler Health Centre"],
  "Got Kachola": ["Got Kachola Primary", "Got Kachola Secondary", "Got Kachola Health Centre"],
  "Bukira East": ["Bukira East Primary", "Bukira East Secondary", "Bukira East Health Centre"],
  "Bukira Central/Ikerege": ["Bukira Central Primary", "Ikerege Primary", "Bukira Central Health Centre"],
  "Isibania": ["Isibania Primary", "Isibania Secondary", "Isibania Health Centre"],
  "Makerero": ["Makerero Primary", "Makerero Secondary", "Makerero Health Centre"],
  "Masaba": ["Masaba Primary", "Masaba Secondary", "Masaba Health Centre"],

  // KISII COUNTY
  "Bogiakumu": ["Bogiakumu Primary", "Bogiakumu Secondary", "Bogiakumu Health Centre"],
  "Bomorenda": ["Bomorenda Primary", "Bomorenda Secondary", "Bomorenda Health Centre"],
  "Bomorianga": ["Bomorianga Primary", "Bomorianga Secondary", "Bomorianga Health Centre"],
  "Bogusero": ["Bogusero Primary", "Bogusero Secondary", "Bogusero Health Centre"],
  "Bokeira": ["Bokeira Primary", "Bokeira Secondary", "Bokeira Health Centre"],
  "Bomachoge": ["Bomachoge Primary", "Bomachoge Secondary", "Bomachoge Health Centre"],
  "Bobasi Chache": ["Bobasi Chache Primary", "Bobasi Chache Secondary", "Bobasi Chache Health Centre"],
  "Bobasi Boitangare": ["Bobasi Boitangare Primary", "Bobasi Boitangare Secondary", "Bobasi Boitangare Health Centre"],
  "Masige East": ["Masige East Primary", "Masige East Secondary", "Masige East Health Centre"],
  "Masige West": ["Masige West Primary", "Masige West Secondary", "Masige West Health Centre"],

  // NYAMIRA COUNTY
  "Bomorenda": ["Bomorenda Primary", "Bomorenda Secondary", "Bomorenda Health Centre"],
  "Bomorianga": ["Bomorianga Primary", "Bomorianga Secondary", "Bomorianga Health Centre"],
  "Bogusero": ["Bogusero Primary", "Bogusero Secondary", "Bogusero Health Centre"],
  "Bokeira": ["Bokeira Primary", "Bokeira Secondary", "Bokeira Health Centre"],
  "Bomachoge": ["Bomachoge Primary", "Bomachoge Secondary", "Bomachoge Health Centre"],

  // NAIROBI COUNTY (Continued)
  "Roysambu": ["Roysambu Primary", "Roysambu Secondary", "Roysambu Health Centre"],
  "Kahawa West": ["Kahawa West Primary", "Kahawa West Secondary", "Kahawa West Health Centre"],
  "Zimmerman": ["Zimmerman Primary", "Zimmerman Secondary", "Zimmerman Health Centre"],
  "Kahawa": ["Kahawa Primary", "Kahawa Secondary", "Kahawa Health Centre"],
  "Clay City": ["Clay City Primary", "Clay City Secondary", "Clay City Health Centre"],
  "Mwiki": ["Mwiki Primary", "Mwiki Secondary", "Mwiki Health Centre"],
  "Njiru": ["Njiru Primary", "Njiru Secondary", "Njiru Health Centre"],
  "Ruai": ["Ruai Primary", "Ruai Secondary", "Ruai Health Centre"],
  "Babadogo": ["Babadogo Primary", "Babadogo Secondary", "Babadogo Health Centre"],
  "Utalii": ["Utalii Primary", "Utalii Secondary", "Utalii Health Centre"],
  "Mathare North": ["Mathare North Primary", "Mathare North Secondary", "Mathare North Health Centre"],
  "Lucky Summer": ["Lucky Summer Primary", "Lucky Summer Secondary", "Lucky Summer Health Centre"],
  "Korogocho": ["Korogocho Primary", "Korogocho Secondary", "Korogocho Health Centre"],
  "Imara Daima": ["Imara Daima Primary", "Imara Daima Secondary", "Imara Daima Health Centre"],
  "Kwa Njenga": ["Kwa Njenga Primary", "Kwa Njenga Secondary", "Kwa Njenga Health Centre"],
  "Kwa Reuben": ["Kwa Reuben Primary", "Kwa Reuben Secondary", "Kwa Reuben Health Centre"],
  "Pipeline": ["Pipeline Primary", "Pipeline Secondary", "Pipeline Health Centre"],
  "Kware": ["Kware Primary", "Kware Secondary", "Kware Health Centre"],
  "Kariobangi North": ["Kariobangi North Primary", "Kariobangi North Secondary", "Kariobangi North Health Centre"],
  "Dandora Area I": ["Dandora Area I Primary", "Dandora Area I Secondary", "Dandora Area I Health Centre"],
  "Dandora Area II": ["Dandora Area II Primary", "Dandora Area II Secondary", "Dandora Area II Health Centre"],
  "Dandora Area III": ["Dandora Area III Primary", "Dandora Area III Secondary", "Dandora Area III Health Centre"],
  "Dandora Area IV": ["Dandora Area IV Primary", "Dandora Area IV Secondary", "Dandora Area IV Health Centre"],
  "Kayole North": ["Kayole North Primary", "Kayole North Secondary", "Kayole North Health Centre"],
  "Kayole Central": ["Kayole Central Primary", "Kayole Central Secondary", "Kayole Central Health Centre"],
  "Kayole South": ["Kayole South Primary", "Kayole South Secondary", "Kayole South Health Centre"],
  "Komarock": ["Komarock Primary", "Komarock Secondary", "Komarock Health Centre"],
  "Matopeni": ["Matopeni Primary", "Matopeni Secondary", "Matopeni Health Centre"],
  "Upper Savanna": ["Upper Savanna Primary", "Upper Savanna Secondary", "Upper Savanna Health Centre"],
  "Lower Savanna": ["Lower Savanna Primary", "Lower Savanna Secondary", "Lower Savanna Health Centre"],
  "Embakasi": ["Embakasi Primary", "Embakasi Secondary", "Embakasi Health Centre"],
  "Utawala": ["Utawala Primary", "Utawala Secondary", "Utawala Health Centre"],
  "Mihang'o": ["Mihang'o Primary", "Mihang'o Secondary", "Mihang'o Health Centre"],
  "Umoja I": ["Umoja I Primary", "Umoja I Secondary", "Umoja I Health Centre"],
  "Umoja II": ["Umoja II Primary", "Umoja II Secondary", "Umoja II Health Centre"],
  "Mowlem": ["Mowlem Primary", "Mowlem Secondary", "Mowlem Health Centre"],
  "Kariobangi South": ["Kariobangi South Primary", "Kariobangi South Secondary", "Kariobangi South Health Centre"],
  "Maringo/Hamza": ["Maringo Primary", "Hamza Primary", "Maringo Health Centre"],
  "Viwandani": ["Viwandani Primary", "Viwandani Secondary", "Viwandani Health Centre"],
  "Harambee": ["Harambee Primary", "Harambee Secondary", "Harambee Health Centre"],
  "Makongeni": ["Makongeni Primary", "Makongeni Secondary", "Makongeni Health Centre"],
  "Mbotela": ["Mbotela Primary", "Mbotela Secondary", "Mbotela Health Centre"],
  "Pumwani": ["Pumwani Primary", "Pumwani Secondary", "Pumwani Health Centre"],
  "Eastleigh North": ["Eastleigh North Primary", "Eastleigh North Secondary", "Eastleigh North Health Centre"],
  "Eastleigh South": ["Eastleigh South Primary", "Eastleigh South Secondary", "Eastleigh South Health Centre"],
  "Airbase": ["Airbase Primary", "Airbase Secondary", "Airbase Health Centre"],
  "California": ["California Primary", "California Secondary", "California Health Centre"],
  "Nairobi Central": ["Nairobi Central Primary", "Nairobi Central Secondary", "Nairobi Central Health Centre"],
  "Ngara": ["Ngara Primary", "Ngara Secondary", "Ngara Health Centre"],
  "Pangani": ["Pangani Primary", "Pangani Secondary", "Pangani Health Centre"],
  "Ziwani/Kariokor": ["Ziwani Primary", "Kariokor Primary", "Ziwani Health Centre"],
  "Landimawe": ["Landimawe Primary", "Landimawe Secondary", "Landimawe Health Centre"],
  "Nairobi South": ["Nairobi South Primary", "Nairobi South Secondary", "Nairobi South Health Centre"],
  "Hospital": ["Hospital Primary", "Hospital Secondary", "Hospital Health Centre"],
  "Mabatini": ["Mabatini Primary", "Mabatini Secondary", "Mabatini Health Centre"],
  "Huruma": ["Huruma Primary", "Huruma Secondary", "Huruma Health Centre"],
  "Ngei": ["Ngei Primary", "Ngei Secondary", "Ngei Health Centre"],
  "Mlango Kubwa": ["Mlango Kubwa Primary", "Mlango Kubwa Secondary", "Mlango Kubwa Health Centre"],
  "Kiamaiko": ["Kiamaiko Primary", "Kiamaiko Secondary", "Kiamaiko Health Centre"]
};
 

const VoterDriveSection = ({ showThankYou: initialShowThankYou = false }: VoterDriveSectionProps) => {
  const [showThankYou, setShowThankYou] = useState(initialShowThankYou);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    county: "",
    constituency: "",
    ward: "",
    pollingStation: "",
    interests: [] as string[],
    additionalInfo: "",
  });

  // Get constituencies for selected county
  const getConstituenciesForCounty = (county: string) => {
    return constituenciesByCounty[county] || [];
  };

  // Get wards for selected constituency
  const getWardsForConstituency = (constituency: string) => {
    return wardsByConstituency[constituency] || [];
  };

  // Get polling stations for selected ward
  const getPollingStationsForWard = (ward: string) => {
    return pollingStationsByWard[ward] || [];
  };

  const interests = [
    "Fund Raising / Donating",
    "Civic Education",
    "Community Organization",
    "Issue Based Organizing",
    "Digital Organizing",
    "Volunteer Recruitment & Training",
    "Voter Registration",
    "Election Monitoring",
    "Youth Mobilization",
    "Women Empowerment"
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleCountyChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      county: value,
      constituency: "",
      ward: "",
      pollingStation: ""
    }));
  };

  const handleConstituencyChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      constituency: value,
      ward: "",
      pollingStation: ""
    }));
  };

  const handleWardChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      ward: value,
      pollingStation: ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    
    if (!fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in your name, email, and phone number");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.county || !formData.constituency) {
      toast.error("Please select your county and constituency");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const { error } = await supabase
        .from("volunteers")
        .insert({
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          county: formData.county,
          constituency: formData.constituency,
          ward: formData.ward || null,
          polling_station: formData.pollingStation || null,
          interests: formData.interests,
          additional_info: formData.additionalInfo || null,
          status: "pending",
          created_at: new Date().toISOString(),
        });
      
      if (error) {
        console.error("Error submitting volunteer form:", error);
        toast.error("Failed to submit. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Thank you for volunteering! We'll contact you soon.");
      setShowThankYou(true);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        county: "",
        constituency: "",
        ward: "",
        pollingStation: "",
        interests: [],
        additionalInfo: "",
      });
      
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showThankYou) {
    return <ThankYouVolunteer />;
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-4">
            <span className="text-sm font-medium text-emerald-700">Get Involved</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Join Voter Drive Movement
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Be part of the change Kenya needs. Your voice and action can help Reset, 
            Restore, and Rebuild our nation for a better tomorrow.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4">
                <span className="text-2xl">🗳️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Voter Drive Registration
              </h3>
              <p className="text-gray-600">
                Fill out the form below to join thousands of Kenyans working to bring 
                positive change to our country.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  Personal Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      placeholder="Enter first name"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      placeholder="Enter last name"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📱 Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      placeholder="+254 7XX XXX XXX"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ✉️ Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="your.email@example.com"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  📍 Location Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      County *
                    </label>
                    <Select 
                      value={formData.county} 
                      onValueChange={handleCountyChange}
                      required
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {kenyanCounties.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Constituency *
                    </label>
                    <Select 
                      value={formData.constituency} 
                      onValueChange={handleConstituencyChange}
                      disabled={!formData.county}
                      required
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={
                          !formData.county 
                            ? "Select county first" 
                            : `Select constituency in ${formData.county}`
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {getConstituenciesForCounty(formData.county).map((constituency) => (
                          <SelectItem key={constituency} value={constituency}>
                            {constituency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ward
                    </label>
                    <Select 
                      value={formData.ward} 
                      onValueChange={handleWardChange}
                      disabled={!formData.constituency}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={
                          !formData.constituency 
                            ? "Select constituency first" 
                            : `Select ward in ${formData.constituency}`
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {getWardsForConstituency(formData.constituency).map((ward) => (
                          <SelectItem key={ward} value={ward}>
                            {ward}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Polling Station
                    </label>
                    <Select 
                      value={formData.pollingStation} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, pollingStation: value }))}
                      disabled={!formData.ward}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={
                          !formData.ward 
                            ? "Select ward first" 
                            : `Select polling station in ${formData.ward}`
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {getPollingStationsForWard(formData.ward).map((station) => (
                          <SelectItem key={station} value={station}>
                            {station}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Voter Drive Interests */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  🗳️ Voter Drive Interests
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {interests.map((interest) => (
                    <label 
                      key={interest}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-emerald-50/50 transition-colors group"
                    >
                      <Checkbox
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                        className="border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {interest}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  💬 Additional Information
                </h4>
                <label className="block text-sm text-gray-600 mb-2">
                  Tell us more about yourself (optional)
                </label>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Share any additional information, skills, or experience that might be relevant to your volunteer work..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox required className="mt-1" />
                  <div className="text-sm text-gray-600">
                    I agree to the terms and conditions of volunteering. I understand that my information 
                    will be used for voter mobilization purposes only and I consent to receiving 
                    communication about voter drive activities.
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Join the Voter Drive Movement 🚀"
                )}
              </Button>
            </form>

            {/* Privacy Notice */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Your information is secure and will only be used for voter mobilization purposes. 
                We respect your privacy and will never share your data without your consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoterDriveSection;
