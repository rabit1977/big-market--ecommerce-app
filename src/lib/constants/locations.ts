export const MACEDONIA_CITIES = [
    "Skopje", "Bitola", "Kumanovo", "Prilep", "Tetovo", "Veles", "Stip", "Ohrid", "Gostivar", "Strumica",
    "Kavadarci", "Kocani", "Kicevo", "Struga", "Radovis", "Gevgelija", "Debar", "Kriva Palanka", "Sveti Nikole", "Negotino",
    "Delcevo", "Vinica", "Resen", "Probistip", "Berovo", "Kratovo", "Bogdanci", "Krusevo", "Makedonski Brod", "Demir Kapija"
].sort();

export const SKOPJE_MUNICIPALITIES = [
    "Aerodrom", "Centar", "Karpos", "Kisela Voda", "Gazi Baba", "Butel", "Chair", "Gjorce Petrov", "Saraj", "Suto Orizari",
    "Aracinovo", "Ilinden", "Petrovec", "Sopiste", "Studenicani", "Zelenikovo", "Cucer Sandevo"
].sort();

export const ALL_MUNICIPALITIES = [
    ...SKOPJE_MUNICIPALITIES,
    ...MACEDONIA_CITIES.filter(c => c !== "Skopje")
].sort();
