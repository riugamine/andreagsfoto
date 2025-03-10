import { type StructureResolver } from 'sanity/desk'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Photos')
        .child(
          S.documentList()
            .title('Photos')
            .filter('_type == "photo"')
        ),
    ])
