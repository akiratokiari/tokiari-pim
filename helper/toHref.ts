const toHref = (pathname: string, query: any): string => {
  let string = pathname
  Object.keys(query).forEach((key) => {
    string = string.replace(`[${key}]`, query[key])
  })
  return string
}

export default toHref
