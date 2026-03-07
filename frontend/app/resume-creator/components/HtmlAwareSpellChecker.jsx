
import React from 'react';
import SpellCheckHighlighter from './SpellCheckHighlighter';

/**
 * HtmlAwareSpellChecker
 * Parses an HTML string and recursively renders React elements,
 * applying spell checking only to text nodes.
 * This preserves formatting (<b>, <i>, <ul>, etc.) during spell check mode.
 */
const HtmlAwareSpellChecker = ({ html, isActive, onIgnore, onReplace }) => {
    if (!isActive) {
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (!html) return null;

    // Use DOMParser to parse the HTML string
    // In a browser environment, this is efficient and robust
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nodes = Array.from(doc.body.childNodes);

    const renderNode = (node, index, path = []) => {
        const currentPath = [...path, index];

        // TEXT_NODE
        if (node.nodeType === 3) {
            return (
                <SpellCheckHighlighter
                    key={`text-${currentPath.join('-')}`}
                    text={node.textContent}
                    isActive={isActive}
                    onIgnore={onIgnore}
                    onReplace={(newText) => {
                        const tempDoc = new DOMParser().parseFromString(html, 'text/html');
                        let target = tempDoc.body;

                        for (const idx of currentPath) {
                            if (target.childNodes && target.childNodes[idx]) {
                                target = target.childNodes[idx];
                            } else {
                                const escapedOld = node.textContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                const replacedHtml = html.replace(new RegExp(escapedOld), newText);
                                onReplace(replacedHtml);
                                return;
                            }
                        }

                        target.textContent = newText;
                        onReplace(tempDoc.body.innerHTML);
                    }}
                />
            );
        }

        // ELEMENT_NODE
        if (node.nodeType === 1) {
            const tagName = node.tagName.toLowerCase();

            const voidElements = ['br', 'hr', 'img', 'input', 'link', 'meta', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
            const isVoid = voidElements.includes(tagName);

            const children = isVoid ? null : Array.from(node.childNodes).map((child, i) => renderNode(child, i, currentPath));

            const props = { key: `${tagName}-${currentPath.join('-')}` };

            if (node.getAttribute('style')) {
                props.style = parseInlineStyle(node.getAttribute('style'));
            }

            if (isVoid) {
                return React.createElement(tagName, props);
            }
            return React.createElement(tagName, props, children);
        }

        return null;
    };

    return <div className="html-spell-check-container">{nodes.map((node, i) => renderNode(node, i))}</div>;
};

/**
 * Simple helper to parse inline style strings into React style objects
 */
const parseInlineStyle = (styleString) => {
    if (!styleString) return {};
    return styleString.split(';').reduce((acc, style) => {
        const [property, value] = style.split(':');
        if (property && value) {
            const camelProperty = property.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            acc[camelProperty] = value.trim();
        }
        return acc;
    }, {});
};

export default HtmlAwareSpellChecker;
