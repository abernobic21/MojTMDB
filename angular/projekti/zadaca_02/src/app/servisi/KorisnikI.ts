export interface KorisnikI {
    korime: string;
    email: string;
    lozinka: string;
    ime: string;
    prezime: string;
    adresa: string;
    datumRodenja: string;
    telefon: string;
    tipKorisnika: number;
    totp: boolean;
    totpAktivan: boolean;
}