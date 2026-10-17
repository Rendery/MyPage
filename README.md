# Edery Abanto · CV web interactivo

Portafolio y CV web en una sola página: personaje 2.5D de cuerpo completo, fotocheck 3D con físicas que se personaliza con el nombre de la empresa, demos interactivas de proyectos reales y motion design.

Hecho con **Angular 19** (signals, componentes standalone), **GSAP** (ScrollTrigger, SplitText, Flip, Draggable) y **Lenis** para el scroll suave.

## Dos versiones: simple y técnica

La web tiene un interruptor **Simple / Técnico** en la barra superior.

- **Simple** (por defecto): sin palabras técnicas, con escenas animadas de lo que puedo hacer por un negocio (bots, apps, automatización y el caso real de boletas). Pensada para RR. HH., dueños de negocio o cualquier persona.
- **Técnico**: stack, terminal con Claude Code / Codex, tecnologías por proyecto e IDs de certificados.

Se puede enviar el enlace directo a cada versión:

```
https://TU-DOMINIO/?modo=simple
https://TU-DOMINIO/?modo=tecnico
```

La elección se recuerda en el navegador del visitante. Los textos simples están junto a los técnicos en `src/app/data/profile.data.ts` (campos `simple…`).

## Desarrollo

```bash
npm install
npm start          # http://localhost:4200
npm run build      # salida en dist/my-page/browser
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Todos los datos del CV (experiencia, proyectos, stack, certificaciones, contacto) | `src/app/data/profile.data.ts` |
| Sesiones de ejemplo de la terminal de IA | `src/app/components/ai-lab/ai-scripts.ts` |
| Colores, tipografías y tema claro/oscuro | `src/styles.scss` |
| CV en PDF que se descarga | `public/cv/Edery_Abanto_CV.pdf` |

## Imágenes del personaje

Si falta alguna imagen, la web muestra un personaje vectorial de reemplazo.
Para usar las tuyas, genera las imágenes con los prompts de [`docs/PROMPTS-IMAGENES.md`](docs/PROMPTS-IMAGENES.md) y guárdalas en `public/images/avatar/` con estos nombres:

- `hero.png`: portada
- `pointing.png`: sección del fotocheck
- `coding.png`: sección de IA
- `celebrate.png`: contacto y botón "Contratar"
- `badge-photo.png`: foto dentro del fotocheck (si falta, muestra las iniciales)

Después de agregar o reemplazar un PNG, genera las versiones livianas (WebP) y la imagen para redes (`og.jpg`):

```bash
python scripts/optimize_avatars.py
```

La web carga primero el `.webp` y, si no existe, el `.png`. Si reemplazas un PNG y no corres el script, se seguirá viendo el WebP anterior.

## Enlace personalizado para reclutadores

El fotocheck lee la URL, así que puedes enviar un enlace ya personalizado:

```
https://TU-DOMINIO/?empresa=Interbank&color=00A86B&rol=1#fotocheck
```

- `empresa`: nombre que aparece en el fotocheck y en el cordón.
- `color`: color de la marca en hexadecimal, sin `#`.
- `rol`: `0` Practicante de Software · `1` Desarrollador Full Stack · `2` QA y Automatización · `3` Automatización e IA.

El botón **Compartir** de la sección genera este enlace automáticamente.

## Interacciones

- **Escritorio:** cursor personalizado, parallax con el mouse, tarjetas con inclinación 3D, botones magnéticos, paleta de comandos (`Ctrl/⌘ + K` o `/`).
- **Móvil:** dock de navegación inferior, parallax con el giroscopio (en iOS se activa con un botón), fotocheck arrastrable con el dedo y vibración en Android.
- **Easter egg:** código Konami (↑ ↑ ↓ ↓ ← → ← → B A).
- Respeta `prefers-reduced-motion`: sin scroll suave ni animaciones si el sistema lo pide.
