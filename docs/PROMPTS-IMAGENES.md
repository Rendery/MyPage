# Prompts para generar mis fotos realistas con ChatGPT

La web ya espera estas imágenes. Mientras no existan, muestra un personaje ilustrado de reemplazo.
Cuando las tengas, guárdalas **con estos nombres exactos** en `public/images/avatar/` y aparecerán solas.
El efecto 2.5D (profundidad, parallax, inclinación con el mouse o el giroscopio) lo pone la web: las fotos solo necesitan ser realistas, de cuerpo completo y con fondo transparente.

| Archivo | Dónde aparece | Formato |
|---|---|---|
| `hero.png` | Portada (cuerpo completo, con parallax) | Vertical 2:3 (1024×1536), fondo transparente |
| `pointing.png` | Sección del fotocheck, señalándolo | Vertical 2:3, fondo transparente |
| `coding.png` | Sección IA (Claude Code / Codex) | Cuadrada 1:1 (1024×1024), fondo transparente |
| `celebrate.png` | Contacto / cuando "te contratan" | Vertical 2:3, fondo transparente |
| `badge-photo.png` | Foto dentro del fotocheck 3D | Cuadrada 1:1, fondo gris claro liso |

## Cómo hacerlo

1. Abre un chat **nuevo** en ChatGPT y adjunta tu foto (`docs/foto-referencia.png` o `Fotos carnet/Foto carnet de frente.png`).
2. Pega el **Prompt 1** y genera `hero.png`. Repite hasta que el parecido te convenza: es la imagen "maestra".
3. Para las demás, **en el mismo chat**, adjunta tu foto **y** la imagen maestra, y pega el prompt correspondiente. Así sales igual en todas (misma ropa, misma luz).
4. Si sale un fondo a cuadros "falso" en lugar de transparente: pide *"vuelve a exportarla como PNG con canal alfa real"*, o quítale el fondo con **Paint de Windows 11 → Quitar fondo**.
5. Revisa que se vean **los pies completos** (apareces de cuerpo entero en la web).
6. Corre `python scripts/optimize_avatars.py` para crear las versiones WebP livianas (la web usa esas) y la imagen para redes `og.jpg`.

### Si el resultado no convence

- **No se parece a ti:** *"Mantén exactamente mi rostro de la foto adjunta; solo cambia la ropa, la pose y el fondo."*
- **Piel de plástico o demasiado retocada:** *"Textura de piel natural, con poros, sin suavizado ni retoque excesivo."*
- **Se ve dibujado o en 3D animado:** *"Debe parecer una fotografía real tomada con cámara, no una ilustración ni un render."*
- **Manos raras:** *"Corrige las manos: cinco dedos, proporciones naturales."*

---

## Bloque de estilo (ya va incluido en cada prompt)

> Usa la foto adjunta como referencia: tengo que ser claramente yo, con mi rostro real sin alterar (forma de la cara, ojos, cejas, nariz, boca, cabello negro corto con volumen peinado hacia un lado, tono de piel y barba ligera). Estilo fotografía realista de estudio profesional: proporciones humanas reales, textura de piel natural, nitidez alta, nada de caricatura, ilustración ni render 3D animado. Iluminación de estudio suave, con una luz de borde cian sutil por la izquierda y una luz cálida por la derecha. Cámara a la altura de la cintura, lente de 50 mm. Look de profesional joven, geek, cumplidor y responsable: casaca con capucha azul marino oscuro abierta sobre una camisa blanca a cuadros finos, jean oscuro, zapatillas blancas con detalles verde lima, reloj inteligente y un lanyard verde lima del que cuelga un fotocheck en blanco.

---

## Prompt 1 — `hero.png` (portada, imagen maestra)

