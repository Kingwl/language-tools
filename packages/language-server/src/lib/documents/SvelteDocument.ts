import { DocumentFragment } from './DocumentFragment';
import { urlToPath } from '../../utils';
import { Document, Fragment, FragmentDetails } from '../../api';

/**
 * Represents a text document that contains a svelte component.
 */
export class SvelteDocument extends Document {
    public script: Fragment;
    public style: Fragment;

    constructor(public url: string, public content: string) {
        super();

        this.script = this.addFragment(
            new DocumentFragment(this, new SvelteFragment(this, 'script')),
        );
        this.style = this.addFragment(
            new DocumentFragment(this, new SvelteFragment(this, 'style')),
        );
    }

    /**
     * Get text content
     */
    getText(): string {
        return this.content;
    }

    /**
     * Set text content and increase the document version
     */
    setText(text: string) {
        this.content = text;
        this.version++;
    }

    /**
     * Returns the file path if the url scheme is file
     */
    getFilePath(): string | null {
        return urlToPath(this.url);
    }

    getURL() {
        return this.url;
    }

    getAttributes() {
        return {};
    }
}

export class SvelteFragment implements FragmentDetails {
    private info!: FragmentDetails;
    private version = -1;

    constructor(public document: SvelteDocument, public tag: 'style' | 'script') {
        this.update();
    }

    get start(): number {
        this.update();
        return this.info.start;
    }

    get end(): number {
        this.update();
        return this.info.end;
    }

    get container(): FragmentDetails['container'] {
        this.update();
        return this.info.container;
    }

    get attributes(): Record<string, string> {
        this.update();
        return { ...this.info.attributes, tag: this.tag };
    }

    /**
     * Find the tag in the document if we detected a change
     */
    private update() {
        if (this.document.version === this.version) {
            return;
        }

        this.version = this.document.version;
        const info = extractTag(this.document.getText(), this.tag);
        if (info) {
            this.info = info;
            return;
        }

        const length = this.document.getTextLength();
        this.info = {
            attributes: {},
            start: length,
            end: length,
            container: {
                start: length,
                end: length,
            },
        };
    }
}

function parseAttributeValue(value: string): string {
    return /^['"]/.test(value) ? value.slice(1, -1) : value;
}

function parseAttributes(str: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    str
        .split(/\s+/)
        .filter(Boolean)
        .forEach(attr => {
            const [name, value] = attr.split('=');
            attrs[name] = value ? parseAttributeValue(value) : name;
        });
    return attrs;
}

function extractTag(source: string, tag: 'script' | 'style') {
    const exp = new RegExp(`(<${tag}([\\S\\s]*?)>)([\\S\\s]*?)<\\/${tag}>`, 'ig');
    const match = exp.exec(source);

    if (!match) {
        return null;
    }

    const attributes = parseAttributes(match[2]);
    const content = match[3];
    const start = match.index + match[1].length;
    const end = start + content.length;

    return {
        content,
        attributes,
        start,
        end,
        container: { start: match.index, end: match.index + match[0].length },
    };
}
