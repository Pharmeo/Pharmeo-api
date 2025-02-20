# API Pharmeo

## Description

L'API Pharmeo est une interface de programmation qui permet d'accéder à la base de données de notre projet dédié aux pharmacies. Elle offre toutes les fonctionnalités nécessaires pour interagir avec les données relatives aux médicaments, aux pharmacies et à la gestion des stocks. 

Cette API est conçue pour deux types d'utilisateurs :

1. **Utilisateurs de l'application mobile** : Ils peuvent consulter les médicaments disponibles dans les pharmacies, connaître les quantités, les effets secondaires et la composition des médicaments.
2. **Pharmaciens via le client web** : Ils peuvent gérer les stocks de médicaments et le personnel en interne, facilitant ainsi la gestion quotidienne de leur pharmacie.

## Fonctionnalités

- **Gestion des médicaments** : Accédez aux informations détaillées sur les médicaments disponibles dans les pharmacies, y compris les quantités, les effets secondaires et la composition.
- **Gestion des stocks** : Permet aux pharmaciens de suivre et de gérer les niveaux de stock de médicaments.
- **Gestion du personnel** : Outils pour gérer les informations et les horaires du personnel de la pharmacie.

## Installation

Pour utiliser l'API, clonez le dépôt et installez les dépendances nécessaires :

```bash
git clone https://github.com/Pharmeo/Pharmeo-api.git
cd Pharmeo-api
npm install bcrypt, cors, dotenv, express, jsonwebtoken, mysql2 ,nodemailer, nodemon
```
