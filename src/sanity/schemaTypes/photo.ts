const photoSchema = {
    name: 'photo',
    title: 'Photo',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
      }
    ]
  }

export default photoSchema