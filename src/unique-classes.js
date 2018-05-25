const uniqueClasses = list => {
  list = list.split(' ')

  const hash = {}
  let i = list.length
  const out = []

  while (i--) {
    if (!hash.hasOwnProperty(list[i])) {
      hash[list[i]] = 1
      out.unshift(list[i])
    }
  }

  return out.join(' ')
}

export default uniqueClasses
