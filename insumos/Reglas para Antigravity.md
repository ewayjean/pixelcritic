# **Contexto del Proyecto: PixelCritique**

Este es un proyecto de desarrollo web frontend puro (SPA) para una página de reseñas de videojuegos.

El objetivo final es desplegar este proyecto en Vercel o Railway como una página estática.

## **Stack Tecnológico Requerido**

1. **HTML5**: Semántico y accesible.  
2. **CSS**: Exclusivamente a través de **Tailwind CSS** (vía CDN para este prototipo o configurado vía npm si decides modularizar el proyecto). No usar archivos CSS externos a menos que sea estrictamente necesario para animaciones complejas.  
3. **JavaScript (Vanilla)**: Lógica de la aplicación, manejo del DOM y enrutamiento simple del lado del cliente. NO usar frameworks como React, Vue o Angular.  
4. **Base de Datos / Backend**: **Firebase Firestore**. El proyecto ya usa los SDKs modulares de Firebase v11.

## **Reglas de Arquitectura y Desarrollo para el Agente (CRÍTICO)**

* **Cero Build Steps Complejos**: Si necesitas separar el archivo index.html en múltiples archivos (js, css, html separados), usa un bundler simple como Vite, pero asegúrate de configurar los scripts en package.json adecuadamente y explicárselo al usuario.  
* **Firebase Firestore**:  
  * Nunca uses consultas complejas (orderBy, where múltiple) que requieran índices manuales. Descarga la colección y filtra/ordena en memoria en JavaScript.  
  * Asegúrate de manejar el estado de autenticación anónima antes de leer/escribir en Firestore.  
* **Diseño Responsive**: Todo debe verse perfecto en móvil, tablet y escritorio usando las clases de Tailwind (sm:, md:, lg:).  
* **Estética Gaming**: Mantener la paleta de colores oscura (\#0f172a), gradientes neón, bordes de cristal (glassmorphism) y las tipografías 'Orbitron' e 'Inter'.  
* **Modo Local/Fallback**: El código siempre debe tener un plan B. Si Firebase falla o no hay configuración, la UI debe mostrar datos de prueba (dummy data) y permitir la navegación sin romperse.

## **Flujo de Trabajo Requerido**

1. Antes de ejecutar comandos de terminal o modificar archivos masivamente, debes crear un **Artifact de Plan de Implementación**.  
2. Espera la aprobación del usuario antes de aplicar cambios estructurales grandes.  
3. Usa comandos de terminal (ej. npm init, npm i firebase) solo si decides modularizar el proyecto. Si lo haces, pide permiso primero.