export function defaultFootnoteBackContent(_, rereferenceIndex) {
    const result = [{type: 'element',
        tagName:"span",
        properties: {
            class:"fa6-solid--arrow-turn-up text-sm w-2.5 h-2.5 color-gray"
        }

    }]
    if (rereferenceIndex > 1) {
        result.push({
            type: 'element',
            tagName: 'sup',
            properties: {},
            children: [{type: 'text', value: String(rereferenceIndex)}]
        })
    }
    return result
}
