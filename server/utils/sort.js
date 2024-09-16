export function removeDuplicates(arr) {
    let tags = {}

    arr.forEach(obj => {
        if (tags[obj.tag]) {
            tags[obj.tag]++
        } else {
            tags[obj.tag] = 1
        }
    })
    
    let sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])
      
    return sortedTags.slice(0, 3).map(tag => ({ tag }))
    }
    
    

    
    