```
Usa la foto adjunta como referencia: tengo que ser claramente yo, con mi rostro real sin alterar (forma de la cara, ojos, cejas, nariz, boca, cabello negro corto con volumen peinado hacia un lado, tono de piel y barba ligera). Estilo fotografía realista de estudio profesional: proporciones humanas reales, textura de piel natural, nitidez alta, nada de caricatura, ilustración ni render 3D animado. Iluminación de estudio suave, con una luz de borde cian sutil por la izquierda y una luz cálida por la derecha. Cámara a la altura de la cintura, lente de 50 mm. Look de profesional joven, geek, cumplidor y responsable: casaca con capucha azul marino oscuro abierta sobre una camisa blanca a cuadros finos, jean oscuro, zapatillas blancas con detalles verde lima, reloj inteligente y un lanyard verde lima del que cuelga un fotocheck en blanco.

Pose: de pie, cuerpo en tres cuartos mirando a la cámara, saludando con la mano derecha levantada y con una laptop cerrada bajo el brazo izquierdo. Expresión amable, segura y confiable.

Toma de cuerpo completo de la cabeza a los pies, sin cortar los pies, centrado y con un poco de margen. Formato vertical 2:3 (1024x1536). Fondo transparente (PNG con canal alfa), sin sombra en el piso, sin texto, sin logos, sin marcas de agua.
```

## Prompt 2 — `pointing.png` (sección del fotocheck)

```
Misma persona, misma ropa y misma iluminación que la imagen maestra adjunta; respeta también mi rostro real de la foto. Fotografía realista de estudio, proporciones humanas reales, textura de piel natural, nada de ilustración ni render.

Pose: de pie, cuerpo completo, ligeramente girado hacia la derecha de la imagen, señalando con el brazo derecho extendido hacia la DERECHA de la imagen, como presentando algo con orgullo. Con la otra mano sostiene su lanyard. Sonrisa entusiasta y natural.

Toma de cuerpo completo de la cabeza a los pies, sin cortar los pies. Formato vertical 2:3 (1024x1536). Fondo transparente (PNG con canal alfa), sin sombra en el piso, sin texto, sin logos, sin marcas de agua.
```

## Prompt 3 — `coding.png` (sección de IA)

```
Misma persona, misma ropa y misma iluminación que la imagen maestra adjunta; respeta también mi rostro real de la foto. Fotografía realista de estudio, proporciones humanas reales, textura de piel natural, nada de ilustración ni render.

Pose: sentado en un puf gris oscuro, con una laptop abierta sobre las piernas, escribiendo concentrado y con una sonrisa leve. La luz fría de la pantalla ilumina suavemente su rostro. Sin hologramas ni efectos de ciencia ficción.

Toma de cuerpo completo, con el puf y los pies visibles. Formato cuadrado 1:1 (1024x1024). Fondo transparente (PNG con canal alfa), sin sombra en el piso, sin texto legible, sin logos, sin marcas de agua.
```

## Prompt 4 — `celebrate.png` (contacto / "contratado")

```
Misma persona, misma ropa y misma iluminación que la imagen maestra adjunta; respeta también mi rostro real de la foto. Fotografía realista de estudio, proporciones humanas reales, textura de piel natural, nada de ilustración ni render.

Pose: de pie, cuerpo completo, celebrando: un pulgar arriba hacia la cámara y la otra mano sosteniendo el fotocheck del lanyard para mostrarlo. Expresión feliz y agradecida, como quien acaba de ser contratado.

Toma de cuerpo completo de la cabeza a los pies, sin cortar los pies. Formato vertical 2:3 (1024x1536). Fondo transparente (PNG con canal alfa), sin sombra en el piso, sin texto, sin logos, sin marcas de agua.
```

## Prompt 5 — `badge-photo.png` (foto del fotocheck)

```
Misma persona que la imagen maestra adjunta; respeta mi rostro real de la foto. Fotografía realista.

Foto tipo fotocheck corporativo: busto (de los hombros hacia arriba), mirando de frente a la cámara, sonrisa profesional, camisa blanca a cuadros finos con la casaca azul marino. Iluminación de estudio suave y pareja, textura de piel natural.

Formato cuadrado 1:1 (1024x1024). Fondo gris claro liso (#E9ECF1), sin texto, sin logos, sin marcas de agua.
```

---

### Opcional — variante con lentes

Si quieres un look más geek, agrega al final de cualquier prompt:

```
Agrega lentes de montura delgada negra, rectangulares, sin alterar el resto del rostro.
```

Si lo haces, úsalo en **todas** las imágenes para que salgas igual en todas.

### Peso de las imágenes

Antes de subir a producción, comprime cada PNG (por ejemplo con squoosh.app → OxiPNG o WebP). Intenta que cada una pese menos de 400 KB.
