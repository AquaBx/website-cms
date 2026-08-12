#import "@preview/fontawesome:0.6.2": fa-icon

// ============================
// Palette de couleurs — Bleu
// ============================
#let title_color = rgb("#0f172a")  // Slate 900 (Titres majeurs, structure)
#let primary_color = rgb("#2563eb")  // Royal Blue 600 (Accents principaux)
#let accent_color = rgb("#3b82f6")  // Blue 500 (Dates, liens)
#let accent_light = rgb("#bfdbfe")  // Blue 200 (Bordures, séparateurs légers)
#let bg_tint = rgb("#f8fafc")  // Slate 50 (Fond très doux pour tags/cartouches)
#let tag_border = rgb("#e2e8f0")  // Slate 200 (Bordure fine pour tags)
#let text_color = rgb("#334155")  // Slate 700 (Texte principal haute lisibilité)
#let text_muted = rgb("#64748b")  // Slate 500 (Texte secondaire/sous-titres)
#let text_light = rgb("#ffffff")  // Blanc pur

#let tag(item) = {
  box(
  inset: (x: 6pt, y: 3pt),
  fill: bg_tint,
  stroke: 0.5pt + tag_border,
  radius: 4pt,
  outset: 0pt,
  baseline: 20%,
    grid(
                columns: 2,
                gutter: 3pt,
                align: horizon,
                // Centre verticalement l'icône et le texte
                fa-icon(lower(item.icon), solid: true, fill: primary_color, size: 7pt),
                text(size: 7.5pt, weight: "semibold", fill: title_color)[#item.name],
    ),
  )
}

#let header(avatar, name, header_text, socials) = {
  block(
    width: 100%,
    inset: 0.5cm,
    fill: title_color,
    // radius: (left: 50%),
    [
      #set text(fill: text_light)
      #grid(
        columns: (auto, 1fr),
        gutter: 20pt,
        align: (center + horizon, left + horizon),
        // Avatar
        block(
          width: 4cm,
          height: 4cm,
          radius: 50%,
          stroke: 0.1cm + title_color.darken(15%),
          clip: true,
          [
            #place(top + left, dx: avatar.dx, dy: avatar.dy, scale(
              x: avatar.scale * 100%,
              y: avatar.scale * 100%,
              image(avatar.url, width: 100%, height: 100%, fit: "cover"),
            ))
          ],
        ),
        // Informations principales
        [
          #text(size: 20pt, weight: "bold", tracking: 1pt, fill: white)[
            #upper(name)
          ]
          // #v(4pt)
          // #text(size: 10pt, weight: "medium", fill: accent_light, tracking: 1.5pt)[
          //   #upper(header_text)
          // ]
          #v(-8pt)

          #stack(
            dir: ltr,
            spacing: 20pt,
            ..socials.map(social => [
              #fa-icon(lower(social.icon), solid: true, fill: accent_light, size: 9pt)
              #h(3pt)
              #link(social.link)[#text(size: 8.5pt, fill: text_light)[#social.name]]
            ])
          )
        ],
      )
    ],
  )
}

#let section_title(title) = {
  text(size: 11.5pt, weight: "bold", fill: title_color, tracking: 0.8pt)[
    #upper(title)
  ]
  v(-6pt)
  grid(
    columns: (40pt, 1fr),
    gutter: 0pt,
    line(length: 100%, stroke: 2pt + accent_color), line(length: 100%, stroke: 0.8pt + accent_light),
  )
  v(-4pt)
}


// ============================
// Élément d'entrée (expérience / projet / etc.)
// ============================
#let entry_item(title, company, address, dates, description, tags) = {
  block(
    width: 100%,
    inset: (y: 5pt),
    [
      // Titre / entreprise à gauche, dates à droite
      #grid(
        columns: (1fr, auto),
        align: (left, right),
        [
          #text(weight: "bold", size: 10pt, fill: title_color, tracking: 0.2pt)[#upper(title)]
          #if company != "" [
            #text(size: 10pt, fill: text_muted)[ "/" ]
            #text(weight: "bold", size: 10pt, fill: primary_color)[#upper(company)]
          ]
        ],
        text(size: 8.5pt, weight: "semibold", fill: accent_color, dates),
      )
      // Localisation
      #if address != "" [
        #v(-2pt)
        #text(size: 8pt, style: "italic", fill: text_muted, address)
      ]
      #v(5pt)
      // Description en liste à puces (tirets)
      #if description != "" and description != none [
        #for line in description.split("\n") [
          #if line.trim() != "" [
            #grid(
              columns: (8pt, 1fr),
              gutter: 5pt,
              text(fill: primary_color, weight: "bold")[–], text(size: 9pt, fill: text_color)[#line.trim()],
            )
            #v(2pt)
          ]
        ]
      ]
      // Tags avec icônes
      #if type(tags) == array and tags.len() > 0 [
        #v(4pt)
        #block[
          #for item in tags [
            #tag(item)
            #h(3pt)
          ]
        ]
      ]
    ],
  )
  v(6pt)
}

