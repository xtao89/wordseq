/**
 * successor should implement the class below
 */
export abstract class DocImp {
    static current: DocImp = null //implementor should set this property

    abstract get name(): string
    abstract mark(signature: string, data: string, text: string): Promise<void>
    abstract traverse(signature: string, handler: (data: string, originalText: string) => string): Promise<void>
    abstract setting(action: 'read' | 'write', content: { key: string, value: any }): Promise<void>
    abstract test(): Promise<void>
}