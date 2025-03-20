import * as vscode from 'vscode';
import { createFileUri, createWebviewPanel, SprottyDiagramIdentifier } from "sprotty-vscode";
import { LspWebviewEndpoint, LspWebviewPanelManager } from "sprotty-vscode/lib/lsp";
import { addLspLabelEditActionHandler, addWorkspaceEditActionHandler } from 'sprotty-vscode/lib/lsp/editing';

export class ERWebviewPanelManager extends LspWebviewPanelManager {

    // Override to customize URIs for local resources, scripts, and styles
    protected override createWebview(identifier: SprottyDiagramIdentifier): vscode.WebviewPanel {
        const extensionPath = this.options.extensionUri.fsPath;
        return createWebviewPanel(identifier, {
            localResourceRoots: [ createFileUri(extensionPath, 'pack', 'diagram') ],
            scriptUri: createFileUri(extensionPath, 'pack', 'diagram', 'main.js'),
            cssUri: createFileUri(extensionPath, 'pack', 'diagram', 'main.css')
        });
    }

    // Override to add action handlers for workspace edits and label edits
    protected override createEndpoint(identifier: SprottyDiagramIdentifier): LspWebviewEndpoint {
        const endpoint = super.createEndpoint(identifier);
        addWorkspaceEditActionHandler(endpoint);
        addLspLabelEditActionHandler(endpoint);
        return endpoint;
    }
}