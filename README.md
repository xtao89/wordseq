# Introduction

**Wordseq** is an MS Word web Addin that generates sequence numbers for official documents or academic papers. 
It uses `Word.ContentControl` to host the sequence items and stores options in `Word.Document.settings`.
With **Wordseq** you can have such types of sequences as:  
- Chapter 1, Chapter 2, Chapter 3...
- 1.1, 1.2, 1.3 and 1.1.1, 1.1.2...
- alternatives like Section One, Section Two...
- affixes like Figure *x*-1, Figure *x*-2, where '*x*' is the title number

# Installation
1. Download the repo, open it with VSCode or WebStorm, in the terminal move to the root directory, run `npm install`
2. After packages installed, execute `npm run dev` to run Vite sever
3. Then you need configure MS Word to authorize the Addin, the simplest way is to a shared folder with the manifest file (wordseq.xml) in it, see <https://learn.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins#share-a-folder>
4. Open MS Word(Version>=2020), if everything is OK, you'll see the **Wordseq** ribbon at the back of the Home tab 

# Generate sequences
In **Sequence Operation** pane, just hit the relevant sequence type, 
and a sequence item will be generated in the document. 
You don't have to click the 'Update' button, unless you've manually changed the content or order
of the sequence items in the document, or you altered the sequence definitions.

# Make sequence types
In **Sequence Definition** pane, choose a sequence type to have a look at its properties before getting start,
- Name, the identifier of the sequence type, can be referenced in a sequence **Template**. Note only letters, digits and underscore allowed in the name.
- Alias, for display in **Sequence Operation** pane, where it is showed as 'Alias@Name'. Not necessarily equal as the name, alias can have arbitrary text.
- Description, a more detailed explanation of the sequence type, also displayed in **Sequence Operation** pane by default.
- Template, this is the vital part of it. It is a template string to indicate the program how to compose the sequence items for a type. We explain it latter.
- Alternatives, a comma-separated strings for substituting the sequence numbers. Say, with 'One,Two' you can generate 'Chapter One' & 'Chapter Two', instead of 'Chapter 1' & 'Chapter 2'
- Recounts, a comma-separated types names that will re-initiate this sequence type. Say, the 'T2' sequence has 'T1' as its recount to re-initiate its number every time appearing after a 'T1' item.

## Compose a template
A template of a sequence contains two kinds of contents, the constant string & the variable string. The latter is included in braces. Take the template of 'T2' for example:  
`{ T1 }.{  }`. The first variable in the template is 'T1', which means a 'T2' item will have 'T1' number as a prefix. 
The second variable, seemingly empty, refers to the sequence number of itself, that is the number of 'T2'.
So a 'T2' item in the document may come as '2.1', provided it is the first 'T2' item after a second 'T1' item. 

Another example is 'Roman' sequence with template `{ # }. `  
The modifier `#` tells there is an alternative instead of a number. So the 'Alternatives' field must be setup to get it work.
As 'Roman' sequence has alternatives 'Ⅰ,Ⅱ,Ⅲ,Ⅳ,Ⅴ,Ⅵ,Ⅶ,Ⅷ,Ⅸ,Ⅹ', its items in the document will come as 'Ⅰ.', 'Ⅱ.', 'Ⅲ.'...  

Concerning the variables in the template we can conclude as follows:  
- an empty, means the self sequence number
- a *name*, means the named sequence number
- a '#', means the self sequence alternative
- a '#*name*', means the named sequence alternative

That's it. Just get hands on it. 
Have fun.