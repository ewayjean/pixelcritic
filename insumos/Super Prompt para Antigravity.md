Hola Antigravity. Eres mi Lead Developer y vamos a terminar el desarrollo de la web "PixelCritique", un sitio de reseñas de videojuegos.

He preparado el entorno y tienes un archivo index.html que sirve como prototipo funcional de una sola página (SPA). También tienes un archivo AGENTS.md que define las restricciones de nuestro stack (HTML, Tailwind CDN, Vanilla JS, Firebase).

Nuestro objetivo final es tener el proyecto listo para ser subido a un repositorio de GitHub y desplegado como un sitio estático en Vercel o Railway.

Por favor, ejecuta las siguientes tareas en orden. Antes de escribir código, genera un **Artifact con el Plan de Implementación** para que yo lo apruebe.

### **FASE 1: Modularización y Setup**

El proyecto actualmente es un solo archivo index.html enorme.

1. Evalúa si es mejor mantenerlo como un solo archivo o separarlo (ej. index.html, style.css, app.js, firebase-config.js).  
2. Si decides separarlo, usa tus capacidades de terminal para crear la estructura de carpetas necesaria, mover el código y actualizar las referencias.  
3. Asegúrate de que el código base siga funcionando perfectamente después de la refactorización.

### **FASE 2: Desarrollo de Nuevas Secciones**

El index.html tiene marcadores de posición (Placeholders) para ciertas secciones. Necesito que las desarrolles:

1. **Sección "Noticias"**: Crea el HTML y JS necesario para mostrar una cuadrícula de noticias de gaming. Por ahora, genera 3-4 noticias de prueba (Hardcoded en JS) con una imagen, título, fecha y extracto. Mantén el estilo glassmorphism.  
2. **Sección "Comunidad / Foro"**: Agrega una nueva sección en la navegación y en el cuerpo principal que actúe como un landing para la comunidad. Debe tener un llamado a la acción (Call to Action) muy visual que invite a unirse a un servidor de Discord ficticio.

### **FASE 3: Refinamiento de la Base de Datos (Firebase)**

1. Revisa la lógica actual de Firebase en el código JS.  
2. Asegúrate de que el formulario de "Nueva Reseña" valide correctamente los datos antes de enviarlos a Firestore.  
3. Implementa manejo de errores robusto. Si Firestore falla por falta de permisos o configuración, la aplicación no debe romperse; debe mostrar una alerta de UI (usa el modal de alerta existente) explicando el problema amigablemente.

### **FASE 4: Preparación para Despliegue (Vercel/GitHub)**

1. Crea un archivo README.md detallado para el repositorio de GitHub. Debe incluir:  
   * Descripción del proyecto.  
   * Stack tecnológico.  
   * Instrucciones de cómo ejecutarlo localmente.  
   * Instrucciones claras de qué variables de entorno (o configuración de Firebase) se necesitan para que funcione en producción.

**Instrucción Final para ti (Agente):**

Comienza analizando los archivos actuales en el workspace y genera el **Artifact del Plan de Implementación** para la Fase 1 y 2\. Detente y espera mi confirmación ("Adelante") antes de empezar a modificar los archivos.