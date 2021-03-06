import {
    Diagnostic,
    DiagnosticSeverity,
    Position,
    Range,
    Hover,
    MarkupContent,
    MarkedString,
    CompletionItem,
    CompletionItemKind,
    TextEdit,
    InsertTextFormat,
    Command,
    CompletionList,
    TextDocumentItem,
    ColorInformation,
    ColorPresentation,
    Color,
    SymbolInformation,
    Location,
    SymbolKind,
    DefinitionLink,
    LocationLink,
    CodeAction,
    CodeActionContext,
    TextDocumentEdit,
    TextDocumentIdentifier,
    VersionedTextDocumentIdentifier,
} from 'vscode-languageserver-types';

import { TextDocumentContentChangeEvent } from "vscode-languageserver-protocol"

import { Document } from './Document';

export {
    Diagnostic,
    DiagnosticSeverity,
    Position,
    Range,
    Hover,
    MarkupContent,
    MarkedString,
    CompletionItem,
    CompletionItemKind,
    TextEdit,
    InsertTextFormat,
    Command,
    CompletionList,
    TextDocumentItem,
    ColorInformation,
    ColorPresentation,
    Color,
    SymbolInformation,
    Location,
    SymbolKind,
    DefinitionLink,
    LocationLink,
    CodeAction,
    CodeActionContext,
    TextDocumentEdit,
    TextDocumentIdentifier,
    VersionedTextDocumentIdentifier,
    TextDocumentContentChangeEvent
};

export type Resolvable<T> = T | Promise<T>;

export interface DiagnosticsProvider {
    getDiagnostics(document: Document): Resolvable<Diagnostic[]>;
}

export namespace DiagnosticsProvider {
    export function is(obj: any): obj is DiagnosticsProvider {
        return typeof obj.getDiagnostics === 'function';
    }
}

export interface HoverProvider {
    doHover(document: Document, position: Position): Resolvable<Hover | null>;
}

export namespace HoverProvider {
    export function is(obj: any): obj is HoverProvider {
        return typeof obj.doHover === 'function';
    }
}

export interface CompletionsProvider {
    getCompletions(
        document: Document,
        position: Position,
        triggerCharacter?: string,
    ): Resolvable<CompletionList | null>;
}

export namespace CompletionsProvider {
    export function is(obj: any): obj is CompletionsProvider {
        return typeof obj.getCompletions === 'function';
    }
}

export interface FormattingProvider {
    formatDocument(document: Document): Resolvable<TextEdit[]>;
}

export namespace FormattingProvider {
    export function is(obj: any): obj is FormattingProvider {
        return typeof obj.formatDocument === 'function';
    }
}

export interface TagCompleteProvider {
    doTagComplete(document: Document, positon: Position): Resolvable<string | null>;
}

export namespace TagCompleteProvider {
    export function is(obj: any): obj is TagCompleteProvider {
        return typeof obj.doTagComplete === 'function';
    }
}

export interface DocumentColorsProvider {
    getDocumentColors(document: Document): Resolvable<ColorInformation[]>;
}

export namespace DocumentColorsProvider {
    export function is(obj: any): obj is DocumentColorsProvider {
        return typeof obj.getDocumentColors === 'function';
    }
}

export interface ColorPresentationsProvider {
    getColorPresentations(
        document: Document,
        range: Range,
        color: Color,
    ): Resolvable<ColorPresentation[]>;
}

export namespace ColorPresentationsProvider {
    export function is(obj: any): obj is ColorPresentationsProvider {
        return typeof obj.getColorPresentations === 'function';
    }
}

export interface DocumentSymbolsProvider {
    getDocumentSymbols(document: Document): Resolvable<SymbolInformation[]>;
}

export namespace DocumentSymbolsProvider {
    export function is(obj: any): obj is DocumentSymbolsProvider {
        return typeof obj.getDocumentSymbols === 'function';
    }
}

export interface DefinitionsProvider {
    getDefinitions(document: Document, position: Position): Resolvable<DefinitionLink[]>;
}

export namespace DefinitionsProvider {
    export function is(obj: any): obj is DefinitionsProvider {
        return typeof obj.getDefinitions === 'function';
    }
}

export interface CodeActionsProvider {
    getCodeActions(
        document: Document,
        range: Range,
        context: CodeActionContext,
    ): Resolvable<CodeAction[]>;
}

export namespace CodeActionsProvider {
    export function is(obj: any): obj is CodeActionsProvider {
        return typeof obj.getCodeActions === 'function';
    }
}

export interface Fragment extends Document {
    details: FragmentDetails;

    /**
     * Get the fragment offset relative to the parent
     * @param offset Offset in fragment
     */
    offsetInParent(offset: number): number;

    /**
     * Get the fragment position relative to the parent
     * @param pos Position in fragment
     */
    positionInParent(pos: Position): Position;

    /**
     * Get the offset relative to the start of the fragment
     * @param offset Offset in parent
     */
    offsetInFragment(offset: number): number;

    /**
     * Get the position relative to the start of the fragment
     * @param pos Position in parent
     */
    positionInFragment(pos: Position): Position;

    /**
     * Returns true if the given parent position is inside of this fragment
     * @param pos Position in parent
     */
    isInFragment(pos: Position): boolean;
}

export interface FragmentDetails {
    start: number;
    end: number;
    container?: {
        start: number;
        end: number;
    };
    attributes: Record<string, string>;
}

export type FragmentPredicate = (fragment: Fragment) => boolean;

export interface Plugin {
    pluginId: string;
    defaultConfig: any;
}
