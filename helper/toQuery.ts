type Props = {
  [key: string]: string | number
}

export const toQuery = (data: Props) => {
  let result = '?'
  for (const key in data) {
    result = result + `${key}=${data[key]}&`
  }
  return result.slice(0, -1)
}
