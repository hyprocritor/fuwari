import {h} from "hastscript";

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.link - The link
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function rehypeComponentLinkCard(properties, children) {
    if (Array.isArray(children) && children.length !== 0)
        return h('div', {class: 'hidden'}, [
            'Invalid directive. ("github" directive must be leaf type "::github{repo="owner/repo"}")',
        ])

    if (!properties.link)
        return h(
            'div',
            {class: 'hidden'},
            'Invalid Link. ("repo" attributte must be in the format "owner/repo")',
        )


    const link = properties.link
    const cardUuid = `EL${Math.random().toString(36).slice(-6)}`
    return h(
        `a#${cardUuid}-card`,
    )
}
