-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 20 mai 2024 à 17:56
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `falcon`
--

-- --------------------------------------------------------

--
-- Structure de la table `affectations`
--

CREATE TABLE `affectations` (
  `id_affectation` int(11) NOT NULL,
  `id_numero` int(11) NOT NULL,
  `id_traceur` int(11) NOT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `affectations`
--

INSERT INTO `affectations` (`id_affectation`, `id_numero`, `id_traceur`, `est_supprime`, `created_at`) VALUES
(1, 1, 1, 0, '2024-05-17 09:00:50');

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id_client` int(11) NOT NULL,
  `nom_client` varchar(255) NOT NULL,
  `nom_principal` varchar(100) DEFAULT NULL,
  `poste` varchar(200) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id_client`, `nom_client`, `nom_principal`, `poste`, `telephone`, `adresse`, `email`, `est_supprime`, `created_at`) VALUES
(1, 'Acha', 'Umba', 'Admin', '+243815127387', 'Kinshasa, c/matete Q/ Debonhomme, N°40', 'achandambi@gmail.com', 0, '2024-05-15 14:13:44'),
(2, 'Heritier', 'Wata', 'Secretaire', '+243820689615', 'Kinshasa, c/Ngaliema Q/ Lalu N°40', 'heritier@gmail.com', 0, '2024-05-15 14:39:20'),
(3, 'Carnayo', 'Giresse', 'Secretaire', '+24382068900', 'Kinshasa, c/kintambo Q/ Benseke, N°40', 'carnayo@gmail.com', 0, '2024-05-17 08:29:06');

-- --------------------------------------------------------

--
-- Structure de la table `contact_client`
--

