-- MySQL dump 10.13  Distrib 8.4.7, for Win64 (x86_64)
--
-- Host: localhost    Database: safeserve_db
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `safeserve_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `safeserve_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `safeserve_db`;

--
-- Table structure for table `auditorias`
--

DROP TABLE IF EXISTS `auditorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditorias` (
  `id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `establecimiento_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plantilla_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_auditoria` datetime DEFAULT CURRENT_TIMESTAMP,
  `puntuacion_cumplimiento` int DEFAULT NULL,
  `progreso` int DEFAULT '0',
  `sincronizado_servidor` tinyint(1) DEFAULT '0',
  `observaciones_generales` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `establecimiento_id` (`establecimiento_id`),
  KEY `plantilla_id` (`plantilla_id`),
  CONSTRAINT `auditorias_ibfk_1` FOREIGN KEY (`establecimiento_id`) REFERENCES `establecimientos` (`id`),
  CONSTRAINT `auditorias_ibfk_2` FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditorias`
--

LOCK TABLES `auditorias` WRITE;
/*!40000 ALTER TABLE `auditorias` DISABLE KEYS */;
INSERT INTO `auditorias` VALUES ('AUD-84F8C980','LOC-003','TMPL-2','2026-02-12 18:54:54',0,0,0,NULL),('AUD-C9622299','LOC-001','TMPL-2','2026-02-14 22:43:20',100,100,0,NULL);
/*!40000 ALTER TABLE `auditorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `establecimientos`
--

DROP TABLE IF EXISTS `establecimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `establecimientos` (
  `id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gerente` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `riesgo_actual` int DEFAULT '0',
  `inspecciones_abiertas` int DEFAULT '0',
  `estado` enum('ACTIVE','FLAGGED','SUSPENDED') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `coord_x` decimal(5,2) DEFAULT NULL,
  `coord_y` decimal(5,2) DEFAULT NULL,
  `ultima_inspeccion` datetime DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_riesgo` (`riesgo_actual`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establecimientos`
--

LOCK TABLES `establecimientos` WRITE;
/*!40000 ALTER TABLE `establecimientos` DISABLE KEYS */;
INSERT INTO `establecimientos` VALUES ('LOC-001','Bistro del Centro','Calle Mayor 123','Alex Rivera',78,4,'FLAGGED',45.00,30.00,NULL,'2026-02-06 23:01:22'),('LOC-002','Airport Express','Terminal 4','Sara Chen',12,0,'ACTIVE',80.00,15.00,NULL,'2026-02-06 23:01:22'),('LOC-003','Parrilla del Puerto','Muelle 39','Marcos Thompson',45,2,'ACTIVE',20.00,70.00,NULL,'2026-02-06 23:01:22'),('LOC-004','Pizzería Urbana','Av. Las Palmeras 88','Lisa G.',89,7,'FLAGGED',65.00,60.00,NULL,'2026-02-06 23:01:22'),('LOC-0DB','Establecimiento 5','Avenida Brasil 550',NULL,0,0,'ACTIVE',NULL,NULL,NULL,'2026-02-12 05:39:08');
/*!40000 ALTER TABLE `establecimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evidencias`
--

DROP TABLE IF EXISTS `evidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `auditoria_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_archivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_archivo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp_captura` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `auditoria_id` (`auditoria_id`),
  CONSTRAINT `evidencias_ibfk_1` FOREIGN KEY (`auditoria_id`) REFERENCES `auditorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidencias`
--

LOCK TABLES `evidencias` WRITE;
/*!40000 ALTER TABLE `evidencias` DISABLE KEYS */;
INSERT INTO `evidencias` VALUES (15,'AUD-C9622299','https://res.cloudinary.com/db7yow6a6/image/upload/v1771127013/caedlxbmmhmniwhffqgo.jpg','image/jpeg','2026-02-15 03:43:34');
/*!40000 ALTER TABLE `evidencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hallazgos`
--

DROP TABLE IF EXISTS `hallazgos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hallazgos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `auditoria_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `evidencia_id` int NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `prioridad` enum('LOW','MEDIUM','HIGH','CRITICAL') COLLATE utf8mb4_unicode_ci DEFAULT 'MEDIUM',
  `accion_correctiva` text COLLATE utf8mb4_unicode_ci,
  `esta_resuelto` tinyint(1) DEFAULT '0',
  `fecha_hallazgo` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `auditoria_id` (`auditoria_id`),
  KEY `evidencia_id` (`evidencia_id`),
  CONSTRAINT `hallazgos_ibfk_1` FOREIGN KEY (`auditoria_id`) REFERENCES `auditorias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hallazgos_ibfk_2` FOREIGN KEY (`evidencia_id`) REFERENCES `evidencias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hallazgos`
--

LOCK TABLES `hallazgos` WRITE;
/*!40000 ALTER TABLE `hallazgos` DISABLE KEYS */;
INSERT INTO `hallazgos` VALUES (46,'AUD-C9622299',15,'Higiene Alimentaria','Bolsas de alimentos (aparentemente vegetales frescos) almacenadas directamente en el suelo debajo de las estanterías, lo que contraviene las normas de higiene y aumenta el riesgo de contaminación por suciedad, plagas o salpicaduras.','HIGH','Elevar todos los alimentos almacenados al menos 15 cm (6 pulgadas) del suelo utilizando estanterías o tarimas limpias y aprobadas para el contacto con alimentos.',0,'2026-02-15 08:43:47');
/*!40000 ALTER TABLE `hallazgos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantilla_items`
--

DROP TABLE IF EXISTS `plantilla_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantilla_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plantilla_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tarea` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_critico` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `plantilla_id` (`plantilla_id`),
  CONSTRAINT `plantilla_items_ibfk_1` FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantilla_items`
--

LOCK TABLES `plantilla_items` WRITE;
/*!40000 ALTER TABLE `plantilla_items` DISABLE KEYS */;
INSERT INTO `plantilla_items` VALUES (1,'TMPL-1','Juntas de puertas limpias y herméticas',0),(2,'TMPL-1','Suelo libre de residuos',0),(3,'TMPL-1','Temperatura ambiente < 4°C',1),(4,'TMPL-2','Aves crudas en el estante inferior',1),(5,'TMPL-2','Separación de alimentos listos para consumo',1),(6,'TMPL-3','Jabón y toallas disponibles',1),(7,'TMPL-1','Alimentos a 15cm del suelo',1),(8,'TMPL-1','Sin óxido en el interior',1),(9,'TMPL-2','Recipientes cubiertos',0),(10,'TMPL-2','Sin goteos',0),(11,'TMPL-2','Etiquetado de fechas correcto',1),(12,'TMPL-3','Accesible y sin obstáculos',0),(13,'TMPL-3','Agua fría/caliente operativa',0),(14,'TMPL-3','Papelera disponible',1),(15,'TMPL-3','Señalización visible',0),(16,'TMPL-4','Redes para el cabello puestas',1),(17,'TMPL-4','Sin joyas en manos',0),(18,'TMPL-4','Delantales limpios',1),(19,'TMPL-4','Cambio de guantes frecuente',0),(20,'TMPL-4','No comer en área de preparación',1);
/*!40000 ALTER TABLE `plantilla_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantillas`
--

DROP TABLE IF EXISTS `plantillas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantillas` (
  `id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantillas`
--

LOCK TABLES `plantillas` WRITE;
/*!40000 ALTER TABLE `plantillas` DISABLE KEYS */;
INSERT INTO `plantillas` VALUES ('TMPL-1','Higiene de Cámara Frigorífica','Almacenamiento',NULL),('TMPL-2','Separación de Carnes Crudas','Seguridad',NULL),('TMPL-3','Control de Lavado de Manos','Limpieza',NULL),('TMPL-4','EPP del Personal','Personal',NULL);
/*!40000 ALTER TABLE `plantillas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','Acceso total al sistema',1),(2,'INSPECTOR','Acceso básico al sistema',1),(3,'GERENTE','Acceso a reportes y gestión avanzada',1);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'admin','admin@empresa.com','$2a$10$neJ49B5F/bS/3BmoAuEOGe/YEUgRroeWGaxJTC.f5n8RJVZhXY2OG','Miguel','Moreno',NULL,1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_rol`
--

DROP TABLE IF EXISTS `usuario_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_rol` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `rol_id` bigint NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuario_rol_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuario_rol_ibfk_2` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_rol`
--

LOCK TABLES `usuario_rol` WRITE;
/*!40000 ALTER TABLE `usuario_rol` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vista_resumen_riesgo`
--

DROP TABLE IF EXISTS `vista_resumen_riesgo`;
/*!50001 DROP VIEW IF EXISTS `vista_resumen_riesgo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_resumen_riesgo` AS SELECT 
 1 AS `nombre`,
 1 AS `riesgo_actual`,
 1 AS `total_inspecciones`,
 1 AS `promedio_historico`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'safeserve_db'
--

--
-- Dumping routines for database 'safeserve_db'
--

--
-- Current Database: `safeserve_db`
--

USE `safeserve_db`;

--
-- Final view structure for view `vista_resumen_riesgo`
--

/*!50001 DROP VIEW IF EXISTS `vista_resumen_riesgo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY INVOKER */
/*!50001 VIEW `vista_resumen_riesgo` AS select `e`.`nombre` AS `nombre`,`e`.`riesgo_actual` AS `riesgo_actual`,count(`a`.`id`) AS `total_inspecciones`,avg(`a`.`puntuacion_cumplimiento`) AS `promedio_historico` from (`establecimientos` `e` left join `auditorias` `a` on((`e`.`id` = `a`.`establecimiento_id`))) group by `e`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-16 17:53:24
