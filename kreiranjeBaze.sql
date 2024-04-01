-- Creator:       MySQL Workbench 8.0.32/ExportSQLite Plugin 0.1.0
-- Author:        Unknown
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2023-12-23 22:01
-- Created:       2023-11-20 15:02

BEGIN;
CREATE TABLE "serija"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(100) NOT NULL,
  "opis" TEXT,
  "broj_sezona" INTEGER,
  "broj_epizoda" INTEGER,
  "popularnost" INTEGER,
  "slika" TEXT,
  "stranica" TEXT,
  "prvi_datum_emitiranja" DATE,
  "zadnji_datum_emitiranja" DATE,
  "originalni_jezik" VARCHAR(45),
  "originalni_naziv" VARCHAR(45),
  "prosjecna_ocjena" FLOAT,
  "broj_glasova" INTEGER,
  CONSTRAINT "id_UNIQUE"
    UNIQUE("id")
);
CREATE TABLE "sezona"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(100) NOT NULL,
  "opis" TEXT,
  "broj_sezone" INTEGER,
  "broj_epizoda" INTEGER,
  "slika" VARCHAR(45),
  "serija_id" INTEGER NOT NULL,
  "datum_emitiranja" DATE,
  "prosjecna_ocjena" DECIMAL,
  CONSTRAINT "fk_sezona_serija"
    FOREIGN KEY("serija_id")
    REFERENCES "serija"("id")
);
CREATE INDEX "sezona.fk_sezona_serija_idx" ON "sezona" ("serija_id");
CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(45),
  "opis" TEXT
);
CREATE TABLE "dnevnik"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "datum" DATE NOT NULL,
  "vrijeme" TIME NOT NULL,
  "trazeni_resurs" TEXT NOT NULL,
  "tijelo" TEXT,
  "metoda" VARCHAR(10) NOT NULL
);
CREATE TABLE "korisnik"(
  "korime" VARCHAR(20) PRIMARY KEY NOT NULL,
  "email" VARCHAR(50) NOT NULL,
  "lozinka" TEXT NOT NULL,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(100),
  "adresa" TEXT,
  "datumRodenja" DATE,
  "telefon" VARCHAR(45),
  "tip_korisnika_id" INTEGER NOT NULL,
  CONSTRAINT "fk_korisnik_tip_korisnika1"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
);
CREATE INDEX "korisnik.fk_korisnik_tip_korisnika1_idx" ON "korisnik" ("tip_korisnika_id");
CREATE TABLE "favoriti"(
  "korisnik_korime" VARCHAR(20) NOT NULL,
  "serija_id" INTEGER NOT NULL,
  PRIMARY KEY("korisnik_korime","serija_id"),
  CONSTRAINT "fk_korisnik_has_serija_korisnik1"
    FOREIGN KEY("korisnik_korime")
    REFERENCES "korisnik"("korime"),
  CONSTRAINT "fk_korisnik_has_serija_serija1"
    FOREIGN KEY("serija_id")
    REFERENCES "serija"("id")
);
CREATE INDEX "favoriti.fk_korisnik_has_serija_serija1_idx" ON "favoriti" ("serija_id");
CREATE INDEX "favoriti.fk_korisnik_has_serija_korisnik1_idx" ON "favoriti" ("korisnik_korime");
COMMIT;

update korisnik set tip_korisnika_id = 2 where korime = "admin";
update tip_korisnika set opis = "Administrator sustava" where id = 2;