CREATE TABLE `contact_client` (
  `id_contact_client` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `nom_contact` varchar(100) DEFAULT NULL,
  `telephone_contact` varchar(100) DEFAULT NULL,
  `poste_contact` varchar(200) DEFAULT NULL,
  `email_contact` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contact_client`
--

INSERT INTO `contact_client` (`id_contact_client`, `id_client`, `nom_contact`, `telephone_contact`, `poste_contact`, `email_contact`) VALUES
(1, 1, 'Grady', '+243834334432', 'Sec', 'grady@gmail.com'),
(2, 1, 'Elie', '+243834334232', 'Pdg', 'elie@gmail.com');

-- --------------------------------------------------------

--
-- Structure de la table `etat_traceur`
--

CREATE TABLE `etat_traceur` (
  `id_etat_traceur` int(11) NOT NULL,
  `nom_etat_traceur` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etat_traceur`
--

INSERT INTO `etat_traceur` (`id_etat_traceur`, `nom_etat_traceur`) VALUES
(1, 'Neuf'),
(2, 'Démanteler'),
(5, 'Défectueux'),
(6, 'Suspendu');

-- --------------------------------------------------------

--
-- Structure de la table `model_traceur`
--

CREATE TABLE `model_traceur` (
  `id_model_traceur` int(11) NOT NULL,
  `nom_model` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `model_traceur`
--

INSERT INTO `model_traceur` (`id_model_traceur`, `nom_model`) VALUES
(1, 'Noir'),
(2, 'Gris');

-- --------------------------------------------------------

--
-- Structure de la table `numero`
--

CREATE TABLE `numero` (
  `id_numero` int(11) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `numero`
--

INSERT INTO `numero` (`id_numero`, `numero`, `created_at`) VALUES
(1, '+243896987001', '2024-05-17 10:36:46'),
(2, '+243896987779', '2024-05-17 10:36:46'),
(3, '+2438245554124', '2024-05-17 10:36:46');

-- --------------------------------------------------------

--
-- Structure de la table `operations`
--

CREATE TABLE `operations` (
  `id_operations` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `site` varchar(200) DEFAULT NULL,
  `id_superviseur` int(11) NOT NULL,
  `id_technicien` int(11) DEFAULT NULL,
  `date_operation` date NOT NULL DEFAULT current_timestamp(),
  `id_type_operations` int(11) DEFAULT NULL,
  `id_traceur` int(11) DEFAULT NULL,
  `probleme` varchar(255) DEFAULT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `kilometre` decimal(10,0) DEFAULT NULL,
  `tension` varchar(40) DEFAULT NULL,
  `photo_plaque` longtext DEFAULT NULL,
  `photo_traceur` longtext DEFAULT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `operations`
--

INSERT INTO `operations` (`id_operations`, `id_client`, `site`, `id_superviseur`, `id_technicien`, `date_operation`, `id_type_operations`, `id_traceur`, `probleme`, `observation`, `kilometre`, `tension`, `photo_plaque`, `photo_traceur`, `est_supprime`, `created_at`) VALUES
(1, 1, 'Kinkole', 1, NULL, '2024-05-17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2024-05-16 15:43:09'),
(2, 1, '1', 1, 1, '2024-05-21', 1, 1, NULL, NULL, NULL, NULL, '/uploads/1fe577b4b3c3204bae0fa49f041f9320', '/uploads/e70d878e4b456f98055ae5e4c05dcb45', 0, '2024-05-20 13:58:20');

-- --------------------------------------------------------

--
-- Structure de la table `options`
--

CREATE TABLE `options` (
  `id_options` int(11) NOT NULL,
  `nom_options` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `options`
--

INSERT INTO `options` (`id_options`, `nom_options`) VALUES
(1, 'Clients'),
(2, 'Traceurs'),
(3, 'Opérations'),
(4, 'Utilisateurs');

-- --------------------------------------------------------

--
-- Structure de la table `optionsitem`
--

CREATE TABLE `optionsitem` (
  `id_optionsItem` int(11) NOT NULL,
  `id_options` int(11) NOT NULL,
  `nom_item` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `optionsitem`
--

INSERT INTO `optionsitem` (`id_optionsItem`, `id_options`, `nom_item`) VALUES
(1, 1, 'Créer un nouveau client'),
(2, 1, 'Liste des clients'),
(3, 2, 'Liste des traceurs'),
(4, 2, 'Nouveau traceur'),
(5, 3, 'Liste des opérations'),
(6, 3, 'Nouvelle opération'),
(9, 4, 'Liste des utilisateurs'),
(10, 4, 'Nouveau utilisateur');

-- --------------------------------------------------------

--
-- Structure de la table `site`
--

CREATE TABLE `site` (
  `id_site` int(11) NOT NULL,
  `nom_site` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `site`
--

INSERT INTO `site` (`id_site`, `nom_site`) VALUES
(1, 'Kinkole');

-- --------------------------------------------------------

--
-- Structure de la table `traceur`
--

CREATE TABLE `traceur` (
  `id_traceur` int(11) NOT NULL,
  `model` varchar(200) DEFAULT NULL,
  `commentaire` varchar(255) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL,
  `numero_serie` varchar(200) NOT NULL,
  `id_etat_traceur` int(11) DEFAULT NULL,
  `date_entree` timestamp NOT NULL DEFAULT current_timestamp(),
  `observation` varchar(255) DEFAULT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `traceur`
--

INSERT INTO `traceur` (`id_traceur`, `model`, `commentaire`, `id_client`, `numero_serie`, `id_etat_traceur`, `date_entree`, `observation`, `est_supprime`) VALUES
(1, '2', NULL, NULL, 'D09', 1, '2024-05-16 14:24:04', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `type_operations`
--

CREATE TABLE `type_operations` (
  `id_type_operations` int(11) NOT NULL,
  `nom_type_operations` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_operations`
--

INSERT INTO `type_operations` (`id_type_operations`, `nom_type_operations`) VALUES
(1, 'Installation'),
(2, 'Transfert'),
(3, 'Démantèlement'),
(4, 'Contrôle technique'),
(5, 'Remplacement');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'Ndambi', 'achandambi@gmail.com', '$2a$10$lQti3gk3E4BcoCgLTogsFuw0nfn27fpmoPkzPyhfQl2O6ZlgbT5DG', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `vehicule`
--

CREATE TABLE `vehicule` (
  `id_vehicule` int(11) NOT NULL,
  `nom_vehicule` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `vehicule`
--

INSERT INTO `vehicule` (`id_vehicule`, `nom_vehicule`, `created_at`) VALUES
(1, 'Toyota', '2024-05-16 15:22:44'),
(2, 'Ford', '2024-05-16 15:22:44'),
(3, 'Volkswagen', '2024-05-16 15:22:44'),
(4, 'Chevrolet', '2024-05-16 15:22:44'),
(5, 'Nissan', '2024-05-16 15:22:44'),
(6, 'Honda', '2024-05-16 15:24:24'),
(7, 'BMW', '2024-05-16 15:24:24'),
(8, 'Mercedes-Benz', '2024-05-16 15:24:24'),
(9, 'Audi', '2024-05-16 15:24:24'),
(10, 'Hyundai', '2024-05-16 15:26:10'),
(11, 'Kia', '2024-05-16 15:26:10'),
(12, 'Subaru', '2024-05-16 15:26:10'),
(13, 'Tesla', '2024-05-16 15:26:10'),
(18, 'Jeep', '2024-05-16 15:29:09'),
(19, 'Mazda', '2024-05-16 15:29:09'),
(20, 'Lexus', '2024-05-16 15:29:09'),
(21, 'Fiat', '2024-05-16 15:29:09'),
(22, 'Volvo', '2024-05-16 15:29:09'),
(23, 'Porsche', '2024-05-16 15:29:58'),
(24, 'Land Rover', '2024-05-16 15:29:58');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `affectations`
--
ALTER TABLE `affectations`
  ADD PRIMARY KEY (`id_affectation`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id_client`);

--
-- Index pour la table `contact_client`
--
ALTER TABLE `contact_client`
  ADD PRIMARY KEY (`id_contact_client`);

--
-- Index pour la table `etat_traceur`
--
ALTER TABLE `etat_traceur`
  ADD PRIMARY KEY (`id_etat_traceur`);

--
-- Index pour la table `model_traceur`
--
ALTER TABLE `model_traceur`
  ADD PRIMARY KEY (`id_model_traceur`);

--
-- Index pour la table `numero`
--
ALTER TABLE `numero`
  ADD PRIMARY KEY (`id_numero`);

--
-- Index pour la table `operations`
--
ALTER TABLE `operations`
  ADD PRIMARY KEY (`id_operations`);

--
-- Index pour la table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id_options`);

--
-- Index pour la table `optionsitem`
--
ALTER TABLE `optionsitem`
  ADD PRIMARY KEY (`id_optionsItem`),
  ADD KEY `id_options` (`id_options`);

--
-- Index pour la table `site`
--
ALTER TABLE `site`
  ADD PRIMARY KEY (`id_site`);

--
-- Index pour la table `traceur`
--
ALTER TABLE `traceur`
  ADD PRIMARY KEY (`id_traceur`);

--
-- Index pour la table `type_operations`
--
ALTER TABLE `type_operations`
  ADD PRIMARY KEY (`id_type_operations`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `vehicule`
--
ALTER TABLE `vehicule`
  ADD PRIMARY KEY (`id_vehicule`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `affectations`
--
ALTER TABLE `affectations`
  MODIFY `id_affectation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `contact_client`
--
ALTER TABLE `contact_client`
  MODIFY `id_contact_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `etat_traceur`
--
ALTER TABLE `etat_traceur`
  MODIFY `id_etat_traceur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `model_traceur`
--
ALTER TABLE `model_traceur`
  MODIFY `id_model_traceur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `numero`
--
ALTER TABLE `numero`
  MODIFY `id_numero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `operations`
--
ALTER TABLE `operations`
  MODIFY `id_operations` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `options`
--
ALTER TABLE `options`
  MODIFY `id_options` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `optionsitem`
--
ALTER TABLE `optionsitem`
  MODIFY `id_optionsItem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `site`
--
ALTER TABLE `site`
  MODIFY `id_site` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `traceur`
--
ALTER TABLE `traceur`
  MODIFY `id_traceur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `type_operations`
--
ALTER TABLE `type_operations`
  MODIFY `id_type_operations` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `vehicule`
--
ALTER TABLE `vehicule`
  MODIFY `id_vehicule` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `optionsitem`
--
ALTER TABLE `optionsitem`
  ADD CONSTRAINT `optionsitem_ibfk_1` FOREIGN KEY (`id_options`) REFERENCES `options` (`id_options`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
