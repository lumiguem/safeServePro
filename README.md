# 🍽️ SafeServePro - Gestión de Auditorías Sanitarias

![GitHub](https://img.shields.io/badge/status-active-success)
![Java](https://img.shields.io/badge/Java-17%2B-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.x-6DB33F)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1)

Proyecto **full stack** para la gestión de auditorías sanitarias en establecimientos de alimentos.

Incluye:

* 🧠 Backend en **Spring Boot (API REST)**
* ⚛️ Frontend en **React + Vite**
* 🗄️ Base de datos **MySQL** (local o Cloud SQL)
* 🤖 Integración con **Gemini API** para análisis de evidencia

---

## 📚 Tabla de Contenidos

* [Requisitos previos](#-requisitos-previos)
* [Instalación](#️-instrucciones-de-instalación)
* [Ejecución](#️-instrucciones-para-ejecutar-el-proyecto)
* [Base de Datos](#️-base-de-datos)
* [Despliegue en Cloud Run](#️-despliegue-en-cloud-run)
* [Notas adicionales](#-notas-adicionales)
* [Autor](#-autor)

---

## ✅ Requisitos previos

Asegúrate de tener instalado:

* **Java 17** o superior
* **Maven 3.9+**
* **Node.js 20+**
* **npm**
* **MySQL 8**
* **Google Cloud SDK (`gcloud`)** (opcional para despliegue)

---

## 🛠️ Instrucciones de instalación

### 1️⃣ Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd safeServePro
```

---

### 2️⃣ Configurar la base de datos

1. Crear una base de datos MySQL (por ejemplo `safeserve_db`)
2. Ejecutar el script SQL del proyecto (`safeserve_db.sql`)
3. Verificar que se creen tablas y datos iniciales

---

### 3️⃣ Configurar el Backend (Spring Boot)

1. Ir a la carpeta del backend
2. Definir variables de entorno necesarias

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://127.0.0.1:3306/safeserve_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="tu_password"
$env:JWT_SECRET_KEY="tu_jwt_secret"
# Opcional (IA)
$env:GEMINI_API_KEY="tu_gemini_api_key"
```

3. Restaurar dependencias y compilar:

```bash
mvn -f backend/pom.xml clean compile
```

---

### 4️⃣ Configurar el Frontend (React)

```bash
npm --prefix frontend install
```

---

## ▶️ Instrucciones para ejecutar el proyecto

### ▶️ Backend

```bash
mvn -f backend/pom.xml spring-boot:run
```

Backend disponible en:

```
http://localhost:8080
```

---

### ▶️ Frontend

```bash
npm --prefix frontend run dev
```

Frontend disponible en:

```
http://localhost:5173
```

---

## 🗃️ Base de Datos

### 📌 Nombre

```
safeserve_db
```

---

### 📌 Tablas principales

* **auditorias**
* **hallazgos**
* **evidencias**
* **establecimientos**
* **plantillas**
* **usuarios / seguridad**

---

### 📌 Datos iniciales

El script SQL incluye datos base para:

* Establecimientos
* Plantillas de auditoría
* Usuarios iniciales

---

## ☁️ Despliegue en Cloud Run

### Backend

```bash
gcloud run deploy safeserve-backend \
  --source backend \
  --project safeservepro \
  --region us-central1 \
  --platform managed
```

### Frontend

```bash
gcloud run deploy safeserve-frontend \
  --source frontend \
  --project safeservepro \
  --region us-central1 \
  --platform managed \
  --set-build-env-vars "VITE_API_BASE_URL=https://TU_BACKEND_URL/api"
```

### Secretos recomendados (Secret Manager)

* `SPRING_DATASOURCE_PASSWORD`
* `JWT_SECRET_KEY`
* `GEMINI_API_KEY`

---

## 📝 Notas adicionales

* Validaciones implementadas en **frontend y backend**
* La API usa autenticación **JWT**
* El módulo de IA depende de una clave válida de **Gemini API**

---

## 👨‍💻 Autor

**Miguel Moreno**
Proyecto SafeServePro

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub.
