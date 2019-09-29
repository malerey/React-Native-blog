export default formatData = data => {
  const entries = data.items.filter((e, i) => {
    return e.sys.contentType.sys.id === 'blogPost'
  })
  const authors = data.items.filter((e, i) => {
    return e.sys.contentType.sys.id === 'person'
  })
  data.includes.Asset.map((asset, i) => {
    entries.map((entry, j) => {
      if (asset.sys.id === entry.fields.heroImage.sys.id) entry.fields.heroImage.link = asset.fields
    })
    authors.map((author, k) => {
      if (asset.sys.id === author.fields.image.sys.id) author.fields.image.sys.link = asset.fields
    })
  })
  entries.map((entry, i) => {
    authors.map(author => {
      if (entry.fields.author.sys.id === author.sys.id) entries[i].author = author
    })
  })
  return entries 
}