CREATE DATABASE SNK_PLASTIC
USE SNK_PLASTIC
-- TABLE: clients
CREATE TABLE clients (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nom NVARCHAR(255) NOT NULL
);

-- TABLE: machines
CREATE TABLE machines (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nom NVARCHAR(255) NOT NULL
);

-- TABLE: produits
CREATE TABLE produits (
    id INT IDENTITY(1,1) PRIMARY KEY,
    designation NVARCHAR(255) NOT NULL
);

-- TABLE: matieres
CREATE TABLE matieres (
    id INT IDENTITY(1,1) PRIMARY KEY,
    reference NVARCHAR(255) NOT NULL
);

-- TABLE: ordres_fabrication
CREATE TABLE ordres_fabrication (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_id INT FOREIGN KEY REFERENCES clients(id),
    machine_id INT FOREIGN KEY REFERENCES machines(id),
    produit_id INT FOREIGN KEY REFERENCES produits(id),
    matiere_id INT FOREIGN KEY REFERENCES matieres(id),
    quantite_commande INT NOT NULL,
    temps_ecoule DECIMAL(10,2) DEFAULT 0,
    temps_restant DECIMAL(10,2) DEFAULT 0,
    etat NVARCHAR(50) DEFAULT 'en_attente'
);

-- TABLE: utilisateurs
CREATE TABLE utilisateurs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nom NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) CHECK (role IN ('admin', 'manager', 'operateur', 'commercial')),
    actif BIT DEFAULT 1
);

-- TABLE: production_logs
CREATE TABLE production_logs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    of_id INT FOREIGN KEY REFERENCES ordres_fabrication(id),
    machine_id INT FOREIGN KEY REFERENCES machines(id),
    date_heure DATETIME DEFAULT GETDATE(),
    quantite_produite INT NOT NULL,
    quantite_rebuts INT NOT NULL
);

-- TABLE: commandes
CREATE TABLE commandes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_id INT FOREIGN KEY REFERENCES clients(id),
    machine_id INT FOREIGN KEY REFERENCES machines(id),
    produit_id INT FOREIGN KEY REFERENCES produits(id),
    cycle_sec INT NOT NULL,
    moule_utilise NVARCHAR(255) NOT NULL,
    nombre_heures DECIMAL(10,2) NOT NULL,
    poids_piece DECIMAL(10,2) NOT NULL,
    nb_operateurs INT NOT NULL,
    matiere_id INT FOREIGN KEY REFERENCES matieres(id),
    remarques NVARCHAR(MAX),
    date_commande DATETIME DEFAULT GETDATE()
);

-- TABLE: stock
CREATE TABLE stock (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nom_objet NVARCHAR(255) NOT NULL,
    type_objet NVARCHAR(50) CHECK (type_objet IN ('produit_fini', 'matiere_premiere', 'outil')),
    client_id INT FOREIGN KEY REFERENCES clients(id),
    quantite INT NOT NULL,
    date_entree DATE NOT NULL,
    echeance_stock INT DEFAULT 30
);

-- TABLE: factures
CREATE TABLE factures (
    id INT IDENTITY(1,1) PRIMARY KEY,
    numero_facture NVARCHAR(100) UNIQUE NOT NULL,
    client_id INT FOREIGN KEY REFERENCES clients(id),
    produit_id INT FOREIGN KEY REFERENCES produits(id),
    date_emission DATETIME DEFAULT GETDATE(),
    montant_total DECIMAL(10,2) NOT NULL,
    montant_paye DECIMAL(10,2) DEFAULT 0,
    pdf_facture NVARCHAR(255)
);
