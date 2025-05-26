import { ValidationAcceptor } from "langium";
import { Model } from "../generated/ast.js";

export class NamingValidator {
    checkModel(model: Model, accept: ValidationAcceptor): void {
        // Check if the model has a name
        if (!model.name || model.name.trim() === "") {
            accept("error", "Missing model header 'erdiagram <name>'", { node: model, range: {start: {line:0, character: 0}, end: {line: 1, character: 0}}});
        }
    }
}